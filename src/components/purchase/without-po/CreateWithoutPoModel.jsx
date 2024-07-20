import React, { useEffect, useState } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import apiService from "../../../apiService";

const CreateWithoutPOModel = ({ show, onClose }) => {
  const [buyer, setBuyer] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [referenceDropdown, setReferenceDropdown] = useState(false);
  const [referenceSuggestions, setReferenceSuggestions] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [styleNo, setStyleNo] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [productType, setProductType] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString());;
  const [assortmentType, setAssortmentType] = useState("assorted");
  const [innerPcs, setInnerPcs] = useState({});
  const [outerPcs, setOuterPcs] = useState({});
  const [bundles, setBundles] = useState("");
  const [totalInnerPcs, setTotalInnerPcs] = useState(0);
  const [totalOuterPcs, setTotalOuterPcs] = useState(0);
  const [totalInnerPcsPerBundle, setTotalInnerPcsPerBundle] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [dia, setDia] = useState('');
  const [notes, setNotes] = useState('');

  const handleDeliveryDateChange = (e) => {
    const inputDate = e.target.value;
    setDeliveryDate(new Date(inputDate).toISOString());
  };
  

  // get product by reference number
  const fetchReferenceSuggestions = async (referenceInput) => {
    try {
      if (referenceInput.length > 0) {
        const response = await apiService.get("/products/getall");
        const filteredProduct = response.data.filter((e) =>
          e.reference_number.toLowerCase().startsWith(referenceInput.toLowerCase())
        );
        console.log(filteredProduct);
        setReferenceSuggestions(filteredProduct);
      } else {
        setReferenceSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching Product:", error);
    }
  };

  const handleInputChange = (e) => {
    const referenceInput = e.target.value;
    if (referenceInput.length > 0) {
    setReferenceNumber(referenceInput);
    setReferenceDropdown(true);
    fetchReferenceSuggestions(referenceInput);
    } else {
      setReferenceNumber("");
      setReferenceDropdown(false);
      setStyleNo("");
      setSizes([]);
      setSelectedProduct(null);
    }
  };

  const handleReferenceSelect = (e) => {
    setReferenceNumber(e.reference_number);
    setSelectedProductId(e.id);
    setReferenceSuggestions([]);
    setReferenceDropdown(false);
    setBrand(e.Brand.brandName);
    setStyleNo(e.Style.style_no);
    setCategory(e.Category.categoryName);
    setProductType(e.ProductType.product)
    setSizes(e.Size.sizes);
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
    const purchaseData = {
      order_type: "Without Purchase Order",
      product_reference_no: referenceNumber,
      product_id: selectedProductId,
      buyer: buyer,
      notes: notes,
      total_purchase_qty: totalProducts,
      delivery_date: deliveryDate,
      diameter: dia,
      packing_type: assortmentType,
      purchase_by_size: sizes.map((size) => ({
        size,
        innerPcs: innerPcs[size],
        outerPcs: outerPcs[size]
      })),
      stock_out_no_bundles: bundles,
    };

    try {
      console.log(purchaseData);
      const response = await apiService.post("/purchases/create", purchaseData);
      console.log("Purchase order is created:", response.data);
      onClose();
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
            <h2 className="text-xl font-bold">Create Without Purchase Order</h2>
            <button className="absolute right-5 cursor-pointer" onClick={onClose}>
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
          <hr className="my-2" />
          <div className="px-20">
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="styleNo">
                  Purchase Order No:
                </label>
                <input
                  type="text"
                  id="purchaseOrderNo"
                  value="Without Purchase Order"
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter po number"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="referenceNo">
                  Buyer:
                </label>
                <input
                  type="text"
                  id="buyer"
                  value={buyer}
                  onChange={(e) => setBuyer(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter buyer"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="deliveryDate">
                  Delivery date:
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  value={deliveryDate.split("T")[0]}
                  onChange={handleDeliveryDateChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter delivery date"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="diameter">
                  Diameter:
                </label>
                <input
                  type="number"
                  id="diameter"
                  value={dia}
                  onChange={(e) => setDia(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter bundle dia"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3 relative">
                <label className="font-semibold" htmlFor="fabric">
                  Reference No:
                </label>
                <input
                  type="text"
                  id="referenceNumber"
                  value={referenceNumber}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Fabric"
                />
                {referenceDropdown && referenceNumber && (
                      <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                        {referenceSuggestions.map((item) => (
                          <li
                            key={item.id}
                            onClick={() => handleReferenceSelect(item)}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          >
                            {item.reference_number}
                          </li>
                        ))}
                      </ul>
                    )}
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="Brand">
                  Brand:
                </label>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="gsm">
                  Style No
                </label>
                <input
                  type="text"
                  id="styleNo"
                  value={styleNo}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="colors">
                  Category:
                </label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="sizes">
                  Product Type:
                </label>
                <input
                  type="text"
                  id="productType"
                  value={productType}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
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

            <div className="content-center">
          <label className="font-semibold">No of Bundles: </label>
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
          </div>
          <div className="flex justify-center px-20 mt-5">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            CREATE WITHOUT PURCHASE ORDER
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWithoutPOModel;
