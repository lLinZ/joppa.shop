import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Head } from "@inertiajs/react";
import { AppShell, Box, Group, Stack, Title, Text, TextInput, ScrollArea, SimpleGrid, Skeleton, Center, Button, rem, Card, Image, Badge } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch, IconShoppingBag, IconFilterOff } from "@tabler/icons-react";
import { H as Header } from "./Header-BA1_ggmj.js";
import { C as CartDrawer, F as Footer } from "./Footer--tUsT2lM.js";
import "zustand";
import "zustand/middleware";
const CRM_BASE = "https://crm.joppa.shop/api";
function ProductCard({ product }) {
  var _a, _b;
  const thumb = ((_a = product.images) == null ? void 0 : _a[0]) ?? null;
  return /* @__PURE__ */ jsxs(
    Card,
    {
      radius: "xl",
      p: 0,
      style: { overflow: "hidden", cursor: "pointer", backgroundColor: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)", transition: "transform 0.25s ease, box-shadow 0.25s ease" },
      onMouseEnter: (e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      },
      onClick: () => window.location.href = `/catalog/${product.slug || product.id}`,
      children: [
        /* @__PURE__ */ jsxs(Box, { style: { aspectRatio: "3/4", backgroundColor: "#F0EFE6", position: "relative", overflow: "hidden" }, children: [
          thumb ? /* @__PURE__ */ jsx(Image, { src: thumb, alt: product.name, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsx(Center, { style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ jsx(IconShoppingBag, { size: 48, color: "#C8C7BC", stroke: 1 }) }),
          ((_b = product.collections) == null ? void 0 : _b.length) > 0 && /* @__PURE__ */ jsx(Box, { style: { position: "absolute", top: 12, left: 12, display: "flex", gap: 4, flexWrap: "wrap" }, children: product.collections.slice(0, 2).map((c) => /* @__PURE__ */ jsx(Badge, { size: "xs", radius: "xl", style: { backgroundColor: "rgba(11,48,34,0.75)", color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em", backdropFilter: "blur(4px)" }, children: c.name }, c.id)) })
        ] }),
        /* @__PURE__ */ jsxs(Box, { p: "md", children: [
          /* @__PURE__ */ jsx(Text, { fw: 700, size: "sm", c: "#0B1B0E", lineClamp: 1, style: { fontFamily: '"Montserrat", sans-serif' }, children: product.name }),
          product.style && /* @__PURE__ */ jsx(Text, { size: "xs", c: "dimmed", mt: 2, children: product.style }),
          /* @__PURE__ */ jsxs(Text, { fw: 800, size: "md", c: "#0B3022", mt: "xs", style: { fontFamily: '"Montserrat", sans-serif' }, children: [
            "$",
            Number(product.price).toLocaleString("es-AR")
          ] })
        ] })
      ]
    }
  );
}
function CatalogIndex() {
  const [opened, { toggle }] = useDisclosure(false);
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      fetch(`${CRM_BASE}/catalog`).then((r) => r.json()).catch(() => ({ products: [] })),
      fetch(`${CRM_BASE}/catalog/collections`).then((r) => r.json()).catch(() => ({ collections: [] }))
    ]).then(([prodData, colData]) => {
      setProducts(prodData.products ?? []);
      setCollections(colData.collections ?? []);
      setLoading(false);
    });
  }, []);
  const filtered = useMemo(() => {
    let list = products;
    if (selectedCollection) list = list.filter((p) => {
      var _a;
      return (_a = p.collections) == null ? void 0 : _a.some((c) => c.slug === selectedCollection);
    });
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, selectedCollection, search]);
  const hasFilters = !!search || !!selectedCollection;
  const chipStyle = (active) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 18px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: '"Montserrat", sans-serif',
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
    border: active ? "1.5px solid #0B3022" : "1.5px solid rgba(0,0,0,0.12)",
    backgroundColor: active ? "#0B3022" : "#FFFFFF",
    color: active ? "#FFFFFF" : "#4A4A4A",
    userSelect: "none"
  });
  return /* @__PURE__ */ jsxs(AppShell, { header: { height: 100, collapsed: false, offset: true }, className: "page-transition", children: [
    /* @__PURE__ */ jsx(Head, { title: "Catálogo — JOPPA" }),
    /* @__PURE__ */ jsx(CartDrawer, {}),
    /* @__PURE__ */ jsx(Header, { opened, toggle }),
    /* @__PURE__ */ jsxs(AppShell.Main, { bg: "#F4F4E8", pt: rem(120), children: [
      /* @__PURE__ */ jsxs(Box, { px: { base: "md", md: "xl" }, pb: rem(80), children: [
        /* @__PURE__ */ jsxs(Group, { justify: "space-between", align: "flex-end", mb: "xl", wrap: "wrap", gap: "md", children: [
          /* @__PURE__ */ jsxs(Stack, { gap: 4, children: [
            /* @__PURE__ */ jsx(Title, { order: 1, c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif', letterSpacing: "-0.03em", fontWeight: 800 }, children: "Catálogo" }),
            /* @__PURE__ */ jsx(Text, { c: "dimmed", size: "sm", children: loading ? "Cargando..." : `${filtered.length} producto${filtered.length !== 1 ? "s" : ""} disponible${filtered.length !== 1 ? "s" : ""}` })
          ] }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              placeholder: "Buscar productos...",
              leftSection: /* @__PURE__ */ jsx(IconSearch, { size: 16 }),
              value: search,
              onChange: (e) => setSearch(e.target.value),
              radius: "xl",
              size: "md",
              w: { base: "100%", sm: 280 },
              styles: { input: { backgroundColor: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", fontFamily: '"Montserrat", sans-serif' } }
            }
          )
        ] }),
        collections.length > 0 && /* @__PURE__ */ jsx(ScrollArea, { type: "never", mb: "xl", children: /* @__PURE__ */ jsxs(Group, { wrap: "nowrap", gap: "sm", pb: 4, children: [
          /* @__PURE__ */ jsx("button", { style: chipStyle(selectedCollection === null), onClick: () => setSelectedCollection(null), children: "Todos" }),
          collections.map((col) => /* @__PURE__ */ jsxs(
            "button",
            {
              style: chipStyle(selectedCollection === col.slug),
              onClick: () => setSelectedCollection(selectedCollection === col.slug ? null : col.slug),
              children: [
                col.name,
                col.products_count > 0 && /* @__PURE__ */ jsxs("span", { style: { opacity: 0.6, fontSize: 11 }, children: [
                  "(",
                  col.products_count,
                  ")"
                ] })
              ]
            },
            col.id
          ))
        ] }) }),
        loading ? /* @__PURE__ */ jsx(SimpleGrid, { cols: { base: 2, sm: 3, lg: 4 }, spacing: "lg", children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsxs(Box, { children: [
          /* @__PURE__ */ jsx(Skeleton, { height: 300, radius: "xl", mb: "sm" }),
          /* @__PURE__ */ jsx(Skeleton, { height: 14, radius: "xl", mb: "xs", width: "70%" }),
          /* @__PURE__ */ jsx(Skeleton, { height: 14, radius: "xl", width: "40%" })
        ] }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsx(Center, { py: rem(120), children: /* @__PURE__ */ jsxs(Stack, { align: "center", gap: "md", children: [
          /* @__PURE__ */ jsx(IconShoppingBag, { size: 64, color: "#C8C7BC", stroke: 1 }),
          /* @__PURE__ */ jsx(Title, { order: 3, c: "#4A4A4A", style: { fontFamily: '"Montserrat", sans-serif' }, children: hasFilters ? "Sin resultados" : "Catálogo vacío" }),
          /* @__PURE__ */ jsx(Text, { c: "dimmed", ta: "center", maw: 300, children: hasFilters ? "Prueba con otra búsqueda o selecciona otra colección." : "Pronto habrá productos disponibles." }),
          hasFilters && /* @__PURE__ */ jsx(Button, { leftSection: /* @__PURE__ */ jsx(IconFilterOff, { size: 16 }), variant: "outline", radius: "xl", color: "dark", onClick: () => {
            setSearch("");
            setSelectedCollection(null);
          }, style: { fontFamily: '"Montserrat", sans-serif' }, children: "Limpiar filtros" })
        ] }) }) : /* @__PURE__ */ jsx(SimpleGrid, { cols: { base: 2, sm: 3, lg: 4 }, spacing: "lg", children: filtered.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id)) })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
export {
  CatalogIndex as default
};
