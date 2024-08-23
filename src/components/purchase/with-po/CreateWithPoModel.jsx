import React, { useEffect, useState } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import apiService from "../../../apiService";

const CreatePoModal = ({ show, onClose, getAllPurchaseOrder }) => {
  const [buyer, setBuyer] = useState("");
  const [buyerLocation, setBuyerLocation] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString());
  const [styleNumber, setStyleNumber] = useState("");
  const [styleDropdown, setStyleDropdown] = useState(false);
  const [styleSuggestions, setStyleSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
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
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  
  const [notes, setNotes] = useState("");
  const [assortmentType, setAssortmentType] = useState("assorted");
  const [innerPcs, setInnerPcs] = useState({});
  const [outerPcs, setOuterPcs] = useState({});
  const [bundles, setBundles] = useState("");
  const [totalInnerPcs, setTotalInnerPcs] = useState(0);
  const [totalOuterPcs, setTotalOuterPcs] = useState(0);
  const [totalInnerPcsPerBundle, setTotalInnerPcsPerBundle] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const handleDeliveryDateChange = (e) => {
    const inputDate = e.target.value;
    setDeliveryDate(new Date(inputDate).toISOString());
  };

  // Suggestion buyer states
  const [buyerDropdown, setBuyerDropdown] = useState(false);
  const [buyerSuggestions, setBuyerSuggestions] = useState([]);
  const [selectedBuyerId, setSelectedBuyerId] = useState(null);

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

  // fetch styleNo
  const fetchStyleSuggestions = async (styleInput) => {
    try {
      if (styleInput.length > 0) {
        const response = await apiService.get("/products/getall");
        const filteredProduct = response.data.filter((e) =>
          e.style_no.toLowerCase().startsWith(styleInput.toLowerCase())
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
      setShortDescription("");
      setFullDescription("");
      setSelectedProduct(null);
    }
  };

  const handleStyleSelect = (e) => {
    setStyleNumber(e.style_no);
    setSelectedProduct(e);
    setSelectedProductId(e.id);
    setStyleSuggestions([]);
    setStyleDropdown(false);
    setReferenceNo(e.Reference.reference_no);
    setCategory(e.Category.categoryName);
    setProductType(e.ProductType.product);
    setBrand(e.Brand.brandName);
    setFabric(e.Fabric.fabricName);
    setFabricFinish(e.FabricFinish.fabricFinishName);
    setGsm(e.Gsm.gsmValue);
    setKnitType(e.KnitType.knitType);
    setColors(e.Color.colorName);
    setDecoration(e.Decoration.decorationName);
    setPrintOrEmb(e.PrintEmbName.printType);
    setStitch(e.StitchDetail.stictchDetail);
    setNeck(e.Neck.neckType);
    setLength(e.Length.lengthType);
    setSleeve(e.Sleeve.sleeveName);
    setPackingMethod(e.PackingMethod.packingType);
    setMeasurementChart(e.MeasurementChart.name);
    setSelectedMeasurementImage(e.MeasurementChart.sample_size_file);
    setShortDescription(e.short_description);
    setFullDescription(e.full_description);
    setSizes(e.Size.sizes);
    setStyleSuggestions([]);
    setStyleDropdown(false);
  };

  const handleAddNewStyleNo = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new style no:", styleNumber);
    // Close the dropdown after adding the buyer
    setStyleDropdown(false);
  };

  // handle size quantity change
  const handleAssortmentTypeChange = (e) => {
    setAssortmentType(e.target.value);
    if (e.target.value === "solid" && selectedProduct) {
      const initialInnerPcs = selectedProduct.Size.sizes.reduce((acc, size) => {
        acc[size] = selectedProduct.inner_pcs;
        return acc;
      }, {});
      setInnerPcs(initialInnerPcs);
    } else {
      setInnerPcs({});
    }
  };

  const handleInnerPcsChange = (size, value) => {
    setInnerPcs((prev) => ({
      ...prev,
      [size]: Number(value)
    }));
  };

  const handleOuterPcsChange = (size, value) => {
    setOuterPcs((prev) => ({
      ...prev,
      [size]: Number(value)
    }));
  };

  
  useEffect(() => {
    const totalInner = Object.values(innerPcs).reduce((sum, pcs) => sum + Number(pcs || 0), 0);
    const totalOuter = Object.values(outerPcs).reduce((sum, pcs) => sum + Number(pcs || 0), 0);
    setTotalInnerPcs(totalInner);
    setTotalOuterPcs(totalOuter);
    
    const totalInnerPerBundle = sizes.reduce((sum, size) => {
      const inner = innerPcs[size] || 0;
      const outer = outerPcs[size] || 0;
      return sum + (inner * outer);
    }, 0);

    setTotalInnerPcsPerBundle(totalInnerPerBundle);
    const totalProducts = totalInnerPerBundle * bundles;
    setTotalProducts(totalProducts);
  }, [innerPcs, outerPcs, bundles, sizes]);

  const handleSubmit = async () => {
    const purchaseData = {
      order_type: "With Purchase Order",
      purchase_order_number: orderNumber,
      buyer_id: selectedBuyerId,
      delivery_date: deliveryDate,
      product_style_number: styleNumber,
      product_id: selectedProductId,
      notes: notes,
      packing_type: assortmentType,
      purchase_by_size: sizes.map((size) => ({
        size,
        innerPcs: innerPcs[size],
        outerPcs: outerPcs[size],
      })),
      req_bundle: bundles,
      req_purchase_qty: totalProducts,
    };

    try {
      console.log(purchaseData);
      const response = await apiService.post("/purchases/create", purchaseData);

      if (response.status === 201) {
        getAllPurchaseOrder();
        setStyleNumber("");
        setStyleDropdown(false);
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
        setShortDescription("");
        setFullDescription("");
        setSelectedProduct(null);
        onClose();
      } else {
        console.error("Error creating Purchase order:", response.data);
      }
    } catch (error) {
      console.error("Error creating Purchase order:", error);
    }
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
            <h2 className="text-xl font-bold">Create Purchase Order</h2>
            <button
              className="absolute cursor-pointer right-5"
              onClick={onClose}
            >
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
          <hr className="my-2" />
          <div className="px-10">
            <div className="grid grid-cols-2 gap-4 mt-10 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              <div className="flex flex-col gap-2">
                <label className="font-semibold" htmlFor="styleNo">
                  Purchase Order No:
                </label>
                <input
                  type="text"
                  id="purchaseOrderNo"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
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
                  value={buyer}
                  onChange={handleBuyerChange}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
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

              <div className="flex flex-col gap-2">
                <label className="font-semibold" htmlFor="location">
                  Buyer Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={buyerLocation}
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
                  value={styleNumber}
                  onChange={handleStyleChange}
                  className="px-2 py-2 border border-gray-300 rounded-md bg-zinc-200"
                  placeholder="Enter Style No"
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
                          {suggestion.style_no}
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

              <div className="relative flex flex-col gap-2">
                <label className="font-semibold" htmlFor="referenceNumber">
                  Reference Number:
                </label>
                <input
                  type="text"
                  id="referenceNumber"
                  value={ReferenceNo}
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
                  value={brand}
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
                  value={fabric}
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
                  value={fabricFinish}
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
                  value={gsm}
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
                  value={knitType}
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
                  value={category}
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
                  value={colors}
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
                  value={sizes}
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
                  value={decoration}
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
                  value={printOrEmb}
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
                  value={stitch}
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
                  value={neck}
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
                  value={sleeve}
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
                  value={length}
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
                  value={packingMethod}
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
                  value={productType}
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
                  value={measurementChart}
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
              <h4 className="mb-4 text-sm font-medium">Quantity per size:</h4>
              <div className="flex flex-col gap-4">
              {sizes.map((size, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
              <div className="w-16 mt-5">{size}: </div>
              <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700">Inner Pcs</label>
              <input
                type="number"
                value={innerPcs[size] || ''}
                onChange={(e) => handleInnerPcsChange(size, e.target.value)}
                placeholder="Inner Pcs"
                className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                disabled={assortmentType === "solid"}
              />
              </div>
              <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700">Outer box</label>
              <input
                type="number"
                value={outerPcs[size] || ''}
                onChange={(e) => handleOuterPcsChange(size, e.target.value)}
                placeholder="Outer Pcs"
                className="w-24 px-2 py-1 border border-gray-300 rounded-md"
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
            value={bundles}
            onChange={(e) => setBundles(Number(e.target.value))}
            placeholder="Bundles"
            className="w-24 px-2 py-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center justify-center p-6 mt-8 mb-8 bg-gray-100">
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
                  <span>{totalProducts}</span>
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
              CREATE PURCHASE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoModal;
