import React, { useState } from 'react';
import closeIcon from "../../assets/close-modal-icon.svg";
import MesasurementSuccessModal from './Mesasurement-sucess-model';

const MesasurementModal = ({ onClose }) => {
  const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-lg w-full h-screen max-h-[50vh] max-w-[30vw] overflow-y-auto lg:overflow-hidden">
          <div>
            <div className="flex justify-center mt-5">
              <h2 className="text-lg font-bold">Measurement Chart (T shirt)</h2>
              <button className="absolute right-5 cursor-pointer" onClick={onClose}>
                <img src={closeIcon} alt="Close" className="mt-2" />
              </button>
            </div>
            <hr className="w-full mt-3" />
          </div>
          <div className="mt-4 text-center">
            <label className="block text-gray-400 text-lg font-bold mb-2">Enter short title</label>
            <div className="text-center">
              <input className="border rounded w-80 py-3 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline" type="text" />
            </div>
            <p className="mt-3 text-lg">Chest (in)</p>
            <div className="mt-4">
              <button className="bg-gray-200 font-bold w-20 py-1 rounded-lg">S</button>
              <button className="bg-gray-200 font-bold w-20 py-1 rounded-lg ml-3">38</button>
            </div>
            <div className="mt-4">
              <button className="bg-gray-200 font-bold w-20 py-1 rounded-lg">M</button>
              <button className="bg-gray-200 font-bold w-20 py-1 rounded-lg ml-3">40</button>
            </div>
            <div className="mt-4">
              <button className="bg-gray-200 font-bold w-20 py-1 rounded-lg">L</button>
              <button className="bg-gray-200 font-bold w-20 py-1 rounded-lg ml-3">42</button>
            </div>
            <p className="underline text-xl mt-4 text-sky-600">Add field</p>
            <button
              className="bg-sky-600 w-80 py-3 text-white rounded-lg font-bold text-lg mt-5"
              onClick={() => setIsThirdModalOpen(true)}
            >
              Update files
            </button>
          </div>
        </div>
      </div>
      {isThirdModalOpen && <MesasurementSuccessModal onClose={() => setIsThirdModalOpen(false)} />}
    </>
  );
};

export default MesasurementModal;
