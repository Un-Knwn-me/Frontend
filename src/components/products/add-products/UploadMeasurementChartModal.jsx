import React from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import uploadImage from "../../../assets/upload-measurement.svg";

const UploadMeasurementChartModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[30vw] h-screen max-h-[35vh] overflow-y-auto lg:overflow-hidden">
        <div className="py-2 flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-center">
              {" "}
              {/* Centering the title */}
              <h2 className="text-lg font-medium">Upload Files</h2>
              <button
                className="absolute right-5 cursor-pointer"
                onClick={onClose}
              >
                <img src={closeIcon} alt="Close" className="mt-2" />
              </button>
            </div>
            <hr className="w-full mt-3" />
          </div>
          <div className="flex justify-center items-center flex-grow">
            <div className="text-center">
              <img src={uploadImage} alt="Upload" className="mx-auto" />
              <button className="bg-sky-600 px-28 py-2 text-white rounded-lg font-bold text-sm mt-4">
                Upload Files
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMeasurementChartModal;
