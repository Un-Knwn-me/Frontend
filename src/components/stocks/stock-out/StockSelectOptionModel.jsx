import React, { useState } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import StockEnterManuallyModel from "./StockEnterManuallyModel";

const StockSelectOptionModel = ({ onClose }) => {
    const [showEnterManuallyModal, setShowEnterManuallyModal] = useState(false);

    const handleEnterManually = () => {
        setShowEnterManuallyModal(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[30vw] h-screen max-h-[30vh] overflow-y-auto lg:overflow-hidden">
          <div className="py-2 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-center">
                <h2 className="text-xl font-bold">Select Option</h2>
                <button
                  className="absolute right-5 cursor-pointer"
                  onClick={onClose}
                >
                  <img src={closeIcon} alt="Close" className="mt-2" />
                </button>
              </div>
              <hr className="w-full mt-3" />
            </div>
            <div className="flex flex-col py-5 items-center flex-grow">
              <div className="text-center">
                  <button className="bg-sky-600 w-64 py-3 text-white rounded-lg font-bold text-md mt-4"
                      onClick={handleEnterManually}
                  >
                    Enter manually
                  </button>
                </div>
              </div>
            </div>
        </div>
        {showEnterManuallyModal && (
                <StockEnterManuallyModel onClose={() => setShowEnterManuallyModal(false)} />
            )}
      </div>
    );
};

export default StockSelectOptionModel;
