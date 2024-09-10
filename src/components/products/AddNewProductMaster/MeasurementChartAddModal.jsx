import React, { useState } from "react";
import apiService from "../../../apiService";
import closeIcon from "../../../assets/close-modal-icon.svg";

const MeasurementChartAddModal = ({
  isModalOpen,
  onClose,
  fetchMesurementChartSuggestions,
  setMesurementDropdown,
}) => {
  const [name, setTypeName] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState([{ key: "", value: "" }]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // handle size change
  const handleAddSizeField = () => {
    setSizes([...sizes, { key: "", value: "" }]);
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
      formData.append("category", category);
      formData.append("sizes", JSON.stringify(formattedSizes));
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
        setSuccessMessage("Measurement Chart added successfully.");
        setErrorMessage("");
        setMesurementDropdown(true);
        fetchMesurementChartSuggestions(response.data.name);
        onClose();

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Measurement Chart already exists.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      } else {
        setErrorMessage("Error adding Measurement Chart.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
      setSuccessMessage("");
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-lg z-10 w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end">
          <button onClick={onClose}>
            <img src={closeIcon} alt="Close" className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-md font-medium text-gray-700"
            >
              Measurement Chart
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setTypeName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-md font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Chest">Chest Diameter</option>
              <option value="Waist">Waist Diameter</option>
            </select>
          </div>

          {sizes.map((size, index) => (
            <div key={index} className="mb-4 flex">
              <div className="mr-2 w-full">
                <label
                  htmlFor={`key-${index}`}
                  className="block text-md font-medium text-gray-700"
                >
                  Size Key
                </label>
                <input
                  type="text"
                  id={`key-${index}`}
                  name="key"
                  value={size.key}
                  onChange={(e) => handleSizeChange(index, e)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="ml-2 w-full">
                <label
                  htmlFor={`value-${index}`}
                  className="block text-md font-medium text-gray-700"
                >
                  Size Value
                </label>
                <input
                  type="text"
                  id={`value-${index}`}
                  name="value"
                  value={size.value}
                  onChange={(e) => handleSizeChange(index, e)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
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
                type="button"
                onClick={() => handleRemoveSizeField(index)}
                className="ml-2 mt-7 px-2 py-1 border rounded-md bg-red-500 text-white"
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSizeField}
            className="mb-4 px-4 py-2 border rounded-md bg-blue-500 text-white"
          >
            Add Size
          </button>

          <div className="mb-4">
            <label className="block text-md font-medium text-gray-700">
              Upload Measurement Chart:
            </label>
            {imagePreview ? (
              <div className="flex items-center mt-5">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-28 mr-2"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="px-4 py-2 border rounded-md bg-red-500 text-white"
                >
                  Remove
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border rounded-md bg-green-500 text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeasurementChartAddModal;
