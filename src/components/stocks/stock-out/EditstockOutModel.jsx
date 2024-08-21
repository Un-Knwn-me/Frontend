import React, { useEffect, useState } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import apiService from "../../../apiService";

const EditStockOutModel = ({
  show,
  onClose,
  stockOutId,
}) => {
  const [orderInfo, setOrderInfo] = useState(null);
  const [productInnerTotals, setProductInnerTotals] = useState(null);
  const [productOuterTotals, setProductOuterTotals] = useState(null);
  const [orderInnerTotals, setOrderInnerTotals] = useState(null);
  const [orderOuterTotals, setOrderOuterTotals] = useState(null);
  const [stockOutInnerTotals, setStockOutInnerTotals] = useState(null);
  const [stockOutOuterTotals, setStockOutOuterTotals] = useState(null);
  const [stockOutBundle, setStockOutBundle] = useState(null);
  const [totalPcs, setTotalPcs] = useState(null);
  const [productInfo, setProductInfo] = useState(null);

  const [stockOutData, setStockOutData] = useState({
    PurchaseOrder: {
      purchase_order_number: "",
      order_type: "",
      delivery_date: "",
      packing_type: "",
    },
    Stock: {
      Product: {
        style_no: "",
        Reference: {
          reference_no: "",
        },
        Category: {
          categoryName: "",
        },
        Brand: {
          brandName: "",
        },
        Color: {
          colorName: "",
        },
        Decoration: {
          decorationName: "",
        },
        Fabric: {
          fabricName: "",
        },
        FabricFinish: {
          fabricFinishName: "",
        },
        Gsm: {
          gsmValue: null,
        },
        KnitType: {
          knitType: "",
        },
        Length: {
          lengthType: "",
        },
        MeasurementChart: {
          name: "",
          sample_size_file: "",
        },
        Neck: {
          neckType: "",
        },
        PackingMethod: {
          packingType: "",
        },
        PrintEmbName: {
          printType: "",
        },
        ProductType: {
          product: "",
        },
        Size: {
          sizes: [],
        },
        Sleeve: {
          sleeveName: "",
        },
        StitchDetail: {
          stictchDetail: "",
        },
        short_description: "",
        full_description: "",
        images: "",
      },
      packing_type: "",
    },

    stockOut_bundle: "",
  });

  // fetch styleNo


  useEffect(() => {
    if (stockOutData?.Stock?.stock_by_size) {
      const totalStockInnerPcs = calculateTotalInnerPcs(stockOutData.Stock.stock_by_size);
      setProductInnerTotals(totalStockInnerPcs);

      const totalStockOuterPcs = calculateTotalOuterPcs(stockOutData.Stock.stock_by_size);
      setProductOuterTotals(totalStockOuterPcs);
    }

    if (stockOutData?.PurchaseOrder?.purchase_by_size) {
      const totalOrderInnerPcs = calculateTotalInnerPcs(stockOutData.PurchaseOrder.purchase_by_size);
      setOrderInnerTotals(totalOrderInnerPcs);

      const totalOrderOuterPcs = calculateTotalOuterPcs(stockOutData.PurchaseOrder.purchase_by_size);
      setOrderOuterTotals(totalOrderOuterPcs);
    }

    if (stockOutData?.stockOut_by_size) {
      const totalStockOutInnerPcs = calculateTotalInnerPcs(stockOutData.stockOut_by_size);
      setStockOutInnerTotals(totalStockOutInnerPcs);

      const totalStockOutOuterPcs = calculateTotalOuterPcs(stockOutData.stockOut_by_size);
      setStockOutOuterTotals(totalStockOutOuterPcs);
    }
  }, [stockOutData]);

  useEffect(() => {
    if (stockOutId) {
      fetchStockOutData(stockOutId);
    }
  }, [stockOutId]);

  const fetchStockOutData = async (stockOutId) => {
    try {
      console.log("Fetching stock out data for ID:", stockOutId);

      const response = await apiService.get(`/stockOut/${stockOutId}`);
      console.log("Stock out data:", response.data);
      setStockOutData(response.data);
    } catch (error) {
      console.error(
        "Error fetching stock out data:",
        error.response || error.message
      );
      // Optionally, set an error state to display an error message in the UI
      // setError("Failed to fetch stock out data. Please try again later.");
    }
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
        stock_id: productInfo.id,
        stockOut_by_size: orderInfo.purchase_by_size,
        stockOut_bundle: stockOutBundle,
        total_stockOut_pcs: totalPcs,
        product_style_number: productInfo.product_style_number,
        product_id: productInfo.Product.id,
        purchase_order_number: orderInfo.purchase_order_number,
        purchase_order_id: orderInfo.id,
      };

      console.log("Stock out: ", stockData);

      const response = await apiService.put(`/stockOut/${stockOutId}`, {
        stock_id: stockOutId,
      });

      if (response.status === 200) {
        console.log("Stock created:", response.data);
        onClose();
      }
    } catch (error) {}
  };

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
            <h2 className="text-xl font-bold">Edit Stock Out</h2>
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
                    <label className="font-semibold" htmlFor="styleNo">
                      Purchase Order No:
                    </label>
                    <input
                      type="text"
                      id="purchaseOrderNo"
                      value={stockOutData.PurchaseOrder.purchase_order_number}
                      className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                      disabled
                    />
                  </div>

                  <div className="relative flex flex-col gap-2">
                    <label className="font-semibold" htmlFor="styleNo">
                      Style No:
                    </label>
                    <input
                      type="text"
                      id="styleNo"
                      value={stockOutData.Stock.Product.style_no}
                      className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="">
                  <h3 className="my-2 text-lg font-medium">Product Image:</h3>
                  <div className="flex items-center justify-center border border-gray-400 max-w-48">
                    <img
                      src={
                        stockOutData.Stock.Product.images[0] ||
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
                        stockOutData.Stock.Product.MeasurementChart
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
                  value={
                    stockOutData?.Stock.Product.Reference.reference_no || ""
                  }
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
                  value={
                    stockOutData?.Stock.Product.Category.categoryName || ""
                  }
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
                  value={stockOutData?.Stock.Product.ProductType.product || ""}
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
                  value={stockOutData?.Stock.Product.Brand.brandName || ""}
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
                  value={stockOutData?.Stock.Product.Color.colorName || ""}
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
                  value={
                    stockOutData?.Stock.Product.Decoration.decorationName || ""
                  }
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
                  value={stockOutData?.Stock.Product.Fabric.fabricName || ""}
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
                    stockOutData?.Stock.Product.FabricFinish.fabricFinishName ||
                    ""
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
                  value={stockOutData?.Stock.Product.Gsm.gsmValue || ""}
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
                  value={stockOutData?.Stock.Product.KnitType.knitType || ""}
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
                  value={stockOutData?.Stock.Product.Length.lengthType || ""}
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
                  value={stockOutData?.Stock.Product.Neck.neckType || ""}
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
                  value={
                    stockOutData?.Stock.Product.PackingMethod.packingType || ""
                  }
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
                  value={
                    stockOutData?.Stock.Product.PrintEmbName.printType || ""
                  }
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
                  value={stockOutData?.Stock.Product.Size.sizes || ""}
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
                  value={stockOutData?.Stock.Product.Sleeve.sleeveName || ""}
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
                  value={
                    stockOutData?.Stock.Product.StitchDetail.stictchDetail || ""
                  }
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
                  value={
                    stockOutData?.Stock.Product.MeasurementChart.name || ""
                  }
                  cl
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
                  value={stockOutData?.Stock.packing_type || ""}
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
                value={stockOutData?.Stock?.Product?.short_description || ""}
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
                value={stockOutData?.Stock?.Product?.full_description || ""}
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
                  value={stockOutData.PurchaseOrder.order_type || ""}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="buyer">
                  Buyer:
                </label>
                <input
                  type="text"
                  id="buyer"
                  value={
                    `${stockOutData?.PurchaseOrder?.Buyer?.name}, ${stockOutData?.PurchaseOrder?.Buyer?.location}` ||
                    ""
                  }
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="deliveryDate">
                  Delivery Date:
                </label>
                <input
                  type="text"
                  id="deliveryDate"
                  value={stockOutData.PurchaseOrder.delivery_date || ""}
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
                  value={stockOutData.PurchaseOrder.packing_type || ""}
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
                value={stockOutData.PurchaseOrder.notes || ""}
                className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                rows="3"
                disabled
              />
            </div>

            <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Available Quantities:</h3>
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
                      {stockOutData?.Stock?.stock_by_size?.map(
                        (stock, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 border-b">{stock.size}</td>
                            <td className="px-4 py-2 border-b">
                              {stock.innerPcs}
                            </td>
                            <td className="px-4 py-2 border-b">
                              {stock.outerPcs}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="my-4">
                  <h3 className="text-lg font-bold">Stock Totals</h3>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="p-2 border rounded-lg">
                      <h4 className="font-semibold">Total Bundles:</h4>
                      <p>{stockOutData?.Stock?.no_bundles}</p>
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
                      <p>{stockOutData?.Stock?.total_pcs}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold">Ordered Quantities:</h3>
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
                      {stockOutData?.PurchaseOrder?.purchase_by_size?.map(
                        (stock, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 border-b">{stock.size}</td>
                            <td className="px-4 py-2 border-b">
                              {stock.innerPcs}
                            </td>
                            <td className="px-4 py-2 border-b">
                              {stock.outerPcs}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="my-4">
                  <h3 className="text-lg font-bold">Order Totals</h3>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="p-2 border rounded-lg">
                      <h4 className="font-semibold">Total Bundle:</h4>
                      <p>{stockOutData?.PurchaseOrder?.req_bundle}</p>
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
                      <p>{stockOutData?.PurchaseOrder?.req_purchase_qty}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold">Stock Out Quantities:</h3>
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
                  {stockOutData?.stockOut_by_size?.map((stock, index) => (
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
              <h3 className="text-lg font-bold">Stock Out Totals</h3>
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="p-2 border rounded-lg">
                  <h4 className="font-semibold">Total Bundle:</h4>
                  <p>{stockOutData?.Stock?.no_bundles}</p>
                </div>
                <div className="p-2 border rounded-lg">
                  <h4 className="font-semibold">Total Inner Pcs:</h4>
                  <p>{stockOutInnerTotals}</p>
                </div>
                <div className="p-2 border rounded-lg">
                  <h4 className="font-semibold">Total Outer Pcs:</h4>
                  <p>{stockOutOuterTotals}</p>
                </div>
                <div className="p-2 border rounded-lg">
                  <h4 className="font-semibold">Total Pieces:</h4>
                  <p>{stockOutData?.Stock?.total_pcs}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center my-10 ">
            <label className="mb-2 font-semibold" htmlFor="StockOutBundle">
              Update Stock Out Bundle:
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
export default EditStockOutModel;