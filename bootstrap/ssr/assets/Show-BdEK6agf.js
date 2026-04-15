import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { AppShell, Loader, Text, Button, Box, Group, ScrollArea, ActionIcon, Image, Accordion, Modal, rem, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowLeft, IconPlayerPlay, IconPlus, IconX } from "@tabler/icons-react";
import { u as useAppStore, H as Header } from "./Header-BA1_ggmj.js";
import { C as CartDrawer, F as Footer } from "./Footer--tUsT2lM.js";
import { P as ProductAura } from "./ProductAura-BBGd2TTl.js";
import "zustand";
import "zustand/middleware";
const CRM_BASE = "https://crm.joppa.shop/api";
function ZoomImage({ src }) {
  const [zoomParams, setZoomParams] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [mobileZoom, setMobileZoom] = useState(false);
  const handleMouseMove = (e) => {
    if (window.innerWidth < 992) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;
    setZoomParams({ x, y });
  };
  const handleMouseEnter = () => {
    if (window.innerWidth >= 992) setIsZooming(true);
  };
  const handleMouseLeave = () => {
    setIsZooming(false);
  };
  const handleClick = () => {
    if (window.innerWidth < 992) open();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Box,
      {
        onMouseMove: handleMouseMove,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onClick: handleClick,
        style: {
          position: "relative",
          width: "100%",
          height: "450px",
          borderRadius: "16px",
          overflow: "hidden",
          cursor: window.innerWidth < 992 ? "pointer" : "crosshair",
          backgroundColor: "#F0EFE6",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
        },
        children: [
          /* @__PURE__ */ jsx(
            Image,
            {
              src,
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: isZooming ? 0 : 1,
                transition: "opacity 0.2s ease-in-out"
              }
            }
          ),
          /* @__PURE__ */ jsx(
            Box,
            {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${src})`,
                backgroundPosition: `${zoomParams.x}% ${zoomParams.y}%`,
                backgroundSize: "300%",
                backgroundRepeat: "no-repeat",
                opacity: isZooming ? 1 : 0,
                transition: "opacity 0.1s ease-in-out",
                pointerEvents: "none"
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(Modal, { opened, onClose: () => {
      close();
      setMobileZoom(false);
    }, fullScreen: true, padding: 0, withCloseButton: false, bg: "black", transitionProps: { transition: "fade", duration: 200 }, children: /* @__PURE__ */ jsxs(Box, { h: "100vh", w: "100vw", style: { backgroundColor: "#111", position: "relative" }, children: [
      /* @__PURE__ */ jsx(
        ActionIcon,
        {
          onClick: () => {
            close();
            setMobileZoom(false);
          },
          variant: "subtle",
          color: "white",
          style: { position: "absolute", top: 20, right: 20, zIndex: 10, backgroundColor: "rgba(0,0,0,0.5)" },
          children: /* @__PURE__ */ jsx(IconX, { size: 32 })
        }
      ),
      /* @__PURE__ */ jsx(ScrollArea, { h: "100vh", w: "100vw", type: "never", children: /* @__PURE__ */ jsx(Center, { style: { minHeight: "100vh" }, children: /* @__PURE__ */ jsx(
        Image,
        {
          src,
          onClick: () => setMobileZoom(!mobileZoom),
          style: {
            width: mobileZoom ? "250vw" : "100vw",
            objectFit: mobileZoom ? "cover" : "contain",
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            cursor: mobileZoom ? "zoom-out" : "zoom-in"
          }
        }
      ) }) })
    ] }) })
  ] });
}
function Show({ id }) {
  const [opened, { toggle }] = useDisclosure(false);
  const [videoOpened, { open: openVideo, close: closeVideo }] = useDisclosure(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [animating, setAnimating] = useState(false);
  const SIZES = ["S", "M", "L", "XL"];
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const addToCart = useAppStore((state) => state.addToCart);
  useEffect(() => {
    setLoading(true);
    fetch(`${CRM_BASE}/catalog/${id}`).then((res) => {
      if (!res.ok) throw new Error("Not found");
      return res.json();
    }).then((data) => {
      setProduct(data.product);
      if (data.product.images && data.product.images.length > 0) {
        setMainImage(data.product.images[0]);
      }
      setLoading(false);
      let visitorId = localStorage.getItem("joppa_visitor_id");
      if (!visitorId) {
        visitorId = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : "v-" + Date.now() + "-" + Math.random().toString(36).substring(2);
        localStorage.setItem("joppa_visitor_id", visitorId);
      }
      fetch(`${CRM_BASE}/catalog/${id}/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor_id: visitorId })
      }).catch(() => {
      });
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, [id]);
  const handleImageChange = (newImg) => {
    if (newImg === mainImage || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setMainImage(newImg);
      setAnimating(false);
    }, 200);
  };
  const handleAddToCart = () => {
    var _a;
    if (!product) return;
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2e3);
      return;
    }
    addToCart({
      id: String(product.id),
      name: product.name,
      price: String(product.price),
      image: ((_a = product.images) == null ? void 0 : _a[0]) || "",
      brand: "JOPPA",
      size: selectedSize
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsxs(AppShell, { header: { height: 100 }, className: "page-transition", children: [
      /* @__PURE__ */ jsx(Header, { opened, toggle }),
      /* @__PURE__ */ jsx(AppShell.Main, { bg: "#F4F4E8", style: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Loader, { color: "#0B3022", size: "lg" }) })
    ] });
  }
  if (error || !product) {
    return /* @__PURE__ */ jsxs(AppShell, { header: { height: 100 }, className: "page-transition", children: [
      /* @__PURE__ */ jsx(Header, { opened, toggle }),
      /* @__PURE__ */ jsxs(AppShell.Main, { bg: "#F4F4E8", style: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsx(Text, { size: "xl", fw: 700, c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif' }, children: "Producto no encontrado" }),
        /* @__PURE__ */ jsx(Button, { mt: "md", variant: "subtle", color: "#0B3022", onClick: () => window.history.back(), children: "Volver al catálogo" })
      ] })
    ] });
  }
  const productImages = product.images || [];
  return /* @__PURE__ */ jsxs(
    AppShell,
    {
      header: { height: 100, collapsed: false, offset: true },
      className: "page-transition",
      children: [
        /* @__PURE__ */ jsxs(Head, { children: [
          /* @__PURE__ */ jsx("title", { children: `${product.name} - JOPPA` }),
          /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.images || [],
            "description": product.description || "",
            "sku": `JOPPA-${product.id}`,
            "brand": {
              "@type": "Brand",
              "name": "JOPPA"
            },
            "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "USD",
              "price": product.price,
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition"
            }
          }) })
        ] }),
        /* @__PURE__ */ jsx(CartDrawer, {}),
        /* @__PURE__ */ jsx(Header, { opened, toggle }),
        /* @__PURE__ */ jsx(ProductAura, {}),
        /* @__PURE__ */ jsxs(AppShell.Main, { bg: "#F4F4E8", pt: rem(40), style: { position: "relative", zIndex: 1 }, children: [
          /* @__PURE__ */ jsxs(Box, { w: "100%", px: { base: "md", md: "xl" }, style: { maxWidth: "1600px", margin: "0 auto", position: "relative", minHeight: "100vh", paddingBottom: "120px" }, children: [
            /* @__PURE__ */ jsx(Box, { display: { base: "none", lg: "block" }, w: "100%", pb: "6rem", pt: "4vh", children: /* @__PURE__ */ jsxs(Group, { align: "flex-start", justify: "space-between", wrap: "nowrap", w: "100%", children: [
              /* @__PURE__ */ jsx(Box, { w: "300px", style: { position: "sticky", top: "120px", height: "calc(100vh - 140px)" }, children: /* @__PURE__ */ jsx(ScrollArea, { h: "100%", type: "never", offsetScrollbars: true, children: /* @__PURE__ */ jsxs(Box, { style: { display: "flex", flexDirection: "column", minHeight: "calc(100vh - 140px)", paddingBottom: "1rem", gap: "3rem" }, children: [
                /* @__PURE__ */ jsxs(Box, { style: { flexShrink: 0 }, children: [
                  /* @__PURE__ */ jsxs(Group, { gap: "xs", mb: "2rem", style: { cursor: "pointer", width: "fit-content" }, onClick: () => window.history.back(), children: [
                    /* @__PURE__ */ jsx(IconArrowLeft, { size: 20, color: "#0B3022" }),
                    /* @__PURE__ */ jsx(Text, { size: "sm", fw: 500, c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif', textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Volver" })
                  ] }),
                  /* @__PURE__ */ jsx(Text, { size: "3.5rem", fw: 400, c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif', lineHeight: 1.1, letterSpacing: "-0.04em" }, children: product.name }),
                  product.description && /* @__PURE__ */ jsx(Text, { size: "1rem", fw: 400, c: "#4A4A4A", mt: "sm", style: { fontFamily: '"Montserrat", sans-serif' }, children: product.description }),
                  /* @__PURE__ */ jsxs(Text, { size: "1.5rem", fw: 500, c: "#000000", mt: "xl", style: { fontFamily: '"Montserrat", sans-serif', letterSpacing: "0.05em" }, children: [
                    "USD $",
                    Number(product.price).toLocaleString("es-AR")
                  ] }),
                  /* @__PURE__ */ jsx(Text, { size: "0.8rem", c: "dimmed", style: { fontFamily: '"Montserrat", sans-serif' }, children: "Precio referencial en dolares BCV" }),
                  /* @__PURE__ */ jsxs(Box, { mt: "2rem", children: [
                    /* @__PURE__ */ jsx(Group, { justify: "space-between", mb: "xs", children: /* @__PURE__ */ jsx(Text, { size: "0.9rem", fw: 600, c: sizeError ? "red" : "#000000", style: { fontFamily: '"Montserrat", sans-serif', transition: "color 0.2s" }, children: sizeError ? "¡Por favor selecciona una talla!" : `Talla: ${selectedSize || "Selecciona..."}` }) }),
                    /* @__PURE__ */ jsx(Group, { gap: "xs", children: SIZES.map((size) => /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: selectedSize === size ? "filled" : "outline",
                        color: sizeError && !selectedSize ? "red" : "#0B3022",
                        radius: "xl",
                        size: "md",
                        onClick: () => {
                          setSelectedSize(size);
                          setSizeError(false);
                        },
                        style: {
                          flex: 1,
                          fontFamily: '"Montserrat", sans-serif',
                          backgroundColor: selectedSize === size ? "#0B3022" : "transparent",
                          color: selectedSize === size ? "#FFFFFF" : sizeError && !selectedSize ? "red" : "#000000",
                          borderColor: sizeError && !selectedSize ? "red" : selectedSize === size ? "#0B3022" : "rgba(0,0,0,0.2)",
                          borderWidth: "1.5px",
                          transition: "all 0.2s"
                        },
                        children: size
                      },
                      size
                    )) })
                  ] }),
                  /* @__PURE__ */ jsx(Group, { mt: "1.5rem", gap: "md", children: /* @__PURE__ */ jsx(Button, { onClick: handleAddToCart, variant: "filled", color: "#0B3022", radius: "xl", size: "lg", h: 56, px: 40, fullWidth: true, style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 500, fontSize: "1rem", backgroundColor: "#0B3022", color: "#FFFFFF" }, children: "Añadir a la Bolsa" }) })
                ] }),
                product.video_url && /* @__PURE__ */ jsxs(Box, { onClick: openVideo, style: { width: "220px", flexShrink: 0, marginTop: "auto", borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", cursor: "pointer" }, children: [
                  /* @__PURE__ */ jsx("video", { src: product.video_url, autoPlay: true, loop: true, muted: true, playsInline: true, style: { width: "100%", height: "280px", objectFit: "cover", display: "block", pointerEvents: "none" } }),
                  /* @__PURE__ */ jsx(ActionIcon, { variant: "white", radius: "xl", size: 48, style: { position: "absolute", bottom: "16px", right: "16px", backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(4px)" }, children: /* @__PURE__ */ jsx(IconPlayerPlay, { size: 20, color: "#0B3022", style: { marginLeft: "4px" } }) })
                ] })
              ] }) }) }),
              /* @__PURE__ */ jsxs(Box, { style: { flex: 1, maxWidth: "550px", display: "flex", flexDirection: "column", alignItems: "center" }, children: [
                /* @__PURE__ */ jsx(Box, { w: "100%", h: "60vh", style: { display: "flex", alignItems: "center", justifyContent: "center" }, children: mainImage ? /* @__PURE__ */ jsx(Image, { src: mainImage, alt: product.name, fit: "contain", style: { width: "100%", height: "100%", objectFit: "contain", transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out", opacity: animating ? 0 : 1, transform: animating ? "scale(0.97)" : "scale(1)" } }) : /* @__PURE__ */ jsx(Box, { w: "100%", h: "100%", style: { backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Text, { c: "dimmed", children: "Sin imagen" }) }) }),
                productImages.length > 1 && /* @__PURE__ */ jsx(ScrollArea, { w: "100%", mt: "3rem", type: "never", children: /* @__PURE__ */ jsx(Group, { gap: "lg", justify: "flex-start", wrap: "nowrap", pb: "md", px: "md", children: productImages.map((img, idx) => /* @__PURE__ */ jsx(Box, { onClick: () => handleImageChange(img), style: { flexShrink: 0, width: "96px", height: "96px", cursor: "pointer", borderRadius: "16px", overflow: "hidden", border: mainImage === img ? "2px solid #0B3022" : "2px solid transparent", opacity: mainImage === img ? 1 : 0.6, transition: "all 0.2s ease", boxShadow: mainImage === img ? "0 8px 16px rgba(0,0,0,0.08)" : "none" }, children: /* @__PURE__ */ jsx(Image, { src: img, h: 96, w: 96, fit: "cover" }) }, idx)) }) })
              ] }),
              /* @__PURE__ */ jsxs(Box, { w: "320px", style: { display: "flex", flexDirection: "column", gap: "4rem", alignItems: "flex-end" }, children: [
                /* @__PURE__ */ jsx(Box, { w: "100%", children: /* @__PURE__ */ jsxs(Accordion, { variant: "separated", disableChevronRotation: true, chevron: /* @__PURE__ */ jsx(IconPlus, { size: 16, color: "#000000" }), styles: { item: { backgroundColor: "transparent", border: "none", borderBottom: "1px solid rgba(0,0,0,0.1)", borderRadius: 0, padding: 0 }, control: { paddingLeft: 0, paddingRight: 0, paddingTop: "1rem", paddingBottom: "1rem", backgroundColor: "transparent" }, label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 500, color: "#000000", fontSize: "0.9rem" }, content: { paddingLeft: 0, paddingRight: 0, paddingBottom: "1.5rem", fontFamily: '"Montserrat", sans-serif', color: "#4A4A4A", lineHeight: 1.6, backgroundColor: "transparent", whiteSpace: "pre-line" } }, children: [
                  product.product_information && /* @__PURE__ */ jsxs(Accordion.Item, { value: "info", children: [
                    /* @__PURE__ */ jsx(Accordion.Control, { children: "Información del producto" }),
                    /* @__PURE__ */ jsx(Accordion.Panel, { children: product.product_information })
                  ] }),
                  product.product_features && /* @__PURE__ */ jsxs(Accordion.Item, { value: "features", children: [
                    /* @__PURE__ */ jsx(Accordion.Control, { children: "Características del producto" }),
                    /* @__PURE__ */ jsx(Accordion.Panel, { children: product.product_features })
                  ] }),
                  product.product_design && /* @__PURE__ */ jsxs(Accordion.Item, { value: "design", children: [
                    /* @__PURE__ */ jsx(Accordion.Control, { children: "Diseño" }),
                    /* @__PURE__ */ jsx(Accordion.Panel, { children: product.product_design })
                  ] })
                ] }) }),
                product.detail_image_url && /* @__PURE__ */ jsx(Box, { w: "100%", children: /* @__PURE__ */ jsx(ZoomImage, { src: product.detail_image_url }) })
              ] })
            ] }) }),
            product.video_url && /* @__PURE__ */ jsx(Modal, { opened: videoOpened, onClose: closeVideo, size: "xl", centered: true, padding: 0, radius: "24px", withCloseButton: false, styles: { content: { backgroundColor: "transparent", boxShadow: "none" }, header: { display: "none" } }, children: /* @__PURE__ */ jsx("video", { src: product.video_url, controls: true, autoPlay: true, style: { width: "100%", maxHeight: "85vh", borderRadius: "24px", outline: "none" } }) }),
            /* @__PURE__ */ jsxs(Box, { display: { base: "block", lg: "none" }, mt: "4rem", children: [
              /* @__PURE__ */ jsxs(Group, { gap: "xs", mb: "2rem", style: { cursor: "pointer", width: "fit-content" }, onClick: () => window.history.back(), children: [
                /* @__PURE__ */ jsx(IconArrowLeft, { size: 20, color: "#0B3022" }),
                /* @__PURE__ */ jsx(Text, { size: "sm", fw: 500, c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif', textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Volver" })
              ] }),
              /* @__PURE__ */ jsxs(Box, { w: "100%", mb: "2rem", children: [
                /* @__PURE__ */ jsx(Box, { w: "100%", h: { base: "350px", sm: "500px" }, style: { display: "flex", alignItems: "center", justifyContent: "center" }, children: mainImage ? /* @__PURE__ */ jsx(Image, { src: mainImage, alt: product.name, fit: "contain", style: { width: "100%", height: "100%", objectFit: "contain", transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out", opacity: animating ? 0 : 1, transform: animating ? "scale(0.97)" : "scale(1)" } }) : /* @__PURE__ */ jsx(Box, { w: "100%", h: "100%", style: { backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Text, { c: "dimmed", children: "Sin imagen" }) }) }),
                productImages.length > 1 && /* @__PURE__ */ jsx(ScrollArea, { w: "100%", mt: "xl", type: "never", children: /* @__PURE__ */ jsx(Group, { gap: "md", justify: "flex-start", wrap: "nowrap", pb: "xs", children: productImages.map((img, idx) => /* @__PURE__ */ jsx(Box, { onClick: () => handleImageChange(img), style: { flexShrink: 0, width: "72px", height: "72px", cursor: "pointer", borderRadius: "12px", overflow: "hidden", border: mainImage === img ? "2px solid #0B3022" : "2px solid transparent", opacity: mainImage === img ? 1 : 0.6, transition: "all 0.2s ease" }, children: /* @__PURE__ */ jsx(Image, { src: img, h: 72, w: 72, fit: "cover" }) }, idx)) }) })
              ] }),
              /* @__PURE__ */ jsx(Text, { size: "3rem", fw: 400, c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif', lineHeight: 1.1, letterSpacing: "-0.04em" }, children: product.name }),
              product.description && /* @__PURE__ */ jsx(Text, { size: "1rem", fw: 400, c: "#4A4A4A", mt: "xs", style: { fontFamily: '"Montserrat", sans-serif' }, children: product.description }),
              /* @__PURE__ */ jsxs(Text, { size: "1.5rem", fw: 500, c: "#000000", mt: "lg", style: { fontFamily: '"Montserrat", sans-serif' }, children: [
                "USD $",
                Number(product.price).toLocaleString("es-AR")
              ] }),
              /* @__PURE__ */ jsxs(Box, { mt: "1.5rem", children: [
                /* @__PURE__ */ jsx(Group, { justify: "space-between", mb: "xs", children: /* @__PURE__ */ jsx(Text, { size: "0.9rem", fw: 600, c: sizeError ? "red" : "#000000", style: { fontFamily: '"Montserrat", sans-serif', transition: "color 0.2s" }, children: sizeError ? "¡Selecciona tu talla!" : `Talla: ${selectedSize || "Selecciona..."}` }) }),
                /* @__PURE__ */ jsx(Group, { gap: "xs", children: SIZES.map((size) => /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: selectedSize === size ? "filled" : "outline",
                    color: sizeError && !selectedSize ? "red" : "#0B3022",
                    radius: "xl",
                    size: "md",
                    onClick: () => {
                      setSelectedSize(size);
                      setSizeError(false);
                    },
                    style: {
                      flex: 1,
                      fontFamily: '"Montserrat", sans-serif',
                      backgroundColor: selectedSize === size ? "#0B3022" : "transparent",
                      color: selectedSize === size ? "#FFFFFF" : sizeError && !selectedSize ? "red" : "#000000",
                      borderColor: sizeError && !selectedSize ? "red" : selectedSize === size ? "#0B3022" : "rgba(0,0,0,0.2)",
                      borderWidth: "1.5px",
                      transition: "all 0.2s"
                    },
                    children: size
                  },
                  size
                )) })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: handleAddToCart,
                  fullWidth: true,
                  variant: "filled",
                  color: "#0B3022",
                  radius: "xl",
                  size: "lg",
                  mt: "1.5rem",
                  h: 56,
                  style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 500 },
                  children: "Añadir a la Bolsa"
                }
              ),
              /* @__PURE__ */ jsx(Box, { mt: "3rem", children: /* @__PURE__ */ jsxs(
                Accordion,
                {
                  variant: "separated",
                  disableChevronRotation: true,
                  chevron: /* @__PURE__ */ jsx(IconPlus, { size: 16, color: "#000000" }),
                  styles: {
                    item: { backgroundColor: "transparent", border: "none", borderBottom: "1px solid rgba(0,0,0,0.1)", borderRadius: 0, padding: 0 },
                    control: { paddingLeft: 0, paddingRight: 0, paddingTop: "1rem", paddingBottom: "1rem", backgroundColor: "transparent" },
                    label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 500, color: "#000000", fontSize: "0.9rem" },
                    content: { paddingLeft: 0, paddingRight: 0, paddingBottom: "1.5rem", fontFamily: '"Montserrat", sans-serif', color: "#4A4A4A", lineHeight: 1.6, backgroundColor: "transparent", whiteSpace: "pre-line" }
                  },
                  children: [
                    product.product_information && /* @__PURE__ */ jsxs(Accordion.Item, { value: "info", children: [
                      /* @__PURE__ */ jsx(Accordion.Control, { children: "Información del producto" }),
                      /* @__PURE__ */ jsx(Accordion.Panel, { children: product.product_information })
                    ] }),
                    product.product_features && /* @__PURE__ */ jsxs(Accordion.Item, { value: "features", children: [
                      /* @__PURE__ */ jsx(Accordion.Control, { children: "Características del producto" }),
                      /* @__PURE__ */ jsx(Accordion.Panel, { children: product.product_features })
                    ] }),
                    product.product_design && /* @__PURE__ */ jsxs(Accordion.Item, { value: "design", children: [
                      /* @__PURE__ */ jsx(Accordion.Control, { children: "Diseño" }),
                      /* @__PURE__ */ jsx(Accordion.Panel, { children: product.product_design })
                    ] })
                  ]
                }
              ) }),
              product.video_url && /* @__PURE__ */ jsxs(Box, { mt: "2rem", w: "100%", children: [
                /* @__PURE__ */ jsx(Text, { size: "sm", fw: 600, mb: "sm", style: { fontFamily: '"Montserrat", sans-serif' }, children: "Video Promocional" }),
                /* @__PURE__ */ jsxs(Box, { onClick: openVideo, style: { width: "100%", borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", cursor: "pointer" }, children: [
                  /* @__PURE__ */ jsx("video", { src: product.video_url, autoPlay: true, loop: true, muted: true, playsInline: true, style: { width: "100%", minHeight: "350px", objectFit: "cover", display: "block", pointerEvents: "none" } }),
                  /* @__PURE__ */ jsx(ActionIcon, { variant: "white", radius: "xl", size: 64, style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(4px)" }, children: /* @__PURE__ */ jsx(IconPlayerPlay, { size: 32, color: "#0B3022", style: { marginLeft: "4px" } }) })
                ] })
              ] }),
              product.detail_image_url && /* @__PURE__ */ jsxs(Box, { w: "100%", mt: "2rem", mb: "2rem", children: [
                /* @__PURE__ */ jsx(Text, { size: "sm", fw: 600, mb: "xs", style: { fontFamily: '"Montserrat", sans-serif' }, children: "Detalle / Textura" }),
                /* @__PURE__ */ jsx(ZoomImage, { src: product.detail_image_url })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Footer, {})
        ] })
      ]
    }
  );
}
export {
  Show as default
};
