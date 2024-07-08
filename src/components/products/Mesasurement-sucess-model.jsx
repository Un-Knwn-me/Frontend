import React from 'react';
import closeIcon from "../../assets/close-modal-icon.svg";
import confirmationImage from "../../assets/confirmation.png";

const MesasurementSuccessModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-lg w-full h-screen max-h-[50vh] max-w-[30vw] overflow-y-auto lg:overflow-hidden">
            <div>
                <div className="text-end p-1">
                    <button className="cursor-pointer mr-5" onClick={onClose}>
                        <img src={closeIcon} alt="Close" className='h-4 mt-5' />
                    </button>
                </div>
                <hr className="w-full mt-5" />
            </div>
            <div className="mt-10 flex justify-center">
                <img src={confirmationImage} alt="" />
            </div>
            <p className='text-3xl text-center mt-5 text-green-700 font-bold'>
                Measurement chat <br /> uploaded successfully
            </p>
        </div>
    </div>
);

export default MesasurementSuccessModal;
