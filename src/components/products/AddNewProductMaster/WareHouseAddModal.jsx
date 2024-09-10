import React, { useState } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import apiService from "../../../apiService";
import excelIcon from "../../../assets/excel-icon.svg";

const WareHouseAddModal = ({
  isModalOpen,
  onClose,
  fetchAllWareHouses,
  fetchWarehouseSuggestions,
  setWarehouseDropdown,
}) => {

  const [singleWareHouses, setSingleWareHouses] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSingleWarehouse = async () => {
    try {
      const response = await apiService.post("/warehouses/create", {
        warehouse: singleWareHouses,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setSingleWareHouses("");
        setSuccessMessage("warehouse added successfully.");
        setErrorMessage("");
        fetchAllWareHouses();
        onClose();
        setWarehouseDropdown(true);
        fetchWarehouseSuggestions(singleWareHouses)

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("warehouse already exists.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      } else {
        setErrorMessage("Error adding warehouse.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
      setSuccessMessage("");
    }
  };

  const handleClose = () => {
    setSingleWareHouses("");
    onClose()
  }

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="fixed inset-0 bg-black opacity-50"
      onClick={handleClose}
    ></div>
    <div className="relative bg-white rounded-lg shadow-lg px-10 py-6 w-fit h-fit overflow-y-auto lg:overflow-hidden">
      <div className="p-5 flex flex-col">
        <div>
          <div className="flex justify-center">
            <h2 className="text-2xl font-bold">Add Warehouse</h2>
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
            placeholder="Enter Warehouse name"
            value={singleWareHouses}
            onChange={(e) => setSingleWareHouses(e.target.value)}
          />
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
          <button
            className="bg-sky-600 w-80 py-3 text-white rounded-lg font-bold text-lg mt-3"
            onClick={() => handleSingleWarehouse()}
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
  )
}

export default WareHouseAddModal
