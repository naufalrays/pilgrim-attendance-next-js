"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import IconPlus from "../icon/IconPlus";
import IconEdit from "../icon/IconEdit";
import { tripService } from "@/app/(default)/trip/api/api";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

interface TripResponseData {
  pic_id: number;
  name: string;
  pic_name?: string;
  date: Date;
  meeting_point: string;
  stand_by: Date;
  start: Date;
  end: Date;
  destination: string;
  bus: string;
  pilgrims?: Pilgrim[];
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

const ComponentsTripPreview: React.FC<{ tripId: string }> = ({ tripId }) => {
  const { data } = useSession();
  const [token, setToken] = useState("");

  const [tripData, setTripData] = useState<TripResponseData>();
  const [pilgrim, setPilgrimData] = useState<Pilgrim[]>([]);

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
            setPilgrimData(tripData.pilgrims);
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
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-4 lg:justify-end">
        <Link href={`/trip/update/${tripId}`} className="btn btn-warning gap-2">
          <IconEdit />
          Edit
        </Link>
      </div>
      <div className="panel">
        <div className="text-2xl font-semibold uppercase">{tripData?.name}</div>

        <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
        <div className="flex flex-col flex-wrap justify-between gap-6 lg:flex-row">
          <div className="flex-1">
            <div className="space-y-1 text-white-dark">
              <div>Pembimbing:</div>
              <div className="font-semibold text-black dark:text-white">
                {tripData?.pic_name ? tripData.pic_name : "Belum ada pembimbing"}
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
                  return <th key={column.key}>{column.label}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {pilgrim.map((pilgrim) => {
                return (
                  <tr key={pilgrim.id}>
                    <td>{pilgrim.portion_number}</td>
                    <td>{pilgrim.name}</td>
                    <td>{pilgrim.phone_number}</td>
                    <td>{pilgrim.cloter}</td>
                    <td>{pilgrim.group}</td>
                    <td>{pilgrim.passport_number}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComponentsTripPreview;
