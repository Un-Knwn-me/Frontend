import React, { useState, useEffect } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import editIcon from "../../../assets/edit-icon.svg";
import excelIcon from "../../../assets/excel-icon.svg";
import downloadExcelTemplateIcon from "../../../assets/download-excel-template-icon.svg";
import apiService from "../../../apiService";

const AddStockModal = ({ show, onClose }) => {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [referenceDropdown, setReferenceDropdown] = useState(false);
  const [referenceSuggestions, setReferenceSuggestions] = useState([]);
  const [selectedReferenceId, setSelectedReferenceId] = useState(null);
  const [styleNo, setStyleNo] = useState("");
  const [fullDescription, setFullDescription] = useState('');
  const [sizes, setSizes] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

// get product by reference number
  const fetchReferenceSuggestions = async (referenceInput) => {
    try {
      if (referenceInput.length > 0) {
        const response = await apiService.get("/products/getall");
        const filteredProduct = response.data.filter((e) =>
          e.reference_number.toLowerCase().startsWith(referenceInput.toLowerCase())
        );
        console.log(filteredProduct);
        setReferenceSuggestions(filteredProduct);
      } else {
        setReferenceSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching Product:", error);
    }
  };

  const handleInputChange = (e) => {
    const referenceInput = e.target.value;
    if (referenceInput.length > 0) {
    setReferenceNumber(referenceInput);
    setReferenceDropdown(true);
    fetchReferenceSuggestions(referenceInput);
    } else {
      setReferenceNumber("");
      setReferenceDropdown(false);
      setStyleNo("");
      setFullDescription("");
      setSizes([]);
      setImageUrl('');
    }
  };

  const handleReferenceSelect = (e) => {
    setReferenceNumber(e.reference_number);
    setSelectedReferenceId(e.id);
    setReferenceSuggestions([]);
    setReferenceDropdown(false);
    setStyleNo(e.Style.style_no);
    setFullDescription(e.Style.full_description);
    setSizes(e.Size.sizes);
    setImageUrl(e.images[0]);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[60vw] h-auto p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4 relative px-20">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-medium">CREATE STOCK INWARD</h2>
          </div>
          <p className="text-2xl font-medium">Date:</p>
          <button className="text-black absolute right-5" onClick={onClose}>
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between px-20 mb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start justify-between">
            <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="brand">
                  Reference No:
                </label>
                <input
                  type="text"
                  id="referenceNumber"
                  value={referenceNumber}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Brand Name"
                />
              {referenceDropdown && referenceNumber && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {referenceSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleReferenceSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.reference_number}
                      </li>
                    ))}
                  </ul>
                )}
                </div>
            </div>
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Style No:</h3>
              </div>
              <span className="text-black">{styleNo}</span>
            </div>
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Description:</h3>
               
              </div>
              <span className="text-black">{fullDescription}</span>
            </div>
          </div>
          <div className="flex items-center justify-center border border-gray-400">
            <img
              src={imageUrl}
              alt="Select Product"
              className="h-60 w-60 object-cover rounded"
            />
          </div>
        </div>
        <div className="px-20">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">Stock Info:</h3>
          </div>
          <div className="flex gap-4 border border-gray-400 px-5 justify-between">
            <div className="p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-4">No Inners Pack:</h4>
              <div className="flex flex-col gap-4">
                {sizes.map((size) => (
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
        <div className="flex justify-end px-20 mt-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
            CREATE STOCK INWARD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;
