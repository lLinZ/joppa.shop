import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from "react";
import { Head } from "@inertiajs/react";
import { Box, Group, Text, rem, Rating, Button, Collapse, Paper, Stack, Progress, Divider, TextInput, Textarea, Alert, AppShell, Loader, Flex, ActionIcon, Tooltip, UnstyledButton, ColorSwatch, Accordion, ScrollArea, Image, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowLeft, IconPlayerPlay, IconSearch, IconPlus } from "@tabler/icons-react";
import { u as useAppStore, H as Header } from "./Header-BA1_ggmj.js";
import { C as CartDrawer, F as Footer } from "./Footer--tUsT2lM.js";
import { P as ProductAura } from "./ProductAura-BBGd2TTl.js";
import { G as GARMENT_COLORS } from "./DesignStudio-DxRxIBTb.js";
import { X, Plus, Star, Check, AlertCircle, MessageSquare } from "lucide-react";
import "zustand";
import "zustand/middleware";
import "axios";
import "react-rnd";
const DesignPreview = React.forwardRef(({ design, view, hideMockup = false, isExporting = false, lightBg = false, hideGuides = false }, externalRef) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const localRef = React.useRef(null);
  const [containerWidth, setContainerWidth] = React.useState(0);
  React.useEffect(() => {
    if (!localRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(localRef.current);
    setContainerWidth(localRef.current.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);
  const designObj = React.useMemo(() => {
    if (!design) return { elements: { front: [], back: [] }, color: "#FFFFFF" };
    if (typeof design === "string") {
      try {
        return JSON.parse(design);
      } catch (e) {
        console.error("Failed to parse design_data", e);
        return { elements: { front: [], back: [] }, color: "#FFFFFF" };
      }
    }
    return design;
  }, [design]);
  const elements = ((_a = designObj == null ? void 0 : designObj.elements) == null ? void 0 : _a[view]) || ((_b = designObj == null ? void 0 : designObj.elementsMap) == null ? void 0 : _b[view]) || [];
  const color = (designObj == null ? void 0 : designObj.color) || "#FFFFFF";
  const isBack = view === "back";
  let assetUrl = isBack ? ((_c = designObj == null ? void 0 : designObj.assets) == null ? void 0 : _c.back) || "/images/custom_design_builder/franela_blanca_sin_fondo_back.png" : ((_d = designObj == null ? void 0 : designObj.assets) == null ? void 0 : _d.front) || "/images/custom_design_builder/franela_blanca_sin_fondo.png";
  if (((_e = designObj == null ? void 0 : designObj.product) == null ? void 0 : _e.id) === "hoodie") {
    assetUrl = isBack ? ((_f = designObj == null ? void 0 : designObj.assets) == null ? void 0 : _f.back) || "/images/custom_design_builder/hoodie_sin_fondo_back.png" : ((_g = designObj == null ? void 0 : designObj.assets) == null ? void 0 : _g.front) || "/images/custom_design_builder/hoodie_sin_fondo_front.png";
  }
  const mirrorScale = containerWidth > 0 ? containerWidth / 1e3 : 1;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: (node) => {
        if (typeof externalRef === "function") {
          externalRef(node);
        } else if (externalRef) {
          externalRef.current = node;
        }
      },
      style: {
        position: "relative",
        borderRadius: lightBg ? "0" : "16px",
        overflow: "hidden",
        boxShadow: lightBg || hideMockup ? "none" : "0 25px 50px rgba(0,0,0,0.5)",
        transition: "all 0.4s ease",
        width: isExporting && containerWidth > 0 ? `${containerWidth}px` : "100%",
        maxWidth: "600px",
        // Prevent over-scaling on ultra-wide screens
        margin: "0 auto",
        aspectRatio: "1000 / 1220",
        backgroundColor: hideMockup || lightBg ? "transparent" : "#09090b",
        border: hideMockup || lightBg ? "none" : "1px solid rgba(255,255,255,0.05)"
      },
      children: [
        /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: `
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;700;900&family=Caveat:wght@400;700&family=Playfair+Display:wght@400;700&display=swap');
            ` } }),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: (node) => {
              localRef.current = node;
            },
            "data-preview-version": "1.2.0-perfect-sync",
            style: { position: "absolute", inset: 0, pointerEvents: "none" },
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  width: "1000px",
                  height: "1100px",
                  position: "absolute",
                  top: `${60 * mirrorScale}px`,
                  left: "50%",
                  transform: `scale(${mirrorScale})`,
                  marginLeft: `-${500 * mirrorScale}px`,
                  transformOrigin: "0 0",
                  backgroundColor: "transparent",
                  zIndex: 10
                },
                children: [
                  !hideMockup && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: assetUrl,
                        style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "top center" },
                        alt: ""
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          inset: 0,
                          backgroundColor: color,
                          maskImage: `url(${assetUrl})`,
                          maskSize: "contain",
                          maskRepeat: "no-repeat",
                          maskPosition: "top center",
                          WebkitMaskImage: `url(${assetUrl})`,
                          WebkitMaskSize: "contain",
                          WebkitMaskRepeat: "no-repeat",
                          WebkitMaskPosition: "top center",
                          mixBlendMode: "multiply",
                          opacity: color.toUpperCase() === "#FFFFFF" ? 0 : 0.85
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: assetUrl,
                        style: {
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          objectPosition: "top center",
                          mixBlendMode: "multiply",
                          filter: "brightness(1.1) contrast(1.1)",
                          opacity: 0.9,
                          pointerEvents: "none"
                        },
                        alt: ""
                      }
                    )
                  ] }),
                  elements.map((el) => /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        left: `${el.x}px`,
                        top: `${el.y}px`,
                        width: `${el.width}px`,
                        height: `${el.height}px`,
                        transform: `rotate(${el.rotation}deg)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "visible",
                        zIndex: 100
                      },
                      children: el.type === "image" ? /* @__PURE__ */ jsx("img", { src: el.content, style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }, alt: "", crossOrigin: "anonymous" }) : /* @__PURE__ */ jsx("div", { style: {
                        color: el.color,
                        fontSize: `${el.fontSize || 30}px`,
                        // Fixed PX same as Studio
                        fontFamily: el.fontFamily,
                        fontWeight: "bold",
                        textAlign: "center",
                        width: "100%",
                        lineHeight: 1.1,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        letterSpacing: `${el.letterSpacing || 0}px`
                      }, children: el.content })
                    },
                    el.id
                  ))
                ]
              }
            )
          }
        )
      ]
    }
  );
});
function ProductReviews({ productId, crmBase }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [opened, { toggle }] = useDisclosure(false);
  const [statsOpened, { toggle: toggleStats }] = useDisclosure(false);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    rating: 5,
    comment: ""
  });
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${crmBase}/catalog/${productId}/reviews`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, [productId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await fetch(`${crmBase}/catalog/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("El servidor no respondió correctamente (Error de Configuración).");
      }
      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          const firstError = Object.values(data.errors)[0];
          throw new Error(firstError[0] || "Datos inválidos");
        }
        throw new Error(data.message || "Error al enviar la reseña");
      }
      setSuccessMessage("¡Gracias! Tu reseña ha sido enviada y será publicada tras ser revisada.");
      setFormData({ user_name: "", user_email: "", rating: 5, comment: "" });
      toggle();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) return null;
  return /* @__PURE__ */ jsxs(Box, { mt: 80, id: "reviews-section", style: { borderTop: "1px solid rgba(11,48,34,0.1)", paddingTop: "4rem" }, children: [
    /* @__PURE__ */ jsxs(Group, { justify: "space-between", mb: 40, align: "flex-end", children: [
      /* @__PURE__ */ jsxs(Box, { children: [
        /* @__PURE__ */ jsx(
          Text,
          {
            size: rem(14),
            fw: 700,
            c: "#0B3022",
            mb: 8,
            style: { textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: '"Montserrat", sans-serif' },
            children: "Opiniones Reales"
          }
        ),
        /* @__PURE__ */ jsxs(Group, { gap: "xs", style: { cursor: "pointer" }, onClick: toggleStats, title: "Click para ver detalles", children: [
          /* @__PURE__ */ jsx(
            Rating,
            {
              value: (stats == null ? void 0 : stats.average) || 0,
              readOnly: true,
              fractions: 2,
              color: "#CC9966",
              size: "sm"
            }
          ),
          /* @__PURE__ */ jsxs(
            Text,
            {
              size: rem(18),
              fw: 500,
              c: "#0B3022",
              style: { fontFamily: '"Montserrat", sans-serif' },
              children: [
                stats == null ? void 0 : stats.average.toFixed(1),
                " ",
                /* @__PURE__ */ jsx(Text, { span: true, size: "xs", c: "dimmed", fw: 400, children: "/ 5" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "subtle",
            color: "#0B3022",
            size: "compact-xs",
            onClick: toggleStats,
            styles: { label: { fontSize: rem(11), textDecoration: "underline" } },
            mt: 4,
            children: statsOpened ? "Cerrar detalles" : `Ver ${stats == null ? void 0 : stats.total} reseñas`
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          color: "#0B3022",
          radius: "xl",
          size: "xs",
          px: "lg",
          leftSection: opened ? /* @__PURE__ */ jsx(X, { size: 14 }) : /* @__PURE__ */ jsx(Plus, { size: 14 }),
          onClick: toggle,
          style: {
            borderWidth: "1.5px",
            fontFamily: '"Montserrat", sans-serif',
            transition: "all 0.3s ease"
          },
          children: opened ? "Cancelar" : "Escribir una reseña"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Collapse, { in: statsOpened, children: /* @__PURE__ */ jsx(Paper, { mb: 40, p: 30, bg: "rgba(11,48,34,0.02)", radius: "xl", style: { border: "1px solid rgba(11,48,34,0.05)" }, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-center", children: [
      /* @__PURE__ */ jsx(Stack, { gap: "xs", children: [5, 4, 3, 2, 1].map((star) => {
        const count = (stats == null ? void 0 : stats.breakdown[star]) || 0;
        const percentage = (stats == null ? void 0 : stats.total) ? count / stats.total * 100 : 0;
        return /* @__PURE__ */ jsxs(Group, { gap: "md", wrap: "nowrap", children: [
          /* @__PURE__ */ jsxs(Group, { gap: 4, w: 70, children: [
            /* @__PURE__ */ jsx(Text, { size: "xs", fw: 700, c: "#0B3022", children: star }),
            /* @__PURE__ */ jsx(Star, { size: 10, className: "fill-zinc-400 text-zinc-400" })
          ] }),
          /* @__PURE__ */ jsx(
            Progress,
            {
              value: percentage,
              color: "#0B3022",
              size: 3,
              radius: "xl",
              style: { flex: 1 },
              bg: "rgba(11,48,34,0.05)"
            }
          ),
          /* @__PURE__ */ jsx(Text, { size: "xs", c: "dimmed", w: 20, ta: "right", children: count })
        ] }, star);
      }) }),
      /* @__PURE__ */ jsx(Box, { ta: "center", hiddenFrom: "md", children: /* @__PURE__ */ jsx(Divider, { my: "xl", label: "Comentarios", labelPosition: "center", color: "rgba(11,48,34,0.1)" }) }),
      /* @__PURE__ */ jsx(Box, { ta: "center", visibleFrom: "md", children: /* @__PURE__ */ jsxs(Text, { size: "sm", c: "dimmed", children: [
        "Basado en ",
        stats == null ? void 0 : stats.total,
        " opiniones de clientes verificados y visitantes."
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Collapse, { in: opened, children: /* @__PURE__ */ jsx(Paper, { withBorder: true, p: 30, radius: "xl", mb: 50, bg: "rgba(11,48,34,0.02)", style: { borderColor: "rgba(11,48,34,0.1)" }, children: /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs(Stack, { gap: 20, children: [
      /* @__PURE__ */ jsx(Text, { fw: 600, size: "md", c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif' }, children: "Comparte tu experiencia" }),
      /* @__PURE__ */ jsxs(Box, { children: [
        /* @__PURE__ */ jsx(Text, { size: "xs", fw: 700, c: "#0B3022", mb: 10, style: { textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Tu Calificación" }),
        /* @__PURE__ */ jsx(
          Rating,
          {
            size: "lg",
            value: formData.rating,
            onChange: (val) => setFormData({ ...formData, rating: val }),
            color: "#CC9966"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Group, { grow: true, gap: "xl", children: [
        /* @__PURE__ */ jsx(
          TextInput,
          {
            label: "Nombre",
            placeholder: "Nombre completo",
            required: true,
            variant: "filled",
            value: formData.user_name,
            onChange: (e) => setFormData({ ...formData, user_name: e.target.value }),
            radius: "md",
            styles: { input: { backgroundColor: "white", border: "1px solid rgba(11,48,34,0.1)" } }
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            label: "Email",
            placeholder: "Para validación",
            value: formData.user_email,
            onChange: (e) => setFormData({ ...formData, user_email: e.target.value }),
            radius: "md",
            variant: "filled",
            styles: { input: { backgroundColor: "white", border: "1px solid rgba(11,48,34,0.1)" } }
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          label: "Tu Reseña",
          placeholder: "Escribe aquí tu comentario sobre el producto...",
          required: true,
          minRows: 3,
          variant: "filled",
          value: formData.comment,
          onChange: (e) => setFormData({ ...formData, comment: e.target.value }),
          radius: "md",
          styles: { input: { backgroundColor: "white", border: "1px solid rgba(11,48,34,0.1)" } }
        }
      ),
      /* @__PURE__ */ jsx(Group, { justify: "flex-end", children: /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          bg: "#0B3022",
          radius: "xl",
          size: "md",
          px: 30,
          loading: submitting,
          children: "Publicar reseña"
        }
      ) })
    ] }) }) }) }),
    successMessage && /* @__PURE__ */ jsx(Alert, { icon: /* @__PURE__ */ jsx(Check, { size: 16 }), color: "teal", variant: "light", mb: "xl", radius: "xl", children: successMessage }),
    errorMessage && /* @__PURE__ */ jsx(Alert, { icon: /* @__PURE__ */ jsx(AlertCircle, { size: 16 }), color: "red", variant: "light", mb: "xl", radius: "xl", children: errorMessage }),
    /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsx(Box, { children: reviews.length === 0 ? /* @__PURE__ */ jsx(Paper, { p: 40, radius: "xl", bg: "rgba(11,48,34,0.03)", ta: "center", style: { border: "1px dashed rgba(11,48,34,0.1)" }, children: /* @__PURE__ */ jsxs(Box, { c: "dimmed", children: [
      /* @__PURE__ */ jsx(MessageSquare, { size: 32, strokeWidth: 1, style: { marginBottom: 12 } }),
      /* @__PURE__ */ jsx(Text, { fw: 500, size: "sm", children: "Aún no hay reseñas publicadas." }),
      /* @__PURE__ */ jsx(Text, { size: "xs", children: "Sé el primero en calificar tu compra." })
    ] }) }) : /* @__PURE__ */ jsx(Stack, { gap: 40, children: reviews.map((review) => /* @__PURE__ */ jsxs(Box, { children: [
      /* @__PURE__ */ jsxs(Group, { justify: "space-between", mb: "xs", align: "flex-start", children: [
        /* @__PURE__ */ jsxs(Stack, { gap: 2, children: [
          /* @__PURE__ */ jsx(Rating, { value: review.rating, readOnly: true, size: "xs", color: "#CC9966" }),
          /* @__PURE__ */ jsxs(Group, { gap: 8, children: [
            /* @__PURE__ */ jsx(Text, { fw: 600, size: "sm", c: "#0B3022", children: review.user_name }),
            review.is_verified_purchase && /* @__PURE__ */ jsxs(Group, { gap: 4, children: [
              /* @__PURE__ */ jsx(Check, { size: 10, color: "#0B3022", strokeWidth: 3 }),
              /* @__PURE__ */ jsx(Text, { size: "xs", fw: 700, c: "#0B3022", style: { textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "10px" }, children: "Compra Verificada" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Text, { size: rem(10), c: "dimmed", fw: 500, style: { textTransform: "uppercase" }, children: new Date(review.created_at).toLocaleDateString() })
      ] }),
      /* @__PURE__ */ jsx(Text, { size: "sm", lh: 1.7, c: "#4A4A4A", style: { maxWidth: "600px" }, children: review.comment }),
      /* @__PURE__ */ jsx(Divider, { mt: 30, color: "rgba(11,48,34,0.05)" })
    ] }, review.id)) }) }) })
  ] });
}
const CRM_BASE = "https://crm.joppa.shop/api";
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("data:")) return path;
  let absUrl = path;
  if (!path.startsWith("http")) {
    const base = CRM_BASE.replace(/\/api$/, "").replace(/\/api\/$/, "");
    absUrl = `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  }
  if (absUrl.includes("storage/catalog") || absUrl.includes("storage/designs")) {
    const actualCrmBase = "https://crm.joppa.shop/api".replace(/\/api$/, "").replace(/\/api\/$/, "");
    const finalUrl = actualCrmBase && !absUrl.startsWith(actualCrmBase) && !absUrl.startsWith("data:") ? `${actualCrmBase}/${absUrl.split("storage/")[1] ? "storage/" + absUrl.split("storage/")[1] : absUrl}` : absUrl;
    return `/api/proxy-image?url=${encodeURIComponent(finalUrl)}`;
  }
  try {
    const url = new URL(absUrl);
    if (url.origin !== window.location.origin) {
      return `/api/proxy-image?url=${encodeURIComponent(absUrl)}`;
    }
  } catch (e) {
  }
  return absUrl;
};
const safeJsonParse = (str) => {
  if (!str) return null;
  if (typeof str !== "string") return str;
  try {
    const cleaned = str.trim();
    if (cleaned.startsWith("{") || cleaned.startsWith("[")) {
      return JSON.parse(cleaned);
    }
    return null;
  } catch (e) {
    console.error("Failed to parse JSON:", e, str);
    return null;
  }
};
function BetaShow({ id }) {
  const [opened, { toggle }] = useDisclosure(false);
  const [videoOpened, { open: openVideo, close: closeVideo }] = useDisclosure(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeView, setActiveView] = useState("front");
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [selectedSize, setSelectedSize] = useState(null);
  const [savedColor, setSavedColor] = useState(null);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [isTouchZooming, setIsTouchZooming] = useState(false);
  const [touchPos, setTouchPos] = useState({ x: 50, y: 50 });
  const [selectedGender, setSelectedGender] = useState("CABALLERO");
  const [sizeError, setSizeError] = useState(false);
  const [globalColors, setGlobalColors] = useState(GARMENT_COLORS);
  useEffect(() => {
    fetch(`${CRM_BASE}/builder-config`).then((res) => res.ok ? res.json() : null).then((data) => {
      if (data == null ? void 0 : data.products) {
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
        if (allColors.length > 0) setGlobalColors(allColors);
      }
    }).catch(() => {
    });
  }, []);
  const SIZES = (product == null ? void 0 : product.available_sizes) && product.available_sizes.length > 0 ? product.available_sizes : ["S", "M", "L", "XL"];
  const GENDERS = (product == null ? void 0 : product.available_genders) && product.available_genders.length > 0 ? product.available_genders : ["CABALLERO", "DAMA"];
  useEffect(() => {
    if ((product == null ? void 0 : product.available_genders) && product.available_genders.length > 0) {
      if (!product.available_genders.includes(selectedGender)) {
        setSelectedGender(product.available_genders[0]);
      }
    }
  }, [product == null ? void 0 : product.available_genders]);
  const addToCart = useAppStore((state) => state.addToCart);
  const handleZoomMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    setZoomPos({ x, y });
  };
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width * 100;
    const y = (touch.clientY - rect.top) / rect.height * 100;
    setTouchPos({ x, y });
  };
  useEffect(() => {
    setLoading(true);
    fetch(`${CRM_BASE}/catalog/${id}`).then((res) => {
      if (!res.ok) throw new Error("Not found");
      return res.json();
    }).then((data) => {
      setProduct(data.product);
      const parsedDesign = safeJsonParse(data.product.product_design);
      if (parsedDesign) {
        if (parsedDesign.color) {
          setSelectedColor(parsedDesign.color);
          if (!GARMENT_COLORS.some((c) => c.value.toUpperCase() === parsedDesign.color.toUpperCase())) {
            setSavedColor(parsedDesign.color);
          }
        }
        if (parsedDesign.view) {
          setActiveView(parsedDesign.view);
        }
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
      size: selectedSize,
      color: selectedColor,
      gender: selectedGender
    });
  };
  const dynamicDesignData = useMemo(() => {
    let baseDesign = { elements: { front: [], back: [] } };
    try {
      const parsed = safeJsonParse(product == null ? void 0 : product.product_design);
      if (parsed) {
        baseDesign = parsed;
        const fixElements = (els) => (els || []).map((el) => {
          if (el.type === "image") {
            let content = el.content;
            if (content.startsWith("/") && !content.startsWith("//")) {
              const base = CRM_BASE.replace(/\/api$/, "").replace(/\/api\/$/, "");
              content = `${base}${content}`;
            }
            return { ...el, content: getImageUrl(content) };
          }
          return el;
        });
        if (baseDesign.elements) {
          baseDesign.elements.front = fixElements(baseDesign.elements.front);
          baseDesign.elements.back = fixElements(baseDesign.elements.back);
        }
      }
    } catch (e) {
      console.error("Error parsing design data", e);
    }
    return { ...baseDesign, color: selectedColor };
  }, [product == null ? void 0 : product.product_design, selectedColor]);
  const productSchema = useMemo(() => {
    var _a;
    if (!product) return null;
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": ((_a = product.images) == null ? void 0 : _a.map((img) => getImageUrl(img))) || [],
      "description": product.description || "",
      "sku": `JOPPA-${product.id}`,
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "USD",
        "price": product.price,
        "availability": "https://schema.org/InStock"
      }
    };
    if (product.status_reviews && product.status_reviews.count > 0) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": product.status_reviews.average,
        "reviewCount": product.status_reviews.count
      };
    }
    return JSON.stringify(schema);
  }, [product]);
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
        /* @__PURE__ */ jsx(Text, { size: "xl", fw: 700, c: "#0B3022", children: "Producto no encontrado" }),
        /* @__PURE__ */ jsx(Button, { mt: "md", variant: "subtle", color: "#0B3022", onClick: () => window.history.back(), children: "Volver al catálogo" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(AppShell, { header: { height: 100, collapsed: false, offset: true }, className: "page-transition", children: [
    /* @__PURE__ */ jsxs(Head, { title: `${product.name} - BETA`, children: [
      /* @__PURE__ */ jsx("title", { children: `${product.name} - JOPPA` }),
      productSchema && /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: productSchema })
    ] }),
    /* @__PURE__ */ jsx(CartDrawer, {}),
    /* @__PURE__ */ jsx(Header, { opened, toggle }),
    /* @__PURE__ */ jsxs(AppShell.Main, { bg: "#F4F4E8", pt: rem(120), style: { overflowX: "hidden", position: "relative" }, children: [
      /* @__PURE__ */ jsx(ProductAura, {}),
      /* @__PURE__ */ jsx(Box, { w: "100%", px: { base: "md", md: "xl" }, style: { maxWidth: "1600px", margin: "0 auto", position: "relative", zIndex: 1 }, children: /* @__PURE__ */ jsx(Box, { display: { base: "none", lg: "block" }, pb: "4rem", pt: "4rem", children: /* @__PURE__ */ jsxs(Flex, { gap: 40, align: "flex-start", justify: "space-between", style: { width: "100%" }, children: [
        /* @__PURE__ */ jsx(Box, { style: { flex: "0 0 350px", minWidth: 0 }, children: /* @__PURE__ */ jsxs(Stack, { gap: 30, children: [
          /* @__PURE__ */ jsxs(Group, { gap: "xs", style: { cursor: "pointer", width: "fit-content" }, onClick: () => window.history.back(), children: [
            /* @__PURE__ */ jsx(IconArrowLeft, { size: 20, color: "#0B3022" }),
            /* @__PURE__ */ jsx(Text, { size: "sm", fw: 500, c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif', textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Volver" })
          ] }),
          /* @__PURE__ */ jsxs(Box, { children: [
            /* @__PURE__ */ jsx(
              Text,
              {
                size: "3rem",
                fw: 500,
                c: "#0B3022",
                style: {
                  fontFamily: '"Montserrat", sans-serif',
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  wordBreak: "break-word"
                },
                children: product.name
              }
            ),
            /* @__PURE__ */ jsxs(Text, { size: "1.5rem", fw: 500, c: "#000000", mt: "xl", style: { fontFamily: '"Montserrat", sans-serif', letterSpacing: "0.05em" }, children: [
              "USD $",
              Number(product.price).toLocaleString("es-AR")
            ] }),
            /* @__PURE__ */ jsx(Text, { size: "0.8rem", c: "dimmed", style: { fontFamily: '"Montserrat", sans-serif' }, children: "Precio referencial en dolares BCV" })
          ] }),
          product.description && /* @__PURE__ */ jsx(
            Text,
            {
              size: "0.9rem",
              fw: 400,
              c: "#4A4A4A",
              mt: "sm",
              style: {
                fontFamily: '"Montserrat", sans-serif',
                wordBreak: "break-word",
                lineHeight: 1.5,
                whiteSpace: "pre-line"
              },
              children: product.description
            }
          ),
          product.video_url && /* @__PURE__ */ jsxs(Box, { onClick: openVideo, style: { width: "100%", maxWidth: "280px", flexShrink: 0, borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", cursor: "pointer" }, children: [
            /* @__PURE__ */ jsx("video", { crossOrigin: "anonymous", src: getImageUrl(product.video_url), autoPlay: true, loop: true, muted: true, playsInline: true, style: { width: "100%", height: "320px", objectFit: "cover", display: "block", pointerEvents: "none" } }),
            /* @__PURE__ */ jsx(ActionIcon, { variant: "white", radius: "xl", size: 48, style: { position: "absolute", bottom: "16px", right: "16px", backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(4px)" }, children: /* @__PURE__ */ jsx(IconPlayerPlay, { size: 20, color: "#0B3022", style: { marginLeft: "4px" } }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Box, { style: { flex: 1, position: "relative", minWidth: 0 }, children: /* @__PURE__ */ jsx(Stack, { align: "center", gap: "xl", children: /* @__PURE__ */ jsxs(Box, { w: "100%", style: { position: "relative" }, children: [
          /* @__PURE__ */ jsx(DesignPreview, { design: dynamicDesignData, view: activeView, lightBg: true, hideGuides: true }),
          /* @__PURE__ */ jsxs(Group, { justify: "center", gap: 12, mt: "xl", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: activeView === "front" ? "filled" : "outline",
                color: "#0B3022",
                radius: "xl",
                px: 24,
                size: "sm",
                onClick: () => setActiveView("front"),
                children: "FRENTE"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: activeView === "back" ? "filled" : "outline",
                color: "#0B3022",
                radius: "xl",
                px: 24,
                size: "sm",
                onClick: () => setActiveView("back"),
                children: "ESPALDA"
              }
            )
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(Box, { style: { flex: "0 0 350px" }, children: /* @__PURE__ */ jsxs(Stack, { gap: 30, children: [
          /* @__PURE__ */ jsxs(
            Box,
            {
              onMouseMove: handleZoomMove,
              onMouseEnter: () => setIsZooming(true),
              onMouseLeave: () => setIsZooming(false),
              style: {
                width: "100%",
                aspectRatio: "5/4",
                borderRadius: "32px",
                overflow: "hidden",
                backgroundColor: selectedColor,
                position: "relative",
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                cursor: "zoom-in",
                touchAction: "none"
              },
              children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    style: {
                      width: "100%",
                      height: "100%",
                      transform: isZooming ? "scale(3.5)" : "scale(1)",
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transition: isZooming ? "none" : "transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)",
                      pointerEvents: "none"
                    },
                    children: [
                      "                                             ",
                      /* @__PURE__ */ jsx(
                        DesignPreview,
                        {
                          design: dynamicDesignData,
                          view: activeView,
                          hideMockup: true,
                          hideGuides: true
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(Box, { style: {
                  position: "absolute",
                  top: 12,
                  right: 12,
                  padding: "6px 12px",
                  backgroundColor: "rgba(11, 48, 34, 0.9)",
                  borderRadius: "12px",
                  backdropFilter: "blur(4px)",
                  opacity: isZooming ? 0 : 1,
                  transition: "opacity 0.2s",
                  pointerEvents: "none"
                }, children: /* @__PURE__ */ jsxs(Group, { gap: 6, children: [
                  /* @__PURE__ */ jsx(IconSearch, { size: 14, color: "white" }),
                  /* @__PURE__ */ jsx(Text, { size: "10px", fw: 700, c: "white", style: { textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Detalle de Diseño" })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(Box, { children: [
            /* @__PURE__ */ jsx(Text, { size: "xs", fw: 700, c: "#0B3022", mb: "sm", style: { textTransform: "uppercase", letterSpacing: "0.1em" }, children: "Tono de Prenda" }),
            /* @__PURE__ */ jsx(Group, { gap: "xs", children: Array.from(/* @__PURE__ */ new Set([
              ...product.available_colors && Array.isArray(product.available_colors) && product.available_colors.length > 0 ? product.available_colors.map((hex) => hex.toUpperCase()) : globalColors.map((c) => c.value.toUpperCase()),
              ...savedColor ? [savedColor.toUpperCase()] : []
            ])).map((hex) => {
              const preset = globalColors.find((gc) => gc.value.toUpperCase() === hex);
              return {
                value: hex,
                label: preset ? preset.label : "Personalizado"
              };
            }).map((c) => /* @__PURE__ */ jsx(Tooltip, { label: c.label, children: /* @__PURE__ */ jsx(
              UnstyledButton,
              {
                onClick: () => setSelectedColor(c.value),
                style: {
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: selectedColor.toUpperCase() === c.value.toLocaleUpperCase() ? "2px solid #0B3022" : "2px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  padding: 2
                },
                children: /* @__PURE__ */ jsx(ColorSwatch, { color: c.value, size: 24 })
              }
            ) }, c.value)) })
          ] }),
          /* @__PURE__ */ jsxs(Box, { children: [
            /* @__PURE__ */ jsx(Text, { size: "xs", fw: 700, c: "#0B3022", mb: "sm", style: { textTransform: "uppercase", letterSpacing: "0.1em" }, children: "Género" }),
            /* @__PURE__ */ jsx(Group, { gap: "xs", grow: true, children: GENDERS.map((g) => /* @__PURE__ */ jsx(
              Button,
              {
                variant: selectedGender === g ? "filled" : "outline",
                color: "#0B3022",
                onClick: () => setSelectedGender(g),
                radius: "md",
                style: { borderOpacity: selectedGender === g ? 1 : 0.2 },
                children: g
              },
              g
            )) })
          ] }),
          /* @__PURE__ */ jsxs(Box, { children: [
            /* @__PURE__ */ jsx(Group, { justify: "space-between", mb: "xs", children: /* @__PURE__ */ jsx(Text, { size: "xs", fw: 700, c: sizeError ? "red" : "#0B3022", style: { textTransform: "uppercase", letterSpacing: "0.1em" }, children: sizeError ? "¡Selecciona una talla!" : "Elige tu talla" }) }),
            /* @__PURE__ */ jsx(Group, { gap: "xs", grow: true, children: SIZES.map((s) => /* @__PURE__ */ jsx(
              Button,
              {
                variant: selectedSize === s ? "filled" : "outline",
                color: "#0B3022",
                onClick: () => {
                  setSelectedSize(s);
                  setSizeError(false);
                },
                radius: "md",
                style: { borderOpacity: selectedSize === s ? 1 : 0.2 },
                children: s
              },
              s
            )) })
          ] }),
          /* @__PURE__ */ jsx(Button, { onClick: handleAddToCart, fullWidth: true, variant: "filled", color: "#0B3022", radius: "xl", size: "xl", h: 64, style: { fontSize: "1.1rem" }, children: "Añadir a la Bolsa" }),
          /* @__PURE__ */ jsxs(
            Accordion,
            {
              variant: "separated",
              disableChevronRotation: true,
              chevron: /* @__PURE__ */ jsx(IconPlus, { size: 16, color: "#000000" }),
              styles: {
                item: {
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 0,
                  padding: 0
                },
                control: {
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                  backgroundColor: "transparent",
                  "&:hover": { backgroundColor: "transparent" }
                },
                label: {
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 500,
                  color: "#000000",
                  fontSize: "0.9rem"
                },
                content: {
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingBottom: "1.5rem",
                  fontFamily: '"Montserrat", sans-serif',
                  color: "#4A4A4A",
                  lineHeight: 1.6,
                  backgroundColor: "transparent",
                  whiteSpace: "pre-line",
                  wordBreak: "break-word"
                }
              },
              children: [
                product.product_information && /* @__PURE__ */ jsxs(Accordion.Item, { value: "info", children: [
                  /* @__PURE__ */ jsx(Accordion.Control, { children: "Información del producto" }),
                  /* @__PURE__ */ jsx(Accordion.Panel, { children: /* @__PURE__ */ jsx(Text, { size: "sm", c: "dimmed", style: { lineHeight: 1.6 }, children: product.product_information }) })
                ] }),
                product.product_features && /* @__PURE__ */ jsxs(Accordion.Item, { value: "features", children: [
                  /* @__PURE__ */ jsx(Accordion.Control, { children: "Características del producto" }),
                  /* @__PURE__ */ jsx(Accordion.Panel, { children: /* @__PURE__ */ jsx(Text, { size: "sm", c: "dimmed", style: { lineHeight: 1.6 }, children: product.product_features }) })
                ] }),
                /* @__PURE__ */ jsxs(Accordion.Item, { value: "shipping", children: [
                  /* @__PURE__ */ jsx(Accordion.Control, { children: "Envío y Devoluciones" }),
                  /* @__PURE__ */ jsx(Accordion.Panel, { children: /* @__PURE__ */ jsx(Text, { size: "sm", c: "dimmed", style: { lineHeight: 1.6 }, children: "Envíos nacionales vía MRW/Zoom (2-5 días hábiles). Los productos personalizados no admiten devoluciones a menos que presenten defectos de fabricación." }) })
                ] })
              ]
            }
          )
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsx(Box, { display: { base: "block", lg: "none" }, px: "md", pb: "xl", children: /* @__PURE__ */ jsxs(Stack, { gap: "xl", children: [
        /* @__PURE__ */ jsxs(Group, { gap: "xs", mb: "lg", style: { cursor: "pointer", width: "fit-content" }, onClick: () => window.history.back(), children: [
          /* @__PURE__ */ jsx(IconArrowLeft, { size: 20, color: "#0B3022" }),
          /* @__PURE__ */ jsx(Text, { size: "sm", fw: 500, c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif', textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Volver" })
        ] }),
        /* @__PURE__ */ jsxs(
          Box,
          {
            style: { position: "relative", touchAction: "none" },
            onTouchStart: (e) => {
              setIsTouchZooming(true);
              handleTouchMove(e);
            },
            onTouchMove: handleTouchMove,
            onTouchEnd: () => setIsTouchZooming(false),
            onMouseDown: () => setIsTouchZooming(true),
            onMouseUp: () => setIsTouchZooming(false),
            children: [
              /* @__PURE__ */ jsx(DesignPreview, { design: dynamicDesignData, view: activeView, lightBg: true, hideGuides: true }),
              isTouchZooming && /* @__PURE__ */ jsxs(
                Box,
                {
                  style: {
                    position: "absolute",
                    top: -100,
                    // Slightly lower to avoid header overlap
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 220,
                    // Slightly larger lens
                    height: 220,
                    borderRadius: "50%",
                    // Circular lens looks more premium
                    border: "6px solid #0B3022",
                    overflow: "hidden",
                    zIndex: 100,
                    backgroundColor: selectedColor,
                    boxShadow: "0 15px 50px rgba(0,0,0,0.4)",
                    pointerEvents: "none"
                  },
                  children: [
                    /* @__PURE__ */ jsx("div", { style: {
                      width: "100%",
                      height: "100%",
                      transform: "scale(4.5)",
                      // Increased zoom for more detail
                      transformOrigin: `${touchPos.x}% ${touchPos.y}%`
                    }, children: /* @__PURE__ */ jsx(DesignPreview, { design: dynamicDesignData, view: activeView, hideMockup: true, hideGuides: true }) }),
                    /* @__PURE__ */ jsx(Box, { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Box, { style: { width: 10, height: 10, borderRadius: "50%", border: "2px solid white", backgroundColor: "rgba(11, 48, 34, 0.4)" } }) })
                  ]
                }
              ),
              !isTouchZooming && /* @__PURE__ */ jsx(Text, { size: "xs", c: "dimmed", ta: "center", mt: "-md", style: { fontFamily: "Montserrat, sans-serif" }, children: "Manten presionado para ampliar" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Group, { justify: "center", gap: "xs", children: [
          globalColors.filter((c) => {
            if (!product.available_colors || !Array.isArray(product.available_colors) || product.available_colors.length === 0) return true;
            return product.available_colors.some((ac) => ac.toUpperCase() === c.value.toUpperCase());
          }).map((c) => /* @__PURE__ */ jsx(
            ColorSwatch,
            {
              color: c.value,
              size: 32,
              onClick: () => setSelectedColor(c.value),
              style: {
                cursor: "pointer",
                border: selectedColor.toUpperCase() === c.value.toUpperCase() ? "2px solid #0B3022" : "none",
                transition: "all 0.2s"
              }
            },
            c.value
          )),
          savedColor && !GARMENT_COLORS.some((c) => c.value.toUpperCase() === savedColor.toUpperCase()) && /* @__PURE__ */ jsx(
            ColorSwatch,
            {
              color: savedColor,
              size: 32,
              onClick: () => setSelectedColor(savedColor),
              style: {
                cursor: "pointer",
                border: selectedColor.toUpperCase() === savedColor.toUpperCase() ? "2px solid #0B3022" : "none",
                transition: "all 0.2s"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Stack, { gap: "xs", align: "center", style: { width: "100%", overflow: "hidden" }, children: [
          /* @__PURE__ */ jsx(Text, { size: "3rem", fw: 400, c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif', lineHeight: 1.1, letterSpacing: "-0.04em", textAlign: "center", wordBreak: "break-word" }, children: product.name }),
          product.description && /* @__PURE__ */ jsx(Box, { style: { width: "100%", px: "md" }, children: /* @__PURE__ */ jsx(Text, { size: "1rem", fw: 400, c: "#4A4A4A", mt: "xs", style: {
            fontFamily: '"Montserrat", sans-serif',
            textAlign: "center",
            wordBreak: "break-word",
            overflowWrap: "anywhere"
          }, children: product.description }) }),
          /* @__PURE__ */ jsxs(Text, { size: "1.5rem", fw: 500, c: "#000000", mt: "lg", style: { fontFamily: '"Montserrat", sans-serif' }, children: [
            "USD $",
            Number(product.price).toLocaleString("es-AR")
          ] }),
          /* @__PURE__ */ jsx(Box, { w: "100%", mt: "xl", children: /* @__PURE__ */ jsxs(Stack, { gap: 20, children: [
            /* @__PURE__ */ jsxs(Box, { children: [
              /* @__PURE__ */ jsx(Text, { size: "xs", fw: 700, c: "#0B3022", mb: "xs", style: { textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center" }, children: "Género" }),
              /* @__PURE__ */ jsx(Group, { gap: "xs", grow: true, children: GENDERS.map((g) => /* @__PURE__ */ jsx(
                Button,
                {
                  variant: selectedGender === g ? "filled" : "outline",
                  color: "#0B3022",
                  onClick: () => setSelectedGender(g),
                  radius: "xl",
                  size: "md",
                  children: g
                },
                g
              )) })
            ] }),
            /* @__PURE__ */ jsxs(Box, { children: [
              /* @__PURE__ */ jsx(Group, { justify: "center", gap: "xs", mb: "xs", children: /* @__PURE__ */ jsx(Text, { size: "xs", fw: 700, c: sizeError ? "red" : "#0B3022", style: { textTransform: "uppercase", letterSpacing: "0.1em" }, children: sizeError ? "¡Selecciona una talla!" : "Escoge Talla" }) }),
              /* @__PURE__ */ jsx(Group, { gap: "xs", grow: true, children: SIZES.map((s) => /* @__PURE__ */ jsx(
                Button,
                {
                  variant: selectedSize === s ? "filled" : "outline",
                  color: "#0B3022",
                  onClick: () => {
                    setSelectedSize(s);
                    setSizeError(false);
                  },
                  radius: "xl",
                  size: "md",
                  children: s
                },
                s
              )) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(Button, { fullWidth: true, size: "xl", color: "#0B3022", radius: "xl", h: 64, onClick: handleAddToCart, mt: "xl", children: "Añadir a la Bolsa" }),
        /* @__PURE__ */ jsxs(
          Accordion,
          {
            variant: "separated",
            disableChevronRotation: true,
            chevron: /* @__PURE__ */ jsx(IconPlus, { size: 16, color: "#000000" }),
            styles: {
              item: { backgroundColor: "transparent", border: "none", borderBottom: "1px solid rgba(0,0,0,0.1)", borderRadius: 0, padding: 0 },
              control: { paddingLeft: 0, paddingRight: 0, paddingTop: "1rem", paddingBottom: "1rem", backgroundColor: "transparent", "&:hover": { backgroundColor: "transparent" } },
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
              /* @__PURE__ */ jsxs(Accordion.Item, { value: "shipping", children: [
                /* @__PURE__ */ jsx(Accordion.Control, { children: "Envío y Devoluciones" }),
                /* @__PURE__ */ jsx(Accordion.Panel, { children: "Envíos nacionales vía MRW/Zoom (2-5 días hábiles). Los productos personalizados no admiten devoluciones a menos que presenten defectos de fabricación." })
              ] })
            ]
          }
        )
      ] }) }),
      product.images && product.images.length > 0 && /* @__PURE__ */ jsx(Box, { w: "100%", px: 0, style: { maxWidth: "1600px", margin: "0 auto" }, children: /* @__PURE__ */ jsxs(Box, { py: { base: "3rem", md: "5rem" }, style: { borderTop: "1px solid rgba(0,0,0,0.05)" }, children: [
        /* @__PURE__ */ jsxs(Box, { px: { base: "md", md: "xl" }, ta: "center", children: [
          /* @__PURE__ */ jsx(
            Text,
            {
              size: "1.5rem",
              fw: 700,
              mb: "xs",
              c: "#0B3022",
              style: {
                fontFamily: "Montserrat, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.1em"
              },
              children: "Galería de Imágenes"
            }
          ),
          /* @__PURE__ */ jsx(Text, { size: "xs", c: "dimmed", mb: "xl", display: { base: "block", md: "none" }, style: { fontFamily: "Montserrat, sans-serif" }, children: "Desliza para ver más →" })
        ] }),
        /* @__PURE__ */ jsx(ScrollArea, { w: "100%", type: "never", offsetScrollbars: false, children: /* @__PURE__ */ jsxs(Group, { gap: "md", wrap: "nowrap", px: { base: "md", md: "xl" }, pb: "xl", children: [
          product.video_url && /* @__PURE__ */ jsxs(
            Box,
            {
              display: { base: "block", lg: "none" },
              onClick: openVideo,
              style: {
                width: window.innerWidth < 768 ? "260px" : "300px",
                height: window.innerWidth < 768 ? "350px" : "400px",
                flexShrink: 0,
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                cursor: "pointer",
                backgroundColor: "#000",
                position: "relative"
              },
              children: [
                /* @__PURE__ */ jsx(
                  "video",
                  {
                    crossOrigin: "anonymous",
                    src: getImageUrl(product.video_url),
                    autoPlay: true,
                    loop: true,
                    muted: true,
                    playsInline: true,
                    style: { width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }
                  }
                ),
                /* @__PURE__ */ jsx(ActionIcon, { variant: "white", radius: "xl", size: 48, style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(4px)" }, children: /* @__PURE__ */ jsx(IconPlayerPlay, { size: 20, color: "#0B3022", style: { marginLeft: "4px" } }) })
              ]
            }
          ),
          product.images.map((img, i) => /* @__PURE__ */ jsx(
            Box,
            {
              style: {
                width: window.innerWidth < 768 ? "260px" : "300px",
                height: window.innerWidth < 768 ? "350px" : "400px",
                flexShrink: 0,
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
              },
              children: /* @__PURE__ */ jsx(Image, { crossOrigin: "anonymous", src: getImageUrl(img), alt: "Lifestyle", fit: "cover", h: "100%", w: "100%" })
            },
            i
          )),
          /* @__PURE__ */ jsx(Box, { w: 1, style: { flexShrink: 0 } })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(Box, { w: "100%", px: { base: "md", md: "xl" }, style: { maxWidth: "1200px", margin: "0 auto", paddingBottom: "5rem" }, children: /* @__PURE__ */ jsx(ProductReviews, { productId: id, crmBase: CRM_BASE }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] }),
    product.video_url && /* @__PURE__ */ jsx(Modal, { opened: videoOpened, onClose: closeVideo, size: "xl", centered: true, padding: 0, withCloseButton: false, children: /* @__PURE__ */ jsx("video", { crossOrigin: "anonymous", src: getImageUrl(product.video_url), controls: true, autoPlay: true, style: { width: "100%", borderRadius: "16px" } }) })
  ] });
}
export {
  BetaShow as default
};
