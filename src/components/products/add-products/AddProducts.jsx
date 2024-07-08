import React, { useState, useEffect } from "react";
import editIcon from "../../../assets/edit-icon.svg";
import deleteIcon from "../../../assets/delete-icon.svg";
import leftArrowIcon from "../../../assets/left-arrow-icon.svg";
import rightArrowIcon from "../../../assets/right-arrow-icon.svg";
import tickIcon from "../../../assets/tick-icon.svg";
import TopLayer from "../../../components/shared/TopLayer"; // Make sure to import TopLayer
import EditProductModal from "./edit-products-modal";
import AddProductModal from "./AddProductModal";
import apiService from "../../../apiService";
// import UploadMeasurementChartModal from "./UploadMeasurementChartModal";

const AddProducts = ({ searchQuery }) => {
  const [initialData, setInitialData] = useState([
    { id: 1, styleNo: 'A123', product: 'Shirt', brand: 'BrandA', fabric: 'Cotton', color: 'Red', size: 'M', status: 'active' },
    { id: 2, styleNo: 'B456', product: 'Pants', brand: 'BrandB', fabric: 'Denim', color: 'Blue', size: 'L', status: 'inactive' },
    { id: 3, styleNo: 'C789', product: 'Jacket', brand: 'BrandC', fabric: 'Leather', color: 'Black', size: 'XL', status: 'active' },
    { id: 4, styleNo: 'D012', product: 'Shirt', brand: 'BrandA', fabric: 'Cotton', color: 'Red', size: 'M', status: 'active' },
    { id: 5, styleNo: 'E345', product: 'Pants', brand: 'BrandB', fabric: 'Denim', color: 'Blue', size: 'L', status: 'inactive' },
    { id: 6, styleNo: 'F678', product: 'Jacket', brand: 'BrandC', fabric: 'Leather', color: 'Black', size: 'XL', status: 'active' },
    // Add more unique items as needed
  ]);
  // const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState(initialData);
  const [editIndex, setEditIndex] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);


  // Function to fetch all products
  const getAllProducts = async () => {
    try {
      const response = await apiService.get(`/products/getall`);
      setInitialData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);


  const handleSearch = (searchValue) => {
    const filtered = initialData.filter((item) =>
      item.brand.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleEditClick = (id) => {
    setSelectedProductId(id);
    setShowModal(true);
  };

  // const handleSaveClick = () => {
  //   setEditIndex(null);
  // };

  const handleSaveClick = async () => {
    try {
      // Assuming selectedProductId is set correctly
      const response = await apiService.put(`/products/${selectedProductId}`, {
        // Update object fields based on your form data or state
        // Example: brand: newData.brand, fabric: newData.fabric, etc.
      });
      console.log('Product updated successfully:', response.data);
      setShowModal(false);
      getAllProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleInputChange = (e, index) => {
    const newData = [...initialData];
    newData[index].brand = e.target.value;
    setInitialData(newData);
  };

  const handleCheckboxChange = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // const handleDelete = () => {
  //   const newData = initialData.filter((row) => !checkedIds.includes(row.id));
  //   setInitialData(newData);
  //   setFilteredData(newData); // Also update filtered data
  //   setCheckedIds([]);
  // };

  const handleDelete = async () => {
    try {
      // Assuming checkedIds contains IDs to delete
      const promises = checkedIds.map(id =>
        apiService.delete(`/products/${id}`)
      );
      await Promise.all(promises);
      console.log('Products deleted successfully');
      getAllProducts(); // Refresh the product list
      setCheckedIds([]); // Clear checked IDs after deletion
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  };  
  

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (
      direction === "next" &&
      currentPage < Math.ceil(filteredData.length / recordsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on changing records per page
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProductId(null);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
  };

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <>
      <div className="">
        <TopLayer
          title="Product List"
          isSearch={true}
          onSearch={handleSearch}
          showDropdown={true}
          options={["BrandA", "BrandB", "BrandC"]}
          selectedOption=""
          setSelectedOption={(option) => {
            const filtered = initialData.filter(
              (item) => item.brand === option
            );
            setFilteredData(filtered);
            setCurrentPage(1); // Reset to first page on new filter
          }}
          isAddButton={true}
          addButtonText="Add Product"
          onAddButtonClick={() => setShowAddModal(true)}
        />
        <div className=" mx-auto p-4 bg-white mt-5">
          <div className="min-h-[60vh] max-h-[60vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 w-full">
                <tr>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-28">
                    Si No
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-40">
                    Image
                  </th>
                  <th className="px-6 py-3 text-center text-md font-bold text-black uppercase flex-grow">
                    Style No
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-28">
                    Product
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-40">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-center text-md font-bold text-black uppercase flex-grow">
                    Fabric
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-28">
                    Color
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-28">
                    Size
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-28">
                    Action
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-20">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      onChange={(e) =>
                        setCheckedIds(
                          e.target.checked
                            ? initialData.map((row) => row.id)
                            : []
                        )
                      }
                      checked={checkedIds.length === initialData.length}
                    />
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-8">
                    <button onClick={handleDelete} className="text-red-500">
                      <img src={deleteIcon} alt="Delete" className="h-6 w-6" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((row, index) => (
                  <tr key={row.id} style={{ maxHeight: "50px" }}>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-12">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-28">
                      <div className="flex justify-center items-center">
                        <img
                          src={`https://via.placeholder.com/50`}
                          alt="Product"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-md text-center text-black flex-grow">
                      {row.styleNo}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-28">
                      {row.product}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-40">
                      {editIndex === startIndex + index ? (
                        <input
                          type="text"
                          value={row.brand}
                          onChange={(e) =>
                            handleInputChange(e, startIndex + index)
                          }
                          className="border border-gray-300 rounded-md w-28 px-2 py-2"
                        />
                      ) : (
                        row.brand
                      )}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-md text-center text-black flex-grow">
                      {row.fabric}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-28">
                      {row.color}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-28">
                      {row.size}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-16">
                      {editIndex === startIndex + index ? (
                        <button
                          onClick={handleSaveClick}
                          className="bg-green-200 border border-green-500 px-2 py-1 rounded-lg flex"
                        >
                          <img src={tickIcon} alt="" className="mt-1 mr-2" />
                          <span className="text-xs">Update</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(row.id)}
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
                        // onChange={() => handleCheckboxChange(row.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCheckedIds([...checkedIds, row.id]);
                          } else {
                            setCheckedIds(checkedIds.filter((id) => id !== row.id));
                          }
                        }}
                      />
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
                {currentPage}/{Math.ceil(filteredData.length / recordsPerPage)}
              </span>
              <button
                onClick={() => handlePageChange("next")}
                className="px-2 py-1 text-md rounded-md"
              >
                <img src={rightArrowIcon} alt="Next" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <EditProductModal
        show={showModal}
        onClose={handleCloseModal}
        productId={selectedProductId}
      />
      <AddProductModal show={showAddModal} onClose={handleAddModalClose} />
    </>
  );
};

export default AddProducts;
