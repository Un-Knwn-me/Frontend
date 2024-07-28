import React, { useState, useEffect } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import apiService from "../../../apiService";
import imgbg from "../../../assets/imgbg.jpg";

const AddStockModal = ({ show, onClose, getAllStocks }) => {
  const [styleNumber, setStyleNumber] = useState("");
  const [styleDropdown, setStyleDropdown] = useState(false);
  const [styleSuggestions, setStyleSuggestions] = useState([]);
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
  const [decoration, setDecoration] = useState("");
  const [printOrEmb, setPrintOrEmb] = useState("");
  const [stitch, setStitch] = useState("");
  const [neck, setNeck] = useState("");
  const [sleeve, setSleeve] = useState("");
  const [length, setLength] = useState("");
  const [measurementChart, setMeasurementChart] = useState("");
  const [selectedMeasurementImage, setSelectedMeasurementImage] = useState(null);
  const [packingMethod, setPackingMethod] = useState("");
  const [sizes, setSizes] = useState([]);
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [assortmentType, setAssortmentType] = useState("assorted");
  const [innerPcs, setInnerPcs] = useState({});
  const [outerPcs, setOuterPcs] = useState({});
  const [bundles, setBundles] = useState("");
  const [totalInnerPcs, setTotalInnerPcs] = useState(0);
  const [totalOuterPcs, setTotalOuterPcs] = useState(0);
  const [totalInnerPcsPerBundle, setTotalInnerPcsPerBundle] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

// get product by style number
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

  const handleInputChange = (e) => {
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
      setImageUrl('');
      setSelectedProduct(null);
    }
  };

  const handleStyleSelect = (e) => {
    setStyleNumber(e.style_no);
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
    setImageUrl(e.images[0]);
    setSelectedProduct(e);

    if (assortmentType === "solid") {
      const initialInnerPcs = e.Size.sizes.reduce((acc, size) => {
        acc[size] = e.inner_pcs;
        return acc;
      }, {});
      setInnerPcs(initialInnerPcs);
    } else {
      setInnerPcs({});
      setOuterPcs({});
    }
  };


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
    const stockData = {
      product_style_number: styleNumber,
      product_id: selectedProductId,
      packing_type: assortmentType,
      total_pcs: totalProducts,
      stock_by_size: sizes.map((size) => ({
        size,
        innerPcs: innerPcs[size],
        outerPcs: outerPcs[size]
      })),
      no_bundles: bundles,
    };

    try {
      const response = await apiService.post("/stocks/create", stockData);

      if (response.status === 200) {
      console.log("Stock created:", response.data);
      onClose();
      getAllStocks();
      } 
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Reference number of the product already exists.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      } else {
        setErrorMessage("Error adding Stock.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
      setSuccessMessage("");
    }
  };


  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[80vw] h-screen max-h-[90vh] overflow-auto py-10">
        <div className="flex justify-between items-center mb-4 relative px-20">
          <div className="flex justify-center gap-3">
            <h2 className="text-2xl font-medium">CREATE STOCK INWARD</h2>
          </div>
          {/* <p className="text-2xl font-medium">Date:</p> */}
          <button className="text-black absolute right-5" onClick={onClose}>
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between px-20 mb-4">

          <div className="flex flex-col grid grid-cols-3 2xl:grid-cols-5 gap-2">
            <div className="flex flex-col">
            <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="styleNumber">
                  Style No:
                </label>
                <input
                  type="text"
                  id="styleNumber"
                  value={styleNumber}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Style Number"
                />
              {styleDropdown && styleNumber && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {styleSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleStyleSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.style_no}
                      </li>
                    ))}
                  </ul>
                )}
                </div>
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="font-semibold" htmlFor="referenceNo">
              Reference No:
              </label>
              <input
                  type="text"
                  id="referenceNo"
                  value={ReferenceNo}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
                  disabled
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="font-semibold" htmlFor="category">
                  Category:
              </label>
              <input
                  type="text"
                  id="category"
                  value={category}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
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
                  value={productType}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
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
                  value={brand}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
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
                  value={fabric}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
                  disabled
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="font-semibold" htmlFor="fabric-finish">
                Fabric Fisnish:
              </label>
              <input
                  type="text"
                  id="fabric-finish"
                  value={fabricFinish}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
                  disabled
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="font-semibold" htmlFor="gsm">
                GSM:
              </label>
              <input
                  type="number"
                  id="gsm"
                  value={gsm}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
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
                  value={knitType}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
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
                  value={colors}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
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
                  value={sizes}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
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
                  value={decoration}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
                  disabled
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="font-semibold" htmlFor="print">
                Print or Emb:
              </label>
              <input
                  type="text"
                  id="print"
                  value={printOrEmb}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
                  disabled
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="font-semibold" htmlFor="stitch">
                Stitch Details:
              </label>
              <input
                  type="text"
                  id="stitch"
                  value={stitch}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
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
                  value={neck}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
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
                  value={length}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
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
                  value={sleeve}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
                  disabled
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="font-semibold" htmlFor="packing">
                Packing Method:
              </label>
              <input
                  type="text"
                  id="packing"
                  value={packingMethod}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
                  disabled
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="font-semibold" htmlFor="measurement">
                Measurement Chart:
              </label>
              <input
                  type="text"
                  id="measurement"
                  value={measurementChart}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
                  disabled
              />
            </div>

          </div>
          
          <div className="flex items-center justify-center border border-gray-400">
            <img
              src={imageUrl || 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1722163869~exp=1722167469~hmac=37361beb0ca1a1c652d36c9ca94818f793a54d21822edab80e80c6e43a9b7b37&w=740'}
              alt='Stock'
              className="h-60 w-60 object-cover rounded"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-3 mx-20">
              <label className="font-semibold" htmlFor="shortDescription">
                Short Description:
              </label>
              <textarea
                id="shortDescription"
                value={shortDescription}
                className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                rows="1"
                disabled
              />
            </div>

            <div className="flex flex-col gap-2 mt-3 mx-20">
              <label className="font-semibold" htmlFor="fullDescription">
                Full Description:
              </label>
              <textarea
                id="fullDescription"
                value={fullDescription}
                className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                rows="2"
                disabled
              />
            </div>

        <div className="px-20 my-4">
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

        <div className="px-20">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">Stock Info:</h3>
          </div>
          <div className="flex gap-4 border border-gray-400 px-5 justify-between">
            <div className="p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-4">Quantity per size:</h4>
              <div className="flex flex-col gap-4">
              {sizes.map((size, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <div className="w-16">{size}: </div>
              <input
                type="number"
                value={innerPcs[size] || ''}
                onChange={(e) => handleInnerPcsChange(size, e.target.value)}
                placeholder="Inner Pcs"
                className="border border-gray-300 rounded-md px-2 py-1 w-24"
                disabled={assortmentType === "solid"}
              />
              <input
                type="number"
                value={outerPcs[size] || ''}
                onChange={(e) => handleOuterPcsChange(size, e.target.value)}
                placeholder="Outer Pcs"
                className="border border-gray-300 rounded-md px-2 py-1 w-24"
              />
            </div>
          ))}
              </div>
            </div>

            <div className="px-20 content-center">
          <label className="font-semibold">Number of Bundles: </label>
          <input
            type="number"
            value={bundles}
            onChange={(e) => setBundles(Number(e.target.value))}
            placeholder="Bundles"
            className="border border-gray-300 rounded-md px-2 py-1 w-24"
          />
        </div>

        <div className="p-4 bg-gray-100 flex items-center justify-center mt-8 mb-8">
              <div className="flex flex-col gap-4">
                <div className="flex gap-5 justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Inner Pcs
                  </label>
                  <span>{totalInnerPcs}</span>
                </div>
                <div className="flex gap-5 justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Outer Pcs
                  </label>
                  <span>{totalOuterPcs}</span>
                </div>
                <div className="flex gap-5 justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Pcs per Bundle
                  </label>
                  <span>{totalInnerPcsPerBundle}</span>
                </div>
                <div className="flex gap-5 justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Pcs
                  </label>
                  <span>{totalProducts}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        {successMessage && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-4">
                <p>{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
                <p>{errorMessage}</p>
              </div>
            )}
        <div className="flex justify-end px-20 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            CREATE STOCK INWARD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;