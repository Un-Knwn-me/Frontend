import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import { toPng } from 'html-to-image';
import closeIcon from "../../../assets/close-modal-icon.svg";

const QRCodeOut = ({ show, stockId, close, qrData }) => {
  const qrRef = useRef();
  const [totalOuterPcs, setTotalOuterPcs] = useState(0);

  useEffect(() => {
    if (qrData && qrData.stock_by_size) {
      const total = qrData.stock_by_size.reduce((total, item) => total + item.outerPcs, 0);
      setTotalOuterPcs(total);
    }
  }, [qrData]);

  const downloadQRCode = () => {
    if (qrRef.current === null) {
      return;
    }

    toPng(qrRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `qr-code-${stockId}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Could not generate image', err);
      });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="fixed inset-0 bg-black opacity-50" onClick={close}></div>
    <div className="relative py-5 overflow-auto bg-white rounded-lg shadow-lg w-fit h-fit">
        <div className="relative flex items-center justify-between px-20 mb-4">
          <div className="flex justify-center gap-2">
            <h2 className="text-xl font-medium">QR code</h2>
          </div>
          {/* <p className="text-2xl font-medium">Date:</p> */}
          <button className="absolute text-black right-5" onClick={close}>
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
        <div ref={qrRef} className="flex flex-col items-center pb-5 -mt-3 bg-white">
          <QRCode value={stockId.toString()} size={256} level={"H"} includeMargin={true} />
          <p className="text-lg font-medium">Style Number: {qrData.product_style_number}</p>
          <p className="text-lg font-medium">Reference Number: {qrData.Product.Reference.reference_no}</p>
          <p className="text-lg font-medium">No of Inner Boxes: {totalOuterPcs}</p>
          <p className="text-lg font-medium">No Pcs: {qrData.total_pcs}</p>
        </div>
      <div className="flex justify-center">
        <button onClick={downloadQRCode} className="px-5 py-2 text-white bg-blue-500 rounded">Download QR Code</button>
      </div>
      </div>
    </div>
  );
};

export default QRCodeOut;