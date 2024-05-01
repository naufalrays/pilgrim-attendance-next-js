"use client";
import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import IconX from "@/components/icon/IconX";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import IconSearch from "../../icon/IconSearch";
import IconListCheck from "../../icon/IconListCheck";
import IconUserPlus from "../../icon/IconUserPlus";
import IconLayoutGrid from "../../icon/IconLayoutGrid";
import { format } from "date-fns";
import { jamaahService } from "@/app/(default)/user/jamaah/api/api";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { Backend_URL } from "@/lib/Constants";

interface Pilgrim {
  id: number;
  portion_number: string;
  name: string;
  gender: string;
  birth_date: Date;
  phone_number: string;
  group: string;
  cloter: string;
  passport_number: string;
}

const ComponentsJamaah = () => {
  const { data } = useSession();
  const [addContactModal, setAddContactModal] = useState<any>(false);
  const [pilgrims, setPilgrim] = useState<Pilgrim[]>([]);
  const [filteredItems, setFilteredItems] = useState<any>(pilgrims);
  const [token, setToken] = useState("");

  const [value, setValue] = useState<any>("list");
  const [defaultParams] = useState({
    id: null,
    portion_number: "",
    name: "",
    gender: "",
    birth_date: "",
    phone_number: "",
    group: "",
    cloter: "",
    passport_number: "",
  });

  const [params, setParams] = useState<any>(
    JSON.parse(JSON.stringify(defaultParams))
  );

  useEffect(() => {
    const fetchPilgrimData = async () => {
      try {
        if (data && data.accessToken) {
          const response = await jamaahService.fetchJamaahData(
            data.accessToken
          );
          setPilgrim(response);
          setFilteredItems(response);
          setToken(data?.accessToken);
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    fetchPilgrimData();
  }, [data?.accessToken]);

  const changeValue = (e: any) => {
    console.log(e);
    if (e[0] instanceof Date) {
      setParams({ ...params, birth_date: e[0] });
    } else {
      const { value, id } = e.target;
      setParams({ ...params, [id]: value });
    }
  };

  const [search, setSearch] = useState<any>("");
  const [contactList] = useState<any>([
    {
      id: 1,
      portion_number: "091029313",
      name: "JOhn",
      gender: "M",
      birth_date: new Date("2022-04-06"),
      phone_number: "08123123123123",
      group: "Rombongan 1",
      cloter: "12",
      passport_number: "ASD 123123",
    },
  ]);

  const searchContact = () => {
    console.log("asdsa");
    setFilteredItems(() => {
      return pilgrims.filter((item: any) => {
        return item.name.toLowerCase().includes(search.toLowerCase());
      });
    });
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd MMMM yyyy");
  };

  useEffect(() => {
    searchContact();
  }, [search]);

  const saveUser = async () => {
    if (!params.portion_number) {
      showMessage("Nomor Porsi dibutuhkan.", "error");
      return true;
    }
    if (!params.name) {
      showMessage("Nama dibutuhkan.", "error");
      return true;
    }
    if (!params.gender) {
      showMessage("Jenis Kelamin dibutuhkan.", "error");
      return true;
    }
    if (!params.birth_date) {
      showMessage("Tanggal Lahir dibutuhkan.", "error");
      return true;
    }
    if (!params.phone_number) {
      showMessage("Nomor telepon dibutuhkan.", "error");
      return true;
    }

    const phoneRegex = /^0\d{9,11}$/;
    if (!phoneRegex.test(params.phone_number)) {
      showMessage("Nomor telepon tidak valid", "error");
      return true;
    }
    if (!params.group) {
      showMessage("Rombongan dibutuhkan.", "error");
      return true;
    }
    if (!params.cloter) {
      showMessage("Kloter dibutuhkan.", "error");
      return true;
    }
    if (params.id) {
      // update Pilgrim
      try {
        await jamaahService.updateJamaah(params.id, params, token);
        let pilgrim: any = filteredItems.find((d: any) => d.id === params.id);
        pilgrim.portion_number = params.portion_number;
        pilgrim.name = params.name;
        pilgrim.gender = params.gender;
        pilgrim.birth_date = params.birth_date;
        pilgrim.phone_number = params.phone_number;
        pilgrim.group = params.group;
        pilgrim.cloter = params.cloter;
        pilgrim.passport_number = params.passport_number;
        showMessage("Data berhasil diubah");
      } catch (error) {
        showMessage("Gagal memperbaharui data", "error");
      }
    } else {
      //add Pilgrim
      let maxUserId = filteredItems.length
        ? filteredItems.reduce(
            (max: any, character: any) =>
              character.id > max ? character.id : max,
            filteredItems[0].id
          )
        : 0;

      let pilgrim = {
        id: maxUserId + 1,
        portion_number: params.portion_number,
        name: params.name,
        gender: params.gender,
        birth_date: params.birth_date,
        phone_number: params.phone_number,
        group: params.group,
        cloter: params.cloter,
        passport_number: params.passport_number,
      };
      try {
        await jamaahService.createJamaah(pilgrim, token);
        filteredItems.splice(0, 0, pilgrim);
        showMessage("Data berhasil ditambahkan");
      } catch (error) {
        showMessage("Gagal menambahkan data", "error");
      }
    }
    // showMessage("User has been saved successfully.");
    setAddContactModal(false);
  };

  const editUser = (pilgrim: any = null) => {
    const json = JSON.parse(JSON.stringify(defaultParams));
    setParams(json);
    if (pilgrim) {
      let json1 = JSON.parse(JSON.stringify(pilgrim));
      setParams(json1);
    }
    setAddContactModal(true);
  };

  const deleteUser = async (id: number) => {
    if (window.confirm("Apakah kamu yakin ingin menghapus datanya ?")) {
      if (id) {
        try {
          await jamaahService.deleteJamaah(id, token);
          showMessage("Berhasil menghapus data");
          setFilteredItems(filteredItems.filter((d: any) => d.id !== id));
        } catch (error) {
          showMessage("Gagal menghapus data", "error");
        }
      }
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

  const downloadPDF = async (id: number) => {
    const doc = new jsPDF({
      orientation: "p",
      unit: "cm",
      format: [8.5, 5.5],
    });
    doc.addImage(
      "/assets/images/pdf-background.png",
      "PNG",
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight()
    );
    // Menghitung posisi horizontal dan vertikal tengah
    const centerX = doc.internal.pageSize.getWidth() / 2;
    const centerY = doc.internal.pageSize.getHeight() / 2;

    doc.setTextColor("#ffffff"); // Mengatur warna teks menjadi putih
    doc.setFontSize(11); // Mengatur ukuran font menjadi 12
    doc.text("KBIH TARBIS", centerX, 0.6, { align: "center" });

    doc.setTextColor("#000000"); // Mengatur warna teks menjadi hitam
    doc.setFontSize(6); // Mengatur ukuran font menjadi 12
    doc.text(pilgrims[id].name, centerX, 5, { align: "center" });
    doc.text(pilgrims[id].portion_number, centerX, 5.28, { align: "center" });

    var opts: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      margin: 0,
    };

    const qrCodeDataURL = await QRCode.toDataURL(
      `${Backend_URL}/pilgrim/${pilgrims[id].portion_number}`,
      opts
    );
    const qrCodeImg = new Image();
    // qrCodeImg.src = qrCodeDataURL;

    doc.setTextColor("#ffffff"); // Mengatur warna teks menjadi putih
    doc.setFontSize(3.6); // Mengatur ukuran font menjadi 12
    doc.addImage(qrCodeDataURL, "JPEG", centerX - 0.7, 5.4, 1.4, 1.4);
    doc.text(
      "Jl. Raya Jagakarsa Jl. H. Sa Amah No.45 7, RT.7/RW.4, Jagakarsa, \nKec. Jagakarsa, Kota Jakarta Selatan, DKI Jakarta 12620",
      centerX,
      7.8,
      { align: "center" }
    );
    doc.setFontSize(5); // Mengatur ukuran font menjadi 12

    doc.text("Kontak : Abdul Holik Muhidin (+62 8118741217)", centerX, 8.3, {
      align: "center",
    });
    doc.save("a4.pdf");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl">Jamaah</h2>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <div className="flex gap-3">
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => editUser()}
              >
                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                Tambahkan Jamaah
              </button>
            </div>
            <div>
              <button
                type="button"
                className={`btn btn-outline-primary p-2 ${
                  value === "list" && "bg-primary text-white"
                }`}
                onClick={() => setValue("list")}
              >
                <IconListCheck />
              </button>
            </div>
            <div>
              <button
                type="button"
                className={`btn btn-outline-primary p-2 ${
                  value === "grid" && "bg-primary text-white"
                }`}
                onClick={() => setValue("grid")}
              >
                <IconLayoutGrid />
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari Jamaah"
              className="peer form-input py-2 ltr:pr-11 rtl:pl-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]"
            >
              <IconSearch className="mx-auto" />
            </button>
          </div>
        </div>
      </div>
      {value === "list" && (
        <div className="panel mt-5 overflow-hidden border-0 p-0">
          <div className="table-responsive">
            <table className="table-striped table-hover">
              <thead>
                <tr>
                  <th>No. Porsi</th>
                  <th>Nama</th>
                  <th>Jenis Kelamin</th>
                  <th>Tanggal Lahir</th>
                  <th>No. Telepon</th>
                  <th>Rombongan</th>
                  <th>Kloter</th>
                  <th>No. Passport</th>
                  <th className="!text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((pilgrim: Pilgrim, index: number) => {
                  return (
                    <tr key={pilgrim.id}>
                      <td>{pilgrim.portion_number}</td>
                      <td>
                        <div>{pilgrim.name}</div>
                      </td>
                      <td className="whitespace-nowrap">
                        {pilgrim.gender == "M" ? "Laki-Laki" : "Perempuan"}
                      </td>
                      <td className="whitespace-nowrap">
                        {pilgrim ? formatDate(pilgrim.birth_date) : "-"}
                      </td>
                      <td className="whitespace-nowrap">
                        {pilgrim.phone_number}
                      </td>
                      <td className="whitespace-nowrap">{pilgrim.group}</td>
                      <td className="whitespace-nowrap">{pilgrim.cloter}</td>
                      <td className="whitespace-nowrap">
                        {pilgrim.passport_number}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-4">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => editUser(pilgrim)}
                          >
                            Ubah
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteUser(pilgrim.id)}
                          >
                            Hapus
                          </button>
                          <button
                            className="border border-green-500 rounded-md py-1 px-2 text-green-500 hover:bg-green-500 hover:text-white"
                            onClick={() => downloadPDF(index)}
                          >
                            Unduh
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
      )}

      {value === "grid" && (
        <div className="mt-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredItems.map((pilgrim: any) => {
            return (
              <div
                className="relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]"
                key={pilgrim.id}
              >
                <div className="relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]">
                  <div className="rounded-t-md bg-white/40 bg-[url('/assets/images/notification-bg.png')] bg-cover bg-center p-6 pb-0">
                    <img
                      className="mx-auto max-h-40 w-4/5 object-contain"
                      src={`/assets/images/${pilgrim.path}`}
                      alt="contact_image"
                    />
                  </div>
                  <div className="relative -mt-10 px-6 pb-24">
                    <div className="rounded-md bg-white px-2 py-4 shadow-md dark:bg-gray-900">
                      <div className="text-xl">{pilgrim.name}</div>
                      <div className="text-white-dark">{pilgrim.role}</div>
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex-auto">
                          <div className="text-info">{pilgrim.posts}</div>
                          <div>Posts</div>
                        </div>
                        <div className="flex-auto">
                          <div className="text-info">{pilgrim.following}</div>
                          <div>Following</div>
                        </div>
                        <div className="flex-auto">
                          <div className="text-info">{pilgrim.followers}</div>
                          <div>Followers</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                      <div className="flex items-center">
                        <div className="flex-none ltr:mr-2 rtl:ml-2">
                          Email :
                        </div>
                        <div className="truncate text-white-dark">
                          {pilgrim.email}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-none ltr:mr-2 rtl:ml-2">
                          Phone :
                        </div>
                        <div className="text-white-dark">
                          {pilgrim.phone_number}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-none ltr:mr-2 rtl:ml-2">
                          Address :
                        </div>
                        <div className="text-white-dark">
                          {pilgrim.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 mt-6 flex w-full gap-4 p-6 ltr:left-0 rtl:right-0">
                    <button
                      type="button"
                      className="btn btn-outline-primary w-1/2"
                      onClick={() => editUser(pilgrim)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger w-1/2"
                      onClick={() => deleteUser(pilgrim.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
                    {params.id ? "Ubah Jamaah" : "Tambah Jamaah"}
                  </div>
                  <div className="p-5">
                    <form>
                      <div className="mb-5">
                        <label htmlFor="portion_number">Nomor Porsi</label>
                        <input
                          id="portion_number"
                          type="portion_number"
                          placeholder="Masukkan Nomor Porsi"
                          className="form-input"
                          value={params.portion_number}
                          onChange={(e) => changeValue(e)}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="name">Nama</label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Masukkan Nama"
                          className="form-input"
                          value={params.name}
                          onChange={(e) => changeValue(e)}
                        />
                      </div>

                      <div className="mb-5">
                        <label htmlFor="gender">Jenis Kelamin</label>
                        <select
                          id="gender"
                          className="form-select text-white-dark"
                          required
                          value={params.gender}
                          onChange={(e) => changeValue(e)}
                        >
                          <option value="">Pilih Jenis Kelamin</option>
                          <option value="M">Laki-Laki</option>
                          <option value="F">Perempuan</option>
                        </select>
                      </div>
                      <div className="mb-5">
                        <label htmlFor="birth_date">Tanggal Lahir</label>
                        <Flatpickr
                          id="birth_date"
                          value={params.birth_date}
                          options={{
                            dateFormat: "d-m-Y",
                            position: "auto left",
                          }}
                          placeholder="Pilih Tanggal Lahir"
                          className="form-input"
                          onChange={(date) => changeValue(date)}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="number">Nomor Telepon</label>
                        <input
                          id="phone_number"
                          type="text"
                          placeholder="Masukan Nomor Telepon"
                          className="form-input"
                          value={params.phone_number}
                          onChange={(e) => changeValue(e)}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="group">Rombongan</label>
                        <input
                          id="group"
                          type="text"
                          placeholder="Masukkan Rombongan"
                          className="form-input"
                          value={params.group}
                          onChange={(e) => changeValue(e)}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="cloter">Kloter</label>
                        <input
                          id="cloter"
                          type="text"
                          placeholder="Masukkan Kloter"
                          className="form-input"
                          value={params.cloter}
                          onChange={(e) => changeValue(e)}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="passport_number">Nomor Passport</label>
                        <input
                          id="passport_number"
                          type="text"
                          placeholder="Masukkan Nomor Passport"
                          className="form-input"
                          value={params.passport_number}
                          onChange={(e) => changeValue(e)}
                        />
                      </div>
                      <div className="mt-8 flex items-center justify-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => setAddContactModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary ltr:ml-4 rtl:mr-4"
                          onClick={saveUser}
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
    </div>
  );
};

export default ComponentsJamaah;
