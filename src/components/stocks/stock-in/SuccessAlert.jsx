import React from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import stocksUpdatedSuccessImage from "../../../assets/stock-updated-success-alert.png";

const SuccessAlert = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[30vw] h-screen max-h-[35vh] overflow-y-auto lg:overflow-hidden">
        <div className="py-2 flex flex-col justify-between h-full">
          <div className="flex justify-center items-center flex-grow">
            <div className="text-center">
              <img src={stocksUpdatedSuccessImage} alt="Upload" className="mx-auto mb-4" />
              <span className="text-green-600 rounded-lg font-bold text-sm py-5">
                Stock Updated Successfully
              </span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-5 right-5" >
            <img src={closeIcon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default SuccessAlert;
