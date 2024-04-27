"use client";
import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import IconX from "@/components/icon/IconX";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import IconSearch from "../icon/IconSearch";
import IconListCheck from "../icon/IconListCheck";
import IconUserPlus from "../icon/IconUserPlus";
import IconLayoutGrid from "../icon/IconLayoutGrid";

interface Pilgrim {
  id?: number;
  portionNumber: string;
  name: string;
  gender: string;
  birthDate: Date;
  phoneNumber: string;
  group: string;
  cloter: string;
  bus: string;
  passportNumber: string;
}

const ComponentsJamaah = () => {
  const [addContactModal, setAddContactModal] = useState<any>(false);

  const [value, setValue] = useState<any>("list");
  const [defaultParams] = useState({
    id: null,
    portionNumber: "",
    name: "",
    gender: "",
    birthDate: "",
    phoneNumber: "",
    group: "",
    cloter: "",
    bus: "",
    passportNumber: "",
  });

  const [params, setParams] = useState<any>(
    JSON.parse(JSON.stringify(defaultParams))
  );

  const changeValue = (e: any) => {
    console.log(e);
    if (e[0] instanceof Date) {
      setParams({ ...params, birthDate: e[0] });
    } else {
      const { value, id } = e.target;
      setParams({ ...params, [id]: value });
    }
  };

  const [search, setSearch] = useState<any>("");
  const [contactList] = useState<any>([
    {
      id: 1,
      portionNumber: "091029313",
      name: "JOhn",
      gender: "M",
      birthDate: new Date("2022-04-06"),
      phoneNumber: "08123123123123",
      group: "Rombongan 1",
      cloter: "12",
      bus: "1",
      passportNumber: "ASD 123123",
    },
  ]);

  const [filteredItems, setFilteredItems] = useState<any>(contactList);

  const searchContact = () => {
    setFilteredItems(() => {
      return contactList.filter((item: any) => {
        return item.name.toLowerCase().includes(search.toLowerCase());
      });
    });
  };

  useEffect(() => {
    searchContact();
  }, [search]);

  const saveUser = () => {
    if (!params.portionNumber) {
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
    if (!params.birthDate) {
      showMessage("Tanggal Lahir dibutuhkan.", "error");
      return true;
    }
    if (!params.phoneNumber) {
      showMessage("Nomor telepon dibutuhkan.", "error");
      return true;
    }

    const phoneRegex = /^0\d{9,11}$/;
    if (!phoneRegex.test(params.phoneNumber)) {
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
    if (!params.bus) {
      showMessage("Bis dibutuhkan.", "error");
      return true;
    }
    if (params.id) {
      //update user
      let user: any = filteredItems.find((d: any) => d.id === params.id);
      user.portionNumber = params.portionNumber;
      user.name = params.name;
      user.gender = params.gender;
      user.birthDate = params.birthDate;
      user.phoneNumber = params.phoneNumber;
      user.group = params.group;
      user.cloter = params.cloter;
      user.bus = params.bus;
      user.passportNumber = params.passportNumber;
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
        // id: maxUserId + 1,
        // path: "profile-35.png",
        // name: params.name,
        // email: params.email,
        // phone: params.phone,
        // role: params.role,
        // location: params.location,
        // posts: 20,
        // followers: "5K",
        // following: 500,
        id: maxUserId + 1,
        portionNumber: params.portionNumber,
        name: params.name,
        gender: params.gender,
        birthDate: params.birthDate,
        bus: params.bus,
        phoneNumber: params.phoneNumber,
        group: params.group,
        cloter: params.cloter,
        passportNumber: params.passportNumber,
        posts: 20,
        followers: "5K",
        following: 500,
      };
      filteredItems.splice(0, 0, user);
      //   searchContacts();
    }

    showMessage("User has been saved successfully.");
    setAddContactModal(false);
  };

  const editUser = (user: any = null) => {
    const json = JSON.parse(JSON.stringify(defaultParams));
    setParams(json);
    if (user) {
      let json1 = JSON.parse(JSON.stringify(user));
      setParams(json1);
    }
    setAddContactModal(true);
  };

  const deleteUser = (user: any = null) => {
    setFilteredItems(filteredItems.filter((d: any) => d.id !== user.id));
    showMessage("User has been deleted successfully.");
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
                  <th>Bis</th>
                  <th>No. Telepon</th>
                  <th>Rombongan</th>
                  <th>Kloter</th>
                  <th>No. Passport</th>
                  <th className="!text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((pilgrim: Pilgrim) => {
                  return (
                    <tr key={pilgrim.id}>
                      <td>{pilgrim.portionNumber}</td>
                      <td>
                        <div>{pilgrim.name}</div>
                      </td>
                      <td className="whitespace-nowrap">
                        {pilgrim.gender == "M" ? "Laki-Laki" : "Perempuan"}
                      </td>
                      <td className="whitespace-nowrap">
                        {pilgrim.birthDate.toDateString()}
                      </td>
                      <td className="whitespace-nowrap">{pilgrim.bus}</td>
                      <td className="whitespace-nowrap">
                        {pilgrim.phoneNumber}
                      </td>
                      <td className="whitespace-nowrap">{pilgrim.group}</td>
                      <td className="whitespace-nowrap">{pilgrim.cloter}</td>
                      <td className="whitespace-nowrap">
                        {pilgrim.passportNumber}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-4">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => editUser(pilgrim)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteUser(pilgrim)}
                          >
                            Delete
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
          {filteredItems.map((contact: any) => {
            return (
              <div
                className="relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]"
                key={contact.id}
              >
                <div className="relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]">
                  <div className="rounded-t-md bg-white/40 bg-[url('/assets/images/notification-bg.png')] bg-cover bg-center p-6 pb-0">
                    <img
                      className="mx-auto max-h-40 w-4/5 object-contain"
                      src={`/assets/images/${contact.path}`}
                      alt="contact_image"
                    />
                  </div>
                  <div className="relative -mt-10 px-6 pb-24">
                    <div className="rounded-md bg-white px-2 py-4 shadow-md dark:bg-gray-900">
                      <div className="text-xl">{contact.name}</div>
                      <div className="text-white-dark">{contact.role}</div>
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex-auto">
                          <div className="text-info">{contact.posts}</div>
                          <div>Posts</div>
                        </div>
                        <div className="flex-auto">
                          <div className="text-info">{contact.following}</div>
                          <div>Following</div>
                        </div>
                        <div className="flex-auto">
                          <div className="text-info">{contact.followers}</div>
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
                          {contact.email}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-none ltr:mr-2 rtl:ml-2">
                          Phone :
                        </div>
                        <div className="text-white-dark">
                          {contact.phoneNumber}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-none ltr:mr-2 rtl:ml-2">
                          Address :
                        </div>
                        <div className="text-white-dark">
                          {contact.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 mt-6 flex w-full gap-4 p-6 ltr:left-0 rtl:right-0">
                    <button
                      type="button"
                      className="btn btn-outline-primary w-1/2"
                      onClick={() => editUser(contact)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger w-1/2"
                      onClick={() => deleteUser(contact)}
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
                    {params.id ? "Edit Contact" : "Tambah Jamaah"}
                  </div>
                  <div className="p-5">
                    <form>
                      <div className="mb-5">
                        <label htmlFor="portionNumber">Nomor Porsi</label>
                        <input
                          id="portionNumber"
                          type="portionNumber"
                          placeholder="Masukkan Nomor Porsi"
                          className="form-input"
                          value={params.portionNumber}
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
                        <label htmlFor="birthDate">Tanggal Lahir</label>
                        <Flatpickr
                          id="birthDate"
                          value={params.birthDate}
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
                          id="phoneNumber"
                          type="text"
                          placeholder="Masukan Nomor Telepon"
                          className="form-input"
                          value={params.phoneNumber}
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
                        <label htmlFor="bus">Bis</label>
                        <input
                          id="bus"
                          type="number"
                          placeholder="Masukkan Bis"
                          min={0}
                          className="form-input"
                          value={params.bus}
                          onChange={(e) => changeValue(e)}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="passportNumber">Nomor Passport</label>
                        <input
                          id="passportNumber"
                          type="text"
                          placeholder="Masukkan Nomor Passport"
                          className="form-input"
                          value={params.passportNumber}
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
