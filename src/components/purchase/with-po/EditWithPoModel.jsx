import React, { useEffect, useState } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import apiService from "../../../apiService";

const EditPoModal = ({ show, onClose, withPoId, getAllPurchaseOrder }) => {
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString());
  const [selectedProduct, setSelectedProduct] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [assortmentType, setAssortmentType] = useState("assorted");
  const [innerPcs, setInnerPcs] = useState({});
  const [totalInnerPcs, setTotalInnerPcs] = useState(0);
  const [totalOuterPcs, setTotalOuterPcs] = useState(0);
  const [totalInnerPcsPerBundle, setTotalInnerPcsPerBundle] = useState(0);
  const [withPoBundle, setWithPoBundle] = useState(null);
  const [totalPcs, setTotalPcs] = useState(null);
  const [updatedWithPoData, setUpdatedwithPoData] = useState({});

  // Suggestion buyer states
  const [buyerDropdown, setBuyerDropdown] = useState(false);
  const [buyerSuggestions, setBuyerSuggestions] = useState([]);
  const [selectedBuyerId, setSelectedBuyerId] = useState(null);
  const [updatedBuyerData, setUpdatedBuyerData] = useState({});

  const [withPoData, setWithPoData] = useState({
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
    req_bundle: "",
    product_id: null,
    purchase_by_size: [],
    req_purchase_qty: null,
    packing_type: "",
    notes: "",
    purchase_order_number: "",
    Buyer: {
      name: "",
      location: "",
    },
  });

  useEffect(() => {
    fetchWithPoData(withPoId);
  }, [withPoId]);

  const fetchWithPoData = async (withPoId) => {
    try {
      const response = await apiService.get(`/purchases/${withPoId}`);
      setWithPoData(response.data);
      console.log(response.data);
      setAssortmentType(response.data.packing_type);

      // Fill the input fields based on the fetched stock-in data
    } catch (error) {
      console.error(
        "Error fetching With Po  data:",
        error.response || error.message
      );
    }
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

  const handlePurchaseOrderNoChange = (e) => {
    const WithPoNo = e.target.value;
    setWithPoData({
      ...withPoData,
      purchase_order_number: WithPoNo,
    });
    setUpdatedwithPoData({
      ...updatedWithPoData,
      purchase_order_number: WithPoNo,
    });
  };

  const handleBuyerChange = (e) => {
    const buyerInput = e.target.value;
    setWithPoData({
      ...withPoData,
      Buyer: {
        ...withPoData.Buyer,
        name: buyerInput,
        location: "",
      },
    });
    setBuyerDropdown(true);
    fetchBuyerSuggestions(buyerInput);
  };

  const handleBuyerSelect = (buyer) => {
    setWithPoData({
      ...withPoData,
      Buyer: {
        ...withPoData.Buyer,
        name: buyer.name,
        location: buyer.location,
      },
    });
    setSelectedBuyerId(buyer.id);
    setBuyerSuggestions([]);
    setBuyerDropdown(false);
    setUpdatedBuyerData({
      ...updatedBuyerData,
      buyer_id: buyer.id,
    });
    setUpdatedwithPoData({
      ...updatedWithPoData,
      buyer_id: buyer.id,
    });
    console.log(buyer.name);
    console.log(buyer.location);
  };

  const handleAddNewBuyer = () => {
    console.log("Adding new buyer:", withPoData.Buyer.name);
    console.log("Adding new buyer:", withPoData.Buyer.location);
    setBuyerDropdown(false);
  };

  // // handle PO number change
  // const handlePurchaseOrderNoChange = (e) => {
  //   setWithPoData((prevState) => ({
  //     ...prevState,
  //     purchase_order_number: e.target.value,
  //   }));
  // };

  const handleDeliveryDateChange = (e) => {
    const inputDate = e.target.value;
    setDeliveryDate(new Date(inputDate).toISOString());
  };

  const handleStockBySizeChange = (size, innerPcs, outerPcs) => {
    const updatedStockBySize = withPoData.purchase_by_size.map((item) =>
      item.size === size ? { ...item, innerPcs, outerPcs } : item
    );

    setWithPoData((prevState) => ({
      ...prevState,
      purchase_by_size: updatedStockBySize,
    }));

    setUpdatedwithPoData({
      ...updatedWithPoData,
      purchase_by_size: updatedStockBySize,
    });
  };

  // handle size quantity change
  const handleAssortmentTypeChange = (e) => {
    setAssortmentType(e.target.value);
    setUpdatedwithPoData({
      ...updatedWithPoData,
      packing_type: e.target.value,
    });

    if (e.target.value === "solid" && selectedProduct) {
      // Check if selectedProduct and selectedProduct.Size.sizes exist
      const initialInnerPcs =
        selectedProduct.Size && selectedProduct.Size.sizes
          ? selectedProduct.Size.sizes.reduce((acc, size) => {
              acc[size] = selectedProduct.inner_pcs;
              return acc;
            }, {})
          : {};

      setInnerPcs(initialInnerPcs);
      console.log(innerPcs);
    } else {
      setInnerPcs({});
    }
  };

  const handleInnerPcsChange = (e, size) => {
    const newInnerPcs = parseInt(e.target.value, 10) || null; // Ensure the value is a number
    const sizeData =
      withPoData.purchase_by_size.find((item) => item.size === size) || {};

    // Update the stock data with new inner pcs and existing outer pcs
    handleStockBySizeChange(size, newInnerPcs, sizeData.outerPcs || null);

    console.log("Inner pieces updated for size", size);
  };

  const handleOuterPcsChange = (e, size) => {
    const newOuterPcs = parseInt(e.target.value, 10) || null; // Ensure the value is a number
    const sizeData =
      withPoData.purchase_by_size.find((item) => item.size === size) || {};

    // Update the stock data with new outer pcs and existing inner pcs
    handleStockBySizeChange(size, sizeData.innerPcs || null, newOuterPcs);

    console.log("Outer pieces updated for size", size);
  };

  useEffect(() => {
    if (withPoData?.purchase_by_size) {
      const totalwithPoInnerPcs = calculateTotalInnerPcs(
        withPoData.purchase_by_size
      );
      setTotalInnerPcs(totalwithPoInnerPcs);

      const totalwithPoOuterPcs = calculateTotalOuterPcs(
        withPoData.purchase_by_size
      );
      setTotalOuterPcs(totalwithPoOuterPcs);

      const totalInnerPerBundle = calculateTotalInnerPerBundle(
        withPoData.purchase_by_size
      );
      setTotalInnerPcsPerBundle(totalInnerPerBundle);
    }

    if (withPoData?.req_bundle !== undefined) {
      setWithPoBundle(withPoData.req_bundle);
    }

    if (withPoBundle > 0 && withPoData?.purchase_by_size) {
      const totalPcs = withPoData.purchase_by_size.reduce((sum, item) => {
        return sum + (item.innerPcs || 0) * (item.outerPcs || 0) * withPoBundle;
      }, 0);

      setTotalPcs(totalPcs);
      setUpdatedwithPoData({
        ...updatedWithPoData,
        req_purchase_qty: totalPcs,
      });
    } else {
      setTotalPcs(withPoData?.req_purchase_qty);
    }
  }, [withPoData]);

  const calculateTotalInnerPcs = (data) => {
    return data.reduce((total, item) => total + item.innerPcs, 0);
  };

  const calculateTotalOuterPcs = (data) => {
    return data.reduce((total, item) => total + item.outerPcs, 0);
  };

  const calculateTotalInnerPerBundle = (data) => {
    return data.reduce((total, item) => {
      const inner = item.innerPcs || 0;
      const outer = item.outerPcs || 0;
      return total + inner * outer;
    }, 0);
  };

  const handleBundleChange = (e) => {
    const bundleQty = Number(e.target.value);
    setWithPoBundle(bundleQty);

    // Recalculate total pieces when the bundle quantity changes
    const newTotalPcs = withPoData.purchase_by_size.reduce((sum, item) => {
      const innerPcs = item.innerPcs || 0;
      const outerPcs = item.outerPcs || 0;
      return sum + innerPcs * outerPcs * bundleQty;
    }, 0);

    setTotalPcs(newTotalPcs);

    setUpdatedwithPoData((prevData) => ({
      ...prevData,
      req_bundle: bundleQty,
      req_purchase_qty: newTotalPcs,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("updatedWithPoData", updatedWithPoData);

    try {
      const response = await apiService.put(
        `/purchases/${withPoId}`,
        updatedWithPoData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Submit response:", response);
        setSuccessMessage("With-Po updated successfully");
        setErrorMessage("");
        setUpdatedwithPoData({});
        setTimeout(() => {
          setSuccessMessage("");
          getAllPurchaseOrder();
          onClose();
        }, 1500);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  const handleClose = () => {
    setUpdatedwithPoData({});
    setSuccessMessage("");
    setErrorMessage("");
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[80vw] h-screen max-h-[90vh] overflow-auto">
        <div className="px-10 py-5">
          <div className="flex justify-center">
            <h2 className="text-xl font-bold">Edit Purchase Order</h2>
            <button
              className="absolute cursor-pointer right-5"
              onClick={handleClose}
            >
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
          <hr className="my-2" />
          <div className="px-20">
            <div className="grid grid-cols-2 gap-4 mt-10 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              <div className="flex flex-col gap-2">
                <label className="font-semibold" htmlFor="styleNo">
                  Purchase Order No:
                </label>
                <input
                  type="text"
                  id="purchaseOrderNo"
                  value={withPoData.purchase_order_number}
                  onChange={handlePurchaseOrderNoChange}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  placeholder="Enter po number"
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="buyer">
                  Buyer Name:
                </label>
                <input
                  type="text"
                  id="buyer"
                  value={withPoData.Buyer.name}
                  onChange={handleBuyerChange}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  placeholder="Enter Buyer Name"
                />
                {buyerDropdown && withPoData.Buyer.name && (
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
                        Add New Buyer: "{withPoData.Buyer.name}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold" htmlFor="location">
                  Buyer Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={withPoData.Buyer.location}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold" htmlFor="deliveryDate">
                  Delivery date:
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  value={deliveryDate.split("T")[0]}
                  onChange={handleDeliveryDateChange}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
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
                  value={withPoData.Product.style_no}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  placeholder="Enter Style No"
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="referenceNumber">
                  Reference Number:
                </label>
                <input
                  type="text"
                  id="referenceNumber"
                  value={withPoData.Product.Reference.reference_no}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="brand">
                  Brand Name:
                </label>
                <input
                  type="text"
                  id="brand"
                  value={withPoData.Product.Brand.brandName}
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
                  value={withPoData.Product.Fabric.fabricName}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="fabricFinish">
                  Fabric Finish:
                </label>
                <input
                  type="text"
                  id="fabricFinish"
                  value={withPoData.Product.FabricFinish.fabricFinishName}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="gsm">
                  GSM:
                </label>
                <input
                  type="number"
                  id="gsm"
                  value={withPoData.Product.Gsm.gsmValue}
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
                  value={withPoData.Product.KnitType.knitType}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="category">
                  Category:
                </label>
                <input
                  type="text"
                  id="category"
                  value={withPoData.Product.Category.categoryName}
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
                  value={withPoData.Product.Color.colorName}
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
                  value={withPoData.Product.Size.sizes}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="decoration">
                  Decorations:
                </label>
                <input
                  type="text"
                  id="decoration"
                  value={withPoData.Product.Decoration.decorationName}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="print">
                  Print or Embed:
                </label>
                <input
                  type="text"
                  id="print"
                  value={withPoData.Product.PrintEmbName.printType}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="stitch">
                  Stitch Details:
                </label>
                <input
                  type="text"
                  id="stitch"
                  value={withPoData.Product.StitchDetail.stictchDetail}
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
                  value={withPoData.Product.Neck.neckType}
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
                  value={withPoData.Product.Sleeve.sleeveName}
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
                  value={withPoData.Product.Length.lengthType}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="packing">
                  Packing Method:
                </label>
                <input
                  type="text"
                  id="packing"
                  value={withPoData.Product.PackingMethod.packingType}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="product-type">
                  Product Type:
                </label>
                <input
                  type="text"
                  id="product-type"
                  value={withPoData.Product.ProductType.product}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="measurement-chart">
                  Measurement chart:
                </label>
                <input
                  type="text"
                  id="measurement-chart"
                  value={withPoData.Product.MeasurementChart.name}
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
                value={withPoData.Product.short_description}
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
                value={withPoData.Product.full_description}
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
                value={withPoData.notes}
                className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                placeholder="Enter additional notes"
                rows="3"
              />
            </div>

            <div className="my-4">
              <label className="font-semibold">Packaging Type:</label>
              <div className="flex items-center gap-4 mt-2">
                <label>
                  <input
                    type="radio"
                    value="assorted"
                    checked={assortmentType === "assorted"}
                    onChange={handleAssortmentTypeChange}
                    className="mx-1"
                  />
                  Assorted
                </label>
                <label>
                  <input
                    type="radio"
                    value="solid"
                    checked={assortmentType === "solid"}
                    onChange={handleAssortmentTypeChange}
                    className="mx-1"
                  />
                  Solid
                </label>
              </div>
            </div>

            <div className="">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium">Order Info:</h3>
              </div>
              <div className="flex justify-between gap-4 px-5 border border-gray-400">
                <div className="p-4 rounded-lg">
                  <h4 className="mb-4 text-sm font-medium">
                    Quantity per size:
                  </h4>
                  <div className="flex flex-col gap-4">
                    {withPoData?.purchase_by_size?.map((stock, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <div className="w-16 mt-5">{stock.size}: </div>
                        <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">Inner Pcs</label>
                        <input
                          type="number"
                          value={stock.innerPcs || null}
                          onChange={(e) => handleInnerPcsChange(e, stock.size)}
                          placeholder="Inner Pcs"
                          className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                          disabled={assortmentType === "solid"}
                        />
                        </div>
                        <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">no of Inner box</label>
                        <input
                          type="number"
                          value={stock.outerPcs || null}
                          onChange={(e) => handleOuterPcsChange(e, stock.size)}
                          placeholder="Outer Pcs"
                          className="px-2 py-1 border border-gray-300 rounded-md w-28"
                        />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="content-center px-20">
                  <label className="font-semibold">Number of Bundles: </label>
                  <input
                    type="number"
                    value={withPoBundle || null}
                    onChange={handleBundleChange}
                    placeholder="Bundles"
                    className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex items-center justify-center p-4 mt-8 mb-8 bg-gray-100">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-5">
                      <label className="block text-sm font-medium text-gray-700">
                        Total Inner Pcs
                      </label>
                      <span>{totalInnerPcs}</span>
                    </div>
                    <div className="flex justify-between gap-5">
                      <label className="block text-sm font-medium text-gray-700">
                        Total Outer Pcs
                      </label>
                      <span>{totalOuterPcs}</span>
                    </div>
                    <div className="flex justify-between gap-5">
                      <label className="block text-sm font-medium text-gray-700">
                        Total Pcs per Bundle
                      </label>
                      <span>{totalInnerPcsPerBundle}</span>
                    </div>
                    <div className="flex justify-between gap-5">
                      <label className="block text-sm font-medium text-gray-700">
                        Total Pcs
                      </label>
                      <span>{totalPcs}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {successMessage && (
            <div className="p-4 my-4 text-green-700 bg-green-100 border-l-4 border-green-500">
              <p>{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div className="p-4 my-4 text-red-700 bg-red-100 border-l-4 border-red-500">
              <p>{errorMessage}</p>
            </div>
          )}
          <div className="flex justify-center px-20 mt-5">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              CREATE PURCHASE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPoModal;