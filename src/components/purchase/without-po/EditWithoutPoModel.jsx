import React, { useState, useEffect } from "react";
import editIcon from "../../../assets/edit-icon.svg";
import closeIcon from "../../../assets/close-modal-icon.svg";
import apiService from "../../../apiService";

const EditWithoutPoModal = ({ show, onClose, productId }) => {
  const [buyer, setBuyer] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [referenceDropdown, setReferenceDropdown] = useState(false);
  const [purchaseOrder, setPurchaseOrder] = useState({});
  const [referenceSuggestions, setReferenceSuggestions] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [styleNo, setStyleNo] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [productType, setProductType] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split("T")[0]); 
  const [assortmentType, setAssortmentType] = useState("");
  const [innerPcs, setInnerPcs] = useState({});
  const [outerPcs, setOuterPcs] = useState({});
  const [bundles, setBundles] = useState(''); 
  const [totalInnerPcs, setTotalInnerPcs] = useState(0);
  const [totalOuterPcs, setTotalOuterPcs] = useState(0);
  const [totalInnerPcsPerBundle, setTotalInnerPcsPerBundle] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [dia, setDia] = useState('');
  const [notes, setNotes] = useState('');

  const handleDeliveryDateChange = (e) => {
    setDeliveryDate(e.target.value); 
  };

  // get purchaseOrder by id
  const getPurchaseOrder = async (productId) => {
    try {
      const response = await apiService.get(`/purchases/${productId}`);

      if (response.status === 200) {
        console.log(response.data);
        const data = response.data;
        setPurchaseOrder(data);
        setDeliveryDate(data.delivery_date.split("T")[0]);
        setAssortmentType(data.packing_type) 
        setBrand(data.Product.Brand.brandName);
        setStyleNo(data.Product.Style.style_no);
        setCategory(data.Product.Category.categoryName);
        setProductType(data.Product.ProductType.product);
        setSizes(data.purchase_by_size.map(item => ({
          size: item.size,
          innerPcs: item.innerPcs,
          outerPcs: item.outerPcs
        })));

        // Set initial innerPcs and outerPcs based on response
        if (data.packing_type === "solid") {
          const initialInnerPcs = data.purchase_by_size.reduce((acc, item) => {
            acc[item.size] = item.innerPcs;
            return acc;
          }, {});
          setInnerPcs(initialInnerPcs);
          const initialOuterPcs = data.purchase_by_size.reduce((acc, item) => {
            acc[item.size] = item.outerPcs;
            return acc;
          }, {});
          setOuterPcs(initialOuterPcs);
        } else {
          setInnerPcs({});
          setOuterPcs({});
        }
      } else {
        setPurchaseOrder({});
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
    setProductType(e.ProductType.product);
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
    const value = e.target.value;
    setAssortmentType(value);
    if (value === "solid" && selectedProduct) {
      const initialInnerPcs = selectedProduct.Size.sizes.reduce((acc, size) => {
        acc[size] = selectedProduct.inner_pcs;
        return acc;
      }, {});
      setInnerPcs(initialInnerPcs);
    } else {
      setInnerPcs({});
      setOuterPcs({});
    }
  };

  const handleInnerPcsChange = (size, value) => {
    setInnerPcs(prev => ({
      ...prev,
      [size]: Number(value) || 0
    }));
  };

  const handleOuterPcsChange = (size, value) => {
    setOuterPcs(prev => ({
      ...prev,
      [size]: Number(value) || 0
    }));
  };

  useEffect(() => {
    if (productId) {
      getPurchaseOrder(productId);
    }
  }, [productId]);

  useEffect(() => {
    const totalInner = Object.values(innerPcs).reduce((sum, pcs) => sum + pcs, 0);
    const totalOuter = Object.values(outerPcs).reduce((sum, pcs) => sum + pcs, 0);
    setTotalInnerPcs(totalInner);
    setTotalOuterPcs(totalOuter);

    const totalInnerPerBundle = sizes.reduce((sum, sizeItem) => {
      const inner = innerPcs[sizeItem.size] || 0;
      const outer = outerPcs[sizeItem.size] || 0;
      return sum + (inner * outer);
    }, 0);

    setTotalInnerPcsPerBundle(totalInnerPerBundle);
    const totalProducts = totalInnerPerBundle * bundles;
    setTotalProducts(totalProducts);
  }, [innerPcs, outerPcs, bundles, sizes]);

  const handleSubmit = async () => {
    // Handle the submit logic
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
            <h2 className="text-xl font-bold">Edit Purchase Order</h2>
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
                  value={purchaseOrder.purchase_order_number || ""}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter po number"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="buyer">
                  Buyer:
                </label>
                <input
                  type="text"
                  id="buyer"
                  value={purchaseOrder?.Buyer?.name || ""}
                  // onChange={(e) => setBuyer(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter buyer"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="location">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  // value={purchaseOrder?.Buyer?.location || ""}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="deliveryDate">
                  Delivery date:
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  value={deliveryDate}
                  onChange={handleDeliveryDateChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter delivery date"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3 relative">
                <label className="font-semibold" htmlFor="styleNo">
                  Style No:
                </label>
                <input
                  type="text"
                  id="styleNo"
                  value={purchaseOrder.product_style_number || ""}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Style No"
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
                value={purchaseOrder.notes}
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
                    {sizes.map((sizeItem, index) => (
                      <div key={index} className="flex items-center gap-4 mb-2">
                        <div className="w-16">{sizeItem.size}: </div>
                        <input
                          type="number"
                          value={innerPcs[sizeItem.size] || sizeItem.innerPcs}
                          onChange={(e) => handleInnerPcsChange(sizeItem, e.target.value)}
                          placeholder="Inner Pcs"
                          className="border border-gray-300 rounded-md px-2 py-1 w-24"
                          disabled={assortmentType === "solid"}
                        />
                        <input
                          type="number"
                          value={outerPcs[sizeItem.size] || sizeItem.outerPcs}
                          onChange={(e) => handleOuterPcsChange(sizeItem, e.target.value)}
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
                    value={purchaseOrder.stock_out_no_bundles}
                    onChange={(e) => setBundles(Number(e.target.value) || 0)}
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
                      <span>{totalProducts || purchaseOrder.total_purchase_qty}</span>
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
              CREATE PURCHASE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditWithoutPoModal;
