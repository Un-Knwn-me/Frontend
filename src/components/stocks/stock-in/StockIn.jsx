import React, { useEffect, useState } from "react";
import editIcon from "../../../assets/edit-icon.svg";
import deleteIcon from "../../../assets/delete-icon.svg";
import leftArrowIcon from "../../../assets/left-arrow-icon.svg";
import rightArrowIcon from "../../../assets/right-arrow-icon.svg";
import TopLayer from "../../shared/TopLayer"; // Make sure to import TopLayer
import EditStockInModal from "./editStockInModal";
import SuccessAlert from "./SuccessAlert";
import AddStockModal from "./AddStockModal";
import apiService from "../../../apiService";

const StockIn = ({ searchQuery }) => {
  const [initialData, setInitialData] = useState([]);

  const [filteredData, setFilteredData] = useState(initialData);
  const [editIndex, setEditIndex] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Function to fetch all products
  const getAllStocks = async () => {
    try {
      const response = await apiService.get(`/stocks/stockIn/all`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = response.data.filter(item => item.total_pcs > 0);
      // Format the created_at date
    const formattedData = data.map(stock => ({
      ...stock,
      created_at: new Date(stock.created_at).toLocaleDateString('en-GB')
    }));

    console.log(formattedData);
    setInitialData(formattedData);
    setFilteredData(formattedData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getAllStocks();
  }, []);


  const handleSearch = (searchValue) => {
    const filtered = initialData.filter((item) =>
      item.brand.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleEditClick = (id) => {
    setShowModal(true);
  };

  const handleCheckboxChange = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      // Assuming checkedIds contains IDs to delete
      const promises = checkedIds.map(id =>
        apiService.delete(`/stocks/stockIn/${id}`)
      );
      await Promise.all(promises);
      console.log('Products deleted successfully');
      getAllStocks(); // Refresh the product list
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
            setCurrentPage(1); 
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
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-10">
                    Si No
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-24">
                    Image
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-20">
                    Date
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-20">
                    Style No
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-20">
                    Reference No
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-20">
                    Brand
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-24">
                    Size
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-16">
                    Category
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-20">
                    Type
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-12">
                    Bundles
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-14">
                    Total Pcs
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-16">
                    Action
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-16">
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
                  <th className="px-2 py-3 text-center text-md font-bold text-black w-8">
                    <img src={deleteIcon} alt="" className="w-5 h-5" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((row, index) => (
                  <tr key={row.id} style={{ maxHeight: "50px" }}>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-10">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-24">
                      <div className="flex justify-center items-center">
                        <img
                          src={row.Product.images[0] || 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1722163869~exp=1722167469~hmac=37361beb0ca1a1c652d36c9ca94818f793a54d21822edab80e80c6e43a9b7b37&w=740'}
                          alt='Stock'
                          className="h-28"
                        />
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-20">
                      {row.created_at}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-20">
                      {row.Product.style_no}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-20">
                      {row.Product.Reference.reference_no}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-20">
                      {row.Product.Brand.brandName}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-24">
                      {row.Product.Size.sizes.join(", ")}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-16">
                      {row.Product.Category.categoryName}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-20">
                      {row.Product.ProductType.product}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-12">
                      {row.no_bundles}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-12">
                      {row.total_pcs}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-16">
                      <button
                        onClick={() => handleEditClick(row.id)}
                        className="text-blue-500 text-center"
                      >
                        <img src={editIcon} alt="Edit" className="h-6 w-6" />
                      </button>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap w-12 text-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={checkedIds.includes(row.id)}
                        onChange={() => handleCheckboxChange(row.id)}
                      />
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-8">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500"
                  >
                    <img src={deleteIcon} alt="Delete" className="h-5 w-5" />
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
      <EditStockInModal showModal={showModal} close={handleCloseModal} />
      {/* <SuccessAlert show={showModal} onClose={handleCloseModal} /> */}
      <AddStockModal show={showAddModal} onClose={handleAddModalClose} getAllStocks={getAllStocks} />
    </>
  );
};

export default StockIn;
