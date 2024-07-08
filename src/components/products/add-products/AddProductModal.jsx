import React, { useState } from "react";
import closeIcon from "../../../assets/close-modal-icon.svg";
import { Uploader } from "uploader"; // Installed by "react-uploader".
import { UploadButton } from "react-uploader";
import apiService from "../../../apiService";

const AddProductModal = ({ show, onClose }) => {
  const [styleNo, setStyleNo] = useState("");
  const [referenceNo] = useState("");
  const [brand, setBrand] = useState("");
  const [fabric, setFabric] = useState("");
  const [fabricFinish, setFabricFinish] = useState("");
  const [gsm, setGsm] = useState(null);
  const [knitType, setKnitType] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [decorations, setDecorations] = useState("");
  const [printOrEmbName, setPrintOrEmbName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [stitchDetails, setStitchDetails] = useState("");
  const [neck, setNeck] = useState("");
  const [sleeve, setSleeve] = useState("");
  const [length, setLength] = useState("");
  const [measurementChart, setMeasurementChart] = useState("");
  const [packingMethod, setPackingMethod] = useState("");
  const [inner, setInner] = useState("");
  const [outerCorton, setOuterCorton] = useState("");
  const [categorie, setCategorie] = useState("");

  //suggestion brand states
  const [brandDropdown, setBrandDropdown] = useState(false);
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  //suggestion fabric states
  const [fabricDropdown, setFabricDropdown] = useState(false);
  const [fabricSuggestions, setFabricSuggestions] = useState([]);
  const [selectedFabricId, setSelectedFabricId] = useState(null);

  //suggestion styleNo states
  const [styleDropdown, setStyleDropdown] = useState(false);
  const [styleSuggestions, setStyleSuggestions] = useState([]);
  const [selectedStyleId, setSelectedStyleId] = useState(null);

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

  //suggestion brand states
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

  //suggestion inner states
  const [innerDropdown, setInnerDropdown] = useState(false);
  const [innerSuggestions, setInnerSuggestions] = useState([]);
  const [selectedInnerId, setSelectedInnerId] = useState(null);

  //suggestion outerCorton states
  const [outerCortonDropdown, setOuterCortonDropdown] = useState(false);
  const [outerCortonSuggestions, setOuterCortonSuggestions] = useState([]);
  const [selectedOuterCortonId, setSelectedOuterCortonId] = useState(null);

  //suggestion mesurement states
  const [mesurementDropdown, setMesurementDropdown] = useState(false);
  const [mesurementSuggestions, setMesurementSuggestions] = useState([]);
  const [selectedMesurementId, setSelectedMesurementId] = useState(null);

  //suggestion categorie states
  const [categorieDropdown, setCategorieDropdown] = useState(false);
  const [categorieSuggestions, setCategorieSuggestions] = useState([]);
  const [selectedCategorieId, setSelectedCategorieId] = useState(null);

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);

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
    setSelectedStyleId(style.id);
    setStyleSuggestions([]);
    setStyleDropdown(false);
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

  // fetch GSM
  const fetchGsmSuggestions = async (gsmInput) => {
    try {
      if (gsmInput.length > 0) {
        const response = await apiService.get("/gsms/getall");
        const filteredGsms = response.data.filter((b) =>
          b.gsmValue.startsWith(gsmInput)
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

  // fetch size
  const fetchSizeSuggestions = async (sizeInput) => {
    try {
      if (sizeInput.length > 0) {
        const response = await apiService.get("/sizes/getall");
        const filteredSizes = response.data.filter((b) =>
          b.sizes.toLowerCase().startsWith(sizeInput.toLowerCase())
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
    setBrand(sizeInput);
    setSizeDropdown(true);
    fetchSizeSuggestions(sizeInput);
  };

  const handleSizeSelect = (size) => {
    setSizes(size.sizes);
    setSelectedSizeId(size.id);
    setSizeSuggestions([]);
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
    setSelectedBrandId(stitchDetails.id);
    setStitchDetailSuggestions([]);
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

  
  // fetch packingMethods
  const fetchPackingMethodSuggestions = async (packingMethodInput) => {
    try {
      if (packingMethodInput.length > 0) {
        const response = await apiService.get("/packingMethods/getall");
        const filteredPackingMethods = response.data.filter((b) =>
          b.packingType.toLowerCase().startsWith(packingMethodInput.toLowerCase())
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

  
  // fetch inner
  const fetchInnerSuggestions = async (innerInput) => {
    try {
      if (innerInput.length > 0) {
        const response = await apiService.get("/innerPcs/getall");
        const filteredInners = response.data.filter((b) =>
          b.number_of_pcs.toLowerCase().startsWith(innerInput.toLowerCase())
        );
        setInnerSuggestions(filteredInners);
      } else {
        setInnerSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching inner:", error);
    }
  };

  const handleInnerChange = (e) => {
    const innerInput = e.target.value;
    setInner(innerInput);
    setInnerDropdown(true);
    fetchInnerSuggestions(innerInput);
  };

  const handleInnerSelect = (inner) => {
    setInner(inner.number_of_pcs);
    setSelectedInnerId(inner.id);
    setInnerSuggestions([]);
    setInnerDropdown(false);
  };

  
  // fetch outerCorton
  const fetchOuterCortonSuggestions = async (outerCortonInput) => {
    try {
      if (outerCortonInput.length > 0) {
        const response = await apiService.get("/outerCortons/getall");
        const filteredOuterCortons = response.data.filter((b) =>
          b.number_of_pcs.toLowerCase().startsWith(outerCortonInput.toLowerCase())
        );
        setOuterCortonSuggestions(filteredOuterCortons);
      } else {
        setOuterCortonSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching outerCorton:", error);
    }
  };

  const handleOuterCortonChange = (e) => {
    const outerCortonInput = e.target.value;
    setOuterCorton(outerCortonInput);
    setOuterCortonDropdown(true);
    fetchOuterCortonSuggestions(outerCortonInput);
  };

  const handleOuterCortonSelect = (outerCorton) => {
    setOuterCorton(outerCorton.number_of_pcs);
    setSelectedOuterCortonId(outerCorton.id);
    setOuterCortonSuggestions([]);
    setOuterCortonDropdown(false);
  };

  
  // fetch mesurementChart
  const fetchMesurementChartSuggestions = async (mesurementChartInput) => {
    try {
      if (mesurementChartInput.length > 0) {
        const response = await apiService.get("/mesurementCharts/getall");
        const filteredMesurementCharts = response.data.filter((b) =>
          b.brandName.toLowerCase().startsWith(mesurementChartInput.toLowerCase())
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
    setMeasurementChart(mesurementChart.brandName);
    setSelectedMesurementId(mesurementChart.id);
    setMesurementSuggestions([]);
    setMesurementDropdown(false);
  };

  
  // fetch categorie
  const fetchCategorieSuggestions = async (categorieInput) => {
    try {
      if (categorieInput.length > 0) {
        const response = await apiService.get("/categories/getall");
        const filteredCategories = response.data.filter((b) =>
          b.categoryName.toLowerCase().startsWith(categorieInput.toLowerCase())
        );
        setCategorieSuggestions(filteredCategories);
      } else {
        setCategorieSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategorieChange = (e) => {
    const categorieInput = e.target.value;
    setCategorie(categorieInput);
    setCategorieDropdown(true);
    fetchCategorieSuggestions(categorieInput);
  };

  const handleCategorieSelect = (categorie) => {
    setCategorie(categorie.categoryName);
    setSelectedCategorieId(categorie.id);
    setCategorieSuggestions([]);
    setCategorieDropdown(false);
  };


  const handleFileUpload = (e) => {
    const files = e.target.files;
    console.log(files);
    // Ensure the total number of files doesn't exceed 13
    if (files.length + images.length > 13) {
      alert("You can only upload up to 13 images.");
      return;
    }

    // Convert FileList to Array and update state
    const newImages = [...images];
    for (let i = 0; i < files.length; i++) {
      newImages.push(files[i]);
    }
    setImages(newImages);
  };

  const uploader = Uploader({
    apiKey: "free", // Get production API keys from Bytescale
  });

  // Configuration options: https://www.bytescale.com/docs/upload-widget/frameworks/react#customize
  const options = { multi: true };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("reference_number", referenceNo);
    formData.append("style_id", styleNo);
    formData.append("category_id", 1); // Example, update as needed
    formData.append("brand_id", brand);
    formData.append("fabric_id", fabric);
    formData.append("fabric_finish_id", fabricFinish);
    formData.append("gsm_id", gsm);
    formData.append("knit_type_id", knitType);
    formData.append("color_id", colors);
    formData.append("size_id", sizes);
    formData.append("decoration_id", decorations);
    formData.append("print_emb_id", printOrEmbName);
    formData.append("stitch_detail_id", stitchDetails);
    formData.append("neck_id", neck);
    formData.append("sleeve_id", sleeve);
    formData.append("length_id", length);
    formData.append("packing_method_id", packingMethod);
    formData.append("inner_pcs_id", inner);
    formData.append("outer_carton_pcs_id", outerCorton);
    formData.append("measurement_chart_id", measurementChart);
    formData.append("is_Stocked", false);
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      const response = await apiService.post("/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      // Handle success, e.g., close modal, show success message, etc.
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
      // Handle error, e.g., show error message, etc.
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[80vw] h-screen max-h-[85vh] overflow-y-auto lg:overflow-auto">
        <div className="px-10 py-5">
          <div className="flex justify-center">
            {" "}
            {/* Centering the title */}
            <h2 className="text-lg font-bold">Add Product</h2>
            <button
              className="absolute right-5 cursor-pointer"
              onClick={onClose}
            >
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
          <hr className="my-2" />
          <div className="px-40">
            <div className="flex flex-col gap-3 mt-10">
              <div className="flex gap-4">
                <h1 className="font-bold">Product Images</h1>
                <span className="text-sm text-gray-400 mt-1 relative px-2">
                  <span className="absolute left-0 top-0 text-gray-600">*</span>
                  Choose up to 13 images
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <UploadButton
                  uploader={uploader}
                  options={options}
                  onComplete={(files) => {
                    if (files.length > 13) {
                      alert("You can only upload up to 13 images.");
                    } else {
                      setImages(
                        files.map((file) => ({
                          fileUrl: file.fileUrl,
                        }))
                      );
                    }
                  }}
                >
                  {({ onClick }) => (
                    <button onClick={onClick}>Upload a file...</button>
                  )}
                </UploadButton>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="styleNo">
                  Style No:
                </label>
                <input
                  type="text"
                  id="styleNo"
                  value={styleNo}
                  onChange={handleStyleChange}
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Style No"
                />
                {styleDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
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

              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="brand">
                  Brand Name:
                </label>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={handleBrandChange}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Brand Name"
                />
                {brandDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {brandSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleBrandSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.brandName}
                      </li>
                    ))}
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
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Fabric"
                />
                {fabricDropdown && (
                  <ul className="absolute left-0  mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {fabricSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleFabricSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.fabricName}
                      </li>
                    ))}
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
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Fabric Finish"
                />
              </div>
              {fabricFinishDropdown && (
                <ul className="absolute left-0 mt-20 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  {fabricFinishSuggestions.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleFabricFinishSelect(item)}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      {item.fabricFinishName}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="gsm">
                  GSM:
                </label>
                <input
                  type="number"
                  id="gsm"
                  value={gsm}
                  onChange={handleGsmChange}
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter GSM"
                />
                {gsmDropdown && (
                  <ul className="absolute left-0 mt-20 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {gsmSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleGsmSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.gsmValue}
                      </li>
                    ))}
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
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Knit Type"
                />
                {knitDropdown && (
                  <ul className="absolute left-0 mt-20 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {knitSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleKnitSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.knitType}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="colors">
                  Colors:
                </label>
                <input
                  type="text"
                  id="colors"
                  value={colors}
                  onChange={handleColorChange}
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Colors"
                />
                {colorDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {colorSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleColorSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.colorName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="sizes">
                  Sizes:
                </label>
                <input
                  type="text"
                  id="sizes"
                  value={sizes}
                  onChange={handleSizeChange}
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Sizes"
                />
                {sizeDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {sizeSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSizeSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.sizes}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="decorations">
                  Decorations:
                </label>
                <input
                  type="text"
                  id="decorations"
                  value={decorations}
                  onChange={handleDecorationChange}
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Decorations"
                />
                {decorationDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {decorationSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleDecorationSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.decorationName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold" htmlFor="printOrEmbName">
                  Print {"("}or{")"} Emb Name:
                </label>
                <input
                  type="text"
                  id="printorEmbName"
                  value={printOrEmbName}
                  onChange={handlePrintChange}
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Print (or) Emb Name"
                />
                {printDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {printSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handlePrintSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.printType}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="stitchDetails">
                  Stitch Details:
                </label>
                <input
                  type="text"
                  id="stitchDetails"
                  value={stitchDetails}
                   onChange={handleStitchDetailChange}
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Stitch Details"
                />
                   {stitchDetailDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {stitchDetailSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleStitchDetailSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.stictchDetail}
                      </li>
                    ))}
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
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Neck"
                />
                   {neckDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {neckSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleNeckSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.neckType}
                      </li>
                    ))}
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
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Sleeve"
                />
                   {sleeveDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {sleeveSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSleeveSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.sleeveName}
                      </li>
                    ))}
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
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Length"
                />
                   {lengthDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {lengthSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleLengthSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.lengthType}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="packingMethod">
                  Packing Method:
                </label>
                <input
                  type="text"
                  id="packingMethod"
                  value={packingMethod}
                  onChange={handlePackingMethodChange}
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Packing Method"
                />
                   {packingDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {packingSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handlePackingMethodSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.packingType}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="piecesPerInner">
                  No of pieces per inner:
                </label>
                <input
                  type="text"
                  id="piecesPerInner"
                  value={inner}
                  onChange={handleInnerChange}
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter No of pieces per inner"
                />
                   {innerDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {innerSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleInnerSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.number_of_pcs}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="piecesPerOuterCarton">
                  No of pieces per outer carton:
                </label>
                <input
                  type="text"
                  id="piecesPerOuterCarton"
                  value={outerCorton}
                  onChange={handleOuterCortonChange}
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter No of pieces per outer carton"
                />
                   {outerCortonDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {outerCortonSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleOuterCortonSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.number_of_pcs}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="measurementChart">
                  Measurement Chart:
                </label>
                <input
                  type="text"
                  id="measurementChart"
                  value={measurementChart}
                  onChange={handleMesurementChartChange}
                  className="border border-gray-300  rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Measurement Chart"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer text-blue-500 underline"
                >
                  Upload Picture
                </label>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e)}
                />
                   {mesurementDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {mesurementSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleMesurementChartSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.brandName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="flex flex-col gap-2 relative">
                <label className="font-semibold" htmlFor="categorie">
                  Categoty:
                </label>
                <input
                  type="text"
                  id="categorie"
                  value={categorie}
                  onChange={handleCategorieChange}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-zinc-200"
                  placeholder="Enter Category Name"
                />
                {categorieDropdown && (
                  <ul className="absolute left-0 mt-16 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {categorieSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleCategorieSelect(item)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {item.categoryName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* <button className="bg-sky-600 px-28 py-2 text-white absolute bottom-5 right-40 rounded-lg font-bold text-sm" >Add Products</button> */}
            <div className="mt-10 flex justify-center gap-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
