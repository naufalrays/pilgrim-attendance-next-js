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
import { useSession } from "next-auth/react";
import { accountService } from "@/app/(default)/user/account/api/api";
import Link from "next/link";

interface Account {
  id: number;
  name: string;
  username: string;
  password: string;
  phone_number?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
const ComponentsAccount = () => {
  const { data } = useSession();
  const [addContactModal, setAddContactModal] = useState<any>(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredItems, setFilteredItems] = useState<any>(accounts);
  const [token, setToken] = useState("");

  const [value, setValue] = useState<any>("list");
  const [defaultParams] = useState({
    id: null,
    name: "",
    username: "",
    password: "",
    phone_number: "",
    role: "",
  });

  const [params, setParams] = useState<Account>(
    JSON.parse(JSON.stringify(defaultParams))
  );

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        if (data && data.accessToken) {
          const responseTripData = await accountService.fetchAccountData(
            data.accessToken
          );
          setAccounts(responseTripData);
          setFilteredItems(responseTripData);
          setToken(data?.accessToken);
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    fetchTripData();
  }, [data?.accessToken]);

  const changeValue = (e: any) => {
    const { value, id } = e.target;
    setParams({ ...params, [id]: value });
  };

  const [search, setSearch] = useState<any>("");

  const searchContact = () => {
    setFilteredItems(() => {
      return accounts.filter((item: any) => {
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
    if (!params.name) {
      showMessage("Nama diperlukan.", "error");
      return true;
    }
    if (!params.username) {
      showMessage("Username diperlukan.", "error");
      return true;
    }
    if (!params.password) {
      showMessage("Password diperlukan.", "error");
      return true;
    }
    if (!params.phone_number) {
      showMessage("Nomor telepon diperlukan.", "error");
      return true;
    }
    const phoneRegex = /^0\d{9,11}$/;
    if (!phoneRegex.test(params.phone_number)) {
      showMessage("Nomor telepon tidak valid", "error");
      return true;
    }
    if (!params.role) {
      showMessage("Role diperlukan.", "error");
      return true;
    }
    if (params.id) {
      // update user
      try {
        await accountService.updateUser(params.id, params, token);
        let user: any = filteredItems.find((d: any) => d.id === params.id);
        user.name = params.name;
        user.username = params.username;
        user.phone_number = params.phone_number;
        user.password = params.password;
        user.role = params.role;
        showMessage("Data berhasil diubah");
      } catch (error) {
        showMessage("Gagal memperbaharui data", "error");
      }
    } else {
      //add user
      let maxUserId = filteredItems.length
        ? filteredItems.reduce(
            (max: any, character: any) =>
              character.id > max ? character.id : max,
            filteredItems[0].id
          )
        : 0;

      let user = {
        id: maxUserId + 1,
        name: params.name,
        username: params.username,
        phone_number: params.phone_number,
        password: params.password,
        role: params.role,
      };
      try {
        await accountService.createUser(user);
        filteredItems.splice(0, 0, user);
        showMessage("Data berhasil ditambahkan");
      } catch (error) {
        showMessage("Gagal menambahkan data", "error");
      }
    }
    // showMessage("User has been saved successfully.");
    setAddContactModal(false);
  };

  const editUser = (account: any = null) => {
    const json = JSON.parse(JSON.stringify(defaultParams));
    setParams(json);
    if (account) {
      let json1 = JSON.parse(JSON.stringify(account));
      setParams(json1);
    }
    setAddContactModal(true);
  };

  const deleteUser = async (id: number) => {
    if (window.confirm("Apakah kamu yakin ingin menghapus datanya ?")) {
      if (id) {
        try {
          await accountService.deleteUser(id, token);
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

  const openWhatsAppChat = (phone_number: string) => {
    if (phone_number) {
      const whatsappNumber = phone_number.replace(/^0/, "62");
      window.open(`https://wa.me/${whatsappNumber}`, "_blank");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl">Akun</h2>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <div className="flex gap-3">
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => editUser()}
              >
                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                Tambahkan Akun
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari Akun"
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
                  <th>Id</th>
                  <th>Nama</th>
                  <th>Username</th>
                  <th>No. Telepon</th>
                  <th>Role</th>
                  <th className="!text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((account: Account) => {
                  return (
                    <tr key={account.id}>
                      <td>{account.id}</td>
                      <td>
                        <div>{account.name}</div>
                      </td>
                      <td className="whitespace-nowrap">{account.username}</td>
                      <td className="whitespace-nowrap">
                        {account.phone_number || "-"}
                      </td>
                      <td className="whitespace-nowrap">{account.role}</td>
                      <td>
                        <div className="flex items-center justify-center gap-4">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => editUser(account)}
                          >
                            Ubah
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteUser(account.id)}
                          >
                            Hapus
                          </button>
                          <button
                            className="border border-green-500 rounded-md py-1 px-2 text-green-500 hover:bg-green-500 hover:text-white"
                            onClick={() => openWhatsAppChat(
                              account.phone_number ?? "-"
                            )}
                          >
                            Whatsapp
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
                    {params.id ? "Ubah Akun" : "Tambahkan Akun"}
                  </div>
                  <div className="p-5">
                    <form>
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
                        <label htmlFor="username">Username</label>
                        <input
                          id="username"
                          type="text"
                          placeholder="Masukkan Username"
                          className="form-input"
                          value={params.username}
                          onChange={(e) => changeValue(e)}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="password">Password</label>
                        <input
                          id="password"
                          type="password"
                          placeholder="Masukkan Password"
                          className="form-input"
                          value={params.password}
                          onChange={(e) => changeValue(e)}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="phone_number">Nomor Telepon</label>
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
                        <label htmlFor="role">Role</label>
                        <select
                          id="role"
                          className="form-select text-white-dark"
                          required
                          value={params.role}
                          onChange={(e) => changeValue(e)}
                        >
                          <option value="">Pilih Role</option>
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
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

export default ComponentsAccount;
