import React, { useState } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";

const CreateWithoutPoModal = ({ show, onClose }) => {
  const [styleNo, setStyleNo] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [brand, setBrand] = useState("");
  const [fabric, setFabric] = useState("");
  const [fabricFinish, setFabricFinish] = useState("");
  const [gsm, setGsm] = useState("");
  const [knitType, setKnitType] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [decorations, setDecorations] = useState("");
  const [printOrEmbName, setPrintOrEmbName] = useState("");
  const [stitchDetails, setStitchDetails] = useState("");


  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[80vw] h-screen max-h-[98vh] overflow-y-auto lg:overflow-hidden">
        <div className="px-10 py-5">
          <div className="flex justify-center">
            <h2 className="text-xl font-bold">Create Without PO</h2>
            <button className="absolute right-5 cursor-pointer" onClick={onClose}>
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
          <hr className="my-2" />
          <div className="px-40">
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="referenceNo">
                  Buyer
                </label>
                <input
                  type="text"
                  id="referenceNo"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter buyer"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="brand">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Brand"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="fabric">
                  Fabric
                </label>
                <input
                  type="text"
                  id="fabric"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Fabric"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="fabricFinish">
                  GSM
                </label>
                <input
                  type="text"
                  id="fabricFinish"
                  value={fabricFinish}
                  onChange={(e) => setFabricFinish(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter GSM"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="gsm">
                  Style no
                </label>
                <input
                  type="text"
                  id="gsm"
                  value={gsm}
                  onChange={(e) => setGsm(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter style no"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="knitType">
                  Reference no
                </label>
                <input
                  type="text"
                  id="knitType"
                  value={knitType}
                  onChange={(e) => setKnitType(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter reference no"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="colors">
                  Print emb details
                </label>
                <input
                  type="text"
                  id="colors"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter print emb details"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="sizes">
                  Unique name
                </label>
                <input
                  type="text"
                  id="sizes"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter unique name"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="decorations">
                  PO Qty
                </label>
                <input
                  type="text"
                  id="decorations"
                  value={decorations}
                  onChange={(e) => setDecorations(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter po qty"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="printOrEmbName">
                  Size
                </label>
                <input
                  type="text"
                  id="printorEmbName"
                  value={printOrEmbName}
                  onChange={(e) => setPrintOrEmbName(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter size"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="stitchDetails">
                  Dia
                </label>
                <input
                  type="text"
                  id="stitchDetails"
                  value={stitchDetails}
                  onChange={(e) => setStitchDetails(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter dia"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="styleNo">
                  Colors Qty
                </label>
                <input
                  type="text"
                  id="styleNo"
                  value={styleNo}
                  onChange={(e) => setStyleNo(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter colors qty"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold" htmlFor="styleNo">
                  Delivery date
                </label>
                <input
                  type="text"
                  id="styleNo"
                  value={styleNo}
                  onChange={(e) => setStyleNo(e.target.value)}
                  className="border border-gray-300  rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter delivery date"
                />
              </div>
            </div>
            <p className="font-semibold mt-5">Quantity</p>
            <div className="flex justify-between w-full mt-5 border p-5">

              <div className="rounded overflow-hidden border-0">
                <div className="px-6 py-4">
                  <div className="mb-2">No inners packs</div>
                  <div className="md:flex md:items-center mb-3">
                    <div className="md:w-1/3">
                      <label className="block font-bold md:text-right mb-1 md:mb-0 pr-4 text-sm" for="inline-full-name">
                        M
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input className="border-2 border-gray-200 rounded w-20 py-1 px-4 text-gray-700 leading-tight focus:outline-none" type="text" />
                    </div>
                  </div>
                  <div className="md:flex md:items-center mb-3">
                    <div className="md:w-1/3">
                      <label className="block font-bold md:text-right mb-1 md:mb-0 pr-4 text-sm" for="inline-full-name">
                        L
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input className="border-2 border-gray-200 rounded w-20 py-1 px-4 text-gray-700 leading-tight focus:outline-none" type="text" />
                    </div>
                  </div>
                  <div className="md:flex md:items-center mb-3">
                    <div className="md:w-1/3">
                      <label className="block font-bold md:text-right mb-1 md:mb-0 pr-4 text-sm" for="inline-full-name">
                        XL
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input className="border-2 border-gray-200 rounded w-20 py-1 px-4 text-gray-700 leading-tight focus:outline-none" type="text" />
                    </div>
                  </div>
                  <div className="md:flex md:items-center mb-3">
                    <div className="md:w-1/3">
                      <label className="block font-bold md:text-right mb-1 md:mb-0 pr-4 text-sm" for="inline-full-name">
                        XXL
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input className="border-2 border-gray-200 rounded w-20 py-1 px-4 text-gray-700 leading-tight focus:outline-none" type="text" />
                    </div>
                  </div>
                  <div className="md:flex md:items-center mb-3">
                    <div className="md:w-1/3">
                      <label className="block font-bold md:text-right mb-1 md:mb-0 pr-4 text-sm" for="inline-full-name">
                        XXXL
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input className="border-2 border-gray-200 rounded w-20 py-1 px-3 text-gray-700 leading-tight focus:outline-none" type="text" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center" >
                <span className="mr-2" >No of bundles</span>
                <input type="text" className="w-28 border border-gray-600 py-1 px-4 text-black" />
              </div>


              <div className="border-0 p-10 bg-gray-100 h-screen mt-5 max-w-[20vw] max-h-[25vh]">
                <p className="flex text-gray-700 text-base gap-x-12">Total inner packs <span>125</span></p>
                <p className="flex text-gray-700 text-base mt-3 gap-x-20">Pcs per packs <span>12</span></p>
                <p className="flex text-gray-700 text-base mt-3 gap-x-10">Total pcs in bundle <span>1500</span></p>
                <p className="flex font-bold text-2xl mt-10 gap-x-16">Total pcs <span>15000</span></p>
              </div>
            </div>
            <button className="bg-sky-600 px-28 py-3 text-white absolute bottom-5 right-40 rounded-lg font-bold text-sm mr-10">Create PO</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWithoutPoModal;
