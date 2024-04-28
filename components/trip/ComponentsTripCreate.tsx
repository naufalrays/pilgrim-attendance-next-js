"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import IconX from "../icon/IconX";
import Flatpickr from "react-flatpickr";
import { start } from "repl";
import "flatpickr/dist/flatpickr.css";
import { DataTableSortStatus, DataTable } from "mantine-datatable";
import IconEdit from "../icon/IconEdit";
import IconEye from "../icon/IconEye";
import IconTrashLines from "../icon/IconTrashLines";
import { sortBy } from "lodash";
import IconPlus from "../icon/IconPlus";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { tripService } from "@/app/(default)/trip/api/api";

interface Pilgrim {
  id?: number;
  portion_number: string;
  name: string;
  gender: string;
  birth_date: Date;
  phone_number: string;
  group: string;
  cloter: string;
  bus: string;
  passport_number: string;
}

interface GuideData {
  id: number;
  name: string;
  username: string;
  phoneNumber: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface TripRequestData {
  picId: number;
  name: string;
  date?: Date;
  meeting_point: string;
  stand_by?: Date;
  start?: Date;
  end?: Date;
  destination: string;
  pilgrims?: number[];
}

const ComponentsTripCreate = () => {
  const router = useRouter();
  const [pilgrimData, setPilgrimData] = useState<Pilgrim[]>([]);
  const [selectedPilgrim, setSelectedPilgrim] = useState<Pilgrim[]>([]);
  const [guideData, setGuideData] = useState<GuideData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWlubmloMTIzNCIsInN1YiI6eyJuYW1lIjoicmlvIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxNDI2Njk4OSwiZXhwIjoxNzE0MzUzMzg5fQ.qqs6LLUGqMsOJ-DlfZvF_WrbpZh2iQX9b5KjMlGHMqE"; // Replace with your token

        // Fetch pilgrim data
        const pilgrimData = await tripService.fetchPilgrimData(token);
        setPilgrimData(pilgrimData);

        // Fetch guide data
        const guideData = await tripService.fetchPilgrimData(token);
        setGuideData(guideData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run effect only once after initial render

  const [records, setRecords] = useState<Pilgrim[]>([]);

  const [selectedRecords, setSelectedRecords] = useState<any>([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [5, 10, 15, 20, 25];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "firstName",
    direction: "asc",
  });

  const addPilgrimById = (portionNumber: string) => {
    const selectedPilgrimToAdd = pilgrimData.find(
      (pilgrim) => pilgrim.portion_number === portionNumber
    );

    if (selectedPilgrimToAdd) {
      const updatedPilgrimData = pilgrimData.filter(
        (pilgrim) => pilgrim.portion_number !== portionNumber
      );

      setSelectedPilgrim((prevSelectedPilgrims) => [
        ...prevSelectedPilgrims,
        selectedPilgrimToAdd,
      ]);

      setPilgrimData(updatedPilgrimData);
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      setRecords([...updatedPilgrimData.slice(from, to)]);
    } else {
      console.error(
        `Data jamaah dengan nomor porsi ${portionNumber} tidak ditemukan.`
      );
    }
  };

  const addSelectedPilgrim = () => {
    console.log(selectedRecords);
    const selectedPilgrimsToAdd = selectedRecords.map((record: Pilgrim) => {
      return pilgrimData.find(
        (pilgrim) => pilgrim.portion_number === record.portion_number
      );
    });

    const updatedPilgrimData = pilgrimData.filter((pilgrim: Pilgrim) =>
      selectedPilgrimsToAdd.every(
        (selectedPilgrim: Pilgrim) =>
          selectedPilgrim.portion_number !== pilgrim.portion_number
      )
    );

    setSelectedPilgrim((prevSelectedPilgrims) => [
      ...prevSelectedPilgrims,
      ...selectedPilgrimsToAdd,
    ]);

    setPilgrimData(updatedPilgrimData);
    setSelectedRecords([]);

    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords([...updatedPilgrimData.slice(from, to)]);
  };

  const removeSelectedPilgrim = (portionNumber: string) => {
    const updatedSelectedPilgrims = selectedPilgrim.filter(
      (pilgrim) => pilgrim.portion_number !== portionNumber
    );
    setSelectedPilgrim(updatedSelectedPilgrims);

    const updatedPilgrimData = [
      ...pilgrimData,
      ...selectedPilgrim.filter((p) => p.portion_number === portionNumber),
    ];

    setPilgrimData(updatedPilgrimData);

    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords(updatedPilgrimData.slice(from, to));
  };

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords([...pilgrimData.slice(from, to)]);
  }, [page, pageSize, pilgrimData]);

  // Search

