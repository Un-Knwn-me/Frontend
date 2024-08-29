import React, { useState, useEffect, useRef } from 'react';
import dropdownIcon from '../../assets/dropdown-icon.svg';
import apiService from '../../apiService';
import leftArrowIcon from '../../assets/left-arrow-icon.svg';
import rightArrowIcon from '../../assets/right-arrow-icon.svg';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const tableRef = useRef();  // Reference for capturing the table

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
        console.log('API Response:', response.data);
        // const formattedData = response.data.map(product => ({
        //   ...product,
        //   Stocks: product.Stocks.map(stock => ({
        //     ...stock,
        //     stockInDate: new Date(stock.created_at).toLocaleDateString('en-GB'),
        //   })),
        // }));
        setReportData(response.data);
        console.log('format: ', response.data);
      } else {
        console.error('No endpoint defined for preset:', preset);
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

  const handlePresetChange = (value) => {
    setSelectedPreset(value);
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
    setCurrentPage(1);
  };

  const generateSpreadsheet = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    const worksheetData = [];

    // Define headers
    const headers = [
        'SL No',
        'Images',
        'Style No',
        'Brand',
        'Category',
        'Color',
        'Decoration',
        'Fabric',
        'Fabric Finish',
        'Gsm',
        'Knit Type',
        'Length',
        'Neck',
        'Packing Method',
        'Print & Embeded',
        'Type',
        'Sleeve',
        'Stitch Detail',
        'Short Description',
        'Full Description',
        'Stock Info',
        'Stock-In Date',
        'Total Pcs'
    ];

    // Push headers to worksheet data
    worksheetData.push(headers);

    // Iterate over products and add data
    reportData.forEach((product, index) => {
        product.Stocks.forEach((stock) => {
            const rowData = [
                index + 1,
                product.product.images[0] || '',
                product.product_style_number || '',
                product.Brand.brandName || '',
                product.Category.categoryName || '',
                product.Color.colorName || '',
                product.Decoration.decorationName || '',
                product.Fabric.fabricName || '',
                product.FabricFinish.fabricFinishName || '',
                product.Gsm.gsmValue || '',
                product.KnitType.knitType || '',
                product.Length.lengthType || '',
                product.Neck.neckType || '',
                product.PackingMethod.packingType || '',
                product.PrintEmbName.printType || '',
                product.ProductType.product || '',
                product.Sleeve.sleeveName || '',
                product.StitchDetail.stictchDetail || '',
                product.short_description || '',
                product.full_description || '',
                stock.total_pcs || '',
                stock.stockInDate || '',
            ];

            worksheetData.push(rowData);
        });
    });

    // Create a worksheet from the data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedPreset || 'report');

    // Generate and save the file
    const fileName = `report_${(selectedPreset || 'report').replace(/\s+/g, '_').toLowerCase()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const generatePDF = () => {
    html2canvas(tableRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`report_${(selectedPreset || 'report').replace(/\s+/g, '_').toLowerCase()}.pdf`);
    });
  };

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const data = reportData.flatMap((brandEntry, brandIndex) => 
    brandEntry.stocks.map((stock, stockIndex) => ({
      index: startIndex + brandIndex + stockIndex + 1,
      brand: stock.product.Brand.brandName,
      style_no: stock.product.style_no,
      product: stock.product,
      stockInfo: stock,
    }))
  ).slice(startIndex, endIndex);  

  console.log('data: ', reportData);

  return (
    <div className="w-full py-2 bg-white rounded-lg">
      <div className="relative w-40">
        <span className="mb-1 ml-4 text-xs font-medium">Select Report Type</span>
        <div
          className="relative flex items-center px-4 py-2 mt-2 ml-5 bg-gray-200 rounded-lg cursor-pointer min-w-48"
          onClick={toggleDropdown}
        >
          <span className="flex items-center hover:underline" title={getCategoryText()}>
            {getCategoryText()}
          </span>
          <img src={dropdownIcon} alt="Dropdown Icon" className="absolute w-4 h-4 ml-2 right-4" />
        </div>
        {isDropdownOpen && (
          <ul className="absolute w-full py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            {presets.map((preset) => (
              <li
                key={preset.id}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => handlePresetChange(preset.value)}
              >
                {preset.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {data.length > 0 && (
        <>
          <div className="flex justify-center mt-4">
            <button
              className="px-3 py-1 mx-2 text-sm text-white bg-green-500 rounded hover:bg-green-600"
              onClick={generateSpreadsheet}
            >
              Export to Excel
            </button>
            <button
              className="px-3 py-1 mx-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              onClick={generatePDF}
            >
              Export to PDF
            </button>
          </div>
          <div className="relative mt-4 overflow-y-auto overflow-h-auto">
            <table className="w-full text-sm text-center text-gray-500" ref={tableRef}>
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">SL No</th>
                  <th scope="col" className="px-6 py-3">Images</th>
                  <th scope="col" className="px-6 py-3">Style No</th>
                  <th scope="col" className="px-6 py-3">Brand</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Color</th>
                  <th scope="col" className="px-6 py-3">Decoration</th>
                  <th scope="col" className="px-6 py-3">Fabric</th>
                  <th scope="col" className="px-6 py-3">Fabric Finish</th>
                  <th scope="col" className="px-6 py-3">Gsm</th>
                  <th scope="col" className="px-6 py-3">Knit Type</th>
                  <th scope="col" className="px-6 py-3">Length</th>
                  <th scope="col" className="px-6 py-3">Neck</th>
                  <th scope="col" className="px-6 py-3">Packing Method</th>
                  <th scope="col" className="px-6 py-3">Print & Embeded</th>
                  <th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Sleeve</th>
                  <th scope="col" className="px-6 py-3">Stitch Detail</th>
                  <th scope="col" className="px-6 py-3">Short Description</th>
                  <th scope="col" className="px-6 py-3">Full Description</th>
                  <th scope="col" className="px-6 py-3">Total Pcs</th>
                  <th scope="col" className="px-6 py-3">Stock-In Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.stockInfo.id} className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.index}</td>
                    <td className="px-6 py-4"><img src={item.product.images[0]} alt="Product" className="w-10 h-10" /></td>
                    <td className="px-6 py-4">{item.style_no}</td>
                    <td className="px-6 py-4">{item.brand}</td>
                    <td className="px-6 py-4">{item.product.Category.categoryName}</td>
                    <td className="px-6 py-4">{item.product.Color.colorName}</td>
                    <td className="px-6 py-4">{item.product.Decoration.decorationName}</td>
                    <td className="px-6 py-4">{item.product.Fabric.fabricName}</td>
                    <td className="px-6 py-4">{item.product.FabricFinish.fabricFinishName}</td>
                    <td className="px-6 py-4">{item.product.Gsm.gsmValue}</td>
                    <td className="px-6 py-4">{item.product.KnitType.knitType}</td>
                    <td className="px-6 py-4">{item.product.Length.lengthType}</td>
                    <td className="px-6 py-4">{item.product.Neck.neckType}</td>
                    <td className="px-6 py-4">{item.product.PackingMethod.packingType}</td>
                    <td className="px-6 py-4">{item.product.PrintEmbName.printType}</td>
                    <td className="px-6 py-4">{item.product.ProductType.product}</td>
                    <td className="px-6 py-4">{item.product.Sleeve.sleeveName}</td>
                    <td className="px-6 py-4">{item.product.StitchDetail.stictchDetail}</td>
                    <td className="px-6 py-4">{item.product.short_description}</td>
                    <td className="px-6 py-4">{item.product.full_description}</td>
                    <td className="px-6 py-4">{item.stockInfo.total_pcs}</td>
                    <td className="px-6 py-4">{new Date(item.stockInfo.created_at).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4">
            <button
              className="px-3 py-1 text-sm text-black rounded hover:bg-blue-600"
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
            >
              <img src={leftArrowIcon} alt="Previous" />
            </button>
            <span>Page {currentPage} of {Math.ceil(reportData.length / recordsPerPage)}</span>
            <button
              className="px-3 py-1 text-sm text-black rounded hover:bg-blue-600"
              onClick={() => handlePageChange('next')}
              disabled={currentPage === Math.ceil(reportData.length / recordsPerPage)}
            >
              <img src={rightArrowIcon} alt="Next" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;