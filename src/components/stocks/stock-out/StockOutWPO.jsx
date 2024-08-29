import React, { useEffect, useState } from 'react'
import closeIcon from "../../../assets/close-modal-icon.svg";
import apiService from '../../../apiService';

const StockOutWPO = ({ show, onClose, fetchStockOut }) => {
  const [buyer, setBuyer] = useState("");
  const [buyerLocation, setBuyerLocation] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString());
  const [styleNumber, setStyleNumber] = useState("");
  const [styleDropdown, setStyleDropdown] = useState(false);
  const [styleSuggestions, setStyleSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productInfo, setProductInfo] = useState({});
  const [orderInfo, setOrderInfo] = useState(null);
  const [productInnerTotals, setProductInnerTotals] = useState(null);
  const [productOuterTotals, setProductOuterTotals] = useState(null);
  const [assortmentType, setAssortmentType] = useState("assorted");
  const [innerPcs, setInnerPcs] = useState({});
  const [outerPcs, setOuterPcs] = useState({});
  const [stockOutBundle, setStockOutBundle] = useState(null);
  const [totalInnerPcs, setTotalInnerPcs] = useState(0);
  const [totalOuterPcs, setTotalOuterPcs] = useState(0);
  const [totalInnerPcsPerBundle, setTotalInnerPcsPerBundle] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPcs, setTotalPcs] = useState(null);
  const [notes, setNotes] = useState("");

  const [ReferenceNo, setReferenceNo] = useState("");
  const [category, setCategory] = useState("");
  const [productType, setProductType] = useState("");
  const [brand, setBrand] = useState("");
  const [fabric, setFabric] = useState("");
  const [fabricFinish, setFabricFinish] = useState("");
  const [gsm, setGsm] = useState(null);
  const [knitType, setKnitType] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState([]);
  const [decoration, setDecoration] = useState("");
  const [printOrEmb, setPrintOrEmb] = useState("");
  const [stitch, setStitch] = useState("");
  const [neck, setNeck] = useState("");
  const [sleeve, setSleeve] = useState("");
  const [length, setLength] = useState("");
  const [measurementChart, setMeasurementChart] = useState("");
  const [selectedMeasurementImage, setSelectedMeasurementImage] = useState(null);
  const [packingMethod, setPackingMethod] = useState("");
  const [packingInfo, setPackingInfo] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [images, setImages] = useState("");

   // Suggestion buyer states
 const [buyerDropdown, setBuyerDropdown] = useState(false);
 const [buyerSuggestions, setBuyerSuggestions] = useState([]);
 const [selectedBuyerId, setSelectedBuyerId] = useState(null);

  // fetch styleNo
  const fetchStyleSuggestions = async (styleInput) => {
    try {
        if (styleInput.length > 0) {
        const response = await apiService.get(`/stocks/stockIn/all`);
        const filteredProduct = response.data.filter((e) =>
            e.product_style_number.toLowerCase().startsWith(styleInput.toLowerCase())
          );
          console.log(response.data);
          setStyleSuggestions(filteredProduct);
        } else {
          setStyleSuggestions([]);
        }
    } catch (error) {
      console.error("Error fetching Product:", error);
    }
  };

  const handleStyleChange = (e) => {
    const styleInput = e.target.value;
    if (styleInput.length > 0) {
    setStyleNumber(styleInput);
    setStyleDropdown(true);
    fetchStyleSuggestions(styleInput);
    } else {
      setStyleNumber("");
      setStyleDropdown(false);
      setProductInfo(null)
      setSelectedProduct(null);
      setReferenceNo("");
      setCategory("");
      setProductType("");
      setBrand("");
      setFabric("");
      setFabricFinish("");
      setGsm("");
      setKnitType("");
      setColors("");
      setSizes([]);
      setDecoration("");
      setPrintOrEmb("");
      setStitch("");
      setLength("");
      setNeck("");
      setSleeve("");
      setMeasurementChart("");
      setSelectedMeasurementImage("");
      setPackingMethod("");
      setWarehouse("");
      setShortDescription("");
      setFullDescription("");
      setImages("");
    }
  };

  const handleStyleSelect = async(e) => {
    console.log("handleStyleSelect: ", e);
    setStyleNumber(e.Product.style_no);
    setSelectedProduct(e);
    setSelectedProductId(e.id);
    setStyleSuggestions([]);
    setStyleDropdown(false);
    setProductInfo(e)
    setImages(e.Product.images[0]);
    setReferenceNo(e.Product.Reference.reference_no);
    setCategory(e.Product.Category.categoryName);
    setProductType(e.Product.ProductType.product);
    setBrand(e.Product.Brand.brandName);
    setFabric(e.Product.Fabric.fabricName);
    setFabricFinish(e.Product.FabricFinish.fabricFinishName);
    setGsm(e.Product.Gsm.gsmValue);
    setKnitType(e.Product.KnitType.knitType);
    setColors(e.Product.Color.colorName);
    setDecoration(e.Product.Decoration.decorationName);
    setPrintOrEmb(e.Product.PrintEmbName.printType);
    setStitch(e.Product.StitchDetail.stictchDetail);
    setNeck(e.Product.Neck.neckType);
    setLength(e.Product.Length.lengthType);
    setSleeve(e.Product.Sleeve.sleeveName);
    setPackingMethod(e.Product.PackingMethod.packingType);
    setMeasurementChart(e.Product.MeasurementChart.name);
    setSelectedMeasurementImage(e.Product.MeasurementChart.sample_size_file);
    setShortDescription(e.Product.short_description);
    setFullDescription(e.Product.full_description);
    setSizes(e.Product.Size.sizes);
    setPackingInfo(e.packing_type)
    setWarehouse(e.Warehouse.warehouse);
    const totalStockInnerPcs = await calculateTotalInnerPcs(e.stock_by_size);
    setProductInnerTotals(totalStockInnerPcs);
    const totalStockOuterPcs = await calculateTotalOuterPcs(e.stock_by_size);
    setProductOuterTotals(totalStockOuterPcs);
  };

  const handleAddNewStyleNo = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new style no:", styleNumber);
    // Close the dropdown after adding the buyer
    setStyleDropdown(false);
  };  

 // Fetch buyer suggestions
 const fetchBuyerSuggestions = async (buyerInput) => {
   try {
     if (buyerInput.length > 0) {
       const response = await apiService.get("/buyers/getall");
       const filteredBuyers = response.data.filter((b) =>
         b.name.toLowerCase().startsWith(buyerInput.toLowerCase())
       );
       console.log(filteredBuyers);
       setBuyerSuggestions(filteredBuyers);
     } else {
       setBuyerSuggestions([]);
     }
   } catch (error) {
     console.error("Error fetching buyers:", error);
   }
 };

 const handleBuyerChange = (e) => {
   const buyerInput = e.target.value;
   setBuyer(buyerInput);
   setBuyerDropdown(true);
   fetchBuyerSuggestions(buyerInput);
   if (buyerInput === "") {
     setBuyerLocation("");
     setSelectedBuyerId(null);
   }
 };

 const handleBuyerSelect = (buyer) => {
   setBuyer(buyer.name);
   setBuyerLocation(buyer.location);
   setSelectedBuyerId(buyer.id);
   setBuyerSuggestions([]);
   setBuyerDropdown(false);
 };

 const handleAddNewBuyer = () => {
   // Implement the logic to add a new buyer here
   console.log("Adding new buyer:", buyer);
   // Close the dropdown after adding the buyer
   setBuyerDropdown(false);
 };