  useEffect(() => {
    setRecords(() => {
      return pilgrimData.filter((data) => {
        return (
          data.portion_number.toLowerCase().includes(search.toLowerCase()) ||
          data.bus.toLowerCase().includes(search.toLowerCase()) ||
          data.phone_number.toLowerCase().includes(search.toLowerCase()) ||
          data.name.toLowerCase().includes(search.toLowerCase()) ||
          data.group.toLowerCase().includes(search.toLowerCase()) ||
          data.cloter.toLowerCase().includes(search.toLowerCase())
        );
      });
    });
  }, [search]);

  // Forms
  const [eventName, setEventName] = useState("");
  const [guide, setGuide] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date>();
  const [standByDate, setStandByDate] = useState<Date>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  Date;
  const isFormValid = () => {
    return (
      eventName.trim() !== "" &&
      guide.trim() !== "" &&
      meetingPoint.trim() !== "" &&
      destination.trim() !== "" &&
      date &&
      standByDate &&
      startDate &&
      endDate
    );
  };

  const logicSubmitButton = () => {
    const pilgrimIds: number[] =
      selectedPilgrim
        ?.map((pilgrim) => pilgrim.id)
        .filter((id): id is number => typeof id === "number") ?? [];
    const parsedDate = date ? new Date(date) : undefined;
    const parsedStandByDate = standByDate ? new Date(standByDate) : undefined;
    const parsedStartDate = startDate ? new Date(startDate) : undefined;
    const parsedEndDate = endDate ? new Date(endDate) : undefined;
    const tripRequestData: TripRequestData = {
      picId: 1,
      name: eventName,
      date: parsedDate,
      meeting_point: meetingPoint,
      stand_by: parsedStandByDate,
      start: parsedStartDate,
      end: parsedEndDate,
      destination: destination,
      pilgrims: pilgrimIds,
    };
    const createTrip = async () => {
      try {
        const response = await fetch("http://localhost:8000/trip", {
          method: "POST",
          body: JSON.stringify(tripRequestData),
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWlubmloMTIzNCIsInN1YiI6eyJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNzE0Mjg3MzA3LCJleHAiOjE3MTQzNzM3MDd9.PwnCYkzlZZECoaKu3i8EO8y_G7l7yA4nkD6YzI_7ssM",
          },
        });
        if (!response.ok) {
          throw new Error("Gagal menambahkan data");
        }
        showMessage("Berhasil menambahkan data");
        const tripPage = "/trip/list";

        router.push("/trip/list");
      } catch (error) {
        showMessage(`${error}`, "error");

        console.error("Error fetching trip data:", error);
      }
    };
    createTrip();
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
      <div className="flex flex-col gap-2.5 xl:flex-row">
        <div className="panel flex-1 px-0 py-6 ltr:xl:mr-0 rtl:xl:ml-6">
          <div className="px-4">
            <div className="flex flex-col justify-between lg:flex-row">
              <div className="mb-6 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                <div className="text-lg">Informasi Kegiatan :</div>
                <div className="mt-4 flex items-center">
                  <label
                    htmlFor="tripName"
                    className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                  >
                    Nama Kegiatan
                  </label>
                  <input
                    id="tripName"
                    type="text"
                    name="tripName"
                    className="form-input flex-1"
                    placeholder="Masukkan nama kegiatan"
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>

