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
  pic_id: number;
  name: string;
  pic_name?: string;
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
  const { data } = useSession();

  const router = useRouter();

  const defaultParams = {
    id: null,
    name: "",
    pic_name: "",
    date: "",
    absent: 0,
    notYetAbsent: 0,
    permission: 0,
    sick: 0,
  };

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

  const editNote = (id: number) => {
    const tripPage = `report/${id}`;
    router.push(tripPage);
    // setParams(note);
    // setIsViewNoteModal(true);
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
                                    onClick={() => editNote(trip.id)}
                                  >
                                    <IconPencil className="h-4.5 w-4.5 shrink-0 ltr:mr-3 rtl:ml-3" />
                                    Edit
                                  </button>
                                </li>
                              </ul>
                            </Dropdown>
                          </div>
                        </div>
                        <div>
                          <div className="mt-2 flex flex-wrap gap-4">
                            <div className="flex items-center">
                              Pembimbing :
                            </div>
                            {trip?.pic_name ? (
                              <div>{trip.pic_name}</div>
                            ) : (
                              <div className="text-gray-500">
                                Tidak ada Pembimbing
                              </div>
                            )}
                          </div>
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
        </div>
      </div>
    </div>
  );
};

export default ComponentsReport;
