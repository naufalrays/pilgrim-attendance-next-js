"use client";
import PerfectScrollbar from "react-perfect-scrollbar";
import { IRootState } from "@/store";
import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Dropdown from "../Dropdown";
import IconSquareRotated from "../icon/IconSquareRotate";
import IconX from "../icon/IconX";
import IconCopy from "../icon/IconCopy";
import IconMenu from "../icon/IconMenu";
import IconHorizontalDots from "../icon/IconHorizontalDots";
import IconTrashLines from "../icon/IconTrashLines";
import IconEye from "../icon/IconEye";
import IconPencil from "../icon/IconPencil";
import IconMenuContacts from "../icon/menu/IconMenuContact";
import IconMapPin from "../icon/IconMapPin";
import { useSession } from "next-auth/react";
import { reportService } from "@/app/(default)/report/api/api";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface TripResponseData {
  id: number;
  picId: number;
  name: string;
  picName?: string;
  date?: string;
  meeting_point: string;
  stand_by?: string;
  start: string;
  end: string;
  destination: string;
  bus: string;
  status: string;
  pilgrims?: Pilgrim[];
  check_in: {
    sick: number;
    permission: number;
    absent: number;
    not_yet_absent: number;
  };
  check_out: {
    sick: number;
    permission: number;
    absent: number;
    not_yet_absent: number;
  };
}

interface Pilgrim {
  id?: number;
  portion_number: string;
  name: string;
  gender: string;
  birth_date: Date;
  phone_number: string;
  group: string;
  cloter: string;
  passport_number: string;
}

