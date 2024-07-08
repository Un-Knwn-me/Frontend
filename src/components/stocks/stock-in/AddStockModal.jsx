import React from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import excelIcon from "../../../assets/excel-icon.svg";
import downloadExcelTemplateIcon from "../../../assets/download-excel-template-icon.svg";

const AddStockModal = ({ show, onClose }) => {
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
              {/* Centering the title */}
              <h2 className="text-lg font-bold">Add Stocks</h2>
              <button
                className="absolute right-5 cursor-pointer"
                onClick={onClose}
              >
                <img src={closeIcon} alt="Close" className="mt-2" />
              </button>
            </div>
            <hr className="w-full mt-3" />
          </div>
          <div className="flex flex-col justify-between py-10 items-center flex-grow">
          <div className="text-center">
              <button className="bg-sky-600 w-64 py-2.5 text-white rounded-lg font-bold text-sm mt-4">
                Create Stock Individual {'('}Individual{')'}
              </button>
            </div>
            <div className="text-center whitespace-nowrap">
                <span className="text-blue-500 underline flex gap-2 ml-5" >
                    <img src={downloadExcelTemplateIcon} alt="" />
                    Download excel template
                </span>
              <button className="bg-sky-600 w-64 px-10 py-3 text-white rounded-lg font-bold text-xs mt-4 flex relative">
                <img src={excelIcon} alt="" className="absolute left-3" />
                Upload From excel {'('}Bulk upload{')'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;
