import React, { useEffect, useState } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import apiService from "../../../apiService";

const CreatePoModal = ({ show, onClose, getAllPurchaseOrder }) => {
  const [buyer, setBuyer] = useState("");
  const [buyerLocation, setBuyerLocation] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString());
  const [styleNo, setStyleNo] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [fabric, setFabric] = useState("");
  const [fabricFinish, setFabricFinish] = useState("");
  const [gsm, setGsm] = useState(null);
  const [knitType, setKnitType] = useState("");
  const [category, setCategory] = useState("");
  const [colors, setColors] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [sizes, setSizes] = useState([]);
  const [decorations, setDecorations] = useState("");
  const [printOrEmbName, setPrintOrEmbName] = useState("");
  const [stitchDetails, setStitchDetails] = useState("");
  const [neck, setNeck] = useState("");
  const [sleeve, setSleeve] = useState("");
  const [length, setLength] = useState("");
  const [packingMethod, setPackingMethod] = useState("");
  const [productTypes, setProductTypes] = useState("");
  const [measurementChart, setMeasurementChart] = useState("");
  const [selectedMeasurementImage, setSelectedMeasurementImage] = useState(null);
  const [notes, setNotes] = useState("");
  const [assortmentType, setAssortmentType] = useState("");
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

  //suggestion styleNo states
  const [styleDropdown, setStyleDropdown] = useState(false);
  const [styleSuggestions, setStyleSuggestions] = useState([]);
  const [selectedStyleId, setSelectedStyleId] = useState(null);

  //suggestion brand states
  const [brandDropdown, setBrandDropdown] = useState(false);
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  //suggestion fabric states
  const [fabricDropdown, setFabricDropdown] = useState(false);
  const [fabricSuggestions, setFabricSuggestions] = useState([]);
  const [selectedFabricId, setSelectedFabricId] = useState(null);

  //suggestion Fabric Finish states
  const [fabricFinishDropdown, setFabricFinishDropdown] = useState(false);
  const [fabricFinishSuggestions, setFabricFinishSuggestions] = useState([]);
  const [selectedFabricFinishId, setSelectedFabricFinishId] = useState(null);

  //suggestion GSM states
  const [gsmDropdown, setGsmDropdown] = useState(false);
  const [gsmSuggestions, setGsmSuggestions] = useState([]);
  const [selectedGsmId, setSelectedGsmId] = useState(null);

  //suggestion knit type states
  const [knitDropdown, setKnitDropdown] = useState(false);
  const [knitSuggestions, setKnitSuggestions] = useState([]);
  const [selectedKnitId, setSelectedKnitId] = useState(null);

  //suggestion category states
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  //suggestion color states
  const [colorDropdown, setColorDropdown] = useState(false);
  const [colorSuggestions, setColorSuggestions] = useState([]);
  const [selectedColorId, setSelectedColorId] = useState(null);

  //suggestion size states
  const [sizeDropdown, setSizeDropdown] = useState(false);
  const [sizeSuggestions, setSizeSuggestions] = useState([]);
  const [selectedSizeId, setSelectedSizeId] = useState(null);

  //suggestion decorations states
  const [decorationDropdown, setDecorationDropdown] = useState(false);
  const [decorationSuggestions, setDecorationSuggestions] = useState([]);
  const [selecteDecorationId, setSelectedDecorationId] = useState(null);

  //suggestion print states
  const [printDropdown, setPrintDropdown] = useState(false);
  const [printSuggestions, setPrintSuggestions] = useState([]);
  const [selectedPrintId, setSelectedPrintId] = useState(null);

  //suggestion stitchDetails states
  const [stitchDetailDropdown, setStitchDetailDropdown] = useState(false);
  const [stitchDetailSuggestions, setStitchDetailSuggestions] = useState([]);
  const [selectedStitchDetailId, setSelectedStitchDetailId] = useState(null);

  //suggestion neck states
  const [neckDropdown, setNeckDropdown] = useState(false);
  const [neckSuggestions, setNeckSuggestions] = useState([]);
  const [selectedNeckId, setSelectedNeckId] = useState(null);

  //suggestion sleeve states
  const [sleeveDropdown, setSleeveDropdown] = useState(false);
  const [sleeveSuggestions, setSleeveSuggestions] = useState([]);
  const [selectedSleeveId, setSelectedSleeveId] = useState(null);

  //suggestion length states
  const [lengthDropdown, setLengthDropdown] = useState(false);
  const [lengthSuggestions, setLengthSuggestions] = useState([]);
  const [selectedLengthId, setSelectedLengthId] = useState(null);

  //suggestion packing states
  const [packingDropdown, setPackingDropdown] = useState(false);
  const [packingSuggestions, setPackingSuggestions] = useState([]);
  const [selectedPackingId, setSelectedPackingId] = useState(null);

  //suggestion productTypes states
  const [productTypesDropdown, setProductTypesDropdown] = useState(false);
  const [productTypesSuggestions, setProductTypesSuggestions] = useState([]);
  const [selectedProductTypesId, setSelectedProductTypesId] = useState(null);

  //suggestion mesurement states
  const [mesurementDropdown, setMesurementDropdown] = useState(false);
  const [mesurementSuggestions, setMesurementSuggestions] = useState([]);
  const [selectedMesurementId, setSelectedMesurementId] = useState(null);
  const [selectedMesurement, setSelectedMesurement] = useState(null);

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
        const response = await apiService.get("/styles/getall");
        const filteredStyles = response.data.filter((b) =>
          b.style_no.toLowerCase().startsWith(styleInput.toLowerCase())
        );
        setStyleSuggestions(filteredStyles);
      } else {
        setStyleSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching StyleNo:", error);
    }
  };

  const handleStyleChange = (e) => {
    const styleInput = e.target.value;
    setStyleNo(styleInput);
    setStyleDropdown(true);
    fetchStyleSuggestions(styleInput);
  };

  const handleStyleSelect = (style) => {
    setStyleNo(style.style_no);
    setShortDescription(style.short_description);
    setFullDescription(style.full_description);
    setSelectedStyleId(style.id);
    setStyleSuggestions([]);
    setStyleDropdown(false);
  };

  const handleAddNewStyleNo = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new style no:", styleNo);
    // Close the dropdown after adding the buyer
    setStyleDropdown(false);
  };

  // fetch brand
  const fetchBrandSuggestions = async (brandInput) => {
    try {
      if (brandInput.length > 0) {
        const response = await apiService.get("/brands/getall");
        const filteredBrands = response.data.filter((b) =>
          b.brandName.toLowerCase().startsWith(brandInput.toLowerCase())
        );
        setBrandSuggestions(filteredBrands);
      } else {
        setBrandSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleBrandChange = (e) => {
    const brandInput = e.target.value;
    setBrand(brandInput);
    setBrandDropdown(true);
    fetchBrandSuggestions(brandInput);
  };

  const handleBrandSelect = (brand) => {
    setBrand(brand.brandName);
    setSelectedBrandId(brand.id);
    setBrandSuggestions([]);
    setBrandDropdown(false);
  };

  const handleAddNewBrand = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new brand:", brand);
    // Close the dropdown after adding the buyer
    setBrandDropdown(false);
  };

  // fetch fabric
  const fetchFabricSuggestions = async (fabricInput) => {
    try {
      if (fabricInput.length > 0) {
        const response = await apiService.get("/fabrics/getall");
        const filteredfabrics = response.data.filter((b) =>
          b.fabricName.toLowerCase().startsWith(fabricInput.toLowerCase())
        );
        setFabricSuggestions(filteredfabrics);
      } else {
        setFabricSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching fabrics:", error);
    }
  };

  const handleFabricChange = (e) => {
    const fabricInput = e.target.value;
    setFabric(fabricInput);
    setFabricDropdown(true);
    fetchFabricSuggestions(fabricInput);
  };

  const handleFabricSelect = (fabric) => {
    setFabric(fabric.fabricName);
    setSelectedFabricId(fabric.id);
    setFabricSuggestions([]);
    setFabricDropdown(false);
  };

  const handleAddNewFabric = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new fabric:", fabric);
    // Close the dropdown after adding the buyer
    setFabricDropdown(false);
  };

  // fetch Fabric Finish
  const fetchFabricFinishSuggestions = async (fabricFinishInput) => {
    try {
      if (fabricFinishInput.length > 0) {
        const response = await apiService.get("/fabricFinishes/getall");
        const filteredFabricFinishs = response.data.filter((b) =>
          b.fabricFinishName
            .toLowerCase()
            .startsWith(fabricFinishInput.toLowerCase())
        );
        setFabricFinishSuggestions(filteredFabricFinishs);
      } else {
        setFabricFinishSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching fabric finish:", error);
    }
  };

  const handleFabricFinishChange = (e) => {
    const fabricFinishInput = e.target.value;
    setFabricFinish(fabricFinishInput);
    setFabricFinishDropdown(true);
    fetchFabricFinishSuggestions(fabricFinishInput);
  };

  const handleFabricFinishSelect = (fabricFinish) => {
    setFabricFinish(fabricFinish.fabricFinishName);
    setSelectedFabricFinishId(fabricFinish.id);
    setFabricFinishSuggestions([]);
    setFabricFinishDropdown(false);
  };

  const handleAddNewFabricFinish = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new fabric finish:", fabricFinish);
    // Close the dropdown after adding the buyer
    setFabricFinishDropdown(false);
  };

  // fetch GSM
  const fetchGsmSuggestions = async (gsmInput) => {
    try {
      if (gsmInput.length > 0) {
        const response = await apiService.get("/gsms/getall");
        const filteredGsms = response.data.filter((b) =>
          b.gsmValue.toString().startsWith(gsmInput)
        );
        console.log(gsmInput, filteredGsms);
        setGsmSuggestions(filteredGsms);
      } else {
        setGsmSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching gsm:", error);
    }
  };

  const handleGsmChange = (e) => {
    const gsmInput = e.target.value;
    setGsm(gsmInput);
    setGsmDropdown(true);
    fetchGsmSuggestions(gsmInput);
  };

  const handleGsmSelect = (gsm) => {
    setGsm(gsm.gsmValue);
    setSelectedGsmId(gsm.id);
    setGsmSuggestions([]);
    setGsmDropdown(false);
  };

  const handleAddNewGsm = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new gsm:", gsm);
    // Close the dropdown after adding the buyer
    setGsmDropdown(false);
  };

  // fetch knit type
  const fetchKnitSuggestions = async (knitInput) => {
    try {
      if (knitInput.length > 0) {
        const response = await apiService.get("/knitTypes/getall");
        const filteredKnit = response.data.filter((b) =>
          b.knitType.toLowerCase().startsWith(knitInput.toLowerCase())
        );
        setKnitSuggestions(filteredKnit);
      } else {
        setKnitSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching knit type:", error);
    }
  };

  const handleKnitChange = (e) => {
    const knitInput = e.target.value;
    setKnitType(knitInput);
    setKnitDropdown(true);
    fetchKnitSuggestions(knitInput);
  };

  const handleKnitSelect = (knit) => {
    setKnitType(knit.knitType);
    setSelectedKnitId(knit.id);
    setKnitSuggestions([]);
    setKnitDropdown(false);
  };

  const handleAddNewKnitType = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new knit type:", knitType);
    // Close the dropdown after adding the buyer
    setKnitDropdown(false);
  };

  // fetch categorie
  const fetchCategorySuggestions = async (categoryInput) => {
    try {
      if (categoryInput.length > 0) {
        const response = await apiService.get("/categories/getall");
        const filteredCategories = response.data.filter((b) =>
          b.categoryName.toLowerCase().startsWith(categoryInput.toLowerCase())
        );
        setCategorySuggestions(filteredCategories);
      } else {
        setCategorySuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (e) => {
    const categorieInput = e.target.value;
    setCategory(categorieInput);
    setCategoryDropdown(true);
    fetchCategorySuggestions(categorieInput);
  };

  const handleCategorySelect = (category) => {
    setCategory(category.categoryName);
    setSelectedCategoryId(category.id);
    setCategorySuggestions([]);
    setCategoryDropdown(false);
  };

  const handleAddNewCategory = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new category:", category);
    // Close the dropdown after adding the buyer
    setCategoryDropdown(false);
  };

  // fetch color
  const fetchColorSuggestions = async (colorInput) => {
    try {
      if (colorInput.length > 0) {
        const response = await apiService.get("/colors/getall");
        const filteredColors = response.data.filter((b) =>
          b.colorName.toLowerCase().startsWith(colorInput.toLowerCase())
        );
        setColorSuggestions(filteredColors);
      } else {
        setColorSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const handleColorChange = (e) => {
    const colorInput = e.target.value;
    setColors(colorInput);
    setColorDropdown(true);
    fetchColorSuggestions(colorInput);
  };

  const handleColorSelect = (color) => {
    setColors(color.colorName);
    setSelectedColorId(color.id);
    setColorSuggestions([]);
    setColorDropdown(false);
  };

  const handleAddNewColor = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new color:", colors);
    // Close the dropdown after adding the buyer
    setColorDropdown(false);
  };

  // Fetch size suggestions
  const fetchSizeSuggestions = async (sizeInput) => {
    try {
      if (sizeInput.length > 0) {
        const response = await apiService.get("/sizes/getall");
        const filteredSizes = response.data.filter((b) =>
          b.type_name.toLowerCase().startsWith(sizeInput.toLowerCase())
        );
        setSizeSuggestions(filteredSizes);
      } else {
        setSizeSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const handleSizeChange = (e) => {
    const sizeInput = e.target.value;
    setSizeInput(sizeInput);
    setSizeDropdown(true);
    fetchSizeSuggestions(sizeInput);
    if (sizeInput === "") {
      setSizes([]);
      setInnerPcs({});
      setOuterPcs({});
      setSizeDropdown(false);
    }
  };

  const handleSizeSelect = (size) => {
    setSizeInput(size.type_name);
    setSizes(size.sizes);
    setSelectedSizeId(size.id);
    setSizeSuggestions([]);
    setSizeDropdown(false);
  };

  const handleAddNewSize = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new size:", sizes);
    // Close the dropdown after adding the buyer
    setSizeDropdown(false);
  };

  // fetch decoration
  const fetchDecorationSuggestions = async (decorationInput) => {
    try {
      if (decorationInput.length > 0) {
        const response = await apiService.get("/decorations/getall");
        const filteredDecorations = response.data.filter((b) =>
          b.decorationName
            .toLowerCase()
            .startsWith(decorationInput.toLowerCase())
        );
        setDecorationSuggestions(filteredDecorations);
      } else {
        setDecorationSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching decorations:", error);
    }
  };

  const handleDecorationChange = (e) => {
    const decorationInput = e.target.value;
    setDecorations(decorationInput);
    setDecorationDropdown(true);
    fetchDecorationSuggestions(decorationInput);
  };

  const handleDecorationSelect = (decoration) => {
    setDecorations(decoration.decorationName);
    setSelectedDecorationId(decoration.id);
    setDecorationSuggestions([]);
    setDecorationDropdown(false);
  };

  const handleAddNewDecoration = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new decoration:", decorations);
    // Close the dropdown after adding the buyer
    setDecorationDropdown(false);
  };

  // fetch print
  const fetchPrintSuggestions = async (printInput) => {
    try {
      if (printInput.length > 0) {
        const response = await apiService.get("/printEmb/getall");
        const filteredPrintEmb = response.data.filter((b) =>
          b.printType.toLowerCase().startsWith(printInput.toLowerCase())
        );
        setPrintSuggestions(filteredPrintEmb);
      } else {
        setPrintSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching prints:", error);
    }
  };

  const handlePrintChange = (e) => {
    const printInput = e.target.value;
    setPrintOrEmbName(printInput);
    setPrintDropdown(true);
    fetchPrintSuggestions(printInput);
  };

  const handlePrintSelect = (print) => {
    setPrintOrEmbName(print.printType);
    setSelectedPrintId(print.id);
    setPrintSuggestions([]);
    setPrintDropdown(false);
  };

  const handleAddNewPrint = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new print/Emb:", printOrEmbName);
    // Close the dropdown after adding the buyer
    setPrintDropdown(false);
  };

  // fetch stitchDetails
  const fetchStitchSuggestions = async (stitchInput) => {
    try {
      if (stitchInput.length > 0) {
        const response = await apiService.get("/stitchDetails/getall");
        const filteredstitchDetails = response.data.filter((b) =>
          b.stictchDetail.toLowerCase().startsWith(stitchInput.toLowerCase())
        );
        setStitchDetailSuggestions(filteredstitchDetails);
      } else {
        setStitchDetailSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching stitchDetails:", error);
    }
  };

  const handleStitchDetailChange = (e) => {
    const stitchInput = e.target.value;
    setStitchDetails(stitchInput);
    setStitchDetailDropdown(true);
    fetchStitchSuggestions(stitchInput);
  };

  const handleStitchDetailSelect = (stitchDetails) => {
    setStitchDetails(stitchDetails.stictchDetail);
    setSelectedStitchDetailId(stitchDetails.id);
    setStitchDetailSuggestions([]);
    setStitchDetailDropdown(false);
  };

  const handleAddNewStitch = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new stitch detail:", stitchDetails);
    // Close the dropdown after adding the buyer
    setStitchDetailDropdown(false);
  };

  // fetch neck
  const fetchNeckSuggestions = async (neckInput) => {
    try {
      if (neckInput.length > 0) {
        const response = await apiService.get("/necks/getall");
        const filteredNecks = response.data.filter((b) =>
          b.neckType.toLowerCase().startsWith(neckInput.toLowerCase())
        );
        setNeckSuggestions(filteredNecks);
      } else {
        setNeckSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching neck:", error);
    }
  };

  const handleNeckChange = (e) => {
    const neckInput = e.target.value;
    setNeck(neckInput);
    setNeckDropdown(true);
    fetchNeckSuggestions(neckInput);
  };

  const handleNeckSelect = (neck) => {
    setNeck(neck.neckType);
    setSelectedNeckId(neck.id);
    setNeckSuggestions([]);
    setNeckDropdown(false);
  };

  const handleAddNewNeck = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new neck:", neck);
    // Close the dropdown after adding the buyer
    setNeckDropdown(false);
  };

  // fetch sleeve
  const fetchSleeveSuggestions = async (sleeveInput) => {
    try {
      if (sleeveInput.length > 0) {
        const response = await apiService.get("/sleeves/getall");
        const filteredSleeves = response.data.filter((b) =>
          b.sleeveName.toLowerCase().startsWith(sleeveInput.toLowerCase())
        );
        setSleeveSuggestions(filteredSleeves);
      } else {
        setSleeveSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching sleeve:", error);
    }
  };

  const handleSleeveChange = (e) => {
    const sleeveInput = e.target.value;
    setSleeve(sleeveInput);
    setSleeveDropdown(true);
    fetchSleeveSuggestions(sleeveInput);
  };

  const handleSleeveSelect = (sleeve) => {
    setSleeve(sleeve.sleeveName);
    setSelectedSleeveId(sleeve.id);
    setSleeveSuggestions([]);
    setSleeveDropdown(false);
  };

  const handleAddNewSleeve = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new sleeve:", sleeve);
    // Close the dropdown after adding the buyer
    setSleeveDropdown(false);
  };

  // fetch length
  const fetchLengthSuggestions = async (lengthInput) => {
    try {
      if (lengthInput.length > 0) {
        const response = await apiService.get("/lengths/getall");
        const filteredlengths = response.data.filter((b) =>
          b.lengthType.toLowerCase().startsWith(lengthInput.toLowerCase())
        );
        setLengthSuggestions(filteredlengths);
      } else {
        setLengthSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching lengths:", error);
    }
  };

  const handleLengthChange = (e) => {
    const lengthInput = e.target.value;
    setLength(lengthInput);
    setLengthDropdown(true);
    fetchLengthSuggestions(lengthInput);
  };

  const handleLengthSelect = (length) => {
    setLength(length.lengthType);
    setSelectedLengthId(length.id);
    setLengthSuggestions([]);
    setLengthDropdown(false);
  };

  const handleAddNewLength = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new length:", length);
    // Close the dropdown after adding the buyer
    setLengthDropdown(false);
  };

  // fetch packingMethods
  const fetchPackingMethodSuggestions = async (packingMethodInput) => {
    try {
      if (packingMethodInput.length > 0) {
        const response = await apiService.get("/packingMethods/getall");
        const filteredPackingMethods = response.data.filter((b) =>
          b.packingType
            .toLowerCase()
            .startsWith(packingMethodInput.toLowerCase())
        );
        setPackingSuggestions(filteredPackingMethods);
      } else {
        setPackingSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching packingMethods:", error);
    }
  };

  const handlePackingMethodChange = (e) => {
    const packingMethodInput = e.target.value;
    setPackingMethod(packingMethodInput);
    setPackingDropdown(true);
    fetchPackingMethodSuggestions(packingMethodInput);
  };

  const handlePackingMethodSelect = (packingMethod) => {
    setPackingMethod(packingMethod.packingType);
    setSelectedPackingId(packingMethod.id);
    setPackingSuggestions([]);
    setPackingDropdown(false);
  };

  const handleAddNewPackingMethod = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new packing method:", packingMethod);
    // Close the dropdown after adding the buyer
    setPackingDropdown(false);
  };

  // fetch product types
  const fetchProductTypesSuggestions = async (productTypesInput) => {
    try {
      if (productTypesInput.length > 0) {
        const response = await apiService.get("/productTypes/getall");
        const filteredProductTypes = response.data.filter((b) =>
          b.product.toLowerCase().startsWith(productTypesInput.toLowerCase())
        );
        setProductTypesSuggestions(filteredProductTypes);
      } else {
        setProductTypesSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleProductTypesChange = (e) => {
    const productTypesInput = e.target.value;
    setProductTypes(productTypesInput);
    setProductTypesDropdown(true);
    fetchProductTypesSuggestions(productTypesInput);
  };

  const handleProductTypesSelect = (productTypes) => {
    setProductTypes(productTypes.product);
    setSelectedProductTypesId(productTypes.id);
    setProductTypesSuggestions([]);
    setProductTypesDropdown(false);
  };

  const handleAddNewProductType = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new product types:", productTypes);
    // Close the dropdown after adding the buyer
    setProductTypesDropdown(false);
  };

  // fetch mesurementChart
  const fetchMesurementChartSuggestions = async (mesurementChartInput) => {
    try {
      if (mesurementChartInput.length > 0) {
        const response = await apiService.get("/mesurementCharts/getall");
        const filteredMesurementCharts = response.data.filter((b) =>
          b.name.toLowerCase().startsWith(mesurementChartInput.toLowerCase())
        );
        setMesurementSuggestions(filteredMesurementCharts);
      } else {
        setMesurementSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching mesurementChart:", error);
    }
  };

  const handleMesurementChartChange = (e) => {
    const mesurementChartInput = e.target.value;
    setMeasurementChart(mesurementChartInput);
    setMesurementDropdown(true);
    fetchMesurementChartSuggestions(mesurementChartInput);
  };

  const handleMesurementChartSelect = (mesurementChart) => {
    setMeasurementChart(mesurementChart.name);
    setSelectedMeasurementImage(mesurementChart.sample_size_file);
    setSelectedMesurement(mesurementChart);
    setSelectedMesurementId(mesurementChart.id);
    setMesurementSuggestions([]);
    setMesurementDropdown(false);
  };

  const handleAddNewMeasurement = () => {
    // Implement the logic to add a new buyer here
    console.log("Adding new Measurements:", measurementChart);
    // Close the dropdown after adding the buyer
    setMesurementDropdown(false);
  };

  // handle size quantity change
  const handleInnerPcsChange = (size, value) => {
    setInnerPcs((prev) => ({
      ...prev,
      [size]: Number(value),
    }));
  };

  const handleOuterPcsChange = (size, value) => {
    setOuterPcs((prev) => ({
      ...prev,
      [size]: Number(value),
    }));
  };

  useEffect(() => {
    const totalInner = Object.values(innerPcs).reduce(
      (sum, pcs) => sum + Number(pcs || 0),
      0
    );
    const totalOuter = Object.values(outerPcs).reduce(
      (sum, pcs) => sum + Number(pcs || 0),
      0
    );
    setTotalInnerPcs(totalInner);
    setTotalOuterPcs(totalOuter);

    const totalInnerPerBundle = sizes.reduce((sum, size) => {
      const inner = innerPcs[size] || 0;
      const outer = outerPcs[size] || 0;
      return sum + inner * outer;
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
      style_id: selectedStyleId,
      brand_id: selectedBrandId,
      fabric_id: selectedFabricId,
      fabric_finish_id: selectedFabricFinishId,
      gsm_id: selectedGsmId,
      knit_id: selectedKnitId,
      category_id: selectedCategoryId,
      color_id: selectedColorId,
      size_id: selectedSizeId,
      decoration_id: selecteDecorationId,
      print_emb_id: selectedPrintId,
      stitch_detail_id: selectedStitchDetailId,
      neck_id: selectedNeckId,
      sleeve_id: selectedSleeveId,
      length_id: selectedLengthId,
      packing_method_id: selectedPackingId,
      productType_id: selectedProductTypesId,
      measurement_chart_id: selectedMesurementId,
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
        onClose();
        console.log("Purchase order is created:", response.data);
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
              className="absolute right-5 cursor-pointer"
              onClick={onClose}
            >
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
          <hr className="my-2" />
          <div className="px-20">
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold" htmlFor="styleNo">
                  Purchase Order No:
                </label>
                <input
                  type="text"
                  id="purchaseOrderNo"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter po number"
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="buyer">
                  Buyer Name:
                </label>
                <input
                  type="text"
                  id="buyer"
                  value={buyer}
                  onChange={handleBuyerChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Buyer Name"
                />
                {buyerDropdown && buyer && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
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
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
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
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
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
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter delivery date"
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="styleNo">
                  Style No:
                </label>
                <input
                  type="text"
                  id="styleNo"
                  value={styleNo}
                  onChange={handleStyleChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Style No"
                />
                {styleDropdown && styleNo && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
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
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewStyleNo}
                      >
                        Add New Style: "{styleNo}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="brand">
                  Brand Name:
                </label>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={handleBrandChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Brand Name"
                />
                {brandDropdown && brand && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {brandSuggestions.length > 0 ? (
                      brandSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleBrandSelect(suggestion)}
                        >
                          {suggestion.brandName}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewBrand}
                      >
                        Add New Brand: "{brand}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="fabric">
                  Fabric:
                </label>
                <input
                  type="text"
                  id="fabric"
                  value={fabric}
                  onChange={handleFabricChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Fabric"
                />
                {fabricDropdown && fabric && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {fabricSuggestions.length > 0 ? (
                      fabricSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleFabricSelect(suggestion)}
                        >
                          {suggestion.fabricName}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewFabric}
                      >
                        Add New Fabric: "{fabric}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="fabricFinish">
                  Fabric Finish:
                </label>
                <input
                  type="text"
                  id="fabricFinish"
                  value={fabricFinish}
                  onChange={handleFabricFinishChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Fabric Finish"
                />
                {fabricFinishDropdown && fabricFinish && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {fabricFinishSuggestions.length > 0 ? (
                      fabricFinishSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleFabricFinishSelect(suggestion)}
                        >
                          {suggestion.fabricFinishName}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewFabricFinish}
                      >
                        Add New Fabric finish: "{fabricFinish}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="gsm">
                  GSM:
                </label>
                <input
                  type="number"
                  id="gsm"
                  value={gsm}
                  onChange={handleGsmChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter GSM"
                />
                {gsmDropdown && gsm && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {gsmSuggestions.length > 0 ? (
                      gsmSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleGsmSelect(suggestion)}
                        >
                          {suggestion.gsmValue}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewGsm}
                      >
                        Add New GSM: "{gsm}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="knitType">
                  Knit Type:
                </label>
                <input
                  type="text"
                  id="knitType"
                  value={knitType}
                  onChange={handleKnitChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Knit Type"
                />
                {knitDropdown && knitType && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {knitSuggestions.length > 0 ? (
                      knitSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleKnitSelect(suggestion)}
                        >
                          {suggestion.knitType}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewKnitType}
                      >
                        Add New knit type: "{knitType}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="category">
                  Category:
                </label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Category"
                />
                {categoryDropdown && category && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {categorySuggestions.length > 0 ? (
                      categorySuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleCategorySelect(suggestion)}
                        >
                          {suggestion.categoryName}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewCategory}
                      >
                        Add New category: "{category}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="color">
                  Color:
                </label>
                <input
                  type="text"
                  id="color"
                  value={colors}
                  onChange={handleColorChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Color"
                />
                {colorDropdown && colors && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {colorSuggestions.length > 0 ? (
                      colorSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleColorSelect(suggestion)}
                        >
                          {suggestion.colorName}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewColor}
                      >
                        Add New color: "{colors}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="size">
                  Size:
                </label>
                <input
                  type="text"
                  id="size"
                  value={sizeInput}
                  onChange={handleSizeChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Sizes"
                />
                {sizeDropdown && sizes && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {sizeSuggestions.length > 0 ? (
                      sizeSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSizeSelect(suggestion)}
                        >
                          {suggestion.type_name}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewSize}
                      >
                        Add New size: "{sizeInput}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="decoration">
                  Decorations:
                </label>
                <input
                  type="text"
                  id="decoration"
                  value={decorations}
                  onChange={handleDecorationChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Decorations"
                />
                {decorationDropdown && decorations && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {decorationSuggestions.length > 0 ? (
                      decorationSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleDecorationSelect(suggestion)}
                        >
                          {suggestion.decorationName}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewDecoration}
                      >
                        Add New decoration: "{decorations}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="print">
                  Print or Embed:
                </label>
                <input
                  type="text"
                  id="print"
                  value={printOrEmbName}
                  onChange={handlePrintChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Print or Embed"
                />
                {printDropdown && printOrEmbName && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {printSuggestions.length > 0 ? (
                      printSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handlePrintSelect(suggestion)}
                        >
                          {suggestion.printType}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewPrint}
                      >
                        Add New print/emb: "{printOrEmbName}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="stitch">
                  Stitch Details:
                </label>
                <input
                  type="text"
                  id="stitch"
                  value={stitchDetails}
                  onChange={handleStitchDetailChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Stitch details"
                />
                {stitchDetailDropdown && stitchDetails && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {stitchDetailSuggestions.length > 0 ? (
                      stitchDetailSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleStitchDetailSelect(suggestion)}
                        >
                          {suggestion.stictchDetail}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewStitch}
                      >
                        Add New stitch detail: "{stitchDetails}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="neck">
                  Neck:
                </label>
                <input
                  type="text"
                  id="neck"
                  value={neck}
                  onChange={handleNeckChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Neck"
                />
                {neckDropdown && neck && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {neckSuggestions.length > 0 ? (
                      neckSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleNeckSelect(suggestion)}
                        >
                          {suggestion.neckType}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewNeck}
                      >
                        Add New neck: "{neck}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="sleeve">
                  Sleeve:
                </label>
                <input
                  type="text"
                  id="sleeve"
                  value={sleeve}
                  onChange={handleSleeveChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Sleeve"
                />
                {sleeveDropdown && sleeve && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {sleeveSuggestions.length > 0 ? (
                      sleeveSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSleeveSelect(suggestion)}
                        >
                          {suggestion.sleeveName}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewSleeve}
                      >
                        Add New sleeve: "{sleeve}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="length">
                  Length:
                </label>
                <input
                  type="text"
                  id="length"
                  value={length}
                  onChange={handleLengthChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Length"
                />
                {lengthDropdown && length && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {lengthSuggestions.length > 0 ? (
                      lengthSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleLengthSelect(suggestion)}
                        >
                          {suggestion.lengthType}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewLength}
                      >
                        Add New length: "{length}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="packing">
                  Packing Method:
                </label>
                <input
                  type="text"
                  id="packing"
                  value={packingMethod}
                  onChange={handlePackingMethodChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Packaging Method"
                />
                {packingDropdown && packingMethod && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {packingSuggestions.length > 0 ? (
                      packingSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handlePackingMethodSelect(suggestion)}
                        >
                          {suggestion.packingType}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewPackingMethod}
                      >
                        Add New packing method: "{packingMethod}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="product-type">
                  Product Type:
                </label>
                <input
                  type="text"
                  id="product-type"
                  value={productTypes}
                  onChange={handleProductTypesChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Product Type"
                />
                {productTypesDropdown && productTypes && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {productTypesSuggestions.length > 0 ? (
                      productTypesSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleProductTypesSelect(suggestion)}
                        >
                          {suggestion.product}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewProductType}
                      >
                        Add New product type: "{productTypes}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="measurement-chart">
                  Measurement chart:
                </label>
                <input
                  type="text"
                  id="measurement-chart"
                  value={measurementChart}
                  onChange={handleMesurementChartChange}
                  className="border border-gray-300 rounded-md px-2 py-2 bg-zinc-200"
                  placeholder="Enter Measurement chart"
                />
                {mesurementDropdown && measurementChart && (
                  <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {mesurementSuggestions.length > 0 ? (
                      mesurementSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleMesurementChartSelect(suggestion)}
                        >
                          {suggestion.name}
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-200"
                        onClick={handleAddNewMeasurement}
                      >
                        Add New measurement chart: "{measurementChart}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              

            </div>

            <div className="flex flex-col gap-2 mt-3">
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

            <div className="flex flex-col gap-2 mt-3">
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
                    onChange={(e) => setAssortmentType(e.target.value)}
                    className="mx-1"
                  />
                  Assorted
                </label>
                <label>
                  <input
                    type="radio"
                    value="solid"
                    checked={assortmentType === "solid"}
                    onChange={(e) => setAssortmentType(e.target.value)}
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
                  <h4 className="text-sm font-medium mb-4">
                    Quantity per size:
                  </h4>
                  <div className="flex flex-col gap-4">
                    {sizes.map((size, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 mb-4"
                      >
                        <span className="mr-2">{size} :</span>
                        <input
                          type="number"
                          placeholder="Inner PCS"
                          value={innerPcs[size] || ''}
                          onChange={(e) => handleInnerPcsChange(size, e.target.value)}
                          className="border border-gray-300 px-2 py-1 rounded w-24"
                        />
                        <input
                          type="number"
                          placeholder="Outer PCS"
                          value={outerPcs[size] || ''}
                          onChange={(e) => handleOuterPcsChange(size, e.target.value)}  
                          className="border border-gray-300 px-2 py-1 rounded w-24"
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

                <div className="py-4 px-8 bg-gray-100 flex items-center justify-center mt-8 mb-8">
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
              CREATE PURCHASE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoModal;
