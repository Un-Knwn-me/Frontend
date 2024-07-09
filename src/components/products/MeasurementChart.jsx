import React, { useEffect, useState } from 'react';
import editIcon from "../../assets/edit-icon.svg"; 
import addIcon from "../../assets/add-icon-green.svg"
import toggleActiveIcon from "../../assets/toggle-active.svg";
import toggleInactiveIcon from "../../assets/toggle-inactive.svg";
import deleteIconRed from "../../assets/delete-icon-red.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import leftArrowIcon from "../../assets/left-arrow-icon.svg";
import rightArrowIcon from "../../assets/right-arrow-icon.svg";
import tickIcon from "../../assets/tick-icon.svg";
import MesasurementModal from './Mesasurement-model';
import closeIcon from "../../assets/close-modal-icon.svg"
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
  const [sizes, setSizes] = useState({});
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    fetchAllMeasurements();
  }, []);

  const fetchAllMeasurements = async () => {
    try {
      const response = await apiService.get("/mesurementCharts/getall");
      console.log(response.data);
      setData(response.data); 
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSize = () => {
    setSizes({ ...sizes, [key]: value });
    setKey('');
    setValue('');
  };
   
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setSizes({ ...sizes, [name]: value });
  // };

  // let addFormFields = () => {
  //   setVarients([...varients, { size: "", value: 0 }]);
  // };  

// let removeFormFields = (i) => {
//   let newFormValues = [...varients];
//   newFormValues.splice(i, 1);
//   setVarients(newFormValues)
// }

  //handle single mesurement chart entry
  const handleSubmit = async () => {
    // e.preventDefault();
    try { 
      console.log(name,sizes)
      const formData = new FormData();
      formData.append("name", name);
      formData.append('sizes', JSON.stringify(sizes));
     
      // let formData = {"name":name,"sizes":varients}
      const response = await apiService.post("/mesurementCharts/create", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)

      if (response.status === 201) {
        
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
      const response = await apiService.delete(`/mesurementCharts/${id}`);
      console.log(response);
      if (response.status === 202) {
        fetchAllMeasurements();
      }
    } catch (error) {
      console.error("Error deleting length:", error);
      // Handle error as needed
    }
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

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const isHeaderCheckboxChecked = checkedIds.length > 0 && checkedIds.length === data.length;

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <div className="shadow border-b border-gray-200 sm:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 w-full">
            <tr>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-1/12">Si No</th>
              <th className="px-2 py-3 text-left text-md font-bold text-black uppercase w-1/4">Measurement Chart</th>
              <th className='px-2 py-3 text-left text-md font-bold text-black uppercase w-1/4'>Sizes</th>
              <th className="px-6 py-3 text-center text-md font-bold text-black uppercase w-1/12">Status</th>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-1/12">Action</th>
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
                  <img src={deleteIcon} alt="Delete" className='h-5 w-5' />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, index) => (
              <tr key={row.id} style={{ maxHeight: '50px' }}>
                <td className="px-3 py-3 whitespace-nowrap text-md text-center text-black w-40">{startIndex + index + 1}</td>
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
                        <span>{key}: {row.sizes[key]}</span>
                      </div>
                    ))
                  ) : (
                    <div>
                      {Object.keys(row.sizes).map((key, i) => (
                        <span key={i}>{key}: {row.sizes[key]}, </span>
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
                    <button onClick={() => handleUpdateClick(startIndex + index)} className="bg-green-200 border border-green-500 px-2 py-1 rounded-lg flex">
                      <img src={tickIcon} alt="" className='mt-1 mr-2' />
                      <span className='text-xs'>Update</span>
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
    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[50vw] max-h-[80vh] overflow-y-auto">
      <div className="py-4 px-6 flex flex-col h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Add Measurement Chart</h2>
          <button
            className="cursor-pointer"
            onClick={onClose}
          >
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
        <hr className="w-full mt-3" /> 
        <div className="px-4 py-2 flex items-center space-x-2">
        <div> Name </div>
                 <div> <input
                    id="name"
                    name="name"
                    placeholder="Enter name"
                    autoComplete="name"
                    value ={name}
                    onChange={(e) => setTypeName(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  /> 
                  </div>
                </div>
        <table className="min-w-full mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">S.no</th>
              <th className="border px-4 py-2">Size</th>
              <th className="border px-4 py-2">Size in value</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* {sizes.map((element, index) => ( */}
              <tr key={1} className="border">
                <td className="border px-4 py-2">{1}</td>
                
                <td className="border px-4 py-2">
                  <input
                    id="size"
                    name="size"
                    placeholder="Size in letter"
                    autoComplete="size"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </td>
                <td className="border px-4 py-2"> 
                  <input
                    type="number"
                    id="value"
                    name="value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoComplete="value"
                    placeholder="Enter Value"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </td>
                <td className="px-4 py-2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleAddSize()}
                    className="w-fit text-cyan-500"
                  >
                    <img src={addIcon} alt="Delete" className='h-6 w-6' />
                  </button>
                  {/* {index ? ( */}
                    {/* <button className="text-red-600" onClick={() => removeFormFields(index)}>
                     <img src={deleteIconRed} alt="Delete" className='h-6 w-6' />
                    </button> */}
                  {/* ) : null} */}
                </td> 
              </tr> 
              
            {/* ))} */}
          </tbody> 
    
        </table>

{/* <div className='align-center'> */}
                <button
                className="bg-sky-600 w-64 py-3 text-white rounded-md font-bold text-lg mt-8 flex justify-center items-center"
                 onClick={(e)=>{handleSubmit(e)}}
                >
                  Update
                </button>
                  {/* </div> */}
        
      </div>
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