import React, { useState, useEffect } from "react";
import editIcon from "../../../assets/edit-icon.svg";
import closeIcon from "../../../assets/close-modal-icon.svg";
import StockSelectOptionModel from "./StockSelectOptionModel";

const EditStockOutModel = ({ show, onClose }) => {
  const styleNo = 1234;

  const initialFields = [];

  const [fields, setFields] = useState(initialFields);
  const [editFieldId, setEditFieldId] = useState(null);
  const [showCreateStockOutwardModal, setShowCreateStockOutwardModal] =
    useState(false);

  const handleEditClick = (id) => {
    setEditFieldId(id);
  };

  const handleInputChange = (e, id) => {
    const newFields = fields.map((field) =>
      field.id === id ? { ...field, value: e.target.value } : field
    );
    setFields(newFields);
  };

  const handleClickOutside = (event) => {
    if (editFieldId && !event.target.closest(".editable-field")) {
      setEditFieldId(null);
    }
  };

  const handleCreateStockOutward = () => {
    setShowCreateStockOutwardModal(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editFieldId]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[80vw] h-full max-h-[85vh] overflow-y-auto lg:overflow-hidden">
        <div className="p-10">
          <div className="flex justify-start items-center relative">
            <h2 className="text-3xl font-bold">PO NO {styleNo}</h2>
            <button
              className="absolute right-0 cursor-pointer"
              onClick={onClose}
            >
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
          <hr className="my-2" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
            {fields.map((field) => (
              <div
                key={field.id}
                className="flex flex-col gap-2 editable-field"
              >
                <div className="flex gap-3">
                  <div className="font-semibold">{field.label}</div>
                  <img
                    src={editIcon}
                    alt="edit"
                    className="cursor-pointer"
                    onClick={() => handleEditClick(field.id)}
                  />
                </div>
                {editFieldId === field.id ? (
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleInputChange(e, field.id)}
                    className="border border-gray-300 rounded-md p-1 w-40"
                  />
                ) : (
                  <span className="flex-grow text-gray-400 text-left">
                    {field.value}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="font-semibold mt-5">Quantity</p>
          <div className="flex justify-between w-full mt-5 border p-5 px-28">
            <div className="rounded overflow-hidden border-0">
              <div className="px-6 py-4">
                <div className="mb-2">No inners packs</div>
                <div className="md:flex md:items-center mb-3">
                  <div className="md:w-1/3">
                    <label
                      className="block font-bold md:text-right mb-1 md:mb-0 pr-4 text-sm"
                      for="inline-full-name"
                    >
                      M
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <input
                      className="border-2 border-gray-200 rounded w-20 py-1 px-4 text-gray-700 leading-tight focus:outline-none"
                      type="text"
                    />
                  </div>
                </div>
                <div className="md:flex md:items-center mb-3">
                  <div className="md:w-1/3">
                    <label
                      className="block font-bold md:text-right mb-1 md:mb-0 pr-4 text-sm"
                      for="inline-full-name"
                    >
                      L
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <input
                      className="border-2 border-gray-200 rounded w-20 py-1 px-4 text-gray-700 leading-tight focus:outline-none"
                      type="text"
                    />
                  </div>
                </div>
                <div className="md:flex md:items-center mb-3">
                  <div className="md:w-1/3">
                    <label
                      className="block font-bold md:text-right mb-1 md:mb-0 pr-4 text-sm"
                      for="inline-full-name"
                    >
                      XL
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <input
                      className="border-2 border-gray-200 rounded w-20 py-1 px-4 text-gray-700 leading-tight focus:outline-none"
                      type="text"
                    />
                  </div>
                </div>
                <div className="md:flex md:items-center mb-3">
                  <div className="md:w-1/3">
                    <label
                      className="block font-bold md:text-right mb-1 md:mb-0 pr-4 text-sm"
                      for="inline-full-name"
                    >
                      XXL
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <input
                      className="border-2 border-gray-200 rounded w-20 py-1 px-4 text-gray-700 leading-tight focus:outline-none"
                      type="text"
                    />
                  </div>
                </div>
                <div className="md:flex md:items-center mb-3">
                  <div className="md:w-1/3">
                    <label
                      className="block font-bold md:text-right mb-1 md:mb-0 pr-4 text-sm"
                      for="inline-full-name"
                    >
                      XXXL
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <input
                      className="border-2 border-gray-200 rounded w-20 py-1 px-3 text-gray-700 leading-tight focus:outline-none"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg flex items-center justify-center whitespace-nowrap gap-5 mr-5">
              <h4 className="text-lg font-medium text-gray-800">
                No of Bundles
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="number"
                  className="block w-28 text-center border border-gray-300 shadow-sm px-4 py-1.5"
                />
              </div>
            </div>

            <div class="border-0 p-10 bg-gray-100 h-screen mt-5 max-w-[20vw] max-h-[25vh]">
              <p class="flex text-gray-700 text-base gap-x-12">
                Total inner packs <span>125</span>
              </p>
              <p class="flex text-gray-700 text-base mt-3 gap-x-20">
                Pcs per packs <span>12</span>
              </p>
              <p class="flex text-gray-700 text-base mt-3 gap-x-10">
                Total pcs in bundle <span>1500</span>
              </p>
              <p class="flex font-bold text-2xl mt-10 gap-x-16">
                Total pcs <span>15000</span>
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-sky-600 px-28 py-4 text-white mt-5 rounded-lg font-bold text-sm"
              onClick={handleCreateStockOutward}
            >
              Create Stock outward
            </button>
          </div>
        </div>
      </div>
      {showCreateStockOutwardModal && (
        <StockSelectOptionModel
          onClose={() => setShowCreateStockOutwardModal(false)}
        />
      )}
    </div>
  );
};

export default EditStockOutModel;