                <div className="mt-4 flex items-center">
                  <label htmlFor="pic" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                    Pembimbing
                  </label>
                  <select
                    id="pic"
                    name="pic"
                    value={guide}
                    className="form-select flex-1"
                    onChange={(e) => setGuide(e.target.value)}
                  >
                    <option value="">Pilih Pembimbing</option>
                    {/* <option value="1">Agus</option>
                    <option value="2">Asep</option> */}
                    {guideData.map((guide) => (
                      <option key={guide.id} value={guide.id}>
                        {guide.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 flex items-center">
                  <label
                    htmlFor="meetingPoint"
                    className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                  >
                    Titik Kumpul
                  </label>
                  <input
                    id="meetingPoint"
                    type="text"
                    name="meetingPoint"
                    className="form-input flex-1"
                    placeholder="Masukkan Titik Kumpul"
                    onChange={(e) => setMeetingPoint(e.target.value)}
                  />
                </div>

                <div className="mt-4 flex items-center">
                  <label
                    htmlFor="destination"
                    className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                  >
                    Destinasi
                  </label>
                  <input
                    id="destination"
                    type="text"
                    name="destination"
                    className="form-input flex-1"
                    placeholder="Masukkan Destinasi"
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="text-lg">Detail Waktu :</div>
                <div className="mt-4 flex items-center">
                  <label
                    htmlFor="date"
                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2"
                  >
                    Tanggal
                  </label>
                  <Flatpickr
                    id="date"
                    value={date}
                    options={{
                      dateFormat: "l, d F Y",
                      position: "auto left",
                    }}
                    className="form-input flex-1"
                    onChange={(date) => setDate(date[0])}
                  />
                </div>
                <div className="mt-4 flex items-center">
                  <label
                    htmlFor="date"
                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2"
                  >
                    Standby
                  </label>
                  <Flatpickr
                    data-enable-time
                    options={{
                      enableTime: true,
                      dateFormat: "H:i - d F Y",
                    }}
                    className="form-input flex-1"
                    onChange={(standByDate) => setStandByDate(standByDate[0])}
                  />
                </div>
                <div className="mt-4 flex items-center">
                  <label
                    htmlFor="date"
                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2"
                  >
                    Berangkat
                  </label>
                  <Flatpickr
                    data-enable-time
                    options={{
                      enableTime: true,
                      dateFormat: "H:i - d F Y",
                    }}
                    className="form-input flex-1"
                    onChange={(startDate) => setStartDate(startDate[0])}
                  />
                </div>

                <div className="mt-4 flex items-center">
                  <label
                    htmlFor="date"
                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2"
                  >
                    Kembali
                  </label>
                  <Flatpickr
                    data-enable-time
                    options={{
                      enableTime: true,
                      dateFormat: "H:i - d F Y",
                    }}
                    className="form-input flex-1"
                    onChange={(endDate) => setEndDate(endDate[0])}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th className="text-nowrap w-1/2">Jamaah</th>
                    <th className="text-nowrap">No. Porsi</th>
                    <th className="text-nowrap">Bus</th>
                    <th className="text-nowrap">No. Telepon</th>
                    <th className="text-nowrap"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPilgrim.length <= 0 && (
                    <tr>
                      <td colSpan={5} className="!text-center font-semibold">
                        Tidak ada Jamaah
                      </td>
                    </tr>
                  )}
                  {selectedPilgrim.map((pilgrim: Pilgrim) => {
                    return (
                      <tr className="align-top" key={pilgrim.id}>
                        <td>{pilgrim.name}</td>
                        <td>{pilgrim.portion_number}</td>
                        <td>{pilgrim.bus}</td>
                        <td>{pilgrim.phone_number}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              removeSelectedPilgrim(pilgrim.portion_number)
                            }
                          >
                            <IconX className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-col justify-between px-4 sm:flex-row">
              <div className="mb-6 sm:mb-0">
                <button
                  type="button"
                  className={`btn btn-success ${
                    isFormValid() ? "" : "cursor-not-allowed opacity-50"
                  }`}
                  disabled={!isFormValid()}
                  onClick={() => logicSubmitButton()}
                >
                  Simpan Kegiatan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="panel mt-5 border-white-light px-0 dark:border-[#1b2e4b]">
        <div className="mb-4.5 flex flex-col gap-5 px-5 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-xl">Jamaah Tersedia</h2>
          </div>
          <div className="ltr:ml-auto rtl:mr-auto">
            <input
              type="text"
              className="form-input w-auto"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="datatables pagination-padding">
          <DataTable
            className="table-hover whitespace-nowrap"
            records={records}
            columns={[
              {
                title: "No. Porsi",
                accessor: "portion_number",
                sortable: true,
              },
              {
                title: "Nama",
                accessor: "name",
                sortable: true,
                render: ({ name, id }) => <div>{name}</div>,
              },
              {
                title: "Bus",
                accessor: "bus",
                sortable: true,
              },
              {
                title: "No. Telepon",
                accessor: "phone_number",
                sortable: true,
              },
              {
                title: "Rombongan",
                accessor: "group",
                sortable: true,
              },
              {
                title: "Kloter",
                accessor: "cloter",
                sortable: true,
              },
              {
                accessor: "Aksi",
                title: "Actions",
                sortable: false,
                textAlignment: "center",
                render: ({ portion_number }) => (
                  <button
                    className="btn btn-primary w-full"
                    type="button"
                    onClick={() => addPilgrimById(portion_number)}
                  >
                    Tambah Jamaah
                  </button>
                ),
              },
            ]}
            highlightOnHover
            totalRecords={pilgrimData.length}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={(p) => setPage(p)}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            paginationText={({ from, to, totalRecords }) =>
              `Showing  ${from} to ${to} of ${totalRecords} entries`
            }
          />
        </div>
        <div className="mt-2 flex flex-col justify-between px-4 sm:flex-row">
          <div className="mb-6 sm:mb-0">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => addSelectedPilgrim()}
            >
              Tambahkan yang dipilih
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsTripCreate;
