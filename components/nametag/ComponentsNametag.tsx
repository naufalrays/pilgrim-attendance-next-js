"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { Backend_URL } from "@/lib/Constants";

const ComponentsNametag = () => {
  const [name, setName] = useState("");
  const [portionNumber, setPortionNumber] = useState("");
  const [contact, setContact] = useState("Abdul Holik Muhidin");
  const [contactPhoneNumber, setContactPhoneNumber] = useState("08118741217");

  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      portionNumber.trim() !== "" &&
      contact.trim() !== "" &&
      contactPhoneNumber.trim() !== ""
    );
  };

  const generatePdf = async (portionNumber: string) => {
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
    const centerX = doc.internal.pageSize.getWidth() / 2;
    const centerY = doc.internal.pageSize.getHeight() / 2;

    doc.setTextColor("#ffffff");
    doc.setFontSize(11);
    doc.text("KBIH TARBIS", centerX, 0.6, { align: "center" });

    doc.setTextColor("#000000");
    doc.setFontSize(6);
    doc.text(name, centerX, 5, { align: "center" });
    doc.text(portionNumber, centerX, 5.28, { align: "center" });

    var opts: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      margin: 0,
    };

    const qrCodeDataURL = await QRCode.toDataURL(
      `${Backend_URL}/pilgrim/${portionNumber}`,
      opts
    );

    doc.setTextColor("#ffffff");
    doc.setFontSize(3.6);
    doc.addImage(qrCodeDataURL, "JPEG", centerX - 0.7, 5.4, 1.4, 1.4);
    doc.text(
      "Jl. Raya Jagakarsa Jl. H. Sa Amah No.45 7, RT.7/RW.4, Jagakarsa, \nKec. Jagakarsa, Kota Jakarta Selatan, DKI Jakarta 12620",
      centerX,
      7.8,
      { align: "center" }
    );
    doc.setFontSize(5);
    const formattedPhoneNumber = `+62 ${contactPhoneNumber.slice(1)}`;

    doc.text(`Kontak : ${contact} (${formattedPhoneNumber})`, centerX, 8.3, {
      align: "center",
    });
    doc.save("a4.pdf");
  };

  return (
    <div>
      <div className="flex flex-col gap-2.5 xl:flex-row">
        <div className="panel flex-1 px-0 py-6 ltr:xl:mr-0 rtl:xl:ml-6">
          <div className="px-4">
            <div className="flex flex-col justify-between lg:flex-row">
              <div className="mb-6 w-full  ltr:lg:mr-6 rtl:lg:ml-6">
                <div className="text-lg">Cetak Nametag</div>
                <div className="mt-4 flex items-center">
                  <label
                    htmlFor="name"
                    className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                  >
                    Nama
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    className="form-input flex-1"
                    placeholder="Masukkan Nama"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mt-4 flex items-center">
                  <label
                    htmlFor="portionNumber"
                    className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                  >
                    Nomor Porsi
                  </label>
                  <input
                    id="portionNumber"
                    type="text"
                    name="portionNumber"
                    className="form-input flex-1"
                    placeholder="Masukkan Nomor Porsi"
                    onChange={(e) => setPortionNumber(e.target.value)}
                  />
                </div>

                <div className="mt-4 flex items-center">
                  <label
                    htmlFor="contact"
                    className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                  >
                    Kontak
                  </label>
                  <input
                    value={contact}
                    id="contact"
                    type="text"
                    name="contact"
                    className="form-input flex-1"
                    placeholder="Masukkan Nama Kontak"
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>
                <div className="mt-4 flex items-center">
                  <label
                    htmlFor="contactPhoneNumber"
                    className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                  >
                    Nomor Telepon Kontak
                  </label>
                  <input
                    value={contactPhoneNumber}
                    id="contactPhoneNumber"
                    type="text"
                    name="contactPhoneNumber"
                    className="form-input flex-1"
                    placeholder="Masukkan Nomor Telepon Kontak"
                    onChange={(e) => setContactPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-col justify-between px-4 sm:flex-row">
            <div className="mb-6 sm:mb-0">
              <button
                type="button"
                className={`btn btn-success ${
                  isFormValid() ? "" : "cursor-not-allowed opacity-50"
                }`}
                disabled={!isFormValid()}
                onClick={() => generatePdf(portionNumber)}
              >
                Cetak Nametag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsNametag;
