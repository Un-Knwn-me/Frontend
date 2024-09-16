import React, { useEffect, useState } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import apiService from "../../../apiService";
import CreatePoModal from "../../purchase/with-po/CreateWithPoModel";

const AddStockOutModel = ({ show, onClose, fetchStockOut }) => {
  const [styleNumber, setStyleNumber] = useState("");
  const [dcNumber, setDcNumber] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDropdown, setOrderDropdown] = useState(false);
  const [orderSuggestions, setOrderSuggestions] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [checkSame, setCheckSame] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [productInnerTotals, setProductInnerTotals] = useState(null);
  const [productOuterTotals, setProductOuterTotals] = useState(null);
  const [orderInnerTotals, setOrderInnerTotals] = useState(null);
  const [orderOuterTotals, setOrderOuterTotals] = useState(null);
  const [stockOutBundle, setStockOutBundle] = useState(null);
  const [totalPcs, setTotalPcs] = useState(null);

  const [isAddCreatePoModalOpen, setIsAddCreatePoModalOpen] = useState(false);

  // fetch styleNo
  const [productInfo, setProductInfo] = useState(null);
  const fetchStyleSuggestions = async (style_no) => {
    try {
      const response = await apiService.get(`/stocks/${style_no}`);

      console.log("stock res: ", response.data);
      setWarehouse(response.data.Warehouse.warehouse);
      setProductInfo(response.data);
      const totalStockInnerPcs = calculateTotalInnerPcs(
        response.data.stock_by_size
      );
      setProductInnerTotals(totalStockInnerPcs);
      const totalStockOuterPcs = calculateTotalOuterPcs(
        response.data.stock_by_size
      );
      setProductOuterTotals(totalStockOuterPcs);
    } catch (error) {
      console.error("Error fetching Product:", error);
    }
  };

  // fetch orderNo
  const fetchOrderSuggestions = async (orderInput) => {
    try {
      if (orderInput.length > 0) {
        const response = await apiService.get("/purchases/all");
        const filteredProduct = response.data.filter(
          (e) =>
            e.purchase_order_number &&
            e.purchase_order_number
              .toLowerCase()
              .startsWith(orderInput.toLowerCase())
        );
        const formattedData = filteredProduct.map((order) => ({
          ...order,
          delivery_date: new Date(order.delivery_date).toLocaleDateString(
            "en-GB"
          ),
        }));
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

      setStyleNumber("");
      setWarehouse("");
      setSelectedProduct(null);
      setCheckSame(null);
      setProductInfo(null);
      setOrderInfo(null);
    }
  };

  const handleOrderSelect = (e) => {
    setOrderNumber(e.purchase_order_number);
    // setWarehouse(e.Warehouse.warehouse);
    setSelectedOrder(e);
    setOrderInfo(e);
    setSelectedOrderId(e.id);
    setOrderSuggestions([]);
    setOrderDropdown(false);
    setOrderSuggestions([]);
    setOrderDropdown(false);
    console.log("orderSelect: ", e);
    const totalOrderInnerPcs = calculateTotalInnerPcs(e.purchase_by_size);
    setOrderInnerTotals(totalOrderInnerPcs);
    const totalOrderOuterPcs = calculateTotalOuterPcs(e.purchase_by_size);
    setOrderOuterTotals(totalOrderOuterPcs);
    setStyleNumber(e.product_style_number);
    fetchStyleSuggestions(e.product_style_number);
  };

  const handleAddNewOrderNo = () => {
    console.log("Adding new purchase order no:", orderNumber);
    setOrderDropdown(false);
    setIsAddCreatePoModalOpen(true);
  };

  const closeAddCreatePoModal = () => {
    setIsAddCreatePoModalOpen(false);
    onClose();
  };

  const handleBundleChange = async (e) => {
    try {
      const bundleQty = e.target.value;
      setStockOutBundle(bundleQty);

      const totalPcs = productInfo?.stock_by_size.reduce((sum, item) => {
        return sum + item.innerPcs * item.outerPcs * bundleQty;
      }, 0);

      setTotalPcs(totalPcs);
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
        dc_number: dcNumber,
        buyer_id: orderInfo.Buyer.id,
        stock_id: productInfo.id,
        stockOut_by_size: orderInfo.purchase_by_size,
        stockOut_bundle: stockOutBundle,
        stockout_pcs_per_bundle: productInfo.pcs_per_bundle,
        total_stockOut_pcs: totalPcs,
        product_style_number: productInfo.product_style_number,
        product_id: productInfo.Product.id,
        purchase_order_number: orderInfo.purchase_order_number,
        purchase_order_id: orderInfo.id,
      };

      console.log("Stock out: ", stockData);

      const response = await apiService.post("/stockOut/create", stockData);

      if (response.status === 200) {
        console.log("Stock created:", response.data);
        fetchStockOut();
        onClose();
      }
    } catch (error) {}
  };

  const handleModalClose = () => {
    setOrderNumber("");
    setStyleNumber("");
    setProductInfo(null);
    setOrderInfo(null);
    setStockOutBundle(null);
    setWarehouse("");
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleModalClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[80vw] h-screen max-h-[90vh] overflow-auto">
        <div className="px-10 py-5">
          <div className="flex justify-center">
            <h2 className="text-xl font-bold">Create Stock Out </h2>
            <button
              className="absolute cursor-pointer right-5"
              onClick={handleModalClose}
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
                    <label className="font-semibold" htmlFor="styleNo">
                      Purchase Order No:
                    </label>
                    <input
                      type="text"
                      id="purchaseOrderNo"
                      value={orderNumber}
                      onChange={handleOrderChange}
                      className="px-2 py-2 border border-gray-300 rounded-md hover:border-cyan-300 active:boder-cyan-300 focus:border-cyan-300"
                      placeholder="Enter PO number"
                    />
                    {orderDropdown && orderNumber && (
                      <ul className="absolute left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg top-full">
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
                            className="px-4 py-2 text-sm text-blue-600 cursor-pointer hover:bg-gray-200"
                            onClick={handleAddNewOrderNo}
                          >
                            Add New Purchase order: "{orderNumber}"
                          </li>
                        )}
                      </ul>
                    )}
                    <CreatePoModal
                      show={isAddCreatePoModalOpen}
                      onClose={closeAddCreatePoModal}
                    />
                  </div>

                  <div className="relative flex flex-col gap-2">
                    <label className="font-semibold" htmlFor="dc-number">
                      DC Number:
                    </label>
                    <input
                      type="text"
                      id="dc-number"
                      value={dcNumber}
                      onChange={(e) => setDcNumber(e.target.value)}
                      className="px-2 py-2 border border-gray-300 rounded-md hover:border-cyan-300 active:boder-cyan-300 focus:border-cyan-300"
                      placeholder="Enter dc number"
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
                      value={warehouse || ""}
                      className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                      disabled
                    />
                  </div>
                </div>

                <div className="relative flex items-center my-4">
                  {checkSame !== null && (
                    <div className="mt-4 text-lg font-semibold text-center">
                      {checkSame ? (
                        <span className="text-green-600">
                          "The Style number on Purchase order and Stock is
                          SAME!"
                        </span>
                      ) : (
                        <span className="text-red-600">
                          "The Style number on Purchase order and Stock is NOT
                          the same!"
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="">
                  <h3 className="my-2 text-lg font-medium">Product Image:</h3>
                  <div className="flex items-center justify-center border border-gray-400 max-w-48">
                    <img
                      src={
                        productInfo?.Product.images[0] ||
                        "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1722163869~exp=1722167469~hmac=37361beb0ca1a1c652d36c9ca94818f793a54d21822edab80e80c6e43a9b7b37&w=740"
                      }
                      alt="Product"
                      className="object-cover h-40 rounded"
                    />
                  </div>
                </div>
                <div className="">
                  <h3 className="my-2 text-lg font-medium">
                    Measurement Chart:
                  </h3>
                  <div className="flex items-center justify-center border border-gray-400 max-w-48">
                    <img
                      src={
                        productInfo?.Product.MeasurementChart
                          .sample_size_file ||
                        "https://img.freepik.com/premium-vector/fashion-designer-flat-design-illustration_169137-4015.jpg?w=1380"
                      }
                      alt="Product"
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
                  value={productInfo?.Product?.Reference?.reference_no || ""}
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
                  value={productInfo?.Product?.Category.categoryName || ""}
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
                  value={productInfo?.Product?.ProductType.product || ""}
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
                  value={productInfo?.Product?.Brand.brandName || ""}
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
                  value={productInfo?.Product?.Color.colorName || ""}
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
                  value={productInfo?.Product?.Decoration.decorationName || ""}
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
                  value={productInfo?.Product?.Fabric.fabricName || ""}
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
                  value={
                    productInfo?.Product?.FabricFinish.fabricFinishName || ""
                  }
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
                  value={productInfo?.Product?.Gsm.gsmValue || ""}
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
                  value={productInfo?.Product?.KnitType.knitType || ""}
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
                  value={productInfo?.Product?.Length.lengthType || ""}
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
                  value={productInfo?.Product?.Neck.neckType || ""}
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
                  value={productInfo?.Product?.PackingMethod.packingType || ""}
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
                  value={productInfo?.Product?.PrintEmbName.printType || ""}
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
                  value={productInfo?.Product?.Size.sizes || ""}
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
                  value={productInfo?.Product?.Sleeve.sleeveName || ""}
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
                  value={productInfo?.Product?.StitchDetail.stictchDetail || ""}
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
                  value={productInfo?.Product?.MeasurementChart.name || ""}
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
                  value={productInfo?.packing_type || ""}
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
                value={productInfo?.Product?.short_description || ""}
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
                value={productInfo?.Product?.full_description || ""}
                className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                rows="2"
                disabled
              />
            </div>

            <div className="flex items-center gap-2 mt-10">
              <h3 className="text-lg font-medium">ORDER INFO:</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-5 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="orderType">
                  Order Type:
                </label>
                <input
                  type="text"
                  id="orderType"
                  value={orderInfo?.order_type || ""}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>
              {orderInfo && (
                <div className="relative flex flex-col gap-2">
                  <label className="font-semibold" htmlFor="buyer">
                    Buyer:
                  </label>
                  <input
                    type="text"
                    id="buyer"
                    value={
                      `${orderInfo?.Buyer?.name}, ${orderInfo?.Buyer?.location}` ||
                      ""
                    }
                    className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                    disabled
                  />
                </div>
              )}
              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="deliveryDate">
                  Delivery Date:
                </label>
                <input
                  type="text"
                  id="deliveryDate"
                  value={orderInfo?.delivery_date || ""}
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
                  value={orderInfo?.packing_type || ""}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-3">
              <label className="font-semibold" htmlFor="notes">
                Notes:
              </label>
              <textarea
                id="notes"
                value={orderInfo?.notes || ""}
                className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                rows="3"
                disabled
              />
            </div>

            <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-500">
                  Available Quantities:
                </h3>
                {productInfo?.stock_by_size ? (
                  <>
                    <div className="">
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
                              <td className="px-4 py-2 border-b">
                                {stock.size}
                              </td>
                              <td className="px-4 py-2 border-b">
                                {stock.innerPcs}
                              </td>
                              <td className="px-4 py-2 border-b">
                                {stock.outerPcs}
                              </td>
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
                  <p className="text-gray-500">
                    No stock information available.
                  </p>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-500">
                  Purchase Quantities:
                </h3>
                {orderInfo?.purchase_by_size ? (
                  <>
                    <div className="">
                      <table className="min-w-full mt-6 bg-white border border-gray-300 rounded-md">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 border-b">Size</th>
                            <th className="px-4 py-2 border-b">Inner Pieces</th>
                            <th className="px-4 py-2 border-b">Outer Pieces</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderInfo.purchase_by_size.map((stock, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 border-b">
                                {stock.size}
                              </td>
                              <td className="px-4 py-2 border-b">
                                {stock.innerPcs}
                              </td>
                              <td className="px-4 py-2 border-b">
                                {stock.outerPcs}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="my-4">
                      <h3 className="text-lg font-bold">Order Totals</h3>
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="p-2 border rounded-lg">
                          <h4 className="font-semibold">Total Bundle:</h4>
                          <p>{orderInfo?.req_bundle}</p>
                        </div>
                        <div className="p-2 border rounded-lg">
                          <h4 className="font-semibold">Total Inner Pcs:</h4>
                          <p>{orderInnerTotals}</p>
                        </div>
                        <div className="p-2 border rounded-lg">
                          <h4 className="font-semibold">Total Outer Pcs:</h4>
                          <p>{orderOuterTotals}</p>
                        </div>
                        <div className="p-2 border rounded-lg">
                          <h4 className="font-semibold">Total Pieces:</h4>
                          <p>{orderInfo?.req_purchase_qty}</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">
                    No order information available.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-5 my-10 bg-blue-200 rounded ">
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
            {totalPcs !== null && (
              <div className="flex justify-center my-2">
                <p className="text-lg font-medium text-green-500">
                  Total Pieces: {totalPcs}
                </p>
              </div>
            )}
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
  );
};

export default AddStockOutModel;