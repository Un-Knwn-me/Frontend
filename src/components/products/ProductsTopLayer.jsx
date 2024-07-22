import React, { useState } from "react";
import dropdownIcon from "../../assets/dropdown-icon.svg";
import StyleNo from "./StyleNo";

import Brand from "./Brand";
import Fabric from "./Fabric";
import FabricFinish from "./FabricFinish";
import GSM from "./GSM";
import KnitType from "./KnitType";
import Colors from "./Colors";
import Sizes from "./Sizes";
import Decorations from "./Decorations";
import PrintOrEmb from "./PrintOrEmb";
import StitchDetails from "./StitchDetails";
import Neck from "./Neck";
import Length from "./Length";
import MeasurementChart from "./MeasurementChart";
import PackingMethod from "./PackingMethod";
import Sleeve from "./Sleeve";
import searchIcon from "../../assets/search-icon.svg";
import addIcon from "../../assets/add-icon.svg";
import noDataImage from "../../assets/no-data1.png";
import Category from "./Category";
import ProductTypes from "./ProductTypes";
import Buyer from "./Buyer";

const ProductsTopLayer = ({
  showDropdown = true,
  showSearch = true,
  showAddButton = true,
}) => {
  const [selectedPreset, setSelectedPreset] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const presets = [
    { id: "pr1", value: "1", label: "Style No", component: StyleNo },
    { id: "pr2", value: "2", label: "Category", component: Category,},
    { id: "pr3", value: "3", label: "Brand", component: Brand },
    { id: "pr4", value: "4", label: "Fabric", component: Fabric },
    { id: "pr5", value: "5", label: "Fabric Finish", component: FabricFinish },
    { id: "pr6", value: "6", label: "GSM", component: GSM },
    { id: "pr7", value: "7", label: "Knit type", component: KnitType },
    { id: "pr8", value: "8", label: "Colors", component: Colors },
    { id: "pr9", value: "9", label: "Sizes", component: Sizes },
    { id: "pr10", value: "10", label: "Decorations", component: Decorations },
    {
      id: "pr11",
      value: "11",
      label: "Print or Emb name",
      component: PrintOrEmb,
    },

    {
      id: "pr12",
      value: "12",
      label: "Stitch details",
      component: StitchDetails,
    },
    { id: "pr13", value: "13", label: "Neck", component: Neck },
    { id: "pr14", value: "14", label: "Sleeve", component: Sleeve },
    { id: "pr15", value: "15", label: "Length", component: Length },
    {
      id: "pr16",
      value: "16",
      label: "Measurement chart",
      component: MeasurementChart,
    },
    {
      id: "pr17",
      value: "17",
      label: "Packing method",
      component: PackingMethod,
    },
    {
      id: "pr18",
      value: "18",
      label: "ProductTypes",
      component: ProductTypes,
    },
    { id: "pr19", value: "19", label: "Buyers", component: Buyer },
  ];

  const handlePresetChange = (event) => {
    setSelectedPreset(event.target.value);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const getCategoryText = () => {
    if (!selectedPreset) {
      return "Select Category";
    }
    const selectedCategory = presets.find(
      (preset) => preset.value === selectedPreset
    );
    return selectedCategory ? selectedCategory.label : "Select Category";
  };

  const renderSelectedComponent = () => {
    if (!selectedPreset) {
      return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col text-center">
            <img
              src={noDataImage}
              alt="No Data"
              className="flex flex-grow object-cover max-w-[600px]"
            />
            <span className="mt-4 text-black font-bold text-2xl">
              Select product category to show data
            </span>
          </div>
        </div>
      );
    }
    const selectedCategory = presets.find(
      (preset) => preset.value === selectedPreset
    );
    return selectedCategory ? (
      <selectedCategory.component
        searchQuery={searchQuery}
        isModalOpen={isModalOpen}
        onClose={onClose}
      />
    ) : null;
  };

  const addButtonLabel = () => {
    if (selectedPreset) {
      const selectedPresetObj = presets.find(
        (preset) => preset.value === selectedPreset
      );
      return selectedPresetObj ? `Add ${selectedPresetObj.label}` : "Add";
    }
    return "Add";
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center px-4 py-2 min-h-[80px] bg-white">
        {showDropdown && (
          <div className="relative mr-4">
            <span className="text-xs font-medium">Select Product Category</span>
            <div
              className="flex items-center cursor-pointer bg-gray-200 px-4 py-2 rounded-lg relative min-w-48"
              onClick={toggleDropdown}
            >
              <span
                className="hover:underline flex items-center"
                title="Nav Link 2"
              >
                {getCategoryText()}
              </span>
              <img
                src={dropdownIcon}
                alt="Dropdown Icon"
                className="ml-2 w-4 h-4 absolute right-2"
              />
            </div>
            {isDropdownOpen && (
              <ul className="list-none absolute bg-white shadow-lg rounded-md mt-2 p-2 z-10 max-h-[75vh] overflow-y-auto">
                {presets.map((preset) => (
                  <li className="p-2 whitespace-nowrap" key={preset.id}>
                    <label className="flex items-center justify-between space-x-2 w-full">
                      <span>{preset.label}</span>
                      <input
                        type="radio"
                        className="rb hidden"
                        id={preset.id}
                        name="preset"
                        value={preset.value}
                        checked={selectedPreset === preset.value}
                        onChange={handlePresetChange}
                      />
                      <span className="custom-radio"></span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {showSearch && (
          <div className="flex-grow mx-4 flex justify-center items-center">
            <div className="relative">
              <img
                src={searchIcon}
                alt="Search Icon"
                className="absolute left-3 w-4 h-4 mt-3"
              />
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 pl-12 border rounded-lg 2xl:w-[400px] xl:w-[350px] min-w-[200px]"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        )}
        {showAddButton && (
          <div className="ml-4">
            <button
              className="font-bold px-4 py-2 rounded-lg flex"
              onClick={openModal}
            >
              <img src={addIcon} alt="Add Icon" className="w-6 h-6 mr-2" />
              <span>{addButtonLabel()}</span>
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 w-full">{renderSelectedComponent()}</div>
    </div>
  );
};

export default ProductsTopLayer;
