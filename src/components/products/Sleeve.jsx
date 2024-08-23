import React, { useState, useEffect } from "react";
import editIcon from "../../assets/edit-icon.svg";
import toggleActiveIcon from "../../assets/toggle-active.svg";
import toggleInactiveIcon from "../../assets/toggle-inactive.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import leftArrowIcon from "../../assets/left-arrow-icon.svg";
import rightArrowIcon from "../../assets/right-arrow-icon.svg";
import tickIcon from "../../assets/tick-icon.svg";
import closeIcon from "../../assets/close-modal-icon.svg";
import excelIcon from "../../assets/excel-icon.svg";
import apiService from "../../apiService";

const Sleeve = ({ searchQuery, isModalOpen, onClose }) => {

  const [data, setData] = useState([]);
  const [editedSleeveName, setEditedSleeveName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [inputValue, setInputValue] = useState("");
  const [addedStyles, setAddedStyles] = useState([]);
  const [singleSleeves, setSingleSleeves] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchAllSleeves();
  }, []);

  const fetchAllSleeves = async () => {
    try {
      const response = await apiService.get("/sleeves/getall", {
        headers:{
          'Content-Type': 'application/json',
        }
      });
      console.log(response.data);
      setData(response.data); // Assuming response.data contains an array of brands
    } catch (error) {
      console.error("Error fetching sleeves:", error);

    }
  };

    // handle toggle button click
  const handleStatusToggle = async ({ id, isActive }) => {
    try {
      const response = await apiService.put(`/sleeves/${id}`, {
        isActive: !isActive,
      }, {
        headers:{
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 200) {
        fetchAllSleeves();
      }
    } catch (error) {
      console.error(`Error toggling status for sleeve with ID ${id}:`, error);
      // Handle error as needed
    }
  };

// handle edit button click
const handleEditClick = ({ id, sleeveName }) => {
  setEditIndex(id);
  setEditedSleeveName(sleeveName);
};

  // handle input change
  const handleInputChange = (e) => {
    setEditedSleeveName(e.target.value);
  };


   // handle save button click
   const handleSaveClick = async (index, id) => {
    try {
      const response = await apiService.put(`/sleeves/${id}`, {
        sleeveName: editedSleeveName,
      }, {
        headers:{
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 200) {
        fetchAllSleeves();
        setEditIndex(null);
      }
    } catch (error) {
      console.error(`Error saving sleeve with ID ${id}:`, error);
      // Handle error as needed
    }
  };

 ;

  const handleCheckboxChange = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

   // handle delete button click
   const handleDelete = async (id) => {
    try {
      const response = await apiService.delete(`/sleeves/${id}`, {
        headers:{
          'Content-Type': 'application/json',
        }
      });
      console.log(response);
      if (response.status === 202) {
        fetchAllSleeves();
      }
    } catch (error) {
      console.error("Error deleting sleeve:", error);
      // Handle error as needed
    }
  };
  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (
      direction === "next" &&
      currentPage < Math.ceil(data.length / recordsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };


  const handleSingleSleeve = async () => {
    try {
      const response = await apiService.post("/sleeves/create", {
        sleeveName: singleSleeves,
      }, {
        headers:{
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 201) {
        setSingleSleeves("");
        setSuccessMessage("Sleeve added successfully.");
        setErrorMessage("");
        fetchAllSleeves();

         // Clear messages after 5 seconds
         setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Sleeve already exists.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      } else {
        setErrorMessage("Error adding sleeve.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
      setSuccessMessage("");
    }
  };
  const handleAddStyle = () => {
    if (inputValue.trim() !== "") {
      setAddedStyles([...addedStyles, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveStyle = (index) => {
    const newAddedStyles = [...addedStyles];
    newAddedStyles.splice(index, 1);
    setAddedStyles(newAddedStyles);
  };
  
  const handleClose = () => {
    setSingleSleeves("");
    onClose()
  }
  
  const filteredData = data.filter(
    (item) =>
      item.sleeveName &&
      item.sleeveName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="p-4 mx-auto bg-white ">
      <div className="min-h-[60vh] max-h-[60vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="w-full bg-gray-50">
            <tr>
              <th className="w-40 px-2 py-3 font-bold text-center text-black uppercase text-md">
                Si No
              </th>
              <th className="w-40 px-2 py-3 font-bold text-left text-black uppercase text-md">
                sleeve
              </th>
              <th className="flex-grow px-6 py-3 font-bold text-center text-black uppercase text-md">
                Status
              </th>
              <th className="px-2 py-3 font-bold text-center text-black uppercase text-md w-28">
                Action
              </th>
              <th className="w-20 px-2 py-3 font-bold text-center text-black uppercase text-md">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  onChange={(e) =>
                    setCheckedIds(
                      e.target.checked ? data.map((row) => row.id) : []
                    )
                  }
                  checked={checkedIds.length === data.length}
                />
              </th>
              <th className="w-8 px-2 py-3 font-bold text-center text-black uppercase text-md">
                <button onClick={handleDelete} className="text-red-500">
                  <img src={deleteIcon} alt="Delete" className="w-6 h-6" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData?.map((row, index) => (
              <tr key={row.id} style={{ maxHeight: "50px" }}>
                <td className="w-40 px-3 py-3 text-center text-black whitespace-nowrap text-md">
                  {startIndex + index + 1}
                </td>
                <td className="w-40 px-3 py-3 text-left text-black whitespace-nowrap text-md">
                  {editIndex === row.id ? (
                    <input
                      type="text"
                      value={editedSleeveName}
                      onChange={handleInputChange}
                      className="w-40 px-2 py-2 text-left border border-gray-300 rounded-md"
                    />
                  ) : (
                    row.sleeveName
                  )}
                </td>
                <td className="flex-grow px-6 py-3 text-center text-black whitespace-nowrap text-md">
                  <button
                    onClick={() =>
                      handleStatusToggle({ id: row.id, isActive: row.isActive })
                    }
                    className="px-2 py-1 rounded-full"
                  >
                    <div className="flex space-x-2">
                      <span
                        className={
                          row.isActive === true
                            ? "text-green-600 w-20"
                            : "text-gray-300 w-20"
                        }
                      >
                        {row.isActive === true ? "Active" : "In-Active"}
                      </span>
                      <img
                        src={
                          row.isActive === true
                            ? toggleActiveIcon
                            : toggleInactiveIcon
                        }
                        alt="Toggle Status"
                      />
                    </div>
                  </button>
                </td>
                <td className="w-16 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                  {editIndex === row.id ? (
                    <button
                      onClick={() => handleSaveClick(index, row.id)}
                      className="flex px-2 py-1 bg-green-200 border border-green-500 rounded-lg"
                    >
                      <img src={tickIcon} alt="" className="mt-1 mr-2" />
                      <span className="text-xs">Update</span>
                    </button>
                  ) : (
                    <button
                    onClick={() =>
                      handleEditClick({
                        id: row.id,
                        sleeveName: row.sleeveName,
                      })
                    }
                      className="text-center text-blue-500"
                    >
                      <img src={editIcon} alt="Edit" className="w-6 h-6" />
                    </button>
                  )}
                </td>
                <td className="w-12 px-2 py-3 text-center whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={checkedIds.includes(row.id)}
                    onChange={() => handleCheckboxChange(row.id)}
                  />
                </td>
                <td className="w-8 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div>
          <span className="text-black text-md">
            {recordsPerPage} records per page
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={recordsPerPage}
            onChange={handleRecordsPerPageChange}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value={5}>Records per page: 5</option>
            <option value={10}>Records per page: 10</option>
            <option value={15}>Records per page: 15</option>
          </select>
          <button
            onClick={() => handlePageChange("prev")}
            className="px-2 py-1 rounded-md text-md"
          >
            <img src={leftArrowIcon} alt="Previous" />
          </button>
          <span className="text-black text-md">
            {currentPage}/{Math.ceil(data.length / recordsPerPage)}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            className="px-2 py-1 rounded-md text-md"
          >
            <img src={rightArrowIcon} alt="Next" />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleClose}
          ></div>
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[35vw] h-fit overflow-y-auto lg:overflow-hidden">
            <div className="flex flex-col py-2">
              <div>
                <div className="flex justify-center">
                  <h2 className="text-2xl font-bold">Add Sleeve</h2>
                  <button
                    className="absolute cursor-pointer right-5"
                    onClick={handleClose}
                  >
                    <img src={closeIcon} alt="Close" className="mt-2" />
                  </button>
                </div>
                <hr className="w-full mt-3" />
              </div>
              <div className="flex flex-col items-center">
                <input
                  className="px-4 py-3 mt-5 text-lg text-center text-gray-700 bg-gray-200 rounded w-80 focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Enter sleeve"
                  value={singleSleeves}
                  onChange={(e) => setSingleSleeves(e.target.value)}
                />
                {successMessage && (
              <div className="p-4 my-4 text-green-700 bg-green-100 border-l-4 border-green-500">
                <p>{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className="p-4 my-4 text-red-700 bg-red-100 border-l-4 border-red-500">
                <p>{errorMessage}</p>
              </div>
            )}
                <button
                  className="py-3 mt-3 text-lg font-bold text-white rounded-lg bg-sky-600 w-80"
                  onClick={() => handleSingleSleeve()}
                >
                  Update
                </button>
                <div className="mt-4 text-center">
                  <p className="flex">
                    <span>
                      <img src={excelIcon} alt="" className="w-7" />
                    </span>
                    <span className="text-lg font-bold text-sky-600">
                      Upload From excel {"("}Bulk upload{")"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sleeve;
