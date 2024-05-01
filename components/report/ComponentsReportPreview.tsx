"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import IconPlus from "../icon/IconPlus";
import IconEdit from "../icon/IconEdit";
import { tripService } from "@/app/(default)/trip/api/api";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../icon/IconX";
import Swal from "sweetalert2";
import { reportService } from "@/app/(default)/report/api/api";
import {
  Pilgrim,
  ResponseUpdateAttendancePilgrim,
  TripResponseData,
} from "@/interfaces/reports/types";

const ComponentsReportPreview: React.FC<{ tripId: string }> = ({ tripId }) => {
  const defaultPilgrim: Pilgrim = {
    // id: null,
    portion_number: "asd",
    name: "",
    gender: "",
    birth_date: "",
    phone_number: "",
    group: "",
    cloter: "",
    passport_number: "",
    check_in: "",
    check_out: "",
    reason: "",
  };

  const { data } = useSession();
  const [token, setToken] = useState("");

  const [tripData, setTripData] = useState<TripResponseData>();
  const [pilgrims, setPilgrimsData] = useState<Pilgrim[]>([]);
  const [params, setParams] = useState<any>(
    JSON.parse(JSON.stringify(defaultPilgrim))
  );

  // Absensi
  const [isShowAttendanceMenu, setIsShowAttendanceMenu] = useState(false);
  const [addAttendanceModal, setAddAttandanceModal] = useState(false);
  // Tampilkan Masukkan Alasan
  const [checkInReason, setCheckInReason] = useState("");
  const [checkOutReason, setCheckOutReason] = useState("");
  const [reason, setReason] = useState("");

  const shouldShowInput =
    checkInReason === "permission" || checkOutReason === "permission";

  // Show Dialog
  const addEditAttendance = (pilgrim: Pilgrim) => {
    let json = JSON.parse(JSON.stringify(defaultPilgrim));
    setParams(json);

    if (pilgrim) {
      let json1 = JSON.parse(JSON.stringify(pilgrim));
      setParams(json1);

      if (pilgrim.check_in) {
        setCheckInReason(pilgrim.check_in);
      } else {
        setCheckInReason("");
      }

      if (pilgrim.check_out) {
        setCheckOutReason(pilgrim.check_out);
      } else {
        setCheckOutReason("");
      }

      if (pilgrim.reason) {
        setReason(pilgrim.reason);
      } else {
        setReason("");
      }
    }

    setAddAttandanceModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data && data.accessToken) {
          // Fetch trip data
          const tripData: TripResponseData =
            await tripService.fetchTripDataById(tripId, data?.accessToken);
          setToken(data?.accessToken);
          if (tripData) {
            setTripData(tripData);
          }
          if (tripData.pilgrims) {
            setPilgrimsData(tripData.pilgrims);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data?.accessToken]); // Empty dependency array to run effect only once after initial render

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd MMMM yyyy");
  };

  const formatTime = (dateString: Date) => {
    const date = new Date(dateString);
    return format(date, "HH:mm");
  };

  const exportTable = () => {
    window.print();
  };

  const columns = [
    {
      key: "portionNumber",
      label: "No. Porsi",
    },
    {
      key: "name",
      label: "Nama",
    },
    {
      key: "phoneNumber",
      label: "No. Telepon",
    },
    {
      key: "group",
      label: "Grup",
    },
    {
      key: "cloter",
      label: "Kloter",
    },
    {
      key: "passportNumber",
      label: "No. Passport",
    },
    {
      key: "check_in",
      label: "Berangkat",
    },
    {
      key: "check_out",
      label: "Kembali",
    },
    {
      key: "action",
      label: "Aksi",
    },
  ];

  const saveAttendance = async () => {
    const data: ResponseUpdateAttendancePilgrim = {
      checkIn: checkInReason,
      checkOut: checkOutReason,
      reason: shouldShowInput ? reason : "",
    };
    if (
      params.check_in != checkInReason ||
      params.check_out != checkOutReason ||
      params.reason != reason
    ) {
      await postAttendance(tripId, params.id, data);
    } else {
      showMessage("Tidak ada yang diubah", "error");
    }
    setAddAttandanceModal(false);
  };

  const postAttendance = async (
    tripId: string,
    pilgrimId: string,
    data: ResponseUpdateAttendancePilgrim
  ) => {
    try {
      await reportService.updateAttendancePilgrimById(
        tripId,
        pilgrimId,
        data,
        token
      );
      // Perbarui data jamaah di client
      const updatedPilgrims = pilgrims.map((pilgrim) => {
        if (pilgrim.id === +pilgrimId) {
          return {
            ...pilgrim,
            check_in: data.checkIn,
            check_out: data.checkOut,
            reason: data.reason,
          };
        }
        return pilgrim;
      });
      setPilgrimsData(updatedPilgrims);
      showMessage("Berhasil mengubah absensi jamaah");
    } catch (error) {
      showMessage("Gagal mengubah absensi jamaah", "error");
      console.error("Error fetching data:", error);
      setAddAttandanceModal(false);
    }
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

  return (
    <div>
      <div className="panel">
        <div className="text-2xl font-semibold uppercase">{tripData?.name}</div>
        <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
        <div className="flex flex-col flex-wrap justify-between gap-6 lg:flex-row">
          <div className="flex-1">
            <div className="space-y-1 text-white-dark">
              <div>Pemandu:</div>
              <div className="font-semibold text-black dark:text-white">
                {tripData?.picName}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 sm:flex-row lg:w-2/3">
            <div className="xl:1/3 sm:w-1/2 lg:w-2/5">
              <div className="mb-2 flex w-full items-center justify-between">
                <div className="text-white-dark">Titik Kumpul :</div>
                <div>{tripData?.meeting_point}</div>
              </div>
              <div className="mb-2 flex w-full items-center justify-between">
                <div className="text-white-dark">Nomor Bis :</div>
                <div>{tripData?.bus}</div>
              </div>
              <div className="mb-2 flex w-full  justify-between">
                <div className="text-white-dark">Destinasi :</div>
                <div className="ml-4 text-right">{tripData?.destination}</div>
              </div>
            </div>
            <div className="xl:1/3 sm:w-1/2 lg:w-2/5">
              <div className="mb-2 flex w-full items-center justify-between">
                <div className="text-white-dark">Tanggal:</div>
                <div className="whitespace-nowrap">
                  {tripData ? formatDate(tripData.date) : "-"}
                </div>{" "}
              </div>
              <div className="mb-2 flex w-full items-center justify-between">
                <div className="text-white-dark">Standby:</div>
                <div>{tripData ? formatTime(tripData.stand_by) : "-"}</div>{" "}
              </div>
              <div className="mb-2 flex w-full items-center justify-between">
                <div className="text-white-dark">Berangkat:</div>
                <div>{tripData ? formatTime(tripData.start) : "-"}</div>{" "}
              </div>
              <div className="mb-2 flex w-full items-center justify-between">
                <div className="text-white-dark">Kembali:</div>
                <div>{tripData ? formatTime(tripData.end) : "-"}</div>{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive mt-6">
          <table className="table-striped">
            <thead>
              <tr>
                {columns.map((column) => {
                  return (
                    <th
                      key={column.key}
                      className={
                        column.key === "action" ? "text-center" : "text-left"
                      }
                    >
                      {column.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {pilgrims.map((pilgrim) => {
                return (
                  <tr key={pilgrim.id}>
                    <td>{pilgrim.portion_number}</td>
                    <td>{pilgrim.name}</td>
                    <td>{pilgrim.phone_number}</td>
                    <td>{pilgrim.cloter}</td>
                    <td>{pilgrim.group}</td>
                    <td>{pilgrim.passport_number}</td>
                    <td>
                      {pilgrim.check_in === "absent" ? (
                        <button
                          type="button"
                          className="badge badge-outline-success rounded-lg capitalize shadow-success"
                        >
                          ABSEN
                        </button>
                      ) : pilgrim.check_in === null ||
                        pilgrim.check_in === "" ? (
                        <button
                          type="button"
                          className="badge badge-outline-danger rounded-lg capitalize shadow-danger"
                        >
                          BELUM ABSEN
                        </button>
                      ) : pilgrim.check_in === "permission" ? (
                        <button
                          type="button"
                          className="badge badge-outline-warning rounded-lg capitalize shadow-warning "
                        >
                          IZIN
                        </button>
                      ) : pilgrim.check_in === "sick" ? (
                        <button
                          type="button"
                          className="badge badge-outline-primary rounded-lg capitalize shadow-primary"
                        >
                          SAKIT
                        </button>
                      ) : (
                        // Default case
                        <span className="text-gray-500">Unknown</span>
                      )}
                    </td>

                    <td>
                      {pilgrim.check_out === "absent" ? (
                        <button
                          type="button"
                          className="badge badge-outline-success rounded-lg capitalize shadow-success"
                        >
                          ABSEN
                        </button>
                      ) : pilgrim.check_out === null ||
                        pilgrim.check_out === "" ? (
                        <button
                          type="button"
                          className="badge badge-outline-danger rounded-lg capitalize shadow-danger"
                        >
                          BELUM ABSEN
                        </button>
                      ) : pilgrim.check_out === "permission" ? (
                        <button
                          type="button"
                          className="badge badge-outline-warning rounded-lg capitalize shadow-warning "
                        >
                          IZIN
                        </button>
                      ) : pilgrim.check_out === "sick" ? (
                        <button
                          type="button"
                          className="badge badge-outline-primary rounded-lg capitalize shadow-primary"
                        >
                          SAKIT
                        </button>
                      ) : (
                        // Default case
                        <span className="text-gray-500">Unknown</span>
                      )}
                    </td>
                    <td>
                      <div className="mx-auto flex w-max items-center gap-4">
                        <button
                          className="flex hover:text-info"
                          onClick={() => addEditAttendance(pilgrim)}
                        >
                          <IconEdit className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Transition appear show={addAttendanceModal} as={Fragment}>
        <Dialog
          as="div"
          open={addAttendanceModal}
          onClose={() => setAddAttandanceModal(false)}
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
                    onClick={() => setAddAttandanceModal(false)}
                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                  >
                    <IconX />
                  </button>
                  <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                    Ubah Absensi
                  </div>
                  <div className="p-5">
                    <form>
                      <div className="mb-5 flex justify-between gap-4">
                        <div className="flex-1">
                          <label htmlFor="tag">Berangkat</label>
                          <select
                            id="tag"
                            className="form-select"
                            value={checkInReason}
                            onChange={(event) =>
                              setCheckInReason(event.target.value)
                            }
                          >
                            <option value="">Belum Absen</option>
                            <option value="absent">Absen</option>
                            <option value="permission">Izin</option>
                            <option value="sick">Sakit</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label htmlFor="priority">Kembali</label>
                          <select
                            id="priority"
                            className="form-select"
                            value={checkOutReason}
                            onChange={(event) =>
                              setCheckOutReason(event.target.value)
                            }
                          >
                            <option value="">Belum Absen</option>
                            <option value="absent">Absen</option>
                            <option value="permission">Izin</option>
                            <option value="sick">Sakit</option>
                          </select>
                        </div>
                      </div>
                      {shouldShowInput && (
                        <div className="mb-5">
                          <label htmlFor="alasan">Alasan</label>
                          <input
                            value={reason}
                            id="alasan"
                            type="text"
                            placeholder="Masukkan Alasannya"
                            className="form-input"
                            onChange={(event) => setReason(event.target.value)}
                          />
                          <span className="ml-2 text-xs italic text-gray-500">
                            (Tidak wajib diisi)
                          </span>
                        </div>
                      )}
                      <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => setAddAttandanceModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary ml-4"
                          onClick={() => saveAttendance()}
                        >
                          Update
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
    </div>
  );
};

export default ComponentsReportPreview;
