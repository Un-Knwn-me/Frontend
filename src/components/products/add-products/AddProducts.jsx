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
  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState(initialData);
  const [editIndex, setEditIndex] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);


  // Function to fetch all products
  const getAllProducts = async () => {
    try {
      const response = await apiService.get(`/products/getall`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      
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
    const lowercasedSearchValue = searchValue.toLowerCase();
  
    const filtered = initialData.filter((item) => {
      return (
        (item.style_no && item.style_no.toLowerCase().includes(lowercasedSearchValue)) ||
        (item.Reference && item.Reference.reference_no && item.Reference.reference_no.toLowerCase().includes(lowercasedSearchValue)) ||
        (item.ProductType && item.ProductType.product && item.ProductType.product.toLowerCase().includes(lowercasedSearchValue)) ||
        (item.Brand && item.Brand.brandName && item.Brand.brandName.toLowerCase().includes(lowercasedSearchValue)) ||
        (item.Fabric && item.Fabric.fabricName && item.Fabric.fabricName.toLowerCase().includes(lowercasedSearchValue)) ||
        (item.Color && item.Color.colorName && item.Color.colorName.toLowerCase().includes(lowercasedSearchValue)) ||
        (item.Size && item.Size.sizes && item.Size.sizes.some(size => size.toLowerCase().includes(lowercasedSearchValue)))
      );
    });
  
    setFilteredData(filtered);
    setCurrentPage(1);
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
    getAllProducts();
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
          options={["New to Old", "Old to New"]}
          selectedOption={selectedOption}
          setSelectedOption={(option) => {
            setSelectedOption(option);
            
            // Sorting logic
            const sortedData = [...initialData].sort((a, b) => {
              if (option === "New to Old") {
                return new Date(b.createdAt) - new Date(a.createdAt);
              } else if (option === "Old to New") {
                return new Date(a.createdAt) - new Date(b.createdAt);
              }
              return 0;
            });

            setFilteredData(sortedData);
            setCurrentPage(1); // Reset to the first page on new sort
          }}
          isAddButton={true}
          addButtonText="Add Product"
          onAddButtonClick={() => setShowAddModal(true)}
        />
        <div className="p-4 mx-auto mt-5 bg-white ">
          <div className="min-h-[60vh] max-h-[60vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="w-full bg-gray-50">
                <tr>
                  <th className="w-10 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Si No
                  </th>
                  <th className="px-2 py-3 font-bold text-center text-black uppercase w-28 text-md">
                    Image
                  </th>
                  <th className="w-24 px-6 py-3 font-bold text-center text-black uppercase text-md">
                    Style No
                  </th>
                  <th className="w-24 px-6 py-3 font-bold text-center text-black uppercase text-md">
                    Ref No
                  </th>
                  <th className="w-24 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Type
                  </th>
                  <th className="w-40 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Brand
                  </th>
                  <th className="flex-grow px-6 py-3 font-bold text-center text-black uppercase text-md">
                    Fabric
                  </th>
                  <th className="px-2 py-3 font-bold text-center text-black uppercase text-md w-28">
                    Color
                  </th>
                  <th className="px-2 py-3 font-bold text-center text-black uppercase text-md w-28">
                    Size
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
                          e.target.checked
                            ? initialData.map((row) => row.id)
                            : []
                        )
                      }
                      checked={checkedIds.length === initialData.length}
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
                {currentData.map((row, index) => (
                  <tr key={row.id} style={{ maxHeight: "50px" }}>
                    <td className="w-10 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-2 py-3 text-center text-black whitespace-nowrap text-md w-28">
                      <div className="flex items-center justify-center">
                        <img
                          src={row.images[0]}
                          alt="Product"
                          className="h-28"
                        />
                      </div>
                    </td>
                    <td className="w-24 px-6 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.style_no}
                    </td>
                    <td className="w-24 px-6 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.Reference.reference_no}
                    </td>
                    <td className="w-24 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.ProductType.product}
                    </td>
                    <td className="w-32 px-6 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.Brand.brandName}
                    </td>
                    <td className="w-32 px-6 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.Fabric.fabricName}
                    </td>
                    <td className="px-2 py-3 text-center text-black whitespace-nowrap text-md w-28">
                      {row.Color.colorName}
                    </td>
                    <td className="px-2 py-3 text-center text-black whitespace-nowrap text-md w-28">
                      {row.Size.sizes.join(", ")}
                    </td>
                    <td className="w-16 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {editIndex === startIndex + index ? (
                        <button
                          onClick={handleSaveClick}
                          className="flex px-2 py-1 bg-green-200 border border-green-500 rounded-lg"
                        >
                          <img src={tickIcon} alt="" className="mt-1 mr-2" />
                          <span className="text-xs">Update</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(row.id)}
                          className="w-16 text-center text-blue-500"
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
                    <td className="w-8 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
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
                {currentPage}/{Math.ceil(filteredData.length / recordsPerPage)}
              </span>
              <button
                onClick={() => handlePageChange("next")}
                className="px-2 py-1 rounded-md text-md"
              >
                <img src={rightArrowIcon} alt="Next" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
      <EditProductModal
        show={showModal}
        onClose={handleCloseModal}
        productId={selectedProductId}
      />
      )}
      <AddProductModal show={showAddModal} onClose={handleAddModalClose} />
    </>
  );
};

export default AddProducts;