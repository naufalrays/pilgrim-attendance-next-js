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
import { format } from "date-fns";
import { jamaahService } from "@/app/(default)/user/jamaah/api/api";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { Backend_URL } from "@/lib/Constants";
import IconPrinter from "@/components/icon/IconPrinter";
import IconDownload from "@/components/icon/IconDownload";
import * as XLSX from "xlsx";
import { setLazyProp } from "next/dist/server/api-utils";
import { DataTableSortStatus, DataTable } from "mantine-datatable";
import { sortBy } from "lodash";
import { id } from "date-fns/locale";

interface Pilgrim {
  id: string;
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
  // Import Excel
  const [file, setFile] = useState<File | null>();
  const [jsonData, setJsonData] = useState("");
  const [previewJsonData, setPreviewJsonData] = useState("");
  const [importPilgrimModal, setImportPilgrimModal] = useState<any>(false);
  const [isPreview, setPreviewMode] = useState<any>(false);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    setFile(uploadedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  function previewData() {
    if (!isPreview) {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result;
          if (data) {
            const workbook = XLSX.read(data, { type: "binary" });
            // SheetName
            const sheetName = workbook.SheetNames[0];
            // Worksheet
            const workSheet = workbook.Sheets[sheetName];
            // Json
            const json = XLSX.utils.sheet_to_json(workSheet);

            // Preview
            setPreviewJsonData(JSON.stringify(json, null, 2));
          }
        };
        reader.readAsBinaryString(file);
        setPreviewMode(true);
      }
    } else {
      setPreviewMode(false);
    }
  }

  const saveMultiplePilgrim = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          // SheetName
          const sheetName = workbook.SheetNames[0];
          // Worksheet
          const workSheet = workbook.Sheets[sheetName];
          // Json
          const json: Pilgrim[] = XLSX.utils.sheet_to_json(workSheet);
          // Ubah pola kunci dengan menggunakan indeks
          const propertyNames = [
            "portion_number",
            "name",
            "gender",
            "birth_date",
            "phone_number",
            "group",
            "cloter",
            "passport_number",
          ];
          const modifiedJson = json.map((item: any) => {
            const modifiedItem: any = {};
            Object.keys(item).forEach((key, index) => {
              if (propertyNames[index] === "portion_number") {
                modifiedItem[propertyNames[index]] = String(item[key]); // Mengonversi ke string
              } else if (propertyNames[index] === "birth_date") {
                modifiedItem[propertyNames[index]] = `${item[key]}T00:00:00Z`;
              } else {
                modifiedItem[propertyNames[index]] = item[key];
              }
            });
            return modifiedItem;
          });
          //Save to the DB
          try {
            await jamaahService.createMultipleJamaah(modifiedJson, token);
            records.push(...modifiedJson);
            setRecords([...records]); // Perbarui records dengan nilai baru

            // Tambahkan modifiedJson ke pilgrims
            setPilgrims((prevPilgrims) => [...prevPilgrims, ...modifiedJson]); // Perbarui pilgrims dengan nilai baru

            showMessage("Data berhasil ditambahkan");
          } catch (error) {
            showMessage(`${error}`, "error");
          }
        }
      };
      setImportPilgrimModal(false);
      reader.readAsBinaryString(file);
    }
  };

  const [addContactModal, setAddContactModal] = useState<any>(false);
  // const [pilgrims, setPilgrim] = useState<Pilgrim[]>([]);
  // const [filteredItems, setFilteredItems] = useState<any>(pilgrims);
  const [token, setToken] = useState("");
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

  // Table
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState<Pilgrim[]>([]);
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>([]);
  const [records, setRecords] = useState(initialRecords);
  const [selectedRecords, setSelectedRecords] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });

  const [params, setParams] = useState<any>(
    JSON.parse(JSON.stringify(defaultParams))
  );

  const addPilgrimToRecords = (newPilgrim: any) => {
    // Tambahkan newPilgrim ke records menggunakan concat atau operasi spread
    const updatedRecords = [...pilgrims, newPilgrim];
    // Set records baru
    setRecords(updatedRecords);
    setInitialRecords(updatedRecords);
    setPilgrims(updatedRecords);
  };

  useEffect(() => {
    const fetchPilgrimData = async () => {
      try {
        if (data && data.accessToken) {
          const response = await jamaahService.fetchJamaahData(
            data.accessToken
          );
          setPilgrims(response);
          setInitialRecords(sortBy(response, "name"));
          setToken(data?.accessToken);
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    fetchPilgrimData();
  }, [data?.accessToken]);

  // Table

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
      return pilgrims.filter((pilgrim) => {
        return (
          pilgrim.name.toLowerCase().includes(search.toLowerCase()) ||
          pilgrim.gender.toLowerCase().includes(search.toLowerCase()) ||
          pilgrim.group.toLowerCase().includes(search.toLowerCase()) ||
          pilgrim.cloter.toLowerCase().includes(search.toLowerCase())
        );
      });
    });
  }, [search]);

  useEffect(() => {
    const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data2.reverse() : data2);
    setPage(1);
  }, [sortStatus]);

  const changeValue = (e: any) => {
    if (e[0] instanceof Date) {
      setParams({ ...params, birth_date: e[0] });
    } else {
      const { value, id } = e.target;
      setParams({ ...params, [id]: value });
    }
  };

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

  // const searchContact = () => {
  //   setFilteredItems(() => {
  //     return pilgrims.filter((item: any) => {
  //       return item.name.toLowerCase().includes(search.toLowerCase());
  //     });
  //   });
  // };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd MMMM yyyy");
  };

  // useEffect(() => {
  //   searchContact();
  // }, [search]);

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
        let pilgrim: any = records.find((d: any) => d.id === params.id);
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
      let maxUserId = records.length
        ? records.reduce(
            (max: any, character: any) =>
              character.id > max ? character.id : max,
            records[0].id
          )
        : 0;

      let pilgrim = {
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
        addPilgrimToRecords(pilgrim);
        showMessage("Data berhasil ditambahkan");
      } catch (error) {
        showMessage("Gagal menambahkan data", "error");
      }
    }
    // showMessage("User has been saved successfully.");
    setAddContactModal(false);
  };

  const editUser = (id: any = null) => {
    const json = JSON.parse(JSON.stringify(defaultParams));
    setParams(json);

    const foundPilgrim = pilgrims.find((pilgrim) => pilgrim.id === id);
    if (foundPilgrim) {
      const json1 = JSON.parse(JSON.stringify(foundPilgrim));
      setParams(json1);
    }

    setAddContactModal(true);
  };

  const importExcel = (pilgrim: any = null) => {
    // const json = JSON.parse(JSON.stringify(defaultParams));
    // setParams(json);
    // if (pilgrim) {
    //   let json1 = JSON.parse(JSON.stringify(pilgrim));
    //   setParams(json1);
    // }
    setFile(null);
    setPreviewMode(false);
    setImportPilgrimModal(true);
  };

  const deleteUser = async (portion_number: string) => {
    if (window.confirm("Apakah kamu yakin ingin menghapus datanya ?")) {
      if (id) {
        try {

          await jamaahService.deleteJamaahByPortionNumber(portion_number, token);
          showMessage("Berhasil menghapus data");
          setRecords(pilgrims.filter((d: any) => d.portion_number !== portion_number));
          setInitialRecords(pilgrims.filter((d: any) => d.portion_number !== portion_number));
          setPilgrims(pilgrims.filter((d: any) => d.portion_number !== portion_number));
          setSelectedRecords([]);
          setSearch("");
          if (records.length == 1) {
            if (page != 0) {
              setPage(page - 1);
            }
          }
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

  const downloadAllPilgrim = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "cm",
      format: "a4",
    });

    const margin = 0.5; // Margin halaman dalam cm
    const nametagWidth = 5.5; // Lebar nametag dalam cm
    const nametagHeight = 8.5; // Tinggi nametag dalam cm
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2; // Lebar halaman dalam cm
    const pageHeight = doc.internal.pageSize.getHeight() - margin * 2; // Tinggi halaman dalam cm
    let x = margin; // Posisi x awal
    let y = margin; // Posisi y awal

    // Loop melalui setiap jamaah
    for (let i = 0; i < pilgrims.length; i++) {
      // Tunggu sampai QR code selesai dibuat
      const qrCodeDataURL = await generateQRCodeDataUrl(pilgrims[i].id);

      // Tambahkan nametag
      addNametag(doc, pilgrims[i], x, y, qrCodeDataURL);

      // Perbarui posisi x dan y
      x += nametagWidth + margin;

      // Cek apakah masih muat di samping
      if (x + nametagWidth > pageWidth) {
        // Jika tidak muat, pindah ke baris baru
        x = margin;
        y += nametagHeight + margin;

        // Cek apakah masih muat di halaman ini
        if (y + nametagHeight > pageHeight) {
          // Jika tidak muat, tambahkan halaman baru
          doc.addPage();
          x = margin;
          y = margin;
        }
      }
    }
    doc.save("nametags.pdf");
  };

  // Fungsi untuk menghasilkan QR code data URL
  const generateQRCodeDataUrl = async (pilgrimId: string) => {
    return await QRCode.toDataURL(`${Backend_URL}/pilgrim/${pilgrimId}`, {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      margin: 0,
    });
  };

  const addNametag = async (
    doc: any,
    pilgrim: Pilgrim,
    x: any,
    y: any,
    qrCodeDataURL: string
  ) => {
    doc.rect(x, y, 5.5, 8.5); // Membuat border dengan ukuran yang sama dengan nametag
    // Tambahkan background
    doc.addImage("/assets/images/pdf-background.png", "PNG", x, y, 5.5, 8.5);

    // Menghitung posisi horizontal dan vertikal tengah
    const centerX = x + 5.5 / 2;
    const centerY = y + 8.5 / 2;

    // Teks "KBIHU TARBIS"
    doc.setTextColor("#ffffff"); // Mengatur warna teks menjadi putih
    doc.setFontSize(11); // Mengatur ukuran font menjadi 12
    doc.text("KBIHU TARBIS", centerX, y + 0.6, { align: "center" });

    // Nama Jamaah
    doc.setTextColor("#000000"); // Mengatur warna teks menjadi hitam
    doc.setFontSize(6); // Mengatur ukuran font menjadi 12
    doc.text(pilgrim.name, centerX, y + 5, { align: "center" });

    // Nomor Porsi Jamaah
    doc.text(pilgrim.portion_number, centerX, y + 5.28, { align: "center" });

    // QR Code
    doc.setTextColor("#ffffff"); // Mengatur warna teks menjadi putih
    doc.setFontSize(3.6); // Mengatur ukuran font menjadi 12
    doc.addImage(qrCodeDataURL, "JPEG", centerX - 0.7, y + 5.4, 1.4, 1.4);

    // Alamat
    doc.text(
      "Jl. Raya Jagakarsa Jl. H. Sa Amah No.45 7, RT.7/RW.4, Jagakarsa, \nKec. Jagakarsa, Kota Jakarta Selatan, DKI Jakarta 12620",
      centerX,
      y + 7.8,
      { align: "center" }
    );

    // Kontak
    doc.setFontSize(5); // Mengatur ukuran font menjadi 12
    doc.text(
      "Kontak : Abdul Holik Muhidin (+62 8118741217)",
      centerX,
      y + 8.3,
      {
        align: "center",
      }
    );
  };

  // Panggil downloadAllPilgrim saat tombol "Cetak Semua Jamaah" ditekan

  const downloadPDF = async (id: string) => {
    const selectedPilgrim = pilgrims.find((pilgrim) => pilgrim.id === id);
    if (!selectedPilgrim) {
      // Jika tidak ada objek pilgrim dengan id yang sesuai, beri tahu pengguna atau tangani kesalahan
      console.error("Pilgrim not found!");
      return;
    }

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
    doc.text("KBIHU TARBIS", centerX, 0.6, { align: "center" });

    doc.setTextColor("#000000"); // Mengatur warna teks menjadi hitam
    doc.setFontSize(6); // Mengatur ukuran font menjadi 12
    doc.text(selectedPilgrim.name, centerX, 5, { align: "center" });
    doc.text(selectedPilgrim.portion_number, centerX, 5.28, {
      align: "center",
    });

    var opts: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      margin: 0,
    };

    const qrCodeDataURL = await QRCode.toDataURL(
      `${Backend_URL}/pilgrim/${selectedPilgrim.id}`,
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
                onClick={() => importExcel()}
              >
                <IconDownload className="ltr:mr-2 rtl:ml-2" />
                Impor Jamaah
              </button>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => editUser()}
              >
                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                Tambah Jamaah
              </button>
            </div>
          </div>
          <div className="relative">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => downloadAllPilgrim()}
            >
              <IconPrinter className="ltr:mr-2 rtl:ml-2" />
              Cetak Semua Jamaah
            </button>
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
      <div className="panel mt-5 overflow-hidden border-0 p-0">
        <div className="table-responsive">
          {/* <table className="table-striped table-hover">
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
          </table> */}
          <div className="datatables pagination-padding">
            <DataTable
              className="table-hover whitespace-nowrap"
              records={records}
              columns={[
                {
                  title: "Nomor porsi",
                  accessor: "portion_number",
                  sortable: true,
                  render: ({ portion_number, id }) => (
                    <div>{portion_number}</div>
                  ),
                },
                {
                  title: "Nama",
                  accessor: "name",
                  sortable: true,
                  render: ({ name }) => <div>{name}</div>,
                },
                {
                  title: "Jenis Kelamin",
                  accessor: "gender",
                  sortable: true,
                  render: ({ gender }) => (
                    <div>{gender == "M" ? "Laki-Laki" : "Perempuan"}</div>
                  ),
                },
                {
                  title: "Tanggal Lahir",
                  accessor: "birth_date",
                  sortable: true,
                  render: ({ birth_date }) => (
                    <div>{formatDate(birth_date)}</div>
                  ),
                },
                {
                  title: "Nomor Telepon",
                  accessor: "phone_number",
                  sortable: false,
                  render: ({ phone_number }) => <div>{phone_number}</div>,
                },
                {
                  title: "Rombongan",
                  accessor: "group",
                  sortable: true,
                  render: ({ group }) => <div>{group}</div>,
                },
                {
                  title: "Kloter",
                  accessor: "cloter",
                  sortable: true,
                  render: ({ cloter }) => <div>{cloter}</div>,
                },
                {
                  title: "Nomor Passport",
                  accessor: "passport_number",
                  sortable: true,
                  render: ({ passport_number }) => <div>{passport_number}</div>,
                },
                {
                  accessor: "action",
                  title: "Actions",
                  sortable: false,
                  textAlignment: "center",
                  render: ({ id, portion_number }) => (
                    <div className="flex items-center justify-center gap-4">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => editUser(id)}
                      >
                        Ubah
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteUser(portion_number)}
                      >
                        Hapus
                      </button>
                      <button
                        className="border border-green-500 rounded-md py-1 px-2 text-green-500 hover:bg-green-500 hover:text-white"
                        onClick={() => downloadPDF(id)}
                      >
                        Unduh
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
                            defaultDate: new Date(1990, 0, 1),
                            maxDate: new Date(
                              new Date().setFullYear(
                                new Date().getFullYear() - 2
                              )
                            ),
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
      {/* Excel */}
      <Transition appear show={importPilgrimModal} as={Fragment}>
        <Dialog
          as="div"
          open={importPilgrimModal}
          onClose={() => setImportPilgrimModal(false)}
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
                    onClick={() => setImportPilgrimModal(false)}
                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                  >
                    <IconX />
                  </button>
                  <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                    Impor Jamaah dari Excel
                  </div>
                  <div className="p-5">
                    <form>
                      {isPreview ? (
                        <pre className="max-h-64 overflow-y-auto">
                          {previewJsonData}
                        </pre>
                      ) : (
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Only Excel Files (.xlsx)
                              </p>
                            </div>
                            <input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                              accept=".xls,.xlsx"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      )}
                      {file && (
                        <div className="mt-2 relative">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Name: {file.name}
                            <br />
                            Size: {(file.size / 1024).toFixed(2)} KB
                          </p>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="absolute top-0 right-0 m-2 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600"
                          >
                            <IconX />
                          </button>
                        </div>
                      )}
                      <div className="mt-8 flex items-center justify-end">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => previewData()}
                        >
                          {isPreview ? "Stop Preview" : "Preview"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary ltr:ml-4 rtl:mr-4"
                          onClick={saveMultiplePilgrim}
                        >
                          Tambahkan
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
