import React, { useState } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import apiService from "../../../apiService";
import excelIcon from "../../../assets/excel-icon.svg";

const SizesAddModal = ({
  isModalOpen,
  onClose,
  fetchAllSizes,
  fetchSizeSuggestions,
  setSizeDropdown,
}) => {
  const [data, setData] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [typeName, setTypeName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddSizeField = () => {
    setSizes([...sizes, [""]]);
  };

  const handleRemoveSizeField = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const handleSizeChange = (index, value) => {
    const newSizes = sizes.map((size, i) => (i === index ? value : size));
    setSizes(newSizes);
  };

  // handle add new size
  const handleAddSizes = async () => {
    try {
      const data = {
        type_name: typeName,
        sizes,
      };
      const response = await apiService.post("/sizes/create", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        setTypeName("");
        setSizes([]);
        setSuccessMessage("Size added successfully.");
        setErrorMessage("");
        fetchAllSizes();
        onClose();
        setSizeDropdown(true);
        fetchSizeSuggestions(typeName)

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Size already exists.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      } else {
        setErrorMessage("Error adding size.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
      setSuccessMessage("");
    }

    const newSizes = sizes
      .map((size) =>
        size && size.size && typeof size.size === "string"
          ? size.size.trim()
          : ""
      )
      .filter((size) => size !== "");
    if (newSizes.length > 0) {
      setData([
        ...data,
        { id: data.length + 1, sizes: newSizes, status: "active" },
      ]);
      setSizes([]);
      onClose();
    }
  };

  const handleClose = () => {
    setTypeName("");
    setSizes([]);
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg px-10 py-6 w-fit h-fit overflow-y-auto lg:overflow-hidden">
        <div className="py-2 flex flex-col">
          <div>
            <div className="flex justify-center">
              <h2 className="text-2xl font-bold">Add Sizes</h2>
              <button
                className="absolute right-5 cursor-pointer"
                onClick={handleClose}
              >
                <img src={closeIcon} alt="Close" className="mt-2" />
              </button>
            </div>
            <hr className="w-full mt-3" />
          </div>
          <div className="flex flex-col items-center">
            <input
              className="bg-gray-200 rounded w-80 py-3 px-4 text-gray-700 focus:outline-none focus:shadow-outline mt-5 text-lg text-center"
              type="text"
              placeholder="Enter Size Type"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
            />
            {sizes.map((size, index) => (
              <div key={index} className="flex items-center my-2">
                <input
                  className="bg-gray-200 rounded py-3 px-4 text-gray-700 focus:outline-none focus:shadow-outline mt-2 text-lg text-center"
                  type="text"
                  placeholder={`Enter size ${index + 1}`}
                  value={size.size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                />
                {sizes.length > 1 && (
                  <button
                    className="ml-2 text-red-500"
                    onClick={() => handleRemoveSizeField(index)}
                  >
                    <img src={closeIcon} alt="Remove" className="w-6 h-6" />
                  </button>
                )}
              </div>
            ))}
            <div>
              {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-4">
                  <p>{successMessage}</p>
                </div>
              )}
              {errorMessage && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>
            <button
              className="text-blue-600 px-2 py-2 font-bold text-md mt-3"
              onClick={handleAddSizeField}
            >
              Add Another Size
            </button>
            <button
              className="bg-sky-600 w-80 py-3 text-white rounded-lg font-bold text-lg mt-3"
              onClick={handleAddSizes}
            >
              Update
            </button>
            <div className="text-center mt-4">
              <p className="flex">
                <span>
                  <img src={excelIcon} alt="" className="w-7" />
                </span>
                <span className="text-sky-600 font-bold text-lg">
                  Upload From excel {"("}Bulk upload{")"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizesAddModal;
