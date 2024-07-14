import React from "react";

const ComponentsBackup = () => {
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
              <button className="btn btn-primary">Unduh</button>
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
              <button className="btn btn-primary">Pulihkan</button>
            </div>
          </div>
          <div className="panel flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div className="me-2">
                <h5 className="text-lg font-semibold dark:text-white-light">
                  Hapus Data
                </h5>
              </div>
              <button className="btn btn-danger">Hapus</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsBackup;