const ComponentsReport = () => {
  const defaultParams = {
    id: null,
    name: "",
    picName: "",
    date: "",
    absent: 0,
    notYetAbsent: 0,
    permission: 0,
    sick: 0,
  };
  const router = useRouter();

  const [params, setParams] = useState<TripResponseData>(
    JSON.parse(JSON.stringify(defaultParams))
  );
  const [addContactModal, setAddContactModal] = useState<any>(false);
  const [isShowNoteMenu, setIsShowNoteMenu] = useState<any>(false);
  const [isViewNoteModal, setIsViewNoteModal] = useState<any>(false);
  const [filteredTripsList, setFilterdTripsList] = useState<TripResponseData[]>(
    []
  );
  const [selectedTab, setSelectedTab] = useState<any>("all");

  const { data } = useSession();
  const [token, setToken] = useState("");
  const [listTrips, setListTrips] = useState<TripResponseData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data && data.accessToken) {
          // Fetch pilgrim data
          const listTrips = await reportService.fetchTripData(
            data?.accessToken
          );
          setListTrips(listTrips);
          setToken(data?.accessToken);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data?.accessToken]); // Empty dependency array to run effect only once after initial render

  const searchNotes = () => {
    if (selectedTab !== "all") {
      setFilterdTripsList(listTrips.filter((d) => d.status === selectedTab));
    } else {
      setFilterdTripsList(listTrips);
    }
  };

  const tabChanged = (type: string) => {
    setSelectedTab(type);
    setIsShowNoteMenu(false);
    searchNotes();
  };

  const changeValue = (e: any) => {
    const { value, id } = e.target;
    setParams({ ...params, [id]: value });
  };

  const viewNote = (id: number) => {
    const tripPage = `report/${id}`;
    router.push(tripPage);
    // setParams(note);
    // setIsViewNoteModal(true);
  };

  const editNote = (note: any = null) => {
    setIsShowNoteMenu(false);
    const json = JSON.parse(JSON.stringify(defaultParams));
    setParams(json);
    if (note) {
      let json1 = JSON.parse(JSON.stringify(note));
      setParams(json1);
    }
    setAddContactModal(true);
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

  useEffect(() => {
    searchNotes();
  }, [selectedTab, listTrips]);

  const formatDate = (dateString: string) => {
    // Konversi string tanggal menjadi objek Date
    const date = new Date(dateString);
    // Format tanggal menggunakan date-fns
    const formattedDate = format(date, "dd MMMM yyyy");
    // Kembalikan tanggal yang diformat
    return formattedDate;
  };

  return (
    <div>
      <div className="relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)]">
        <div
          className={`absolute z-10 hidden h-full w-full rounded-md bg-black/60 ${
            isShowNoteMenu ? "!block xl:!hidden" : ""
          }`}
          onClick={() => setIsShowNoteMenu(!isShowNoteMenu)}
        ></div>
        <div
          className={`panel
                    absolute
                    z-10
                    hidden
                    h-full
                    w-[240px]
                    flex-none
                    space-y-4
                    overflow-hidden
                    p-4
                    ltr:rounded-r-none
                    rtl:rounded-l-none
                    ltr:lg:rounded-r-md rtl:lg:rounded-l-md
                    xl:relative xl:block
                    xl:h-auto ${
                      isShowNoteMenu
                        ? "!block h-full ltr:left-0 rtl:right-0"
                        : "hidden shadow"
                    }`}
        >
          <div className="flex h-full flex-col pb-16">
            <div className="flex items-center text-center">
              <div className="shrink-0">
                <IconMapPin />
              </div>
              <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">
                Kegiatan
              </h3>
            </div>

            <div className="my-4 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
            <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
              <div className="space-y-1">
                <button
                  type="button"
                  className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${
                    selectedTab === "all" &&
                    "bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary"
                  }`}
                  onClick={() => tabChanged("all")}
                >
                  <div className="flex items-center">
                    <IconCopy className="shrink-0" />
                    <div className="ltr:ml-3 rtl:mr-3">Semua Kegiatan</div>
                  </div>
                </button>
                <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                <div className="px-1 py-3 text-white-dark">Status</div>
                <button
                  type="button"
                  className={`flex h-10 w-full items-center rounded-md p-1 font-medium text-primary duration-300 hover:bg-white-dark/10 ltr:hover:pl-3 rtl:hover:pr-3 dark:hover:bg-[#181F32] ${
                    selectedTab === "upcoming" &&
                    "bg-gray-100 ltr:pl-3 rtl:pr-3 dark:bg-[#181F32]"
                  }`}
                  onClick={() => tabChanged("upcoming")}
                >
                  <IconSquareRotated className="shrink-0 fill-primary" />
                  <div className="ltr:ml-3 rtl:mr-3">Akan Datang</div>
                </button>
                <button
                  type="button"
                  className={`flex h-10 w-full items-center rounded-md p-1 font-medium text-warning duration-300 hover:bg-white-dark/10 ltr:hover:pl-3 rtl:hover:pr-3 dark:hover:bg-[#181F32] ${
                    selectedTab === "ongoing" &&
                    "bg-gray-100 ltr:pl-3 rtl:pr-3 dark:bg-[#181F32]"
                  }`}
                  onClick={() => tabChanged("ongoing")}
                >
                  <IconSquareRotated className="shrink-0 fill-warning" />
                  <div className="ltr:ml-3 rtl:mr-3">Berlangsung</div>
                </button>
                <button
                  type="button"
                  className={`flex h-10 w-full items-center rounded-md p-1 font-medium text-success duration-300 hover:bg-white-dark/10 ltr:hover:pl-3 rtl:hover:pr-3 dark:hover:bg-[#181F32] ${
                    selectedTab === "done" &&
                    "bg-gray-100 ltr:pl-3 rtl:pr-3 dark:bg-[#181F32]"
                  }`}
                  onClick={() => tabChanged("done")}
                >
                  <IconSquareRotated className="shrink-0 fill-success" />
                  <div className="ltr:ml-3 rtl:mr-3">Selesai</div>
                </button>
              </div>
            </PerfectScrollbar>
          </div>
        </div>
        <div className="panel h-full flex-1 overflow-auto">
          <div className="pb-5">
            <button
              type="button"
              className="hover:text-primary xl:hidden"
              onClick={() => setIsShowNoteMenu(!isShowNoteMenu)}
            >
              <IconMenu />
            </button>
          </div>
          {filteredTripsList.length ? (
            <div className="min-h-[400px] sm:min-h-[300px]">
              <div className="grid grid-cols-1 gap-5">
                {" "}
                {filteredTripsList.map((trip: TripResponseData) => {
                  return (
                    <div
                      className={`panel ${
                        trip.status === "upcoming"
                          ? "bg-primary-light shadow-primary"
                          : trip.status === "ongoing"
                          ? "bg-warning-light shadow-warning"
                          : trip.status === "done"
                          ? "bg-success-light shadow-success"
                          : "dark:shadow-dark"
                      }`}
                      key={trip.id}
                    >
                      <div className="min-h-[100px]">
                        <div className="flex justify-between">
                          <div className="flex w-max items-center">
                            <div className="">
                              <div className="font-semibold text-xl">
                                {trip.name}
                              </div>
                              <div className="text-sx text-white-dark">
                                {formatDate(trip.start)} -{" "}
                                {formatDate(trip.end)}
                              </div>
                            </div>
                          </div>
                          <div className="dropdown">
                            <Dropdown
                              offset={[0, 5]}
                              placement="bottom-end"
                              btnClassName="text-primary"
                              button={
                                <IconHorizontalDots className="rotate-90 opacity-70 hover:opacity-100" />
                              }
                            >
                              <ul className="text-sm font-medium">
                                <li>
                                  <button
                                    type="button"
                                    onClick={() => editNote(trip)}
                                  >
                                    <IconPencil className="h-4 w-4 shrink-0 ltr:mr-3 rtl:ml-3" />
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button
                                    type="button"
                                    onClick={() => viewNote(trip.id)}
                                  >
                                    <IconEye className="h-4.5 w-4.5 shrink-0 ltr:mr-3 rtl:ml-3" />
                                    View
                                  </button>
                                </li>
                              </ul>
                            </Dropdown>
                          </div>
                        </div>
                        <div>
                          <h4 className="mt-2 font-semibold">
                            {trip.picName != "" ? trip.picName : "-"}
                          </h4>
                          <div className="mt-2 flex flex-wrap gap-4">
                            <div className="flex items-center">Berangkat :</div>
                            {trip.check_in.absent !== 0 && (
                              <button
                                type="button"
                                className="badge badge-outline-success rounded-lg capitalize shadow-success"
                              >
                                Sudah Absen : {trip.check_in.absent}
                              </button>
                            )}

                            {trip.check_in.not_yet_absent !== 0 && (
                              <button
                                type="button"
                                className="badge badge-outline-danger rounded-lg capitalize shadow-danger"
                              >
                                Belum Absen : {trip.check_in.not_yet_absent}
                              </button>
                            )}

                            {trip.check_in.permission !== 0 && (
                              <button
                                type="button"
                                className="badge badge-outline-warning rounded-lg capitalize shadow-warning"
                              >
                                Izin : {trip.check_in.permission}
                              </button>
                            )}

                            {trip.check_in.sick !== 0 && (
                              <button
                                type="button"
                                className="badge badge-outline-primary rounded-lg capitalize shadow-primary"
                              >
                                Sakit : {trip.check_in.sick}
                              </button>
                            )}
                            {trip.check_out.absent === 0 &&
                              trip.check_out.not_yet_absent === 0 &&
                              trip.check_out.permission === 0 &&
                              trip.check_out.sick === 0 && (
                                <span className="text-gray-500">
                                  Tidak ada Jamaah
                                </span>
                              )}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-4">
                            <div className="flex items-center">Kembali :</div>
                            {trip.check_out.absent !== 0 && (
                              <button
                                type="button"
                                className="badge badge-outline-success rounded-lg capitalize shadow-success"
                              >
                                Sudah Absen : {trip.check_out.absent}
                              </button>
                            )}

                            {trip.check_out.not_yet_absent !== 0 && (
                              <button
                                type="button"
                                className="badge badge-outline-danger rounded-lg capitalize shadow-danger"
                              >
                                Belum Absen : {trip.check_out.not_yet_absent}
                              </button>
                            )}

                            {trip.check_out.permission !== 0 && (
                              <button
                                type="button"
                                className="badge badge-outline-warning rounded-lg capitalize shadow-warning"
                              >
                                Izin : {trip.check_out.permission}
                              </button>
                            )}

                            {trip.check_out.sick !== 0 && (
                              <button
                                type="button"
                                className="badge badge-outline-primary rounded-lg capitalize shadow-primary"
                              >
                                Sakit : {trip.check_out.sick}
                              </button>
                            )}

                            {trip.check_out.absent === 0 &&
                              trip.check_out.not_yet_absent === 0 &&
                              trip.check_out.permission === 0 &&
                              trip.check_out.sick === 0 && (
                                <span className="text-gray-500">
                                  Tidak ada Jamaah
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-5 left-0 w-full px-5"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[400px] items-center justify-center text-lg font-semibold sm:min-h-[300px]">
              No data available
            </div>
          )}

          <Transition appear show={addContactModal} as={Fragment}>
            <Dialog
              as="div"
              open={addContactModal}
              onClose={() => setAddContactModal(false)}
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
                        onClick={() => setAddContactModal(false)}
                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                      >
                        <IconX />
                      </button>
                      <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                        {params.id ? "Edit Note" : "Add Note"}
                      </div>
                      <div className="p-5">
                        <form>
                          <div className="mb-5">
                            <label htmlFor="name">Name</label>
                            <input
                              id="name"
                              type="text"
                              placeholder="Enter name"
                              className="form-input"
                              value={params.name}
                              onChange={(e) => changeValue(e)}
                            />
                          </div>
                          <div className="mb-5">
                            <label htmlFor="name">User Name</label>
                            <select
                              id="user"
                              className="form-select"
                              value={params.picName}
                              onChange={(e) => changeValue(e)}
                            >
                              <option value="">Select User</option>
                              <option value="Max Smith">Max Smith</option>
                              <option value="John Doe">John Doe</option>
                              <option value="Kia Jain">Kia Jain</option>
                              <option value="Karena Courtliff">
                                Karena Courtliff
                              </option>
                              <option value="Vladamir Koschek">
                                Vladamir Koschek
                              </option>
                              <option value="Robert Garcia">
                                Robert Garcia
                              </option>
                              <option value="Marie Hamilton">
                                Marie Hamilton
                              </option>
                              <option value="Megan Meyers">Megan Meyers</option>
                              <option value="Angela Hull">Angela Hull</option>
                              <option value="Karen Wolf">Karen Wolf</option>
                              <option value="Jasmine Barnes">
                                Jasmine Barnes
                              </option>
                              <option value="Thomas Cox">Thomas Cox</option>
                              <option value="Marcus Jones">Marcus Jones</option>
                              <option value="Matthew Gray">Matthew Gray</option>
                              <option value="Chad Davis">Chad Davis</option>
                              <option value="Linda Drake">Linda Drake</option>
                              <option value="Kathleen Flores">
                                Kathleen Flores
                              </option>
                            </select>
                          </div>
                          <div className="mb-5">
                            <label htmlFor="tag">Status</label>
                            <select
                              id="tag"
                              className="form-select"
                              value={params.status}
                              onChange={(e) => changeValue(e)}
                            >
                              <option value="">None</option>
                              <option value="upcoming">Akan Datang</option>
                              <option value="ongoing">Berlangsung</option>
                              <option value="done">Selesai</option>
                            </select>
                          </div>
                          {/* <div className="mb-5">
                            <label htmlFor="desc">Description</label>
                            <textarea
                              id="description"
                              rows={3}
                              className="form-textarea min-h-[130px] resize-none"
                              placeholder="Enter Description"
                              value={params.description}
                              onChange={(e) => changeValue(e)}
                            ></textarea>
                          </div> */}
                          {/* <div className="mb-5">
                            <label htmlFor="absent">Absent</label>
                            <textarea
                              id="absent"
                              rows={3}
                              className="form-textarea min-h-[130px] resize-none"
                              placeholder="Enter Description"
                              value={params.absent}
                              onChange={(e) => changeValue(e)}
                            ></textarea>
                          </div> */}
                          <div className="mt-8 flex items-center justify-end">
                            <button
                              type="button"
                              className="btn btn-outline-danger gap-2"
                              onClick={() => setAddContactModal(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary ltr:ml-4 rtl:mr-4"
                              // onClick={saveNote}
                            >
                              {params.id ? "Update Note" : "Add Note"}
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

          <Transition appear show={isViewNoteModal} as={Fragment}>
            <Dialog
              as="div"
              open={isViewNoteModal}
              onClose={() => setIsViewNoteModal(false)}
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
                        onClick={() => setIsViewNoteModal(false)}
                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                      >
                        <IconX />
                      </button>
                      <div className="flex flex-wrap items-center gap-2 bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                        <div className="ltr:mr-3 rtl:ml-3">{params.name}</div>
                        {params.status && (
                          <button
                            type="button"
                            className={`badge badge-outline-primary rounded-3xl capitalize ltr:mr-3 rtl:ml-3 ${
                              (params.status === "upcoming" && "shadow-primary",
                              params.status === "ongoing" && "shadow-warning",
                              params.status === "done" && "shadow-success")
                            }`}
                          >
                            {params.status}
                          </button>
                        )}
                      </div>
                      <div className="p-5">
                        {/* <div className="text-base">{params.description}</div> */}

                        <div className="mt-8 ltr:text-right rtl:text-left">
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => setIsViewNoteModal(false)}
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
    </div>
  );
};

export default ComponentsReport;
