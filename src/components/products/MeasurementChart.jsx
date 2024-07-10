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
  const [addedStyles, setAddedStyles] = useState([]);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [sizes, setSizes] = useState([{ key: '', value: '' }]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


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
      if(response.status === 200) {
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

  //handle single mesurement chart entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedSizes = sizes.reduce((acc, size) => {
        acc[size.key] = size.value;
        return acc;
      }, {});
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append('sizes', JSON.stringify(formattedSizes));
      if (image) {
        formData.append("sample_size_file", image);
      }

      // let formData = {"name":name,"sizes":varients}
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
      console.error("Error adding mesurement chart:", error);
    }
  };

  // handle toggle button click
  const handleStatusToggle = async ({ id, isActive }) => {
    try {
      const response = await apiService.put(`/mesurementCharts/${id}`, {
        isActive: !isActive,
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
    setEditIndex(index);
  };

  const handleUpdateClick = (index) => {
    setEditIndex(null);
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
      console.error("Error deleting length:", error);
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
                Sizes
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
                <td className="px-3 py-3 whitespace-nowrap text-md text-left text-black 2xl:w-[500px] xl:w-[450px] min-w-[200px]">
                  {editIndex === startIndex + index ? (
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => handleInputChange(e, startIndex + index)}
                      className="border border-gray-300 rounded-md px-2 py-2 text-left 2xl:w-[500px] xl:w-[450px] min-w-[200px]"
                    />
                  ) : (
                    row.name
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-md text-left text-black 2xl:w-[500px] xl:w-[450px] min-w-[200px]">
                  {editIndex === startIndex + index ? (
                    Object.keys(row.sizes).map((key) => (
                      <div key={key}>
                        <span>
                          {key}: {row.sizes[key]}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div>
                      {Object.keys(row.sizes).map((key, i) => (
                        <span key={i}>
                          {key}: {row.sizes[key]},{" "}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-md text-center text-black flex-grow">
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
                <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-16">
                  {editIndex === startIndex + index ? (
                    <button
                      onClick={() => handleUpdateClick(startIndex + index)}
                      className="bg-green-200 border border-green-500 px-2 py-1 rounded-lg flex"
                    >
                      <img src={tickIcon} alt="" className="mt-1 mr-2" />
                      <span className="text-xs">Update</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(startIndex + index)}
                      className="text-blue-500 text-center"
                    >
                      <img src={editIcon} alt="Edit" className="h-6 w-6" />
                    </button>
                  )}
                </td>
                <td className="px-2 py-3 whitespace-nowrap w-12 text-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={checkedIds.includes(row.id)}
                    onChange={() => handleCheckboxChange(row.id)}
                  />
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-center text-black">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500 w-5"
                  >
                    <img src={deleteIcon} alt="Delete" className="h-6 w-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-md text-black">
            {recordsPerPage} records per page
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={recordsPerPage}
            onChange={handleRecordsPerPageChange}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value={5}>Records per page: 5</option>
            <option value={10}>Records per page: 10</option>
            <option value={15}>Records per page: 15</option>
          </select>
          <button
            onClick={() => handlePageChange("prev")}
            className="px-2 py-1 text-md rounded-md"
          >
            <img src={leftArrowIcon} alt="Previous" />
          </button>
          <span className="text-md text-black">
            {currentPage}/{Math.ceil(data.length / recordsPerPage)}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            className="px-2 py-1 text-md rounded-md"
          >
            <img src={rightArrowIcon} alt="Next" />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 relative overflow-auto max-h-full">
            <button className="absolute top-4 right-4" onClick={onClose}>
              <img src={closeIcon} alt="Close" className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Add Measurement Chart</h2>
            <div className="flex flex-col mb-4">
              <label htmlFor="name" className="font-medium mb-2">
                Type Name:
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setTypeName(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="sizes" className="font-medium mb-2">
                Sizes:
              </label>
              {sizes.map((size, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    name="key"
                    value={size.key}
                    onChange={(e) => handleSizeChange(index, e)}
                    placeholder="Size Key"
                    className="border border-gray-300 rounded-md px-2 py-1 mr-2"
                  />
                  <input
                    type="text"
                    name="value"
                    value={size.value}
                    onChange={(e) => handleSizeChange(index, e)}
                    placeholder="Size Value"
                    className="border border-gray-300 rounded-md px-2 py-1"
                  />
                  <button onClick={() => handleRemoveSizeField(index)} className="text-red-500 ml-2">
                    Remove
                  </button>
                </div>
              ))}
              <button onClick={handleAddSizeField} className="text-blue-500 mt-2">
                Add Size Field
              </button>
            </div>

            <div className="mt-4">
                  <label htmlFor="imageUpload" className="block text-md font-medium text-gray-700">
                    Upload Image:
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    className="mt-1 block w-full text-md text-gray-500"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-2 relative">
                      <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover" />
                      <button
                          type="button"
                          onClick={handleImageRemove}
                          className="absolute top-2 left-24 bg-red-600 text-white rounded-full px-2 pb-0.5 focus:outline-none"
                        >
                          &times;
                        </button>
                    </div>
                  )}
                </div>


            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 mt-10 rounded-md"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {isSecondModalOpen && (
        <MesasurementModal onClose={() => setIsSecondModalOpen(false)} />
      )}
    </div>
  );
};

export default MeasurementChart;
