import React from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import editIcon from "../../../assets/edit-icon.svg";

const CreateStockInwardModal = ({ showModal, close }) => {
  const stockData = {
    styleNo: "123456",
    referenceNo: "REF123",
    date: "12/12/2021",
    size: "S",
    quantity: "10",
    description: "Shirt",
    imageUrl: "https://via.placeholder.com/150",
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={close}></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[60vw] h-full max-h-[80vh] p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4 relative px-20">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-medium">STOCK INWARD</h2>
          </div>
          <p className="text-2xl font-medium">Date: {stockData.date}</p>
          <button className="text-black absolute right-5" onClick={close}>
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between px-20 mb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Style No:</h3>
                <button className="text-black">
                  <img src={editIcon} alt="Edit" />
                </button>
              </div>
              <span className="text-black">{stockData.styleNo}</span>
            </div>
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Reference No:</h3>
                <button className="text-black">
                  <img src={editIcon} alt="Edit" />
                </button>
              </div>
              <span className="text-black">{stockData.referenceNo}</span>
            </div>
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Description:</h3>
                <button className="text-black">
                  <img src={editIcon} alt="Edit" />
                </button>
              </div>
              <span className="text-black">{stockData.description}</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={stockData.imageUrl}
              alt="Product"
              className="h-60 w-60 object-cover rounded"
            />
          </div>
        </div>
        <div className="px-20">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">Edit Stock:</h3>
            <button className="text-black">
              <img src={editIcon} alt="Edit" />
            </button>
          </div>
          <div className="flex gap-4 border border-gray-400 px-5 justify-between">
            <div className="p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">No Inners Pack</h4>
              <div className="flex flex-col gap-4">
                {["M", "L", "XL", "XXL", "XXXL"].map((size) => (
                  <div key={size} className="flex gap-4">
                    <label className="block text-sm font-medium text-gray-700 mr-10 w-10">
                      {size}
                    </label>
                    <input
                      type="number"
                      placeholder="size"
                      className="block w-20 text-center border border-gray-300 shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-lg flex items-center justify-center whitespace-nowrap gap-5 mr-5">
              <h4 className="text-lg font-medium text-gray-800">
                No of Bundles
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="number"
                  className="block w-20 text-center border border-gray-300 shadow-sm"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-100 flex items-center justify-center mt-8 mb-8">
              <div className="flex flex-col gap-4">
                <div className="flex gap-5 justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Inners
                  </label>
                  <span>125</span>
                </div>
                <div className="flex gap-5 justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Pieces per Pack
                  </label>
                  <span>125</span>
                </div>
                <div className="flex gap-5 justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Pcs in Bundle
                  </label>
                  <span>125</span>
                </div>
                <div className="flex gap-5 justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Pcs
                  </label>
                  <span>125</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStockInwardModal;
