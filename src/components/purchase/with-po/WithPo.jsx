import React, { useEffect, useState } from 'react';
import editIcon from "../../../assets/edit-icon.svg";
import deleteIcon from "../../../assets/delete-icon.svg";
import leftArrowIcon from "../../../assets/left-arrow-icon.svg";
import rightArrowIcon from "../../../assets/right-arrow-icon.svg";
import tickIcon from "../../../assets/tick-icon.svg";
import TopLayer from '../../shared/TopLayer';
import CreatePoModal from './CreateWithPoModel';
import EditPoModal from './EditWithPoModel';
import apiService from '../../../apiService';

const WithPo = () => {
  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState(initialData);
  const [editIndex, setEditIndex] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);


   // Function to fetch all orders
   const getAllPurchaseOrder = async () => {
    try {
      const poType = "po"
      const response = await apiService.get(`/purchases/type/${poType}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Format the created_at date
    const formattedData = response.data.map(stock => ({
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
    getAllPurchaseOrder();
  }, []);

  const handleSearch = (searchValue) => {
    const filtered = initialData.filter(item =>
      item.purchase_order_number.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleEditClick = (id) => {
    setSelectedProductId(id);
    setShowModal(true);
  };

  const handleSaveClick = () => {
    setEditIndex(null);
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
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < Math.ceil(filteredData.length / recordsPerPage)) {
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
      <div className=''>
        <TopLayer
          title="Product List"
          isSearch={true}
          onSearch={handleSearch}
          showDropdown={true}
          options={initialData.map(item => item.Product?.style_no || '')}
          selectedOption=""
          setSelectedOption={(option) => {
            const filtered = initialData.filter(item => item.Product?.style_no === option);
            setFilteredData(filtered);
            setCurrentPage(1);
          }}
          isAddButton={true}
          addButtonText="Add PO"
          onAddButtonClick={() => setShowAddModal(true)}
        />
        <div className="p-4 mx-auto mt-5 bg-white ">
          <div className='min-h-[60vh] max-h-[60vh] overflow-y-auto'>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="w-full bg-gray-50">
                <tr>
                  <th className="w-12 px-2 py-3 font-bold text-center text-black uppercase text-md">SL No</th>
                  <th className="w-40 px-2 py-3 font-bold text-center text-black uppercase text-md">Date</th>
                  <th className="w-40 px-2 py-3 font-bold text-center text-black uppercase text-md">PO No</th>
                  <th className="px-6 py-3 font-bold text-center text-black uppercase text-md">Buyer</th>
                  <th className="w-40 px-6 py-3 font-bold text-center text-black uppercase text-md">Style No</th>
                  <th className="px-2 py-3 font-bold text-center text-black uppercase text-md w-28">Brand</th>
                  <th className="px-6 py-3 font-bold text-center text-black uppercase text-md w-28">Category</th>
                  <th className="px-6 py-3 font-bold text-center text-black uppercase text-md w-28">Type</th>
                  <th className="px-6 py-3 font-bold text-center text-black uppercase text-md">Total Pcs</th>
                  <th className="w-20 px-2 py-3 font-bold text-center text-black uppercase text-md">Action</th>
                  <th className="w-12 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      onChange={(e) =>
                        setCheckedIds(e.target.checked ? initialData.map((row) => row.id) : [])
                      }
                      checked={checkedIds.length === initialData.length}
                    />
                  </th>
                  <th className="w-16 px-2 py-3 font-bold text-center text-black uppercase text-md">
                    <button onClick={handleDelete} className="text-red-500">
                      <img src={deleteIcon} alt="Delete" className='w-5 h-5' />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((row, index) => (
                  <tr key={row.id} style={{ maxHeight: '50px' }}>
                    <td className="w-12 px-2 py-3 text-center text-black whitespace-nowrap text-md">{startIndex + index + 1}</td>
                    <td className="px-2 py-3 text-center text-black whitespace-nowrap text-md w-28">{row.created_at}</td>
                    <td className="px-2 py-3 text-center text-black whitespace-nowrap text-md w-28">{row.purchase_order_number}</td>
                    <td className="flex-grow px-6 py-3 text-center text-black whitespace-nowrap text-md">{row.Buyer.name}, {row.Buyer.location}</td>
                    <td className="px-2 py-3 text-center text-black whitespace-nowrap text-md w-28">{row.Product.style_no}</td>
                    <td className="px-2 py-3 text-center text-black whitespace-nowrap text-md w-28">{row.Product.Brand.brandName}</td>
                    <td className="px-2 py-3 text-center text-black whitespace-nowrap text-md w-28">{row.Product.Category.categoryName}</td>
                    <td className="px-6 py-3 text-center text-black whitespace-nowrap text-md w-28">{row.Product.ProductType.product}</td>
                    <td className="px-2 py-3 text-center text-black whitespace-nowrap text-md w-28">{row.req_purchase_qty}</td>
                    <td className="w-20 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                      {editIndex === startIndex + index ? (
                        <button onClick={handleSaveClick} className="flex px-2 py-1 bg-green-200 border border-green-500 rounded-lg">
                          <img src={tickIcon} alt="" className='mt-1 mr-2' />
                          <span className='text-xs'>Update</span>
                        </button>
                      ) : (
                        <button onClick={() => handleEditClick(row.id)} className="text-center text-blue-500">
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
                    <td className="w-16 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-5 h-4" />
                  </button>
                </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-black text-md">{recordsPerPage} records per page</span>
            </div>
            <div className="flex items-center space-x-2">
              <select value={recordsPerPage} onChange={handleRecordsPerPageChange} className="px-3 py-2 border border-gray-300 rounded-md">
                <option value={5}>Records per page: 5</option>
                <option value={10}>Records per page: 10</option>
                <option value={15}>Records per page: 15</option>
              </select>
              <button onClick={() => handlePageChange('prev')} className="px-2 py-1 rounded-md text-md">
                <img src={leftArrowIcon} alt="Previous" />
              </button>
              <span className="text-black text-md">{currentPage}/{Math.ceil(filteredData.length / recordsPerPage)}</span>
              <button onClick={() => handlePageChange('next')} className="px-2 py-1 rounded-md text-md">
                <img src={rightArrowIcon} alt="Next" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <CreatePoModal show={showAddModal} onClose={handleAddModalClose} getAllPurchaseOrder={getAllPurchaseOrder}/>
      <EditPoModal show={showModal} onClose={handleCloseModal} withPoId={selectedProductId} />
    </>
  );
};

export default WithPo;
