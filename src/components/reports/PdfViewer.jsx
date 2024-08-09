import React from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

const PdfViewer = ({ selectedProduct }) => {

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    page.drawText(`Product Details`, { x: 50, y: height - 50, size: 20, color: rgb(0, 0, 0) });
    page.drawText(`Brand: ${selectedProduct.brandName || 'N/A'}`, { x: 50, y: height - 80, size: 15, color: rgb(0, 0, 0) });
    page.drawText(`Color: ${selectedProduct.colorName || 'N/A'}`, { x: 50, y: height - 110, size: 15, color: rgb(0, 0, 0) });
    page.drawText(`Fabric: ${selectedProduct.fabricName || 'N/A'}`, { x: 50, y: height - 140, size: 15, color: rgb(0, 0, 0) });
    page.drawText(`GSM: ${selectedProduct.gsmValue || 'N/A'}`, { x: 50, y: height - 170, size: 15, color: rgb(0, 0, 0) });
    // Add more details as needed

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  };

  return (
    <div>
      <h2>Product Details</h2>
      <p>Brand: {selectedProduct.brandName}</p>
      <p>Color: {selectedProduct.colorName}</p>
      <p>Fabric: {selectedProduct.fabricName}</p>
      <p>GSM: {selectedProduct.gsmValue}</p>
      {/* Render more details as needed */}
      <button onClick={generatePDF} className="px-3 py-1 mt-4 text-sm text-white bg-blue-500 rounded-md">
        Download PDF
      </button>
    </div>
  );
};

export default PdfViewer;
