import React, { useEffect, useState } from "react";
import editIcon from "../../assets/edit-icon.svg";
import addIcon from "../../assets/add-icon-green.svg";
import toggleActiveIcon from "../../assets/toggle-active.svg";
import toggleInactiveIcon from "../../assets/toggle-inactive.svg";
import deleteIconRed from "../../assets/delete-icon-red.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import leftArrowIcon from "../../assets/left-arrow-icon.svg";
import rightArrowIcon from "../../assets/right-arrow-icon.svg";
import tickIcon from "../../assets/tick-icon.svg";
import MesasurementModal from "./Mesasurement-model";
import closeIcon from "../../assets/close-modal-icon.svg";
import apiService from "../../apiService";

const MeasurementChart = ({ searchQuery, isModalOpen, onClose }) => {
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [name, setTypeName] = useState("");
  const [category, setCategory] = useState(""); // New state for category
  const [sizes, setSizes] = useState([{ key: '', value: '' }]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null); 
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchAllMeasurements();
  }, []);

  const fetchAllMeasurements = async () => {
    try {
      const response = await apiService.get("/mesurementCharts/getall", {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // handle size change
  const handleAddSizeField = () => {
    setSizes([...sizes, { key: '', value: '' }]);
  };

  const handleSizeChange = (index, event) => {
    const { name, value } = event.target;
    const newSizes = [...sizes];
    newSizes[index][name] = value;
    setSizes(newSizes);
  };

  const handleRemoveSizeField = (index) => {
    const newSizes = [...sizes];
    newSizes.splice(index, 1);
    setSizes(newSizes);
  };

  //handle single measurement chart entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedSizes = sizes.reduce((acc, size) => {
        acc[size.key] = size.value;
        return acc;
      }, {});
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category); // Include category in the form data
      formData.append('sizes', JSON.stringify(formattedSizes));
      if (image) {
        formData.append("sample_size_file", image);
      }

      const response = await apiService.post(
        "/mesurementCharts/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      if (response.status === 201) {
        fetchAllMeasurements();
        onClose();
      }
    } catch (error) {
      console.error("Error adding measurement chart:", error);
    }
  };

  // handle toggle button click
  const handleStatusToggle = async ({ id, isActive }) => {
    try {
      const response = await apiService.put(`/mesurementCharts/isActive/${id}`, {
        isActive: !isActive,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        fetchAllMeasurements();
      }
    } catch (error) {
      console.error(`Error toggling status for length with ID ${id}:`, error);
      // Handle error as needed
    }
  };

  const handleEditClick = (index) => {
    const selectedData = data[index];
    setCurrentEditId(selectedData.id);
    setEditIndex(index);
    setTypeName(selectedData.name);
    setCategory(selectedData.category);
    setSizes(Object.entries(selectedData.sizes).map(([key, value]) => ({ key, value })));
    setImagePreview(selectedData.sample_size_file);
    setIsSecondModalOpen(true); // Open the modal for editing
  };

  const handleUpdateClick = async (e) => {
    e.preventDefault();
    try {
      const formattedSizes = sizes.reduce((acc, size) => {
        acc[size.key] = size.value;
        return acc;
      }, {});
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append('sizes', JSON.stringify(formattedSizes));
      if (image) {
        formData.append("sample_size_file", image);
      }

      const response = await apiService.put(
        `/mesurementCharts/${currentEditId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      if (response.status === 201) {
        setTypeName("");
        setCategory("");
        setSizes([{ key: '', value: '' }]);
        handleImageRemove();
        setSuccessMessage("Measurement Chart added successfully.");
        setErrorMessage("");
        fetchAllMeasurements();
        setIsSecondModalOpen(false);
        setEditIndex(null);
        setCurrentEditId(null);

         // Clear messages after 5 seconds
         setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Measurement chart already exists.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      } else {
        setErrorMessage("Error adding measurement chart.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
      setSuccessMessage("");
    }
  };

  const handleInputChange = (e, index) => {
    const newData = [...data];
    newData[index].measurementChart = e.target.value;
    setData(newData);
  };

  const handleCheckboxChange = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleHeaderCheckboxChange = (e) => {
    if (e.target.checked) {
      setCheckedIds(data.map((row) => row.id));
    } else {
      setCheckedIds([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await apiService.delete(`/mesurementCharts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 202) {
        fetchAllMeasurements();
      }
    } catch (error) {
      console.error("Error deleting measurement chart:", error);
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

  // handle images
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const isHeaderCheckboxChecked =
    checkedIds.length > 0 && checkedIds.length === data.length;

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <div className="shadow border-b border-gray-200 sm:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 w-full">
            <tr>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-1/12">
                Si No
              </th>
              <th className="px-2 py-3 text-left text-md font-bold text-black uppercase w-1/4">
                Measurement Chart
              </th>
              <th className="px-2 py-3 text-left text-md font-bold text-black uppercase w-1/4">
                Chart name
              </th>
              <th className="px-2 py-3 text-left text-md font-bold text-black uppercase w-1/4">
                Sizes
              </th>
              <th className="px-2 py-3 text-left text-md font-bold text-black uppercase w-1/12">
                Category
              </th>
              <th className="px-6 py-3 text-center text-md font-bold text-black uppercase w-1/12">
                Status
              </th>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-1/12">
                Action
              </th>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-1/12">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  onChange={handleHeaderCheckboxChange}
                  checked={checkedIds.length === data.length}
                />
              </th>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-8">
                <button onClick={handleDelete} className="text-red-500">
                  <img src={deleteIcon} alt="Delete" className="h-5 w-5" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, index) => (
              <tr key={row.id} style={{ maxHeight: "50px" }}>
                <td className="px-3 py-3 whitespace-nowrap text-md text-center text-black w-40">
                  {startIndex + index + 1}
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-28">
                      <div className="flex justify-center items-center">
                        <img
                          src={row.sample_size_file}
                          alt="Product"
                        />
                      </div>
                    </td>
                <td className="px-3 py-3 whitespace-nowrap text-md text-left text-black 2xl:w-[500px] xl:w-[450px] min-w-[200px]">
                  {row.name}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-md text-left text-black w-40">
                  {row.sizes ? Object.keys(row.sizes).map((key) => (
                    <span key={key}>{key}: {row.sizes[key]}, </span>
                  )) : null}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-md text-left text-black 2xl:w-[500px] xl:w-[450px] min-w-[200px]">
                  {row.category}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-md text-right text-black flex-grow">
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
                <td className="px-3 py-3 whitespace-nowrap text-md text-center text-black w-40">
                  <button
                    onClick={() => handleEditClick(index)}
                    className="text-blue-500"
                  >
                    <img src={editIcon} alt="Edit" className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-md text-center text-black w-40">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    onChange={() => handleCheckboxChange(row.id)}
                    checked={checkedIds.includes(row.id)}
                  />
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-md text-center text-black w-40">
                  <button onClick={() => handleDelete(row.id)}>
                    <img src={deleteIconRed} alt="Delete" className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination flex justify-between items-center px-4 py-3">
          <div>
            <label htmlFor="recordsPerPage" className="text-md text-black">
              Records per page:
            </label>
            <select
              id="recordsPerPage"
              value={recordsPerPage}
              onChange={handleRecordsPerPageChange}
              className="mx-2 border rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => handlePageChange("prev")}
              className="mx-1 p-1 border rounded-md focus:outline-none focus:border-blue-500"
            >
              <img src={leftArrowIcon} alt="Previous" className="h-5 w-5" />
            </button>
            <span className="text-md text-black">{`Page ${currentPage} of ${Math.ceil(
              data.length / recordsPerPage
            )}`}</span>
            <button
              onClick={() => handlePageChange("next")}
              className="mx-1 p-1 border rounded-md focus:outline-none focus:border-blue-500"
            >
              <img src={rightArrowIcon} alt="Next" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <MesasurementModal
          isOpen={isModalOpen}
          onClose={onClose}
          handleSubmit={handleSubmit}
          setTypeName={setTypeName}
          name={name}
          setCategory={setCategory}
          category={category}
          handleAddSizeField={handleAddSizeField}
          handleSizeChange={handleSizeChange}
          handleRemoveSizeField={handleRemoveSizeField}
          sizes={sizes}
          handleImageChange={handleImageChange}
          imagePreview={imagePreview}
          handleImageRemove={handleImageRemove}
        />
      )}

      {isSecondModalOpen && (
        <MesasurementModal
          isOpen={isSecondModalOpen}
          onClose={() => setIsSecondModalOpen(false)}
          handleSubmit={handleUpdateClick}
          setTypeName={setTypeName}
          name={name}
          setCategory={setCategory}
          category={category}
          handleAddSizeField={handleAddSizeField}
          handleSizeChange={handleSizeChange}
          handleRemoveSizeField={handleRemoveSizeField}
          sizes={sizes}
          handleImageChange={handleImageChange}
          imagePreview={imagePreview}
          handleImageRemove={handleImageRemove}
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

export default MeasurementChart;