//  handle date
const handleDeliveryDateChange = (e) => {
    const inputDate = e.target.value;
    setDeliveryDate(new Date(inputDate).toISOString());
};

  const handleBundleChange = async (e) => {
    try {
      const bundleQty = e.target.value;
      setStockOutBundle(bundleQty);

      const totalInnerPerBundle = productInfo.stock_by_size.reduce((sum, size) => {
        return sum + (size.inner * size.outer);
    }, 0);

    setTotalInnerPcsPerBundle(totalInnerPerBundle);

      const totalPcs = productInfo?.stock_by_size.reduce((sum, item) => {
        return sum + (item.innerPcs * item.outerPcs * bundleQty);
      }, 0);
      
      setTotalProducts(totalPcs);
    } catch (error) {
      console.error("Error handling bundle change:", error);
    }
  };

  const calculateTotalInnerPcs = (data) => {
    return data.reduce((total, item) => total + item.innerPcs, 0);
  };
  
  const calculateTotalOuterPcs = (data) => {
    return data.reduce((total, item) => total + item.outerPcs, 0);
  };
  
  const handleSubmit = async () => {
    try {
      const stockData = {
        order_type: "Without Purchase Order",
        buyer_id: selectedBuyerId,
        delivery_date: deliveryDate,
        product_style_number: productInfo.product_style_number,
        product_id: productInfo.Product.id,
        notes,
        packing_type: packingInfo,
        purchase_by_size: productInfo.stock_by_size,
        req_bundle: stockOutBundle,
        req_purchase_qty: totalProducts,
      }

      console.log('Stock out: ', stockData);

      const response = await apiService.post("/stockOut/createWPO/stockout", stockData);

      if (response.status === 201) {
      console.log("Stock created:", response.data);
      fetchStockOut();
      onClose();
      } 

    } catch (error) {
      
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[80vw] h-screen max-h-[90vh] overflow-auto">
        <div className="px-10 py-5">
          <div className="flex justify-center">
            <h2 className="text-xl font-bold">Create WPO Stock Out</h2>
            <button
              className="absolute cursor-pointer right-5"
              onClick={onClose}
            >
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
          <hr className="my-2" />
          <div className="px-10">

          <div className="relative flex items-center justify-between gap-4 my-6">

            <div className="">
            <div className="grid grid-cols-2 gap-4">
            
            <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="buyer">
                  Buyer Name:
                </label>
                <input
                  type="text"
                  id="buyer"
                  value={buyer}
                  onChange={handleBuyerChange}
                  className="px-2 py-2 border border-gray-300 rounded-md hover:border-cyan-300 active:boder-cyan-300 focus:border-cyan-300"
                  placeholder="Enter Buyer Name"
                />
                {buyerDropdown && buyer && (
                  <ul className="absolute left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg top-full">
                    {buyerSuggestions.length > 0 ? (
                      buyerSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleBuyerSelect(suggestion)}
                        >
                          {suggestion.name}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 text-sm text-blue-600 cursor-pointer hover:bg-gray-200"
                        onClick={handleAddNewBuyer}
                      >
                        Add New Buyer: "{buyer}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="location">
                  Buyer Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={buyerLocation}
                  className="px-2 py-2 border border-gray-300 rounded-md hover:border-cyan-300 active:boder-cyan-300 focus:border-cyan-300"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="deliveryDate">
                  Delivery date:
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  value={deliveryDate.split("T")[0]}
                  onChange={handleDeliveryDateChange}
                  className="px-2 py-2 border border-gray-300 rounded-md hover:border-cyan-300 active:boder-cyan-300 focus:border-cyan-300"
                  placeholder="Enter delivery date"
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="styleNo">
                  Style No:
                </label>
                <input
                  type="text"
                  id="styleNo"
                  value={styleNumber}
                  onChange={handleStyleChange}
                  className="px-2 py-2 border border-gray-300 rounded-md hover:border-cyan-300 active:boder-cyan-300 focus:border-cyan-300"
                  placeholder="Enter Style number"
                />
                {styleDropdown && styleNumber && (
                  <ul className="absolute left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg top-full">
                    {styleSuggestions.length > 0 ? (
                      styleSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleStyleSelect(suggestion)}
                        >
                          {suggestion.Product.style_no}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 text-sm text-blue-600 cursor-pointer hover:bg-gray-200"
                        onClick={handleAddNewStyleNo}
                      >
                        Add New Style: "{styleNumber}"
                      </li>
                    )}
                  </ul>
                )}
              </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-10'>
            <div className="">
              <h3 className="my-2 text-lg font-medium">Product Image:</h3>
            <div className="flex items-center justify-center border border-gray-400 max-w-48">
              <img
                src={images || 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1722163869~exp=1722167469~hmac=37361beb0ca1a1c652d36c9ca94818f793a54d21822edab80e80c6e43a9b7b37&w=740'}
                alt='Product'
                className="object-cover h-40 rounded"
              />
          </div>
          </div>
          <div className="">
              <h3 className="my-2 text-lg font-medium">Measurement Chart:</h3>
            <div className="flex items-center justify-center border border-gray-400 max-w-48">
              <img
                src={selectedMeasurementImage || 'https://img.freepik.com/premium-vector/fashion-designer-flat-design-illustration_169137-4015.jpg?w=1380'}
                alt='Product'
                className="object-cover h-40 rounded"
              />
          </div>
          </div>
            </div>

            </div>

            <div className="flex items-center gap-2 mt-6">
                <h3 className="text-lg font-medium">PRODUCT INFO:</h3>
              </div>
            <div className="grid grid-cols-2 gap-4 mt-5 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">

            <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="reference">
                  Reference No:
                </label>
                <input
                  type="text"
                  id="reference"
                  value={ReferenceNo || ""}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="Category">
                  Category:
                </label>
                <input
                  type="text"
                  id="Category"
                  value={category || ""}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="productType">
                  Product Type:
                </label>
                <input
                  type="text"
                  id="productType"
                  value={productType || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="brand">
                  Brand:
                </label>
                <input
                  type="text"
                  id="brand"
                  value={brand || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="color">
                  Color:
                </label>
                <input
                  type="text"
                  id="color"
                  value={colors || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="decoration">
                  Decoration:
                </label>
                <input
                  type="text"
                  id="decoration"
                  value={decoration || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="fabric">
                  Fabric:
                </label>
                <input
                  type="text"
                  id="fabric"
                  value={fabric || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="fabric fabric">
                  Fabric Fabric:
                </label>
                <input
                  type="text"
                  id="fabric fabric"
                  value={fabricFinish || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="gsm">
                  GSM:
                </label>
                <input
                  type="text"
                  id="gsm"
                  value={gsm || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="knitType">
                  Knit Type:
                </label>
                <input
                  type="text"
                  id="knitType"
                  value={knitType || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="length">
                  Length:
                </label>
                <input
                  type="text"
                  id="length"
                  value={length || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="neck">
                  Neck:
                </label>
                <input
                  type="text"
                  id="neck"
                  value={neck || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="packingMethod">
                  Packing Method:
                </label>
                <input
                  type="text"
                  id="packingMethod"
                  value={packingMethod || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="print">
                  Print or Embroidery:
                </label>
                <input
                  type="text"
                  id="print"
                  value={printOrEmb || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="size">
                  Size:
                </label>
                <input
                  type="text"
                  id="size"
                  value={sizes || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="sleeve">
                  Sleeve:
                </label>
                <input
                  type="text"
                  id="sleeve"
                  value={sleeve || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="stitchDetails">
                  Stitch Details:
                </label>
                <input
                  type="text"
                  id="stitchDetails"
                  value={stitch || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="measurementChart">
                  Measurement Chart:
                </label>
                <input
                  type="text"
                  id="measurementChart"
                  value={measurementChart || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="packing">
                  Packing Information:
                </label>
                <input
                  type="text"
                  id="packing"
                  value={packingInfo || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
            </div>

            <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="packing">
                  Warehouse:
                </label>
                <input
                  type="text"
                  id="packing"
                  value={warehouse || ''}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-3">
              <label className="font-semibold" htmlFor="shortDescription">
                Short Description:
              </label>
              <textarea
                id="shortDescription"
                value={shortDescription}
                className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                rows="1"
                disabled
              />
            </div>

            <div className="flex flex-col gap-2 mt-3">
              <label className="font-semibold" htmlFor="fullDescription">
                Full Description:
              </label>
              <textarea
                id="fullDescription"
                value={fullDescription}
                className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                rows="2"
                disabled
              />
            </div>
            
            <div className="flex flex-col gap-2 mt-3">
              <label className="font-semibold" htmlFor="notes">
                Notes:
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="px-2 py-2 border border-gray-300 rounded-md hover:border-cyan-300 active:boder-cyan-300 focus:border-cyan-300"
                placeholder="Enter additional notes"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Available Quantities:</h3>
              {productInfo?.stock_by_size ? (
                <>
                  <div className=''>
                    <table className="min-w-full mt-6 bg-white border border-gray-300 rounded-md">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 border-b">Size</th>
                          <th className="px-4 py-2 border-b">Inner Pieces</th>
                          <th className="px-4 py-2 border-b">Outer Pieces</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productInfo.stock_by_size.map((stock, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 border-b">{stock.size}</td>
                            <td className="px-4 py-2 border-b">{stock.innerPcs}</td>
                            <td className="px-4 py-2 border-b">{stock.outerPcs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="my-4">
              <h3 className="text-lg font-bold">Stock Totals</h3>
              <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="p-2 border rounded-lg">
                  <h4 className="font-semibold">Total Bundles:</h4>
                  <p>{productInfo?.no_bundles}</p>
                </div>
                <div className="p-2 border rounded-lg">
                  <h4 className="font-semibold">Total Inner Pcs:</h4>
                  <p>{productInnerTotals}</p>
                </div>
                <div className="p-2 border rounded-lg">
                  <h4 className="font-semibold">Total Outer:</h4>
                  <p>{productOuterTotals}</p>
                </div>
                <div className="p-2 border rounded-lg">
                  <h4 className="font-semibold">Total Pieces:</h4>
                  <p>{productInfo?.total_pcs}</p>
                </div>
              </div>
            </div>
                </>
              ) : (
                <p className="text-gray-500">No stock information available.</p>
              )}
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold">Order Quantities:</h3>
              <div className="flex flex-col items-center justify-center my-10 ">
            <label className="mb-2 font-semibold" htmlFor="StockOutBundle">
              Enter Stock Out Bundle:
            </label>
            <input
              className="w-40 px-2 py-2 border border-gray-300 rounded-md hover:border-cyan-300 active:boder-cyan-300 focus:border-cyan-300 "
              type="number"
              value={stockOutBundle}
              onChange={handleBundleChange}
              placeholder="Enter Bundle Value"
            />
          </div>

          <div className="flex items-center justify-center my-8" >
              <div className="flex flex-col gap-4 p-5 bg-gray-100 w-fit">
                {/* <div className="flex justify-between gap-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Pcs per Bundle
                  </label>
                  <span>{totalInnerPcsPerBundle}</span>
                </div> */}
                <div className="flex justify-between gap-5">
                  <label className="block font-bold text-gray-700 text-md">
                    Total Pcs
                  </label>
                  <span className='text-lg font-bold'>{totalProducts}</span>
                </div>
              </div>
            </div>
            </div>
          </div>
          </div>          

          <div className="flex justify-center px-20 mt-5">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Approve Stock Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockOutWPO