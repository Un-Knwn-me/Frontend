import React from 'react';
import closeIcon from '../../assets/close-modal-icon.svg';

const MesasurementModal = ({
  isOpen,
  onClose,
  handleSubmit,
  setTypeName,
  name,
  setCategory, // Add setCategory
  category, // Add category
  handleAddSizeField,
  handleSizeChange,
  handleRemoveSizeField,
  sizes,
  handleImageChange,
  imagePreview,
  handleImageRemove,
  successMessage,
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-lg z-10 w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end">
          <button onClick={onClose}>
            <img src={closeIcon} alt="Close" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium text-gray-700 text-md">
              Measurement Chart
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setTypeName(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block font-medium text-gray-700 text-md">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Chest">Chest Diameter</option>
              <option value="Waist">Waist Diameter</option>
            </select>
          </div>

          {sizes.map((size, index) => (
            <div key={index} className="flex mb-4">
              <div className="w-full mr-2">
                <label htmlFor={`key-${index}`} className="block font-medium text-gray-700 text-md">
                  Size Key
                </label>
                <input
                  type="text"
                  id={`key-${index}`}
                  name="key"
                  value={size.key}
                  onChange={(e) => handleSizeChange(index, e)}
                  className="block w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full ml-2">
                <label htmlFor={`value-${index}`} className="block font-medium text-gray-700 text-md">
                  Size Value
                </label>
                <input
                  type="text"
                  id={`value-${index}`}
                  name="value"
                  value={size.value}
                  onChange={(e) => handleSizeChange(index, e)}
                  className="block w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
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
                type="button"
                onClick={() => handleRemoveSizeField(index)}
                className="px-2 py-1 ml-2 text-white bg-red-500 border rounded-md mt-7"
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSizeField}
            className="px-4 py-2 mb-4 text-white bg-blue-500 border rounded-md"
          >
            Add Size
          </button>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 text-md">
              Upload Measurement Chart:
            </label>
            {imagePreview ? (
              <div className="flex items-center mt-5">
                <img src={imagePreview} alt="Preview" className="h-32 mr-2 w-28" />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="px-4 py-2 text-white bg-red-500 border rounded-md"
                >
                  Remove
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
              />
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-green-500 border rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MesasurementModal;
