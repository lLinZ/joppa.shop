import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Box, ActionIcon, Group, Paper, Button, Text, Title, Tabs, Stack, Select, Tooltip, Divider, ColorInput, Slider, FileButton, SimpleGrid } from "@mantine/core";
import { IconTrash, IconMinus, IconPlus, IconShirt, IconTypography, IconPhoto, IconBolt, IconRefresh, IconUpload, IconSparkles } from "@tabler/icons-react";
import { Rnd } from "react-rnd";
import { useMediaQuery } from "@mantine/hooks";
const DEFAULT_PRODUCTS = [
  {
    id: "oversize",
    name: "T-Shirt Oversize",
    basePrice: 20,
    assets: {
      Caballero: {
        front: "/images/custom_design_builder/franela_blanca_sin_fondo.png",
        back: "/images/custom_design_builder/franela_blanca_sin_fondo_back.png"
      },
      Dama: {
        front: "/images/custom_design_builder/franela_blanca_sin_fondo.png",
        back: "/images/custom_design_builder/franela_blanca_sin_fondo_back.png"
      }
    }
  }
];
const DEFAULT_GARMENT_COLORS = [
  { label: "Negro", value: "#1A1A1A" },
  { label: "Blanco", value: "#FFFFFF" },
  { label: "Verde Bosque", value: "#0B3022" }
];
let GARMENT_COLORS = DEFAULT_GARMENT_COLORS;
function apiProductToLocal(p) {
  const assets = {};
  for (const [gender, variant] of Object.entries(p.variants ?? {})) {
    assets[gender] = variant.assets ?? { front: "", back: "" };
  }
  return {
    id: p.id,
    name: p.name,
    basePrice: p.basePrice,
    assets,
    // store full variants for color/size lookup
    variants: p.variants
  };
}
const DEFAULT_FONTS = [
  { label: "Montserrat", value: "Montserrat, sans-serif", url: "Montserrat:wght@400;700;900" },
  { label: "Bebas Neue", value: "'Bebas Neue', sans-serif", url: "Bebas+Neue" },
  { label: "Caveat", value: "Caveat, cursive", url: "Caveat:wght@400;700" },
  { label: "Playfair Display", value: "Playfair Display, serif", url: "Playfair+Display:wght@400;700" }
];
const VCS_WIDTH = 1e3;
const VCS_HEIGHT = 1100;
const DesignStudio = ({ gender, design_data, onSave, crmApiUrl }) => {
  const [elementsMap, setElementsMap] = useState({
    front: [],
    back: []
  });
  const [selectedId, setSelectedId] = useState(null);
  const [availableProducts, setAvailableProducts] = useState(DEFAULT_PRODUCTS);
  const [availableColors, setAvailableColors] = useState(DEFAULT_GARMENT_COLORS);
  const [availableSizes, setAvailableSizes] = useState(["S", "M", "L", "XL"]);
  const [availableFonts, setAvailableFonts] = useState(DEFAULT_FONTS);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [product, setProduct] = useState(DEFAULT_PRODUCTS[0]);
  const [color, setColor] = useState(DEFAULT_GARMENT_COLORS[0].value);
  const [view, setView] = useState("front");
  const [activeTab, setActiveTab] = useState("product");
  const [zoom, setZoom] = useState(100);
  const zoomInitialized = useRef(false);
  const [studioScale, setStudioScale] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const isHydrated = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const isMobile = useMediaQuery("(max-width: 992px)");
  const containerRef = useRef(null);
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);
  useEffect(() => {
    const configUrl = crmApiUrl ? `${crmApiUrl}/builder-config` : "http://localhost:8000/api/builder-config";
    fetch(configUrl).then((res) => res.ok ? res.json() : null).then((data) => {
      if (data) {
        if (data.products && data.products.length > 0) {
          const mapped = data.products.map(apiProductToLocal);
          setAvailableProducts(mapped);
          setProduct(mapped[0]);
          const allColors = [];
          for (const p of data.products) {
            for (const v of Object.values(p.variants ?? {})) {
              for (const c of v.colors ?? []) {
                if (!allColors.some((x) => x.value.toUpperCase() === c.value.toUpperCase())) {
                  allColors.push({ label: c.label, value: c.value });
                }
              }
            }
          }
          if (allColors.length > 0) {
            setAvailableColors(allColors);
            GARMENT_COLORS = allColors;
          }
        }
        if (data.fonts && data.fonts.length > 0) {
          setAvailableFonts(data.fonts);
        }
      }
      setConfigLoaded(true);
    }).catch(() => setConfigLoaded(true));
  }, [crmApiUrl]);
  useEffect(() => {
    if (isMobile && !zoomInitialized.current) {
      setZoom(180);
      zoomInitialized.current = true;
    }
  }, [isMobile]);
  useEffect(() => {
    const localDesigns = localStorage.getItem("joppa_local_gallery");
    if (localDesigns) {
      try {
        setSavedDesigns(JSON.parse(localDesigns));
      } catch (e) {
        console.error(e);
      }
    }
    const localImages = localStorage.getItem("joppa_uploaded_images_history");
    if (localImages) {
      try {
        setUploadedImages(JSON.parse(localImages));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);
  useEffect(() => {
    if (design_data && !isHydrated.current) {
      const dataElements = design_data.elements || design_data.elementsMap;
      if (dataElements) {
        setElementsMap(dataElements);
        const existingImages = [];
        [...dataElements.front, ...dataElements.back].forEach((el) => {
          if (el.type === "image" && !existingImages.includes(el.content)) {
            existingImages.push(el.content);
          }
        });
        if (existingImages.length > 0) {
          setUploadedImages((prev) => {
            const combined = [.../* @__PURE__ */ new Set([...prev, ...existingImages])];
            return combined;
          });
        }
      }
      if (design_data.product) {
        const foundProduct = availableProducts.find((p) => p.id === design_data.product.id) || availableProducts[0];
        setProduct(foundProduct || DEFAULT_PRODUCTS[0]);
      }
      if (design_data.color) setColor(design_data.color);
      if (design_data.view) setView(design_data.view);
      isHydrated.current = true;
    } else if (!design_data) {
      isHydrated.current = true;
    }
  }, [design_data]);
  useEffect(() => {
    if (isHydrated.current && isReady) {
      const timeoutId = setTimeout(() => {
        onSaveRef.current({
          elements: elementsMap,
          product,
          color,
          view,
          basePrice: product.basePrice,
          assets: product.assets[gender]
        });
      }, 800);
      return () => clearTimeout(timeoutId);
    }
  }, [elementsMap, product, color, view, gender, isReady]);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem("joppa_design_session_v1");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("joppa_design_session_v1", id);
    }
    return id;
  });
  useEffect(() => {
    if (!isHydrated.current || !isReady) return;
    const totalElements = elementsMap.front.length + elementsMap.back.length;
    if (totalElements === 0) return;
    const pingTimeoutId = setTimeout(() => {
      const payload = {
        session_id: sessionId,
        duration_increment: 5,
        // Aprox 5 segundos de iteración activa
        design_data: {
          elementsMap,
          product,
          color,
          view
        }
      };
      const pingUrl = crmApiUrl ? `${crmApiUrl}/abandoned-designs/ping` : "http://localhost:8000/api/abandoned-designs/ping";
      axios.post(pingUrl, payload).catch(() => {
      });
    }, 5e3);
    return () => clearTimeout(pingTimeoutId);
  }, [elementsMap, product, color, view, gender, isReady, sessionId, crmApiUrl]);
  const elements = elementsMap[view];
  const variantColors = (() => {
    var _a;
    const v = (_a = product.variants) == null ? void 0 : _a[gender];
    if ((v == null ? void 0 : v.colors) && v.colors.length > 0) return v.colors;
    return availableColors;
  })();
  (() => {
    var _a;
    const v = (_a = product.variants) == null ? void 0 : _a[gender];
    if ((v == null ? void 0 : v.sizes) && v.sizes.length > 0) return v.sizes;
    return availableSizes;
  })();
  const parentRef = useRef(null);
  useEffect(() => {
    const updateScale = () => {
      if (!parentRef.current) return;
      const PADDING = isMobile ? 0 : 40;
      const availableW = parentRef.current.clientWidth - PADDING;
      const availableH = parentRef.current.clientHeight - PADDING;
      if (availableW <= 0) return;
      let scale = availableW / VCS_WIDTH;
      if (!isMobile) {
        scale = Math.min(availableW / VCS_WIDTH, availableH / VCS_HEIGHT);
      }
      setStudioScale(scale || 1);
      setIsReady(true);
    };
    const observer = new ResizeObserver(updateScale);
    if (parentRef.current) observer.observe(parentRef.current);
    updateScale();
    return () => observer.disconnect();
  }, [isMobile, product]);
  const getNextZIndex = () => {
    const allElements = [...elementsMap.front, ...elementsMap.back];
    if (allElements.length === 0) return 10;
    return Math.max(...allElements.map((el) => el.zIndex)) + 1;
  };
  const addText = () => {
    var _a;
    const newEl = {
      id: Math.random().toString(),
      type: "text",
      content: "NUEVA AVENTURA",
      x: 250,
      y: 350,
      width: 500,
      height: 100,
      rotation: 0,
      fontSize: 40,
      fontFamily: ((_a = availableFonts[0]) == null ? void 0 : _a.value) || "sans-serif",
      color: "#0B3022",
      letterSpacing: 2,
      zIndex: getNextZIndex()
    };
    setElementsMap((prev) => ({ ...prev, [view]: [...prev[view], newEl] }));
    setSelectedId(newEl.id);
    setActiveTab("text");
  };
  const handleImageUpload = async (file) => {
    if (!file) return;
    const tempUrl = URL.createObjectURL(file);
    addImage(tempUrl);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadUrl = crmApiUrl ? `${crmApiUrl}/design-assets` : "http://localhost:8001/api/design-assets";
      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data.url) {
        setElementsMap((prev) => ({
          front: prev.front.map((el) => el.content === tempUrl ? { ...el, content: response.data.url } : el),
          back: prev.back.map((el) => el.content === tempUrl ? { ...el, content: response.data.url } : el)
        }));
        setUploadedImages((prev) => {
          const updated = prev.map((u) => u === tempUrl ? response.data.url : u);
          localStorage.setItem("joppa_uploaded_images_history", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  const addImage = (url) => {
    const newEl = {
      id: Math.random().toString(),
      type: "image",
      content: url,
      x: 400,
      y: 450,
      width: 200,
      height: 200,
      rotation: 0,
      zIndex: getNextZIndex()
    };
    setElementsMap((prev) => ({ ...prev, [view]: [...prev[view], newEl] }));
    setSelectedId(newEl.id);
    setActiveTab("image");
    setUploadedImages((prev) => {
      if (prev.includes(url)) return prev;
      const updated = [...prev, url];
      localStorage.setItem("joppa_uploaded_images_history", JSON.stringify(updated));
      return updated;
    });
  };
  const updateElement = (id, updates) => {
    setElementsMap((prev) => ({
      ...prev,
      [view]: prev[view].map((el) => el.id === id ? { ...el, ...updates } : el)
    }));
  };
  const removeElement = (id) => {
    setElementsMap((prev) => ({
      ...prev,
      [view]: prev[view].filter((el) => el.id !== id)
    }));
    setSelectedId(null);
  };
  const saveToGallery = () => {
    const newDesign = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Diseño ${savedDesigns.length + 1}`,
      elementsMap,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    const updated = [newDesign, ...savedDesigns];
    setSavedDesigns(updated);
    localStorage.setItem("joppa_local_gallery", JSON.stringify(updated));
    setActiveTab("designs");
  };
  const applyLibraryDesign = (libDesign) => {
    if (window.confirm("¿Aplicar este diseño? Reemplazará los logos y textos actuales.")) {
      setElementsMap(libDesign.elementsMap);
      setSelectedId(null);
    }
  };
  const deleteFromGallery = (id) => {
    const updated = savedDesigns.filter((d) => d.id !== id);
    setSavedDesigns(updated);
    localStorage.setItem("joppa_local_gallery", JSON.stringify(updated));
  };
  const selectedElement = elements.find((el) => el.id === selectedId);
  const currentAssetUrl = product.assets[gender][view] || product.assets[gender].front;
  const totalScale = studioScale * (zoom / 100);
  return /* @__PURE__ */ jsxs(
    Box,
    {
      style: {
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "stretch",
        gap: 0,
        height: isMobile ? "auto" : "840px",
        minHeight: isMobile ? "100vh" : "unset",
        backgroundColor: "#F7F8F9",
        borderRadius: isMobile ? 0 : 32,
        overflow: isMobile ? "auto" : "hidden",
        border: isMobile ? "none" : "1px solid rgba(0,0,0,0.05)",
        boxShadow: isMobile ? "none" : "0 20px 60px rgba(0,0,0,0.04)"
      },
      children: [
        /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: `
                @import url('https://fonts.googleapis.com/css2?${availableFonts.map((f) => f.url ? `family=${f.url}` : "").filter(Boolean).join("&")}&display=swap');
            ` } }),
        /* @__PURE__ */ jsxs(
          Box,
          {
            style: {
              flex: isMobile ? "none" : 1,
              height: isMobile ? "60vh" : "auto",
              position: "relative",
              backgroundColor: "#FFFFFF",
              borderRight: isMobile ? "none" : "1px solid rgba(0,0,0,0.05)",
              borderBottom: isMobile ? "1px solid rgba(0,0,0,0.05)" : "none",
              minWidth: isMobile ? "100%" : 400,
              overflow: "hidden",
              // Stop entire area from scrolling
              display: "flex",
              flexDirection: "column"
            },
            children: [
              /* @__PURE__ */ jsx(
                Box,
                {
                  ref: parentRef,
                  style: {
                    flex: 1,
                    overflow: "auto",
                    position: "relative",
                    padding: 0
                  },
                  children: isReady && /* @__PURE__ */ jsx(
                    Box,
                    {
                      style: {
                        width: "100%",
                        height: Math.max(isMobile ? 0 : 700, VCS_HEIGHT * totalScale + 120),
                        position: "relative",
                        minHeight: "100%",
                        padding: "60px 0"
                      },
                      children: /* @__PURE__ */ jsxs(
                        Box,
                        {
                          style: {
                            width: VCS_WIDTH,
                            height: VCS_HEIGHT,
                            position: "absolute",
                            top: 60,
                            left: "50%",
                            marginLeft: -(500 * totalScale),
                            transform: `scale(${totalScale})`,
                            transformOrigin: "0 0",
                            pointerEvents: "auto",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                            backgroundColor: "#fff"
                          },
                          children: [
                            /* @__PURE__ */ jsx("img", { src: currentAssetUrl, alt: "Base", style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "top center" } }),
                            /* @__PURE__ */ jsx(Box, { style: {
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              backgroundColor: color,
                              maskImage: `url(${currentAssetUrl})`,
                              maskSize: "contain",
                              maskRepeat: "no-repeat",
                              maskPosition: "top center",
                              WebkitMaskImage: `url(${currentAssetUrl})`,
                              WebkitMaskSize: "contain",
                              WebkitMaskRepeat: "no-repeat",
                              WebkitMaskPosition: "top center",
                              mixBlendMode: "multiply",
                              transition: "background-color 0.5s ease",
                              opacity: 0.9
                            } }),
                            /* @__PURE__ */ jsx("img", { src: currentAssetUrl, alt: "Texture", style: {
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              objectPosition: "top center",
                              mixBlendMode: "multiply",
                              filter: "brightness(1.1) contrast(1.1)",
                              opacity: 0.9,
                              pointerEvents: "none"
                            } }),
                            /* @__PURE__ */ jsx(Box, { ref: containerRef, style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }, onMouseDown: (e) => e.target === e.currentTarget && setSelectedId(null), children: elements.map((el) => /* @__PURE__ */ jsx(
                              Rnd,
                              {
                                scale: totalScale,
                                size: { width: el.width, height: el.height },
                                position: { x: el.x, y: el.y },
                                onDragStart: () => setSelectedId(el.id),
                                onDragStop: (e, d) => updateElement(el.id, { x: Math.round(d.x), y: Math.round(d.y) }),
                                onResizeStop: (e, dir, ref, delta, pos) => {
                                  const updates = { width: Math.round(ref.offsetWidth), height: Math.round(ref.offsetHeight), x: Math.round(pos.x), y: Math.round(pos.y) };
                                  if (el.type === "text" && el.fontSize && ["topLeft", "topRight", "bottomLeft", "bottomRight"].includes(dir)) {
                                    updates.fontSize = Math.max(10, Math.min(150, Math.round(el.fontSize * (ref.offsetHeight / el.height))));
                                  }
                                  updateElement(el.id, updates);
                                },
                                style: { zIndex: el.zIndex },
                                resizeHandleStyles: {
                                  bottomRight: { width: 16, height: 16, background: "#228be6", border: "2px solid white", borderRadius: "50%", right: -8, bottom: -8, display: selectedId === el.id ? "block" : "none" },
                                  bottomLeft: { width: 16, height: 16, background: "#228be6", border: "2px solid white", borderRadius: "50%", left: -8, bottom: -8, display: selectedId === el.id ? "block" : "none" },
                                  topRight: { width: 16, height: 16, background: "#228be6", border: "2px solid white", borderRadius: "50%", right: -8, top: -8, display: selectedId === el.id ? "block" : "none" },
                                  topLeft: { width: 16, height: 16, background: "#228be6", border: "2px solid white", borderRadius: "50%", left: -8, top: -8, display: selectedId === el.id ? "block" : "none" }
                                },
                                onMouseDownCapture: () => setSelectedId(el.id),
                                onTouchStartCapture: () => setSelectedId(el.id),
                                children: /* @__PURE__ */ jsxs("div", { style: {
                                  width: "100%",
                                  height: "100%",
                                  position: "relative",
                                  rotate: `${el.rotation}deg`,
                                  transformOrigin: "center center",
                                  border: selectedId === el.id ? "2px solid #228be6" : "1px solid transparent",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: selectedId === el.id ? "rgba(34, 139, 230, 0.05)" : "transparent",
                                  borderRadius: "2px"
                                }, children: [
                                  selectedId === el.id && /* @__PURE__ */ jsx(ActionIcon, { color: "red", variant: "filled", size: "sm", radius: "xl", onClick: (e) => {
                                    e.stopPropagation();
                                    removeElement(el.id);
                                  }, style: { position: "absolute", top: -45, right: -15, zIndex: 2e3, rotate: `-${el.rotation}deg` }, children: /* @__PURE__ */ jsx(IconTrash, { size: 14 }) }),
                                  el.type === "image" ? /* @__PURE__ */ jsx("img", { src: el.content, alt: "Design", style: { width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" } }) : /* @__PURE__ */ jsx("div", { style: { color: el.color, fontSize: `${el.fontSize}px`, fontFamily: el.fontFamily, fontWeight: "bold", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "pre-wrap", textAlign: "center", lineHeight: 1.1, letterSpacing: `${el.letterSpacing}px`, pointerEvents: "none" }, children: el.content })
                                ] })
                              },
                              el.id
                            )) })
                          ]
                        }
                      )
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(Box, { style: { position: "absolute", bottom: isMobile ? 12 : 24, zIndex: 200, width: "100%", pointerEvents: "none" }, children: /* @__PURE__ */ jsxs(Group, { justify: "center", gap: "xs", children: [
                /* @__PURE__ */ jsx(Paper, { shadow: "sm", radius: "xl", withBorder: true, p: 4, style: { pointerEvents: "auto", backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)" }, children: /* @__PURE__ */ jsxs(Group, { gap: 4, children: [
                  /* @__PURE__ */ jsx(Button, { variant: view === "front" ? "filled" : "subtle", color: "#0B3022", size: "compact-sm", onClick: () => setView("front"), radius: "xl", fw: 700, children: "FRONT" }),
                  /* @__PURE__ */ jsx(Button, { variant: view === "back" ? "filled" : "subtle", color: "#0B3022", size: "compact-sm", onClick: () => setView("back"), radius: "xl", fw: 700, children: "BACK" })
                ] }) }),
                /* @__PURE__ */ jsx(Paper, { shadow: "sm", radius: "xl", withBorder: true, p: 4, style: { pointerEvents: "auto", backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)" }, children: /* @__PURE__ */ jsxs(Group, { gap: 8, p: "0 12px", children: [
                  /* @__PURE__ */ jsx(ActionIcon, { variant: "subtle", color: "gray", size: "sm", onClick: () => setZoom(Math.max(50, zoom - 10)), children: /* @__PURE__ */ jsx(IconMinus, { size: 14 }) }),
                  /* @__PURE__ */ jsxs(Text, { size: "xs", fw: 700, w: 30, ta: "center", children: [
                    zoom,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsx(ActionIcon, { variant: "subtle", color: "gray", size: "sm", onClick: () => setZoom(Math.min(200, zoom + 10)), children: /* @__PURE__ */ jsx(IconPlus, { size: 14 }) })
                ] }) })
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Box, { style: { width: isMobile ? "100%" : 420, backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column" }, children: [
          /* @__PURE__ */ jsx(Box, { p: "xl", style: { borderBottom: "1px solid rgba(0,0,0,0.05)" }, children: /* @__PURE__ */ jsx(Title, { order: 3, fw: 900, style: { fontFamily: "Montserrat, sans-serif", color: "#0B3022" }, children: "Personaliza tu Prenda" }) }),
          /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onChange: (v) => setActiveTab(v), variant: "unstyled", children: [
            /* @__PURE__ */ jsxs(Tabs.List, { grow: true, children: [
              /* @__PURE__ */ jsx(Tabs.Tab, { value: "product", style: { flex: 1, padding: "16px", backgroundColor: activeTab === "product" ? "#0B3022" : "transparent", borderBottom: activeTab === "product" ? "4px solid #D4AF37" : "1px solid #eee" }, children: /* @__PURE__ */ jsxs(Stack, { gap: 4, align: "center", children: [
                /* @__PURE__ */ jsx(IconShirt, { size: 26, color: activeTab === "product" ? "white" : "gray" }),
                /* @__PURE__ */ jsx(Text, { size: "10px", fw: 800, c: activeTab === "product" ? "white" : "dimmed", children: "PRENDA" })
              ] }) }),
              /* @__PURE__ */ jsx(Tabs.Tab, { value: "text", style: { flex: 1, padding: "16px", backgroundColor: activeTab === "text" ? "#0B3022" : "transparent", borderBottom: activeTab === "text" ? "4px solid #D4AF37" : "1px solid #eee" }, children: /* @__PURE__ */ jsxs(Stack, { gap: 4, align: "center", children: [
                /* @__PURE__ */ jsx(IconTypography, { size: 26, color: activeTab === "text" ? "white" : "gray" }),
                /* @__PURE__ */ jsx(Text, { size: "10px", fw: 800, c: activeTab === "text" ? "white" : "dimmed", children: "TEXTO" })
              ] }) }),
              /* @__PURE__ */ jsx(Tabs.Tab, { value: "image", style: { flex: 1, padding: "16px", backgroundColor: activeTab === "image" ? "#0B3022" : "transparent", borderBottom: activeTab === "image" ? "4px solid #D4AF37" : "1px solid #eee" }, children: /* @__PURE__ */ jsxs(Stack, { gap: 4, align: "center", children: [
                /* @__PURE__ */ jsx(IconPhoto, { size: 26, color: activeTab === "image" ? "white" : "gray" }),
                /* @__PURE__ */ jsx(Text, { size: "10px", fw: 800, c: activeTab === "image" ? "white" : "dimmed", children: "SUBIR" })
              ] }) }),
              /* @__PURE__ */ jsx(Tabs.Tab, { value: "designs", style: { flex: 1, padding: "16px", backgroundColor: activeTab === "designs" ? "#0B3022" : "transparent", borderBottom: activeTab === "designs" ? "4px solid #D4AF37" : "1px solid #eee" }, children: /* @__PURE__ */ jsxs(Stack, { gap: 4, align: "center", children: [
                /* @__PURE__ */ jsx(IconBolt, { size: 26, color: activeTab === "designs" ? "white" : "gray" }),
                /* @__PURE__ */ jsx(Text, { size: "10px", fw: 800, c: activeTab === "designs" ? "white" : "dimmed", children: "DISEÑOS" })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs(Box, { p: "xl", style: { flex: 1, overflowY: "auto", minHeight: isMobile ? "unset" : 600 }, children: [
              /* @__PURE__ */ jsx(Tabs.Panel, { value: "product", children: /* @__PURE__ */ jsxs(Stack, { gap: "lg", children: [
                /* @__PURE__ */ jsx(Select, { label: "PRENDA", data: availableProducts.map((p) => ({ label: p.name, value: p.id })), value: product.id, onChange: (v) => {
                  const found = availableProducts.find((p) => p.id === v);
                  if (found) setProduct(found);
                } }),
                /* @__PURE__ */ jsxs(Box, { children: [
                  /* @__PURE__ */ jsxs(Text, { size: "xs", fw: 700, mb: 8, children: [
                    "COLOR DE PRENDA (",
                    gender,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsx(Group, { gap: "xs", mb: "md", children: variantColors.map((c) => /* @__PURE__ */ jsx(Tooltip, { label: c.label, children: /* @__PURE__ */ jsx(
                    ActionIcon,
                    {
                      radius: "xl",
                      size: 32,
                      onClick: () => setColor(c.value),
                      style: {
                        backgroundColor: c.value,
                        border: color.toUpperCase() === c.value.toUpperCase() ? "2px solid #0B3022" : "1px solid #eee",
                        boxShadow: color.toUpperCase() === c.value.toUpperCase() ? "0 0 0 2px #fff, 0 0 0 4px #0B3022" : "none"
                      }
                    }
                  ) }, c.value)) }),
                  /* @__PURE__ */ jsx(Divider, { label: "O Color Personalizado", labelPosition: "center", mb: "sm" }),
                  /* @__PURE__ */ jsx(
                    ColorInput,
                    {
                      value: color,
                      onChange: setColor,
                      placeholder: "#000000",
                      radius: "md",
                      size: "sm",
                      styles: { input: { fontFamily: "Montserrat, sans-serif", fontWeight: 600 } }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(Button, { variant: "light", color: "red", leftSection: /* @__PURE__ */ jsx(IconRefresh, { size: 16 }), onClick: () => window.confirm("¿Borrar todo?") && setElementsMap({ front: [], back: [] }), children: "Limpiar Todo el Diseño" })
              ] }) }),
              /* @__PURE__ */ jsx(Tabs.Panel, { value: "text", children: /* @__PURE__ */ jsxs(Stack, { gap: "lg", children: [
                /* @__PURE__ */ jsx(Button, { onClick: addText, leftSection: /* @__PURE__ */ jsx(IconPlus, { size: 18 }), color: "#0B3022", fullWidth: true, children: "Añadir Texto" }),
                elements.filter((el) => el.type === "text").map((el, idx) => /* @__PURE__ */ jsx(Paper, { withBorder: true, p: "sm", radius: "md", style: { cursor: "pointer", borderColor: selectedId === el.id ? "#0B3022" : "#eee" }, onClick: () => setSelectedId(el.id), children: /* @__PURE__ */ jsxs(Group, { justify: "space-between", children: [
                  /* @__PURE__ */ jsxs(Box, { children: [
                    /* @__PURE__ */ jsxs(Text, { size: "xs", fw: 800, c: "dimmed", children: [
                      "TEXTO ",
                      idx + 1
                    ] }),
                    /* @__PURE__ */ jsx(Text, { size: "sm", fw: 600, truncate: true, w: 200, children: el.content })
                  ] }),
                  /* @__PURE__ */ jsx(IconTypography, { size: 16, color: "gray" })
                ] }) }, el.id)),
                selectedId && (selectedElement == null ? void 0 : selectedElement.type) === "text" && /* @__PURE__ */ jsxs(Stack, { gap: "md", mt: "xl", p: "md", style: { backgroundColor: "#F8F9FA", borderRadius: "12px" }, children: [
                  /* @__PURE__ */ jsx("textarea", { value: selectedElement.content, onChange: (e) => updateElement(selectedId, { content: e.target.value }), style: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" } }),
                  /* @__PURE__ */ jsx(Select, { label: "FUENTE", data: availableFonts.map((f) => ({ label: f.label, value: f.value })), value: selectedElement.fontFamily, onChange: (v) => updateElement(selectedId, { fontFamily: v || "" }) }),
                  /* @__PURE__ */ jsx(ColorInput, { label: "COLOR", value: selectedElement.color, onChange: (v) => updateElement(selectedId, { color: v }) }),
                  /* @__PURE__ */ jsxs(Box, { children: [
                    /* @__PURE__ */ jsxs(Text, { size: "xs", fw: 700, children: [
                      "TAMAÑO (",
                      selectedElement.fontSize,
                      ")"
                    ] }),
                    /* @__PURE__ */ jsx(Slider, { value: selectedElement.fontSize, onChange: (v) => updateElement(selectedId, { fontSize: v }), min: 10, max: 120, label: null })
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx(Tabs.Panel, { value: "image", children: /* @__PURE__ */ jsxs(Stack, { gap: "lg", children: [
                /* @__PURE__ */ jsx(FileButton, { onChange: handleImageUpload, accept: "image/*", children: (p) => /* @__PURE__ */ jsx(Button, { ...p, variant: "outline", color: "#0B3022", leftSection: /* @__PURE__ */ jsx(IconUpload, { size: 18 }), children: "Subir Imagen" }) }),
                /* @__PURE__ */ jsx(SimpleGrid, { cols: 3, spacing: "xs", children: uploadedImages.map((u, i) => /* @__PURE__ */ jsx(Paper, { withBorder: true, p: 4, radius: "md", onClick: () => addImage(u), style: { cursor: "pointer", height: 80 }, children: /* @__PURE__ */ jsx("img", { src: u, style: { width: "100%", height: "100%", objectFit: "contain" } }) }, i)) }),
                /* @__PURE__ */ jsx(Divider, { label: "Opciones", labelPosition: "center" }),
                /* @__PURE__ */ jsx(Button, { variant: "light", color: "#0B3022", onClick: saveToGallery, leftSection: /* @__PURE__ */ jsx(IconBolt, { size: 16 }), children: "Guardar Todo como Plantilla" })
              ] }) }),
              /* @__PURE__ */ jsx(Tabs.Panel, { value: "designs", children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
                /* @__PURE__ */ jsx(Text, { size: "xs", fw: 700, c: "dimmed", children: "MIS PLANTILLAS GUARDADAS" }),
                savedDesigns.length === 0 ? /* @__PURE__ */ jsx(Paper, { p: "xl", withBorder: true, radius: "md", bg: "gray.0", style: { borderStyle: "dashed" }, children: /* @__PURE__ */ jsxs(Stack, { gap: 8, align: "center", children: [
                  /* @__PURE__ */ jsx(IconSparkles, { size: 24, color: "gray" }),
                  /* @__PURE__ */ jsx(Text, { size: "sm", c: "dimmed", ta: "center", children: 'No tienes diseños guardados aún. Usa "Guardar Todo como Plantilla" en la pestaña de SUBIR.' })
                ] }) }) : /* @__PURE__ */ jsx(SimpleGrid, { cols: 1, spacing: "xs", children: savedDesigns.map((d) => /* @__PURE__ */ jsx(Paper, { withBorder: true, p: "md", radius: "md", style: { cursor: "pointer" }, className: "hover:bg-gray-50", children: /* @__PURE__ */ jsxs(Group, { justify: "space-between", children: [
                  /* @__PURE__ */ jsxs(Box, { onClick: () => applyLibraryDesign(d), style: { flex: 1 }, children: [
                    /* @__PURE__ */ jsx(Text, { fw: 800, size: "sm", children: d.name }),
                    /* @__PURE__ */ jsx(Text, { size: "10px", c: "dimmed", children: new Date(d.timestamp).toLocaleDateString() })
                  ] }),
                  /* @__PURE__ */ jsx(ActionIcon, { variant: "subtle", color: "red", size: "sm", onClick: () => deleteFromGallery(d.id), children: /* @__PURE__ */ jsx(IconTrash, { size: 14 }) })
                ] }) }, d.id)) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Box, { p: "xl", style: { borderTop: "1px solid rgba(0,0,0,0.05)" }, children: /* @__PURE__ */ jsx(Text, { size: "xs", fw: 700, c: "dimmed", ta: "center", children: "DISEÑO AUTOGUARDADO LISTO PARA ENVIAR" }) })
        ] })
      ]
    }
  );
};
export {
  DesignStudio as D,
  GARMENT_COLORS as G
};
