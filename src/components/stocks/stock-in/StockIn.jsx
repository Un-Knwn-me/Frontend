import React, { useState } from "react";
import editIcon from "../../../assets/edit-icon.svg";
import deleteIcon from "../../../assets/delete-icon.svg";
import leftArrowIcon from "../../../assets/left-arrow-icon.svg";
import rightArrowIcon from "../../../assets/right-arrow-icon.svg";
import TopLayer from "../../shared/TopLayer"; // Make sure to import TopLayer
import EditStockInModal from "./editStockInModal";
import SuccessAlert from "./SuccessAlert";
import AddStockModal from "./AddStockModal";

const StockIn = ({ searchQuery }) => {
  const [initialData, setInitialData] = useState([
    {
      id: 1,
      styleNo: "A123",
      date: "12/5/24",
      size: "M",
      description: "Size A",
      quantity: "2",
    },
    {
      id: 2,
      styleNo: "B456",
      date: "12/5/24",
      size: "L",
      description: "Size A",
      quantity: "2",
    },
    {
      id: 3,
      styleNo: "C789",
      date: "12/5/24",
      size: "XL",
      description: "Size A",
      quantity: "2",
    },
    {
      id: 4,
      styleNo: "D012",
      date: "12/5/24",
      size: "M",
      description: "Size A",
      quantity: "2",
    },
    {
      id: 5,
      styleNo: "E345",
      date: "12/5/24",
      size: "L",
      description: "Size A",
      quantity: "2",
    },
    {
      id: 6,
      styleNo: "F678",
      date: "12/5/24",
      size: "XL",
      description: "Size A",
      quantity: "2",
    },
  ]);

  const [filteredData, setFilteredData] = useState(initialData);
  const [editIndex, setEditIndex] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleDelete = () => {
    const newData = initialData.filter((row) => !checkedIds.includes(row.id));
    setInitialData(newData);
    setFilteredData(newData); // Also update filtered data
    setCheckedIds([]);
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
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-16">
                    Sin. No
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-20">
                    Image
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-20">
                    Date
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-36">
                    Style No
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-32">
                    Description
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-16">
                    Size
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-16">
                    Qty
                  </th>
                  <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-20">
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
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-12">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-20">
                      <div className="flex justify-center items-center">
                        <img
                          src={`https://via.placeholder.com/50`}
                          alt="Product"
                        />
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black flex-grow">
                      {row.date}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-36">
                      {row.styleNo}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-32">
                      {row.description}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-16">
                      {row.size}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-16">
                      {row.quantity}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-20">
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
      {/* <AddStockModal show={showAddModal} onClose={handleAddModalClose}  /> */}
    </>
  );
};

export default StockIn;
