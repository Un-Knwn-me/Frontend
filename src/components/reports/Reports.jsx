import React, { useState, useEffect } from 'react';
import dropdownIcon from '../../assets/dropdown-icon.svg';
import apiService from '../../apiService';
import leftArrowIcon from '../../assets/left-arrow-icon.svg';
import rightArrowIcon from '../../assets/right-arrow-icon.svg';
import { PDFDocument, rgb } from 'pdf-lib';

const Reports = () => {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const presets = [
    { id: 'pr1', value: 'Overall Stocks', label: 'Overall Stocks' },
    { id: 'pr2', value: 'Agewise Stocks', label: 'Agewise Stocks' },
    { id: 'pr3', value: 'Print wise', label: 'Print wise' },
    { id: 'pr4', value: 'Style wise', label: 'Style wise' },
    { id: 'pr5', value: 'Category wise', label: 'Category wise' },
    { id: 'pr6', value: 'Brand wise', label: 'Brand wise' },
    { id: 'pr7', value: 'Size wise', label: 'Size wise' }
  ];

  const fetchReportData = async (preset) => {
    try {
      setIsLoading(true);
      let endpoint = '';

      switch (preset) {
        case 'Overall Stocks':
          endpoint = '/reports/overallStock';
          break;
        case 'Agewise Stocks':
          endpoint = '/reports/agewise-stocks';
          break;
        case 'Print wise':
          endpoint = '/reports/print-wise-stocks';
          break;
        case 'Style wise':
          endpoint = '/reports/style-number-wise-stocks';
          break;
        case 'Category wise':
          endpoint = '/reports/category-wise-stocks';
          break;
        case 'Brand wise':
          endpoint = '/reports/brand-wise-stocks';
          break;
        case 'Size wise':
          endpoint = '/reports/size-wise-stocks';
          break;
        default:
          endpoint = '';
          break;
      }

      if (endpoint) {
        const response = await apiService.get(endpoint);
        setReportData(response.data);
        console.log(response.data);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPreset) {
      fetchReportData(selectedPreset);
    }
  }, [selectedPreset]);

  const handlePresetChange = (event) => {
    setSelectedPreset(event.target.value);
    setIsDropdownOpen(false);
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

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < Math.ceil(reportData.length / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on changing records per page
  };
  
  const generatePDF = async (category) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
  
    const marginTop = 50;
    const lineHeight = 20;
    let currentYPosition = height - marginTop;
  
    // Draw the report title and category
    page.drawText(`Report: ${selectedPreset}`, { x: 50, y: currentYPosition, size: 20, color: rgb(0, 0, 0) });
    currentYPosition -= lineHeight;
  
    page.drawText(`Category: ${category.categoryName || 'N/A'}`, { x: 50, y: currentYPosition - 10, size: 18, color: rgb(0, 0, 0) });
    currentYPosition -= lineHeight;
  
    // Draw a line between header and product details
    page.drawLine({
      start: { x: 50, y: currentYPosition },
      end: { x: width - 50, y: currentYPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    currentYPosition -= lineHeight;
  
    // Iterate over the products in the category and add them to the PDF
    category.Products.forEach((product, index) => {
      if (currentYPosition <= marginTop) {
        // If the content goes beyond the page, add a new page
        page = pdfDoc.addPage();
        currentYPosition = height - marginTop;
      }  
      // Draw the product details
      page.drawText(`${index + 1}. Style No: ${product.style_no}`, { x: 50, y: currentYPosition - 15, size: 15, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      // page.drawImage(`Product: ${product.images[0]}`, { x: 150, y: currentYPosition - 15, size: 15, color: rgb(0, 0, 0) });
      // currentYPosition -= lineHeight;
  
      page.drawText(`Brand: ${product.Brand.brandName}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Category: ${product.Category.categoryName}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;
      
      page.drawText(`Color: ${product.Color.colorName}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Decoration: ${product.Decoration.decorationName}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Fabric: ${product.Fabric.fabricName}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Fabric Finish: ${product.FabricFinish.fabricFinishName}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Gsm: ${product.Gsm.gsmValue}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Knit Type: ${product.KnitType.knitType}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Length: ${product.Length.lengthType}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Neck: ${product.Neck.neckType}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Packing Method: ${product.PackingMethod.packingType}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Print & Embeded: ${product.PrintEmbName.printType}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Type: ${product.ProductType.product}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Sleeve: ${product.Sleeve.sleeveName}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Stitch Detail: ${product.StitchDetail.stictchDetail}`, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Short Description: `, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`${product.short_description}`, { x: 75, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`Full Description: `, { x: 65, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;

      page.drawText(`${product.full_description}`, { x: 75, y: currentYPosition - 15, size: 14, color: rgb(0, 0, 0) });
      currentYPosition -= lineHeight;
    });
  
    const pdfBytes = await pdfDoc.save();
  
    // Create a blob and a URL for it
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
  
    // Open the PDF in a new tab
    window.open(url, '_blank');
  };  

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const data = reportData.slice(startIndex, endIndex);

  return (
    <div className="w-full py-2 bg-white rounded-lg">
      <div className="relative w-40">
        <span className="mb-1 ml-4 text-xs font-medium">Select Report Type</span>
        <div
          className="relative flex items-center px-4 py-2 ml-5 bg-gray-200 rounded-lg cursor-pointer min-w-48"
          onClick={toggleDropdown}
        >
          <span className="flex items-center hover:underline" title={getCategoryText()}>
            {getCategoryText()}
          </span>
          <img src={dropdownIcon} alt="Dropdown Icon" className="absolute w-4 h-4 ml-2 right-2" />
        </div>
        {isDropdownOpen && (
          <ul className="list-none absolute bg-white shadow-lg rounded-md mt-2 py-2 z-10 max-h-[75vh] overflow-y-auto border-2 border-gray-300">
            {presets.map((preset) => (
              <li className="p-2 cursor-pointer whitespace-nowrap w-60 hover:bg-gray-200" key={preset.id}>
                <label className="flex items-center justify-between w-full space-x-2">
                  <span>{preset.label}</span>
                  <input
                    type="radio"
                    className="hidden rb"
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
      
      {selectedPreset && (
        <div className="py-4 mt-5 bg-white">
          <div className="min-h-[60vh] max-h-[60vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="w-full bg-gray-50">
                <tr>
                  <th className="w-12 px-2 py-3 font-bold text-center text-black uppercase text-md">SL No</th>
                  <th className="px-6 py-3 font-bold text-center text-black uppercase text-md w-28">
                    {selectedPreset || 'Category'}
                  </th>
                  <th className="w-20 px-2 py-3 font-bold text-center text-black uppercase text-md">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((category, categoryIndex) =>
                  category.Products.map((product, productIndex) => (
                    <tr key={`${category.id}-${product.id}`} style={{ maxHeight: '50px' }}>
                      <td className="w-12 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                        {startIndex + categoryIndex + 1}
                      </td>
                      <td className="px-2 py-3 text-center text-black whitespace-nowrap text-md w-28">
                        {selectedPreset === 'Category wise' ? category.categoryName : selectedPreset === 'Style wise' ? category.style_no : selectedPreset === 'Print wise' ? category.printType : selectedPreset === 'Brand wise' ? category.brandName : selectedPreset === 'Size wise' ? category.type_name : product.productName}
                      </td>
                      <td className="w-20 px-2 py-3 text-center text-black whitespace-nowrap text-md">
                        <button 
                          onClick={() => generatePDF(category)} 
                          className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mx-5">
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
              <span className="text-black text-md">
                {currentPage}/{Math.ceil(reportData.length / recordsPerPage)}
              </span>
              <button onClick={() => handlePageChange('next')} className="px-2 py-1 rounded-md text-md">
                <img src={rightArrowIcon} alt="Next" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
