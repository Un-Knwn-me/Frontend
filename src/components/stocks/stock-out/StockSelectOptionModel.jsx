import React, { useState } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import AddStockOutModel from "./AddStockOutModel";
import StockOutWPO from "./StockOutWPO";

const StockSelectOptionModel = ({ show, onClose, fetchStockOut }) => {
    const [showAddWPO, setShowWPO] = useState(false);
    const [showStockOut, setShowStockOut] = useState(false);

    const handleStockoutWpo = () => {
        setShowWPO(true);
    };

    const handleStockoutPo = () => {
        setShowStockOut(true);
        fetchStockOut();
    };

    const handleCloseModal = () => {
        setShowStockOut(false);
        setShowWPO(false);
      };

    return (
        <>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[30vw] h-fit overflow-y-auto lg:overflow-hidden">
                        <div className="flex flex-col justify-between h-full py-2">
                            <div>
                                <div className="flex justify-center">
                                    <h2 className="text-xl font-bold">Select Option</h2>
                                    <button className="absolute cursor-pointer right-5" onClick={onClose}>
                                        <img src={closeIcon} alt="Close" className="mt-2" />
                                    </button>
                                </div>
                                <hr className="w-full mt-3" />
                            </div>
                            <div className="flex flex-col items-center flex-grow py-5">
                                <div className="text-center">
                                    <button className="w-64 py-3 mt-4 font-bold text-white rounded-lg bg-sky-600 text-md" onClick={handleStockoutPo}>
                                        With Purchase Order
                                    </button>
                                </div>
                                <div className="text-center">
                                    <button className="w-64 py-3 mt-4 font-bold text-white rounded-lg bg-sky-600 text-md" onClick={handleStockoutWpo}>
                                        Without Purchase Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <AddStockOutModel show={showStockOut} onClose={handleCloseModal} fetchStockOut={fetchStockOut}/>
                    <StockOutWPO show={showAddWPO} onClose={handleCloseModal} fetchStockOut={fetchStockOut} />
                </div>
            )}
        </>
    );
};

export default StockSelectOptionModel;