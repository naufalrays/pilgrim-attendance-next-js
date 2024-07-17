"use client";
import { Transition, Dialog } from "@headlessui/react";
import { backupService } from "@/app/(default)/backup/api/api";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import IconX from "../icon/IconX";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const ComponentsBackup = () => {
  const { data } = useSession();
  // Restore
  const [file, setFile] = useState<File | null>();
  const [restoreModal, setRestoreModal] = useState<any>(false);
  const [previewJsonData, setPreviewJsonData] = useState("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    setFile(uploadedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  // Backup
  const [backupData, setBackupData] = useState(null);

  const [backupLoading, setBackupLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (data && data.accessToken) {
      setToken(data?.accessToken);
    }
  }, [data?.accessToken]);

  const handleDownload = async () => {
    setBackupLoading(true);
    try {
      const data = await backupService.fetchSqlData(token);
      // Create a URL for the blob and download the file
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "backup.sql"); // Specify the file name
      document.body.appendChild(link);
      link.click();

      // Clean up the URL object
      link.remove();
      window.URL.revokeObjectURL(url);
      showMessage("Berhasil mengunduh data")
    } catch (error) {
      showMessage("Gagal mengunduh data", "error");
    } finally {
      setBackupLoading(false);
    }
  };

  const importSql = (pilgrim: any = null) => {
    // const json = JSON.parse(JSON.stringify(defaultParams));
    // setParams(json);
    // if (pilgrim) {
    //   let json1 = JSON.parse(JSON.stringify(pilgrim));
    //   setParams(json1);
    // }
    setFile(null);
    setRestoreModal(true);
  };

  const handleRestoreData = async () => {
    if (!file) return;
    // setBackupLoading(true);
    try {
      const data = await backupService.restoreData(token, file);
      // Handle the restored data if needed
      setRestoreModal(false);
      showMessage("Berhasil memulihkan data")
    } catch (error) {
      showMessage("Gagal memulihkan data", "error")
      console.error("Error restoring data:", error);
      // setError("Error restoring data");
    } finally {
      // setBackupLoading(false);
    }
  };

  const handleDeleteData = async () => {
    const confirmDelete = window.confirm("Apakah anda yakin datanya mau dihapus?");
    if (!confirmDelete) return;
    // setBackupLoading(true);
    // setError(null);
    try {
      await backupService.deleteData(token);
      showMessage("Berhasil menghapus data")
      console.log("Data deleted successfully");
    } catch (error) {
      showMessage("Gagal menghapus data", "error")
    } finally {
      // setBackupLoading(false);
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
      <h2 className="text-xl">Cadangkan & Pulihkan</h2>
      <div className="mt-6">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* Panel untuk Cadangkan Data */}
          <div className="panel flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">
                Cadangkan Data
              </h5>
              <button className="btn btn-primary" onClick={handleDownload}>
                {backupLoading ? "Mengunduh..." : "Unduh"}
              </button>
            </div>
          </div>
          {/* Panel untuk Pulihkan Data */}
          <div className="panel">
            <div className="flex items-center justify-between">
              <div className="me-2">
                <h5 className="text-lg font-semibold dark:text-white-light">
                  Pulihkan Data
                </h5>
                <h1>
                  *Ketika memulihkan data, maka data saat ini akan tertimpa
                </h1>
              </div>
              <button onClick={() => importSql()} className="btn btn-primary">
                Pulihkan
              </button>
            </div>
          </div>
          <div className="panel flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div className="me-2">
                <h5 className="text-lg font-semibold dark:text-white-light">
                  Hapus Data
                </h5>
              </div>
              <button onClick={handleDeleteData} className="btn btn-danger">Hapus</button>
            </div>
          </div>
        </div>
      </div>
      {/* Restore data */}
      <Transition appear show={restoreModal} as={Fragment}>
        <Dialog
          as="div"
          open={restoreModal}
          onClose={() => setRestoreModal(false)}
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
                    onClick={() => setRestoreModal(false)}
                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                  >
                    <IconX />
                  </button>
                  <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                    Pulihkan Data
                  </div>
                  <div className="p-5">
                    <form>
                    {!file && (
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
                                Only Sql Files (.sql)
                              </p>
                            </div>
                            <input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                              accept=".sql"
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
                          className="btn btn-primary ltr:ml-4 rtl:mr-4"
                          onClick={handleRestoreData}
                        >
                          Pulihkan
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

export default ComponentsBackup;
