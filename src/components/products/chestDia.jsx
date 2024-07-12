import React, { useState } from 'react';
import editIcon from "../../assets/edit-icon.svg";
import toggleActiveIcon from "../../assets/toggle-active.svg";
import toggleInactiveIcon from "../../assets/toggle-inactive.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import leftArrowIcon from "../../assets/left-arrow-icon.svg";
import rightArrowIcon from "../../assets/right-arrow-icon.svg";
import tickIcon from "../../assets/tick-icon.svg";
import closeIcon from "../../assets/close-modal-icon.svg";
import excelIcon from "../../assets/excel-icon.svg";

const ChestDla = ({ searchQuery, isModalOpen, onClose }) => {
  const [data, setData] = useState([
    { id: 1, chestDla: '17', status: 'active' },
    { id: 2, chestDla: '18', status: 'inactive' },
    { id: 3, chestDla: '8', status: 'active' },
    { id: 4, chestDla: '19', status: 'inactive' },
    { id: 5, chestDla: '20', status: 'active' },
    { id: 6, chestDla: 'Jersey', status: 'inactive' },
    { id: 7, chestDla: 'Jersey', status: 'active' },
    { id: 8, chestDla: 'Jersey', status: 'inactive' },
    { id: 9, chestDla: 'Jersey', status: 'active' },
    { id: 10, chestDla: 'Jersey', status: 'inactive' },
    { id: 11, chestDla: 'Jersey', status: 'active' },
    { id: 12, chestDla: 'Jersey', status: 'inactive' },
  ]);
 
  const [editIndex, setEditIndex] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [inputValue, setInputValue] = useState("");
  const [addedStyles, setAddedStyles] = useState([]);

  const filteredData = data.filter(item =>
    item.chestDla.toLowerCase().includes(searchQuery.toLowerCase())
  ); 

  const handleStatusToggle = (index) => {
    const newData = [...data];
    newData[index].status = newData[index].status === 'active' ? 'inactive' : 'active';
    setData(newData);
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
  };

  const handleUpdateClick = (index) => {
    setEditIndex(null);
  };

  const handleInputChange = (e, index) => {
    const newData = [...data];
    newData[index].chestDla = e.target.value;
    setData(newData);
  };

  const handleCheckboxChange = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    const newData = data.filter((row) => !checkedIds.includes(row.id));
    setData(newData);
    setCheckedIds([]);
  };

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < Math.ceil(data.length / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleInputChangeModal = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddStyle = () => {
    if (inputValue.trim() !== "") {
      setAddedStyles([...addedStyles, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveStyle = (index) => {
    const newAddedStyles = [...addedStyles];
    newAddedStyles.splice(index, 1);
    setAddedStyles(newAddedStyles);
  };

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className=" mx-auto p-4 bg-white">
      <div className='min-h-[60vh] max-h-[60vh] overflow-y-auto'>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 w-full">
            <tr>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-28">Si No</th>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-40">Chest Dla</th>
              <th className="px-6 py-3 text-center text-md font-bold text-black uppercase flex-grow">Status</th>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-28">Action</th>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-20">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  onChange={(e) =>
                    setCheckedIds(e.target.checked ? data.map((row) => row.id) : [])
                  }
                  checked={checkedIds.length === data.length}
                />
              </th>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-8">
                <button onClick={handleDelete} className="text-red-500">
                  <img src={deleteIcon} alt="Delete" className='h-6 w-6' />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, index) => (
              <tr key={row.id} style={{ maxHeight: '50px' }}>
                <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-12">{startIndex + index + 1}</td>
                <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-28">
                  {editIndex === startIndex + index ? (
                    <input
                      type="text"
                      value={row.chestDla}
                      onChange={(e) => handleInputChange(e, startIndex + index)}
                      className="border border-gray-300 rounded-md px-2 py-2 text-center w-28"
                    />
                  ) : (
                    row.chestDla
                  )}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-md text-center text-black flex-grow">
                  <button
                    onClick={() => handleStatusToggle(startIndex + index)}
                    className="px-2 py-1 rounded-full"
                  >
                    <div className='flex space-x-2' >
                      <span className={row.status === 'active' ? 'text-green-600 w-20' : 'text-gray-300 w-20'}>
                          {row.status === 'active' ? 'Active' : 'In-Active'}
                      </span>
                      <img src={row.status === 'active' ? toggleActiveIcon : toggleInactiveIcon} alt="Toggle Status" />
                    </div>
                  </button>
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-16">
                  {editIndex === startIndex + index ? (
                    <button onClick={() => handleUpdateClick(startIndex + index)} className="bg-green-200 border border-green-500 px-2 py-1 rounded-lg flex">
                        <img src={tickIcon} alt="" className='mt-1 mr-2' />
                        <span className='text-xs' >Update</span>
                    </button>
                  ) : (
                    <button onClick={() => handleEditClick(startIndex + index)} className="text-blue-500 text-center">
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
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-md text-black">{recordsPerPage} records per page</span>
        </div>
        <div className="flex items-center space-x-2">
          <select value={recordsPerPage} onChange={handleRecordsPerPageChange} className="border border-gray-300 rounded-md px-3 py-2">
            <option value={5}>Records per page: 5</option>
            <option value={10}>Records per page: 10</option>
            <option value={15}>Records per page: 15</option>
          </select>
          <button onClick={() => handlePageChange('prev')} className="px-2 py-1 text-md rounded-md">
            <img src={leftArrowIcon} alt="Previous" />
          </button>
          <span className="text-md text-black">{currentPage}/{Math.ceil(data.length / recordsPerPage)}</span>
          <button onClick={() => handlePageChange('next')} className="px-2 py-1 text-md rounded-md">
            <img src={rightArrowIcon} alt="Next" />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={onClose}
          ></div>
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[35vw] h-screen max-h-[50vh] overflow-y-auto lg:overflow-hidden">
            <div className="py-2 flex flex-col">
              <div>
                <div className="flex justify-center">
                  <h2 className="text-2xl font-bold">Add Chest Dia</h2>
                  <button
                    className="absolute right-5 cursor-pointer"
                    onClick={onClose}
                  >
                    <img src={closeIcon} alt="Close" className="mt-2" />
                  </button>
                </div>
                <hr className="w-full mt-3" />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-gray-400 font-bold mt-10">*For multiple “Chest dia” feed use enter after each values</p>
                <input
                  className="bg-gray-200 rounded w-80 py-3 px-4 text-gray-700 focus:outline-none focus:shadow-outline mt-5 text-lg text-center"
                  type="text"
                  placeholder="Enter chest dia"
                  value={inputValue}
                  onChange={handleInputChangeModal}
                />
                <button
                  className="bg-sky-600 w-80 py-3 text-white rounded-lg font-bold text-lg mt-3"
                  onClick={handleAddStyle}
                >
                  Update
                </button>
                <div className="text-center mt-4">
                  <p className="flex">
                    <span><img src={excelIcon} alt="" className="w-7" /></span>
                    <span className="text-sky-600 font-bold text-lg">Upload From excel {'('}Bulk upload{')'}</span>
                  </p>
                </div>
                <div className="bg-gray-100 mt-10 w-full h-screen max-h-[13vh]">
                {addedStyles.length > 0 ? (
                  <div className="flex flex-wrap mt-3">
                    {addedStyles.map((style, index) => (
                      <div key={index} className="w-35 flex items-center bg-gray-200 px-5 py-2 mb-2 mx-2">
                        <span>{style}</span>
                        <button onClick={() => handleRemoveStyle(index)}>
                          <img src={closeIcon} alt="Remove" className="w-3 h-3 ml-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                   ) : (
                    <div className="flex justify-center items-center h-full">
                    <span className="text-gray-500 text-xl">No chest dia entries</span>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChestDla;
