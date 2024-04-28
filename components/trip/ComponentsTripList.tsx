"use client";
import IconEdit from "@/components/icon/IconEdit";
import IconEye from "@/components/icon/IconEye";
import IconPlus from "@/components/icon/IconPlus";
import IconTrashLines from "@/components/icon/IconTrashLines";
import { sortBy } from "lodash";
import { DataTableSortStatus, DataTable } from "mantine-datatable";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import useSWR from "swr";
import Swal from "sweetalert2";

interface Trip {
  id: number;
  picId?: number | null;
  name: string;
  date: string;
  meeting_point: string;
  stand_by: string;
  start: string;
  end: string;
  destination: string;
  createdAt: string;
  updatedAt?: string | null;
}

const ComponentsTripList = () => {
  const [items, setItems] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch("http://localhost:8000/trip", {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWlubmloMTIzNCIsInN1YiI6eyJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNzE0Mjg3MzA3LCJleHAiOjE3MTQzNzM3MDd9.PwnCYkzlZZECoaKu3i8EO8y_G7l7yA4nkD6YzI_7ssM",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        const tripData: Trip[] = responseData.data;
        setItems(tripData);
        setInitialRecords(sortBy(tripData, "invoice"));
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    fetchTripData();
  }, []);

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState<Trip[]>([]);
  const [records, setRecords] = useState(initialRecords);
  const [selectedRecords, setSelectedRecords] = useState<any>([]);

  const [search, setSearch] = useState("");
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "firstName",
    direction: "asc",
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy");
  };

  const formatTimeWithDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm dd MMM yyyy");
  };

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  useEffect(() => {
    setInitialRecords(() => {
      return items.filter((item) => {
        return (
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.date.toLowerCase().includes(search.toLowerCase()) ||
          item.meeting_point.toLowerCase().includes(search.toLowerCase()) ||
          item.destination.toLowerCase().includes(search.toLowerCase())
        );
      });
    });
  }, [search]);

  useEffect(() => {
    const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data2.reverse() : data2);
    setPage(1);
  }, [sortStatus]);

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

  const deleteData = async (id: any) => {
    try {
        const response = await fetch(`http://localhost:8000/trip/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWlubmloMTIzNCIsInN1YiI6eyJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNzE0Mjg3MzA3LCJleHAiOjE3MTQzNzM3MDd9.PwnCYkzlZZECoaKu3i8EO8y_G7l7yA4nkD6YzI_7ssM",
          },
        });
        if (!response.ok) {
          throw new Error("Gagal menghapus data");
        }
        showMessage("Berhasil menghapus data");
        // CSR
        setRecords(items.filter((user) => user.id !== id));
        setInitialRecords(items.filter((user) => user.id !== id));
        setItems(items.filter((user) => user.id !== id));
        setSelectedRecords([]);
        setSearch("");
      } catch (error) {
        showMessage(`${error}`, "error");
        console.error("Error fetching trip data:", error);
      }
  }

  const deleteRow = async (id: any = null) => {
    if (window.confirm("Are you sure want to delete selected row ?")) {
      if (id) {
        deleteData(id)
      } else {
        let selectedRows = selectedRecords || [];
        const ids = selectedRows.map((d: any) => {
          return d.id;
        });
        const result = items.filter((d) => !ids.includes(d.id as never));
        setRecords(result);
        setInitialRecords(result);
        setItems(result);
        setSelectedRecords([]);
        setSearch("");
        setPage(1);
      }
    }
  };

  return (
    <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
      <div className="invoice-table">
        <div className="mb-4.5 flex flex-col gap-5 px-5 md:flex-row md:items-center">
          <Link href="/trip/create/" className="btn btn-primary gap-2">
            <IconPlus />
            Tambah Trip Baru
          </Link>
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
                title: "Nama Kegiatan",
                accessor: "name",
                sortable: true,
                render: ({ name, id }) => <div>{name}</div>,
              },
              {
                title: "Tanggal",
                accessor: "date",
                sortable: true,
                render: ({ date }) => <div>{formatDate(date)}</div>,
              },
              {
                title: "Titik Kumpul",
                accessor: "meeting_point",
                sortable: true,
              },
              {
                title: "Jam Kumpul",
                accessor: "stand_by",
                sortable: true,
                render: ({ date }) => <div>{formatTime(date)}</div>,
              },
              {
                title: "Berangkat",
                accessor: "start",
                sortable: true,
                render: ({ date }) => <div>{formatTime(date)}</div>,
              },
              {
                title: "Kembali",
                accessor: "end",
                sortable: true,
                render: ({ date }) => <div>{formatTime(date)}</div>,
              },
              {
                title: "Destinasi",
                accessor: "destination",
                sortable: true,
              },
              {
                accessor: "action",
                title: "Actions",
                sortable: false,
                textAlignment: "center",
                render: ({ id }) => (
                  <div className="mx-auto flex w-max items-center gap-4">
                    <Link
                      href={`/trip/update/${id}`}
                      className="flex hover:text-info"
                    >
                      <IconEdit className="h-4.5 w-4.5" />
                    </Link>
                    <Link
                      href={`/trip/preview/${id}`}
                      className="flex hover:text-primary"
                    >
                      <IconEye />
                    </Link>
                    <button
                      type="button"
                      className="flex hover:text-danger"
                      onClick={(e) => deleteRow(id)}
                    >
                      <IconTrashLines />
                    </button>
                  </div>
                ),
              },
            ]}
            highlightOnHover
            totalRecords={initialRecords.length}
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
      </div>
    </div>
  );
};

export default ComponentsTripList;
