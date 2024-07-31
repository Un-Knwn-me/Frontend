import React, { useEffect, useState } from 'react'
import closeIcon from "../../../assets/close-modal-icon.svg";
import apiService from '../../../apiService';

const AddStockOutModel = ({ show, onClose }) => {
  const [styleNumber, setStyleNumber] = useState("");
  const [styleDropdown, setStyleDropdown] = useState(false);
  const [styleSuggestions, setStyleSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDropdown, setOrderDropdown] = useState(false);
  const [orderSuggestions, setOrderSuggestions] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [checkSame, setCheckSame] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [productInnerTotals, setProductInnerTotals] = useState(null);
  const [productOuterTotals, setProductOuterTotals] = useState(null);
  const [orderInnerTotals, setOrderInnerTotals] = useState(null);
  const [orderOuterTotals, setOrderOuterTotals] = useState(null);
  const [stockOutBundle, setStockOutBundle] = useState(null);

  // fetch styleNo
  const fetchStyleSuggestions = async (styleInput) => {
    try {
      if (styleInput.length > 0) {
        const response = await apiService.get("/stocks/stockIn/all");
        const filteredProduct = response.data.filter((e) =>
          e.product_style_number.toLowerCase().startsWith(styleInput.toLowerCase())
        );
        console.log(filteredProduct);
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
      setSelectedProduct(null);
      setCheckSame(null);
      setProductInfo(null);
      setOrderInfo(null);
    }
  };

  const handleStyleSelect = (e) => {
    setStyleNumber(e.product_style_number);
    setSelectedProduct(e);
    setSelectedProductId(e.id);
    setStyleSuggestions([]);
    setStyleDropdown(false);
    setStyleSuggestions([]);
    setStyleDropdown(false);
    checkIfStyleNumbersMatch(e, selectedOrder);
    console.log(e.Product.style_no)
  };

  const handleAddNewStyleNo = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new style no:", styleNumber);
    // Close the dropdown after adding the buyer
    setStyleDropdown(false);
  };


  // fetch orderNo
  const fetchOrderSuggestions = async (orderInput) => {
    try {
      if (orderInput.length > 0) {
        const response = await apiService.get("/purchases/all");
        const filteredProduct = response.data.filter((e) =>
          e.purchase_order_number.toLowerCase().startsWith(orderInput.toLowerCase())
        );
        const formattedData = filteredProduct.map(order => ({
          ...order,
          delivery_date: new Date(order.delivery_date).toLocaleDateString('en-GB')
        }));
        console.log(formattedData);
        setOrderSuggestions(formattedData);
      } else {
        setOrderSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching Purchase order:", error);
    }
  };

  const handleOrderChange = (e) => {
    const orderInput = e.target.value;
    if (orderInput.length > 0) {
    setOrderNumber(orderInput);
    setOrderDropdown(true);
    fetchOrderSuggestions(orderInput);
    } else {
      setOrderNumber("");
      setOrderDropdown(false);
      setSelectedOrder(null);
      setCheckSame(null);
      setProductInfo(null);
      setOrderInfo(null);
    }
  };

  const handleOrderSelect = (e) => {
    setOrderNumber(e.purchase_order_number);
    setSelectedOrder(e);
    setSelectedOrderId(e.id);
    setOrderSuggestions([]);
    setOrderDropdown(false);
    setOrderSuggestions([]);
    setOrderDropdown(false);
    checkIfStyleNumbersMatch(selectedProduct, e);
    console.log(e.Product.style_no)
  };

  const handleAddNewOrderNo = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new purchase order no:", orderNumber);
    // Close the dropdown after adding the buyer
    setOrderDropdown(false);
  };

  const handleBundleChange = async(e) => {
    try {
      const setBundle = setStockOutBundle(e.target.value);
    } catch (error) {
      
    }
  }

  const calculateTotalInnerPcs = (data) => {
    return data.reduce((total, item) => total + item.innerPcs, 0);
  };
  
  const calculateTotalOuterPcs = (data) => {
    return data.reduce((total, item) => total + item.outerPcs, 0);
  };

  const checkIfStyleNumbersMatch = (product, order) => {
    if (product && order) {
      if (product.Product.style_no === order.Product.style_no) {
        setCheckSame(true);
        setProductInfo(product);
        const totalStockInnerPcs = calculateTotalInnerPcs(product.stock_by_size);
        setProductInnerTotals(totalStockInnerPcs);
        const totalStockOuterPcs = calculateTotalOuterPcs(product.stock_by_size);
        setProductOuterTotals(totalStockOuterPcs);
        setOrderInfo(order);
        const totalOrderInnerPcs = calculateTotalInnerPcs(order.purchase_by_size);
        setOrderInnerTotals(totalOrderInnerPcs);
        const totalOrderOuterPcs = calculateTotalOuterPcs(order.purchase_by_size);
        setOrderOuterTotals(totalOrderOuterPcs);
        console.log('product: ', product);
        console.log('order: ', order);
      } else {
        setCheckSame(false);
      }
    }
  };
  
  const handleSubmit = async () => {
    try {
      const stockData = {
      stock_id: productInfo.id,
      stockOut_by_size: orderInfo.purchase_by_size,
      stockOut_bundle: stockOutBundle,
      total_stockOut_pcs: orderInfo.req_purchase_qty,
      product_style_number: productInfo.product_style_number,
      product_id: productInfo.Product.id,
      purchase_order_number: orderInfo.purchase_order_number,
      purchase_order_id: orderInfo.id,
      }

      console.log('Stock out: ', stockData);

      const response = await apiService.post("/stockOut/create", stockData);

      if (response.status === 200) {
      console.log("Stock created:", response.data);
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
            <h2 className="text-xl font-bold">Create Stock Out</h2>
            <button
              className="absolute right-5 cursor-pointer"
              onClick={onClose}
            >
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
          <hr className="my-2" />
          <div className="px-10">

          <div className="flex justify-between items-center my-6 relative">

            <div className="">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="styleNo">
                  Purchase Order No:
                </label>
                <input
                  type="text"
                  id="purchaseOrderNo"
                  value={orderNumber}
                  onChange={handleOrderChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter PO number"
                />
                {orderDropdown && orderNumber && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {orderSuggestions.length > 0 ? (
                      orderSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleOrderSelect(suggestion)}
                        >
                          {suggestion.purchase_order_number}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewOrderNo}
                      >
                        Add New Purchase order: "{orderNumber}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="styleNo">
                  Style No:
                </label>
                <input
                  type="text"
                  id="styleNo"
                  value={styleNumber}
                  onChange={handleStyleChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Style No"
                />
                {styleDropdown && styleNumber && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {styleSuggestions.length > 0 ? (
                      styleSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleStyleSelect(suggestion)}
                        >
                          {suggestion.product_style_number}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewStyleNo}
                      >
                        Add New Style: "{styleNumber}"
                      </li>
                    )}
                  </ul>
                )}
              </div>
              </div>

                <div className="flex items-center my-4 relative">
                    {checkSame !== null && (
                      <div className="mt-4 text-center text-lg font-semibold">
                        {checkSame
                          ? <span className='text-green-600'>"The Style number on Purchase order and Stock is SAME!"</span>
                          : <span className='text-red-600'>"The Style number on Purchase order and Stock is NOT the same!"</span> }
                      </div>
                    )}
                </div>
            </div>

            <div className='grid grid-cols-2 gap-10'>
            <div className="">
              <h3 className="text-lg font-medium my-2">Product Image:</h3>
            <div className="flex items-center justify-center max-w-48 border border-gray-400">
              <img
                src={productInfo?.Product.images[0] || 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1722163869~exp=1722167469~hmac=37361beb0ca1a1c652d36c9ca94818f793a54d21822edab80e80c6e43a9b7b37&w=740'}
                alt='Product'
                className="h-40 object-cover rounded"
              />
          </div>
          </div>
          <div className="">
              <h3 className="text-lg font-medium my-2">Measurement Chart:</h3>
            <div className="flex items-center justify-center max-w-48 border border-gray-400">
              <img
                src={productInfo?.Product.MeasurementChart.sample_size_file || 'https://img.freepik.com/premium-vector/fashion-designer-flat-design-illustration_169137-4015.jpg?w=1380'}
                alt='Product'
                className="h-40 object-cover rounded"
              />
          </div>
          </div>
            </div>

            </div>

            <div className="flex items-center gap-2 mt-6">
                <h3 className="text-lg font-medium">PRODUCT INFO:</h3>
              </div>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">

            <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="reference">
                  Reference No:
                </label>
                <input
                  type="text"
                  id="reference"
                  value={productInfo?.Product.Reference.reference_no || ""}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="Category">
                  Category:
                </label>
                <input
                  type="text"
                  id="Category"
                  value={productInfo?.Product.Category.categoryName || ""}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="productType">
                  Product Type:
                </label>
                <input
                  type="text"
                  id="productType"
                  value={productInfo?.Product.ProductType.product || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="brand">
                  Brand:
                </label>
                <input
                  type="text"
                  id="brand"
                  value={productInfo?.Product.Brand.brandName || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="color">
                  Color:
                </label>
                <input
                  type="text"
                  id="color"
                  value={productInfo?.Product.Color.colorName || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="decoration">
                  Decoration:
                </label>
                <input
                  type="text"
                  id="decoration"
                  value={productInfo?.Product.Decoration.decorationName || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="fabric">
                  Fabric:
                </label>
                <input
                  type="text"
                  id="fabric"
                  value={productInfo?.Product.Fabric.fabricName || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="fabric fabric">
                  Fabric Fabric:
                </label>
                <input
                  type="text"
                  id="fabric fabric"
                  value={productInfo?.Product.FabricFinish.fabricFinishName || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="gsm">
                  GSM:
                </label>
                <input
                  type="text"
                  id="gsm"
                  value={productInfo?.Product.Gsm.gsmValue || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="knitType">
                  Knit Type:
                </label>
                <input
                  type="text"
                  id="knitType"
                  value={productInfo?.Product.KnitType.knitType || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="length">
                  Length:
                </label>
                <input
                  type="text"
                  id="length"
                  value={productInfo?.Product.Length.lengthType || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="neck">
                  Neck:
                </label>
                <input
                  type="text"
                  id="neck"
                  value={productInfo?.Product.Neck.neckType || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="packingMethod">
                  Packing Method:
                </label>
                <input
                  type="text"
                  id="packingMethod"
                  value={productInfo?.Product.PackingMethod.packingType || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="print">
                  Print or Embroidery:
                </label>
                <input
                  type="text"
                  id="print"
                  value={productInfo?.Product.PrintEmbName.printType || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="size">
                  Size:
                </label>
                <input
                  type="text"
                  id="size"
                  value={productInfo?.Product.Size.sizes || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="sleeve">
                  Sleeve:
                </label>
                <input
                  type="text"
                  id="sleeve"
                  value={productInfo?.Product.Sleeve.sleeveName || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="stitchDetails">
                  Stitch Details:
                </label>
                <input
                  type="text"
                  id="stitchDetails"
                  value={productInfo?.Product.StitchDetail.stictchDetail || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="measurementChart">
                  Measurement Chart:
                </label>
                <input
                  type="text"
                  id="measurementChart"
                  value={productInfo?.Product.MeasurementChart.name || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="packing">
                  Packing Information:
                </label>
                <input
                  type="text"
                  id="packing"
                  value={productInfo?.packing_type || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>
            </div>


            <div className="flex items-center gap-2 mt-10">
                <h3 className="text-lg font-medium">ORDER INFO:</h3>
              </div>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                
            <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="orderType">
                  Order Type:
                </label>
                <input
                  type="text"
                  id="orderType"
                  value={orderInfo?.order_type || ""}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>
              {orderInfo && (
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="buyer">
                  Buyer:
                </label>
                <input
                  type="text"
                  id="buyer"
                  value={`${orderInfo?.Buyer.name}, ${orderInfo?.Buyer.location}` || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>
             ) }
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="deliveryDate">
                  Delivery Date:
                </label>
                <input
                  type="text"
                  id="deliveryDate"
                  value={orderInfo?.delivery_date || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="packing">
                  Packing Information:
                </label>
                <input
                  type="text"
                  id="packing"
                  value={orderInfo?.packing_type || ''}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Available Quantities:</h3>
              {productInfo?.stock_by_size ? (
                <>
                  <div className=''>
                    <table className="min-w-full bg-white border border-gray-300 rounded-md mt-6">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b">Size</th>
                          <th className="py-2 px-4 border-b">Inner Pieces</th>
                          <th className="py-2 px-4 border-b">Outer Pieces</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productInfo.stock_by_size.map((stock, index) => (
                          <tr key={index}>
                            <td className="py-2 px-4 border-b">{stock.size}</td>
                            <td className="py-2 px-4 border-b">{stock.innerPcs}</td>
                            <td className="py-2 px-4 border-b">{stock.outerPcs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="my-4">
              <h3 className="text-lg font-bold">Stock Totals</h3>
              <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="border p-2 rounded-lg">
                  <h4 className="font-semibold">Total Bundles:</h4>
                  <p>{productInfo?.no_bundles}</p>
                </div>
                <div className="border p-2 rounded-lg">
                  <h4 className="font-semibold">Total Inner Pcs:</h4>
                  <p>{productInnerTotals}</p>
                </div>
                <div className="border p-2 rounded-lg">
                  <h4 className="font-semibold">Total Outer:</h4>
                  <p>{productOuterTotals}</p>
                </div>
                <div className="border p-2 rounded-lg">
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
              <h3 className="text-lg font-semibold">Ordered Quantities:</h3>
              {orderInfo?.purchase_by_size ? (
                <>
                  <div className=''>
                    <table className="min-w-full bg-white border border-gray-300 rounded-md mt-6">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b">Size</th>
                          <th className="py-2 px-4 border-b">Inner Pieces</th>
                          <th className="py-2 px-4 border-b">Outer Pieces</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderInfo.purchase_by_size.map((stock, index) => (
                          <tr key={index}>
                            <td className="py-2 px-4 border-b">{stock.size}</td>
                            <td className="py-2 px-4 border-b">{stock.innerPcs}</td>
                            <td className="py-2 px-4 border-b">{stock.outerPcs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="my-4">
              <h3 className="text-lg font-bold">Order Totals</h3>
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="border p-2 rounded-lg">
                  <h4 className="font-semibold">Total Bundle:</h4>
                  <p>{orderInfo?.req_bundle}</p>
                </div>
                <div className="border p-2 rounded-lg">
                  <h4 className="font-semibold">Total Inner Pcs:</h4>
                  <p>{orderInnerTotals}</p>
                </div>
                <div className="border p-2 rounded-lg">
                  <h4 className="font-semibold">Total Outer Pcs:</h4>
                  <p>{orderOuterTotals}</p>
                </div>
                <div className="border p-2 rounded-lg">
                  <h4 className="font-semibold">Total Pieces:</h4>
                  <p>{orderInfo?.req_purchase_qty}</p>
                </div>
              </div>
            </div>
                </>
              ) : (
                <p className="text-gray-500">No order information available.</p>
              )}
            </div>
          </div>
          </div>

          <div className="flex flex-col justify-center items-center my-10 ">
            <label className="font-semibold mb-2" htmlFor="StockOutBundle">
              Enter Stock Out Bundle:
            </label>
            <input
              className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200 w-40 "
              type="number"
              value={stockOutBundle}
              onChange={handleBundleChange}
              placeholder="Enter Bundle Value"
            />
          </div>

          <div className="flex justify-center px-20 mt-5">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Approve Stock Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddStockOutModel