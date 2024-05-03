"use client";
import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import PerfectScrollbar from "react-perfect-scrollbar";
import IconMapPin from "../icon/IconMapPin";
import IconSend from "../icon/IconSend";
import Dropdown from "../Dropdown";
import IconPlus from "../icon/IconPlus";
import IconSearch from "../icon/IconSearch";
import IconCaretDown from "../icon/IconCaretDown";
import IconMenu from "../icon/IconMenu";
import IconHorizontalDots from "../icon/IconHorizontalDots";
import IconX from "../icon/IconX";
import IconTrashLines from "../icon/IconTrashLines";
import IconPencilPaper from "../icon/IconPencilPaper";
import { MultiSelect } from "@mantine/core";
import { useSession } from "next-auth/react";
import { announcementService } from "@/app/(default)/announcement/api/api";
import { format, isToday, isYesterday } from "date-fns";
import IconMail from "../icon/IconMail";

const ComponentsAnnouncement = () => {
  const { data } = useSession();
  const [token, setToken] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState("");

  const defaultParams = {
    id: 0,
    senderName: "",
    subject: "",
    message: "",
    createdAt: "",
    recipients: [] as Recipient[],
  };

  const [params, setParams] = useState<any>(
    JSON.parse(JSON.stringify(defaultParams))
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data && data.accessToken) {
          // Fetch pilgrim data
          const users = await announcementService.fetchAllUser(
            data?.accessToken
          );
          setUsers(users);
          setToken(data.accessToken);
          setUserId(String(data?.user_id));
          const fetchedMessages: Message[] =
            await announcementService.fetchAllMessage(
              data?.accessToken,
              String(data.user_id)
            );
          // Filter and sort messages based on createdAt
          const filteredAndSortedMessages = fetchedMessages
            .filter((message) => message.createdAt) // Filter out messages without a createdAt property
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            ); // Sort messages by createdAt, newest to oldest

          // Set the filtered and sorted messages to state
          setMessages(filteredAndSortedMessages);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data?.accessToken]); // Empty dependency array to run effect only once after initial render

  const [selectedTab, setSelectedTab] = useState("");
  const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [viewTaskModal, setViewTaskModal] = useState(false);

  const [receiver, setReceiver] = useState<string[]>([]);

  const [filteredMessages, setFilteredMessages] = useState<any>(messages);
  const [pagedMessages, setPagedMessages] = useState<any>(filteredMessages);
  const [searchAnnouncement, setSearchAnnouncement] = useState<any>("");
  const [selectedTask, setSelectedTask] = useState<any>(defaultParams);

  const [requestMessage, setRequestMessage] = useState<string>("");
  const [requestSubject, setRequestSubject] = useState<string>("");

  const [pager] = useState<any>({
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    startIndex: 0,
    endIndex: 0,
  });

  useEffect(() => {
    cariPesan();
  }, [selectedTab, searchAnnouncement, messages]);

  const changeValue = (e: any) => {
    const { value, id } = e.target;
    setParams({ ...params, [id]: value });
  };

  const cariPesan = (isResetPage = true) => {
    if (isResetPage) {
      pager.currentPage = 1;
    }
    let res;
    res = messages;

    setFilteredMessages([
      ...res!.filter((d: any) =>
        d.subject?.toLowerCase().includes(searchAnnouncement)
      ),
    ]);
    getPager(
      res!.filter((d: any) =>
        d.subject?.toLowerCase().includes(searchAnnouncement)
      )
    );
  };

  const getPager = (res: any) => {
    setTimeout(() => {
      if (res.length) {
        pager.totalPages =
          pager.pageSize < 1 ? 1 : Math.ceil(res.length / pager.pageSize);
        if (pager.currentPage > pager.totalPages) {
          pager.currentPage = 1;
        }
        pager.startIndex = (pager.currentPage - 1) * pager.pageSize;
        pager.endIndex = Math.min(
          pager.startIndex + pager.pageSize - 1,
          res.length - 1
        );
        setPagedMessages(res.slice(pager.startIndex, pager.endIndex + 1));
      } else {
        setPagedMessages([]);
        pager.startIndex = -1;
        pager.endIndex = -1;
      }
    });
  };

  const tabChanged = () => {
    setIsShowTaskMenu(false);
  };

  const viewTask = (item: any = null) => {
    setSelectedTask(item);
    setTimeout(() => {
      setViewTaskModal(true);
    });
  };

  const addEditTask = (task: any = null) => {
    setIsShowTaskMenu(false);
    let json = JSON.parse(JSON.stringify(defaultParams));
    setParams(json);
    if (task) {
      let json1 = JSON.parse(JSON.stringify(task));
      setParams(json1);
    }
    setAddTaskModal(true);
  };

  const deleteTask = async (message: any, type: string = "") => {
    try {
      await announcementService.deleteMessage(token, message.id);
      setMessages(messages.filter((d: any) => d.id !== message.id));
      showMessage("Berhasil menghapus pesan");
    } catch (error) {
      showMessage("Gagal menghapus pesan", "error");
    }
    cariPesan(false);
  };

  const showMessage = (msg = "", type = "success") => {
    const toast: any = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: "toast" },
    });
    toast.fire({
      icon: type,
      title: msg,
      padding: "10px 20px",
    });
  };

  const save = async () => {
    try {
      const receiverIds: number[] = receiver.map((idString) =>
        parseInt(idString, 10)
      );

      const userIdNumber: number = parseInt(userId, 10);
      const data: RequestSendMessage = {
        message: requestMessage,
        subject: requestSubject,
        recipientIds: receiverIds,
        senderId: userIdNumber,
      };

      const receiverNames: Recipient[] = receiver.map((receiverId) => {
        const recipient = users.find(
          (user) => user.id === parseInt(receiverId, 10)
        );
        return {
          id: recipient ? recipient.id : 0,
          name: recipient ? recipient.name : "",
        };
      });

      const responseData: Message = await announcementService.sendMessage(
        token,
        data
      );
      setMessages([responseData, ...messages]);
      showMessage("Berhasil menambah pesan");
      setAddTaskModal(false);
    } catch (error) {
      showMessage("Gagal menambah pesan", "error");
      setAddTaskModal(false);
    }
  };

  const formatDate = (date: string) => {
    const currentDate = new Date(date);
    if (isToday(currentDate)) {
      // Jika tanggalnya hari ini, tampilkan waktu
      return format(currentDate, "HH:mm");
    } else if (isYesterday(currentDate)) {
      // Jika tanggalnya kemarin, tampilkan "Kemarin"
      return "Kemarin";
    } else {
      // Jika tanggalnya bukan hari ini atau kemarin, tampilkan tanggalnya saja
      return format(currentDate, "dd/MM/yyyy");
    }
  };

  return (
    <div>
      <div className="relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)]">
        <div
          className={`panel absolute z-10 hidden h-full w-[240px] max-w-full flex-none space-y-4 p-4 ltr:rounded-r-none rtl:rounded-l-none xl:relative xl:block xl:h-auto ltr:xl:rounded-r-md rtl:xl:rounded-l-md ${
            isShowTaskMenu && "!block"
          }`}
        >
          <div className="flex h-full flex-col pb-16">
            <div className="pb-5">
              <div className="flex items-center text-center">
                <div className="shrink-0">
                  <IconMail />
                </div>
                <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">
                  Pesan
                </h3>
              </div>
            </div>
            <div className="mb-5 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
            <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
              <div className="space-y-1">
                <button
                  type="button"
                  className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${
                    selectedTab === ""
                      ? "bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary"
                      : ""
                  }`}
                  onClick={() => {
                    tabChanged();
                    setSelectedTab("");
                  }}
                >
                  <div className="flex items-center">
                    <IconSend className="h-4.5 w-4.5 shrink-0" />
                    <div className="ltr:ml-3 rtl:mr-3">Terkirim</div>
                  </div>
                </button>
              </div>
            </PerfectScrollbar>
            <div className="absolute bottom-0 w-full p-4 ltr:left-0 rtl:right-0">
              <button
                className="btn btn-primary w-full"
                type="button"
                onClick={() => addEditTask()}
              >
                <IconPlus className="shrink-0 ltr:mr-2 rtl:ml-2" />
                Tambah Pesan Baru
              </button>
            </div>
          </div>
        </div>
        <div
          className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${
            isShowTaskMenu && "!block xl:!hidden"
          }`}
          onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}
        ></div>
        <div className="panel h-full flex-1 overflow-auto p-0">
          <div className="flex h-full flex-col">
            <div className="flex w-full flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center ltr:mr-3 rtl:ml-3">
                <button
                  type="button"
                  className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                  onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}
                >
                  <IconMenu />
                </button>
                <div className="group relative flex-1">
                  <input
                    type="text"
                    className="peer form-input ltr:!pr-10 rtl:!pl-10"
                    placeholder="Cari Pesan..."
                    value={searchAnnouncement}
                    onChange={(e) => setSearchAnnouncement(e.target.value)}
                    onKeyUp={() => cariPesan()}
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                    <IconSearch />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center sm:flex-auto sm:justify-end">
                <p className="ltr:mr-3 rtl:ml-3">
                  {pager.startIndex +
                    1 +
                    "-" +
                    (pager.endIndex + 1) +
                    " of " +
                    filteredMessages.length}
                </p>
                <button
                  type="button"
                  disabled={pager.currentPage === 1}
                  className="rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 ltr:mr-3 rtl:ml-3 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30"
                  onClick={() => {
                    pager.currentPage--;
                    cariPesan(false);
                  }}
                >
                  <IconCaretDown className="h-5 w-5 rotate-90 rtl:-rotate-90" />
                </button>
                <button
                  type="button"
                  disabled={pager.currentPage === pager.totalPages}
                  className="rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30"
                  onClick={() => {
                    pager.currentPage++;
                    cariPesan(false);
                  }}
                >
                  <IconCaretDown className="h-5 w-5 -rotate-90 rtl:rotate-90" />
                </button>
              </div>
            </div>
            <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>

            {pagedMessages.length ? (
              <div className="table-responsive min-h-[400px] grow overflow-y-auto sm:min-h-[300px]">
                <table className="table-hover">
                  <tbody>
                    {pagedMessages.map((message: Message) => {
                      return (
                        <tr className="group cursor-pointer " key={message.id}>
                          <td className="w-1">
                            <input
                              type="checkbox"
                              id={`chk-${message.id}`}
                              className="form-checkbox"
                              disabled={selectedTab === "trash"}
                            />
                          </td>
                          <td>
                            <div onClick={() => viewTask(message)}>
                              <div className="whitespace-nowrap text-base font-semibold group-hover:text-primary">
                                {message.subject}
                              </div>
                              <div className="line-clamp-1 min-w-[300px] overflow-hidden text-white-dark">
                                {message.message}
                              </div>
                            </div>
                          </td>
                          <td className="w-1 text-right">
                            <p
                              className={`whitespace-nowrap font-medium text-white-dark}`}
                            >
                              {formatDate(message.createdAt)}
                            </p>
                          </td>

                          <td className="w-1">
                            <div className="flex w-max items-center justify-between">
                              <div className="dropdown">
                                <Dropdown
                                  offset={[0, 5]}
                                  placement="bottom-end"
                                  btnClassName="align-middle"
                                  button={
                                    <IconHorizontalDots className="rotate-90 opacity-70" />
                                  }
                                >
                                  <ul className="whitespace-nowrap">
                                    {/* <li>
                                      <button
                                        type="button"
                                        onClick={() => addEditTask(message)}
                                      >
                                        <IconPencilPaper className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Edit
                                      </button>
                                    </li> */}
                                    <li>
                                      <button
                                        type="button"
                                        onClick={() => deleteTask(message)}
                                      >
                                        <IconTrashLines className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Delete
                                      </button>
                                    </li>
                                  </ul>
                                </Dropdown>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] items-center justify-center text-lg font-semibold sm:min-h-[300px]">
                No data available
              </div>
            )}
          </div>
        </div>

        <Transition appear show={addTaskModal} as={Fragment}>
          <Dialog
            as="div"
            open={addTaskModal}
            onClose={() => setAddTaskModal(false)}
            className="relative z-50"
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-[black]/60" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center px-4 py-8">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                    <button
                      type="button"
                      onClick={() => setAddTaskModal(false)}
                      className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                    >
                      <IconX />
                    </button>
                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                      {params.id ? "Edit Pengumuman" : "Tambahkan Pengumuman"}
                    </div>
                    <div className="p-5">
                      <form>
                        <MultiSelect
                          onChange={(value) => setReceiver(value)}
                          className="mb-5"
                          size="md"
                          radius="sm"
                          label="Penerima"
                          placeholder="Pilih Penerima"
                          data={
                            users
                              ? users.map((u) => ({
                                  value: String(u.id),
                                  label: u.name,
                                }))
                              : []
                          }
                          searchable
                        />

                        <div className="mb-5">
                          <label htmlFor="subject">Subject</label>
                          <input
                            id="subject"
                            type="text"
                            placeholder="Masukkan Subject"
                            className="form-input"
                            // value={params.title}
                            onChange={(e) => setRequestSubject(e.target.value)}
                          />
                        </div>

                        <div className="mb-5">
                          <label htmlFor="message">Pesan</label>
                          <textarea
                            id="message"
                            rows={4} // Adjust the number of rows as needed
                            placeholder="Enter Message"
                            className="form-textarea w-full" // Set width to full
                            // value={params.message}
                            onChange={(e) => setRequestMessage(e.target.value)}
                          ></textarea>
                        </div>

                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => setAddTaskModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            disabled={
                              !requestMessage ||
                              !requestSubject ||
                              receiver.length === 0
                            }
                            onClick={() => save()}
                          >
                            {params.id ? "Update" : "Add"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition appear show={viewTaskModal} as={Fragment}>
          <Dialog
            as="div"
            open={viewTaskModal}
            onClose={() => setViewTaskModal(false)}
            className="relative z-50"
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-[black]/60" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center px-4 py-8">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                    <button
                      type="button"
                      onClick={() => setViewTaskModal(false)}
                      className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                    >
                      <IconX />
                    </button>
                    <div className="flex flex-wrap items-center gap-2 bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                      <div className="text-xl font-bold">
                        {selectedTask.subject}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-md mb-2">
                        Penerima:{" "}
                        {selectedTask.recipients
                          .map((recipient: any) => recipient.name)
                          .join(", ")}
                      </p>
                      <h1 className="text-gray-600 text-xl dark:text-gray-400">
                        {selectedTask.message}
                      </h1>

                      <div className="mt-8 flex items-center justify-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => setViewTaskModal(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default ComponentsAnnouncement;
