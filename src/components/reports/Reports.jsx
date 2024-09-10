import React, { useState } from 'react';
import dropdownIcon from '../../assets/dropdown-icon.svg';
import apiService from '../../apiService';
import { Document, Page, pdfjs } from 'react-pdf';
import * as XLSX from 'xlsx';

// Use the correct path for the pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Reports = () => {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);  // PDF URL for rendering on screen
  const [isLoading, setIsLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);  // Track total pages in PDF

  const presets = [
    { id: 'pr1', value: 'Overall Stocks', label: 'Overall Stocks' },
    // { id: 'pr2', value: 'Agewise Stocks', label: 'Agewise Stocks' },
    { id: 'pr3', value: 'Print wise', label: 'Print wise' },
    { id: 'pr4', value: 'Style wise', label: 'Style wise' },
    { id: 'pr5', value: 'Category wise', label: 'Category wise' },
    { id: 'pr6', value: 'Brand wise', label: 'Brand wise' },
    { id: 'pr7', value: 'Size wise', label: 'Size wise' }
  ];

  const fetchPdfReport = async (preset) => {
    try {
      setIsLoading(true);
      let endpoint = '';

      switch (preset) {
        case 'Overall Stocks':
          endpoint = '/reports/stock-report';
          break;
        case 'Brand wise':
          endpoint = '/reports/brand-report';
          break;
        case 'Print wise':
          endpoint = '/reports/print-report';
          break;
        default:
          console.error('Invalid report type selected');
          setIsLoading(false);
          return;
      }

      const response = await apiService.get(endpoint, { responseType: 'blob' });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      setPdfUrl(pdfUrl);  // Set the PDF URL to render
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching PDF report:', error);
      setIsLoading(false);
    }
  };

  const handlePresetChange = (value) => {
    setSelectedPreset(value);
    setIsDropdownOpen(false);
    fetchPdfReport(value);  // Fetch and display the selected report
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

  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `report_${(selectedPreset || 'report').replace(/\s+/g, '_').toLowerCase()}.pdf`;
    link.click();
  };

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

      <div className="flex justify-center mt-4">
        {pdfUrl && (
          <>
            <button
              onClick={downloadPdf}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Download PDF
            </button>

            {/* Render the PDF */}
            <div className="mt-4">
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(error) => console.error('Error loading PDF:', error)}
              >
                <Page pageNumber={1} />
              </Document>
            </div>
          </>
        )}

        {isLoading && <p>Loading PDF...</p>}
      </div>
    </div>
  );
};

export default Reports;