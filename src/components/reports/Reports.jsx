import React, { useState, useEffect } from 'react';
import dropdownIcon from '../../assets/dropdown-icon.svg';
import apiService from '../../apiService'; 

const Reports = () => {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Add your other state variables and functions here 
  

  const presets = [
    { id: 'pr1', value: 'Overall Stocks', label: 'Overall Stocks' },
    { id: 'pr2', value: 'Agewise Stocks', label: 'Agewise Stocks' },
    { id: 'pr3', value: 'Printwise', label: 'Printwise' },
    { id: 'pr4', value: 'Stylewise', label: 'Stylewise' },
    { id: 'pr5', value: 'Categorywise', label: 'Categorywise' },
    { id: 'pr6', value: 'Brandwise', label: 'Brandwise' },
    { id: 'pr7', value: 'SizeWise', label: 'SizeWise' }
  ];

  useEffect(() => {
    // Fetch initial report data or handle as needed
  }, []);

  // const handlePresetChange = (event) => {
  //   setSelectedPreset(event.target.value);
  //   setIsDropdownOpen(false);
  // };

  const handlePresetChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedPreset(selectedValue);
    setIsDropdownOpen(false);

    try {
      setIsLoading(true);
      let response;
      if (selectedValue === 'Overall Stocks') {
        response = await apiService.get('/reports/overallStock');
      } else if (selectedValue === 'Agewise Stocks') {
        // Example of another API call, adjust as per your API endpoint
        response = await apiService.get('/reports/stockByDate');
      }
      
      setReportData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      // Handle error state as needed
      setIsLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const getCategoryText = () => {
    if (!selectedPreset) {
      return 'Select Category';
    }
    const selectedCategory = presets.find((preset) => preset.value === selectedPreset);
    return selectedCategory ? selectedCategory.label : 'Select Category';
  };

  return (
    <div className='bg-white w-full rounded-lg py-2'>
      <div className="relative w-40">
        <span className="text-xs font-medium ml-4 mb-1">Select Report Type</span>
        <div
          className="flex items-center cursor-pointer px-4 py-2 rounded-lg relative min-w-48 bg-gray-200 ml-5"
          onClick={toggleDropdown}
        >
          <span className="hover:underline flex items-center" title={getCategoryText()}>
            {getCategoryText()}
          </span>
          <img src={dropdownIcon} alt="Dropdown Icon" className="ml-2 w-4 h-4 absolute right-2" />
        </div>
        {isDropdownOpen && (
          <ul className="list-none absolute bg-white shadow-lg rounded-md mt-2 py-2 z-10 max-h-[75vh] overflow-y-auto border-2 border-gray-300">
            {presets.map((preset) => (
              <li className="p-2 whitespace-nowrap w-60 hover:bg-gray-200 cursor-pointer" key={preset.id}>
                <label className="flex items-center justify-between space-x-2 w-full">
                  <span>{preset.label}</span>
                  <input
                    type="radio"
                    className="rb hidden"
                    id={preset.id}
                    name="preset"
                    value={preset.value}
                    checked={selectedPreset === preset.value}
                    onChange={handlePresetChange}
                  />
                  <span className="custom-radio"></span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isLoading && <p>Loading...</p>}

      {reportData && (
        <div className="mt-4">
          {/* Display report data here based on selectedPreset */}
          {/* Example: Displaying overall stocks data */}
          {selectedPreset === 'Overall Stocks' && (
            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="text-lg font-semibold">Overall Stocks Report</h3>
              {/* Render report data here */}
              <pre>{JSON.stringify(reportData, null, 2)}</pre>
            </div>
          )}
           {/* Example for other report types */}
          {/* {selectedPreset === 'Agewise Stocks' && (
            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="text-lg font-semibold">Agewise Stocks Report</h3>
              Render agewise stocks data here
            </div>
          )} */}
        </div>
      )}

    </div>
  );
};

export default Reports;
