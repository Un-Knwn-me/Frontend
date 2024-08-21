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
  const [sortedData, setSortedData] = useState([]);
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
      created_at: new Date(stock.created_at).toLocaleDateString('en-GB'),
      days_since_created: Math.floor((new Date() - new Date(stock.created_at)) / (1000 * 60 * 60 * 24))
    }));

    console.log(formattedData);
    setInitialData(formattedData);
    setFilteredData(formattedData);
    setSortedData(formattedData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getAllStocks();
  }, []);

  // handle sort
  const handleSort = (sortOption) => {
    let sortedArray = [...initialData];
    
    if (sortOption === "newest") {
      sortedArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOption === "oldest") {
      sortedArray.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    setSortedData(sortedArray);
    setCurrentPage(1); // Reset to first page after sorting
  };

  const handleSearch = (searchValue) => {
    const filtered = initialData.filter((item) =>
      item.brand.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleEditClick = (id) => {
    setEditIndex(id);
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
          options={["Sort by Newest", "Sort by Oldest"]}
          selectedOption=""
          setSelectedOption={(option) => {
            if (option === "Sort by Newest") {
              handleSort("newest");
            } else if (option === "Sort by Oldest") {
              handleSort("oldest");
            }
          }}
          isAddButton={true}
          addButtonText="Add Stock"
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
                  <th className="w-20 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Date
                  </th>
                  <th className="w-20 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Style No
                  </th>
                  <th className="w-20 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Reference No
                  </th>
                  <th className="w-20 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Brand
                  </th>
                  <th className="w-20 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Size
                  </th>
                  <th className="w-16 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Category
                  </th>
                  <th className="w-16 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Type
                  </th>
                  <th className="w-20 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Bundles
                  </th>
                  <th className="w-20 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Total Pcs
                  </th>
                  <th className="w-16 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Age
                  </th>
                  <th className="w-16 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    Action
                  </th>
                  <th className="w-16 px-2 py-3 font-bold text-center text-black uppercase text-md">
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
                  <th className="w-8 px-2 py-3 font-bold text-center text-black text-md">
                    <img src={deleteIcon} alt="" className="w-5 h-5" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((row, index) => (
                  <tr key={row.id} style={{ maxHeight: "50px" }}>
                    <td className="w-10 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-2 py-3 text-center text-black w-28 whitespace-nowrap text-md">
                      <div className="flex items-center justify-center">
                        <img
                          src={row.Product.images[0] || 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1722163869~exp=1722167469~hmac=37361beb0ca1a1c652d36c9ca94818f793a54d21822edab80e80c6e43a9b7b37&w=740'}
                          alt='Stock'
                          className="h-28"
                        />
                      </div>
                    </td>
                    <td className="w-20 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.created_at}
                    </td>
                    <td className="w-20 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.Product.style_no}
                    </td>
                    <td className="w-20 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.Product.Reference.reference_no}
                    </td>
                    <td className="w-20 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.Product.Brand.brandName}
                    </td>
                    <td className="w-20 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.Product.Size.sizes.join(", ")}
                    </td>
                    <td className="w-16 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.Product.Category.categoryName}
                    </td>
                    <td className="w-16 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.Product.ProductType.product}
                    </td>
                    <td className="w-20 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.no_bundles}
                    </td>
                    <td className="w-20 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.total_pcs}
                    </td>
                    <td className="w-16 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {row.days_since_created}
                    </td>   
                    <td className="w-16 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      <button
                        onClick={() => handleEditClick(row.id)}
                        className="text-center text-blue-500"
                      >
                        <img src={editIcon} alt="Edit" className="w-6 h-6" />
                      </button>
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
      <EditStockInModal showModal={showModal} close={handleCloseModal} editIndex={editIndex} stockInData={currentData.find((item) => item.id === editIndex)} />
      <AddStockModal show={showAddModal} onClose={handleAddModalClose} getAllStocks={getAllStocks} />
    </>
  );
};

export default StockIn;
