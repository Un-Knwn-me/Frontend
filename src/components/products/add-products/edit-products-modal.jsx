import React, { useState, useEffect } from "react";
import editIcon from "../../../assets/edit-icon.svg";
import closeIcon from "../../../assets/close-modal-icon.svg";

const EditProductModal = ({ show, onClose, productId }) => {
  const styleNo = 1234;
  const images = [
    { id: 1, size: "50x50" },
    { id: 2, size: "50x50" },
    { id: 3, size: "50x50" },
    { id: 4, size: "50x50" },
    { id: 5, size: "50x50" },
  ];

  const initialFields = [
    { id: "pr1", value: "KK234", label: "Style No" },
    { id: "pr2", value: "2", label: "Reference No" },
    { id: "pr3", value: "3", label: "Brand" },
    { id: "pr4", value: "4", label: "Fabric" },
    { id: "pr5", value: "5", label: "Fabric Finish" },
    { id: "pr6", value: "6", label: "GSM" },
    { id: "pr7", value: "7", label: "Knit type" },
    { id: "pr8", value: "8", label: "Colors" },
    { id: "pr9", value: "9", label: "Sizes" },
    { id: "pr10", value: "10", label: "Decorations" },
    { id: "pr11", value: "11", label: "Print or Emb name" },
    { id: "pr12", value: "12", label: "Short description" },
    { id: "pr13", value: "13", label: "Full description" },
    { id: "pr14", value: "14", label: "Stitch details" },
    { id: "pr15", value: "15", label: "Chest dla" },
    { id: "pr16", value: "16", label: "Neck" },
    { id: "pr17", value: "17", label: "Sleeve" },
    { id: "pr18", value: "18", label: "Storms" },
    { id: "pr19", value: "19", label: "Length" },
    { id: "pr20", value: "20", label: "Measurement chart" },
    { id: "pr21", value: "21", label: "Packing method" },
    { id: "pr22", value: "22", label: "No of pieces per inner" },
    { id: "pr23", value: "23", label: "No of pieces per outer carton" },
  ];

  const [fields, setFields] = useState(initialFields);
  const [editFieldId, setEditFieldId] = useState(null);

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
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[80vw] h-full max-h-[80vh] overflow-y-auto lg:overflow-hidden">
        <div className="px-10 py-5">
          <div className="flex justify-start items-center relative">
            <h2 className="text-2xl font-bold">Style No: {styleNo}</h2>
            <button
              className="absolute right-0 cursor-pointer"
              onClick={onClose}
            >
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
          <hr className="my-2" />
          <div className="flex flex-col gap-3 mt-10">
            <div className="flex gap-4">
              <h1>Product Images</h1>
              <img src={editIcon} alt="edit" className="cursor-pointer" />
              <span className="text-sm text-blue-500 underline cursor-pointer">
                Change primary image
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="w-12 h-12 flex justify-center items-center border border-dashed border-gray-300 text-gray-500 text-xs font-bold"
                >
                  {image.size}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
            {fields.map((field) => (
              <div
                key={field.id}
                className="flex flex-col gap-2 editable-field"
              >
                <div className="flex gap-3">
                  <div className="font-semibold">{field.label}:</div>
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
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
