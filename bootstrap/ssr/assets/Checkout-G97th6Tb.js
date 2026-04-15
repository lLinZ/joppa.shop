import { jsxs, jsx } from "react/jsx-runtime";
import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { AppShell, Box, Button, Title, Paper, ThemeIcon, Text, Group, Stack, Grid, TextInput, Select, Textarea, Badge, Image, ActionIcon, Divider, SimpleGrid, Card, Flex, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconCheck, IconBrandWhatsapp, IconShoppingBag, IconMinus, IconPlus, IconTrash, IconShoppingCartPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { u as useAppStore, H as Header } from "./Header-BA1_ggmj.js";
import axios from "axios";
import "zustand";
import "zustand/middleware";
const CRM_API_URL = "https://crm.joppa.shop/api";
const countries = [
  { value: "+58", label: "+58", country: "ve" },
  { value: "+1", label: "+1", country: "us" },
  { value: "+34", label: "+34", country: "es" },
  { value: "+57", label: "+57", country: "co" },
  { value: "+56", label: "+56", country: "cl" },
  { value: "+54", label: "+54", country: "ar" },
  { value: "+52", label: "+52", country: "mx" },
  { value: "+51", label: "+51", country: "pe" },
  { value: "+507", label: "+507", country: "pa" },
  { value: "+55", label: "+55", country: "br" },
  { value: "+593", label: "+593", country: "ec" },
  { value: "+506", label: "+506", country: "cr" }
];
const parsePrice = (priceStr) => {
  const num = parseFloat(String(priceStr).replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : num;
};
function Checkout() {
  var _a;
  const [opened, { toggle }] = useDisclosure(false);
  const { cartItems, clearCart, addToCart, updateQuantity, removeFromCart } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  React.useEffect(() => {
    fetch(`${CRM_API_URL}/catalog`).then((res) => res.json()).then((data) => {
      if (data.products) {
        const shuffled = data.products.sort(() => 0.5 - Math.random());
        setSuggestedProducts(shuffled.slice(0, 3));
      }
    }).catch((err) => console.error(err));
  }, []);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone_prefix: "+58",
      phone_number: "",
      state: "",
      address_detail: ""
    },
    validate: {
      name: (v) => v.trim().length < 2 ? "Nombre requerido." : null,
      email: (v) => /^\S+@\S+$/.test(v) ? null : "Email inválido.",
      phone_number: (v) => v.replace(/\D/g, "").length < 10 ? "El número debe tener al menos 10 dígitos." : null,
      state: (v) => !v ? "Estado requerido." : null,
      address_detail: () => null
    }
  });
  const handleSubmit = async (values) => {
    var _a2, _b, _c, _d, _e, _f;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: `${values.phone_prefix}${values.phone_number.replace(/\D/g, "")}`,
        address: values.state,
        notes: values.address_detail || null,
        total_amount: subtotal,
        items: cartItems.map((item) => ({
          product_id: String(item.productId || item.id),
          product_name: item.name,
          quantity: item.quantity,
          price: parsePrice(item.price),
          size: item.size || null,
          color: item.color || null
        }))
      };
      const res = await axios.post(`${CRM_API_URL}/orders`, payload);
      clearCart();
      setCreatedOrder(res.data.order);
      setSuccess(true);
    } catch (err) {
      const msg = ((_b = (_a2 = err == null ? void 0 : err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || ((_f = (_e = (_d = (_c = err == null ? void 0 : err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.errors) == null ? void 0 : _e.name) == null ? void 0 : _f[0]) || "Error al crear la orden. Intenta de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 10) val = val.slice(0, 10);
    let formatted = val;
    if (val.length > 3 && val.length <= 6) {
      formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
    } else if (val.length > 6) {
      formatted = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`;
    }
    form.setFieldValue("phone_number", formatted);
  };
  return /* @__PURE__ */ jsxs(AppShell, { header: { height: 100, collapsed: false, offset: true }, children: [
    /* @__PURE__ */ jsx(Head, { title: "Checkout - JOPPA" }),
    /* @__PURE__ */ jsx(Header, { opened, toggle }),
    /* @__PURE__ */ jsx(AppShell.Main, { bg: "#F4F4E8", pt: rem(120), children: /* @__PURE__ */ jsxs(Box, { px: { base: "md", md: "xl" }, pb: rem(80), maw: 1100, mx: "auto", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "subtle",
          color: "dark",
          leftSection: /* @__PURE__ */ jsx(IconArrowLeft, { size: 16, stroke: 2 }),
          mb: "xl",
          style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600 },
          onClick: () => router.visit("/"),
          children: "Volver a la tienda"
        }
      ),
      /* @__PURE__ */ jsx(
        Title,
        {
          order: 1,
          mb: "xl",
          style: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#0B3022"
          },
          children: "Checkout"
        }
      ),
      success ? (
        /* ─── SUCCESS STATE ─── */
        /* @__PURE__ */ jsxs(Paper, { radius: "32px", p: 64, bg: "#F9F9F4", ta: "center", children: [
          /* @__PURE__ */ jsx(ThemeIcon, { size: 80, radius: "100%", color: "teal", variant: "light", mb: "xl", children: /* @__PURE__ */ jsx(IconCheck, { size: 44, stroke: 2 }) }),
          /* @__PURE__ */ jsxs(Title, { order: 2, mb: "sm", style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }, children: [
            "¡Orden #",
            createdOrder == null ? void 0 : createdOrder.id,
            " recibida!"
          ] }),
          /* @__PURE__ */ jsx(Text, { c: "dimmed", size: "lg", mb: "xl", style: { fontFamily: '"Montserrat", sans-serif' }, children: "Tu pedido fue enviado correctamente. Por favor contáctanos por WhatsApp para coordinar el pago y envío." }),
          /* @__PURE__ */ jsxs(Group, { justify: "center", gap: "md", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "lg",
                radius: "xl",
                component: "a",
                href: `https://wa.me/584222030200?text=Hola,%20acabo%20de%20hacer%20el%20pedido%20%23${createdOrder == null ? void 0 : createdOrder.id}%20en%20la%20tienda.`,
                target: "_blank",
                color: "#25D366",
                c: "#FFFFFF",
                leftSection: /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 22 }),
                style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700 },
                children: "Contactar por WhatsApp"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "lg",
                radius: "xl",
                variant: "outline",
                color: "#0B3022",
                style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700 },
                onClick: () => router.visit("/"),
                children: "Volver al Inicio"
              }
            )
          ] })
        ] })
      ) : cartItems.length === 0 ? (
        /* ─── EMPTY CART STATE ─── */
        /* @__PURE__ */ jsx(Stack, { gap: "xl", children: /* @__PURE__ */ jsxs(Paper, { radius: "32px", p: 64, bg: "#F9F9F4", ta: "center", children: [
          /* @__PURE__ */ jsx(ThemeIcon, { size: 80, radius: "100%", color: "gray", variant: "light", mb: "xl", children: /* @__PURE__ */ jsx(IconShoppingBag, { size: 44, stroke: 2 }) }),
          /* @__PURE__ */ jsx(Title, { order: 2, mb: "sm", style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }, children: "Tu carrito está vacío" }),
          /* @__PURE__ */ jsx(Text, { c: "dimmed", size: "lg", mb: "xl", style: { fontFamily: '"Montserrat", sans-serif' }, children: "Parece que aún no has agregado productos. Explora nuestro catálogo y descubre lo que tenemos para ti." }),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "lg",
              radius: "xl",
              color: "#0B3022",
              c: "#FFFFFF",
              style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700 },
              onClick: () => router.visit("/catalog"),
              children: "Ir al Catálogo de Productos"
            }
          )
        ] }) })
      ) : (
        /* ─── CHECKOUT FORM ─── */
        /* @__PURE__ */ jsxs(Grid, { gutter: "xl", children: [
          /* @__PURE__ */ jsx(Grid.Col, { span: { base: 12, md: 7 }, children: /* @__PURE__ */ jsxs(Paper, { radius: "32px", p: 36, bg: "#F9F9F4", children: [
            /* @__PURE__ */ jsx(
              Text,
              {
                fw: 800,
                size: "xl",
                mb: "lg",
                style: { fontFamily: '"Montserrat", sans-serif', color: "#0B3022" },
                children: "Datos de entrega"
              }
            ),
            /* @__PURE__ */ jsx("form", { onSubmit: form.onSubmit(handleSubmit), children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  label: "Nombre completo",
                  placeholder: "Juan Pérez",
                  radius: "xl",
                  size: "md",
                  styles: {
                    label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginBottom: 6 },
                    input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: "#FFFFFF" }
                  },
                  ...form.getInputProps("name")
                }
              ),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  label: "Email",
                  placeholder: "juan@ejemplo.com",
                  radius: "xl",
                  size: "md",
                  type: "email",
                  styles: {
                    label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginBottom: 6 },
                    input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: "#FFFFFF" }
                  },
                  ...form.getInputProps("email")
                }
              ),
              /* @__PURE__ */ jsxs(Grid, { gutter: "md", children: [
                /* @__PURE__ */ jsx(Grid.Col, { span: 4, children: /* @__PURE__ */ jsx(
                  Select,
                  {
                    label: "Cód. País",
                    searchable: true,
                    allowDeselect: false,
                    data: countries,
                    renderOption: ({ option }) => /* @__PURE__ */ jsxs(Group, { gap: "xs", wrap: "nowrap", children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: `https://flagcdn.com/w20/${option.country}.png`,
                          srcSet: `https://flagcdn.com/w40/${option.country}.png 2x`,
                          width: 20,
                          alt: option.country,
                          style: { flexShrink: 0, borderRadius: 2 }
                        }
                      ),
                      /* @__PURE__ */ jsx(Text, { size: "sm", style: { fontFamily: '"Montserrat", sans-serif' }, children: option.label })
                    ] }),
                    leftSection: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: `https://flagcdn.com/w20/${((_a = countries.find((c) => c.value === form.values.phone_prefix)) == null ? void 0 : _a.country) || "ve"}.png`,
                        width: 20,
                        alt: "",
                        style: { borderRadius: 2 }
                      }
                    ),
                    radius: "xl",
                    size: "md",
                    styles: {
                      label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginBottom: 6 },
                      input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: "#FFFFFF", paddingLeft: 42 }
                    },
                    ...form.getInputProps("phone_prefix")
                  }
                ) }),
                /* @__PURE__ */ jsx(Grid.Col, { span: 8, children: /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    label: "Teléfono",
                    placeholder: "412-123-4567",
                    radius: "xl",
                    size: "md",
                    type: "tel",
                    styles: {
                      label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginBottom: 6 },
                      input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: "#FFFFFF" }
                    },
                    ...form.getInputProps("phone_number"),
                    onChange: handlePhoneChange
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsx(
                Select,
                {
                  label: "Estado (Venezuela)",
                  placeholder: "Selecciona un estado",
                  data: ["Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo", "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón", "Guárico", "Lara", "Mérida", "Miranda", "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", "La Guaira", "Yaracuy", "Zulia"],
                  radius: "xl",
                  size: "md",
                  styles: {
                    label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginBottom: 6 },
                    input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: "#FFFFFF" }
                  },
                  ...form.getInputProps("state")
                }
              ),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  label: "Instrucciones de Entrega (Opcional)",
                  placeholder: "Municipio, zona, punto de referencia o instrucciones adicionales",
                  radius: "lg",
                  size: "md",
                  rows: 3,
                  styles: {
                    label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginBottom: 6 },
                    input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: "#FFFFFF" }
                  },
                  ...form.getInputProps("address_detail")
                }
              ),
              error && /* @__PURE__ */ jsx(Text, { c: "red", size: "sm", style: { fontFamily: '"Montserrat", sans-serif' }, children: error }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "submit",
                  fullWidth: true,
                  size: "xl",
                  radius: "xl",
                  color: "#0B3022",
                  c: "#FFFFFF",
                  h: 60,
                  loading,
                  style: {
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontFamily: '"Montserrat", sans-serif',
                    marginTop: 8
                  },
                  children: [
                    "Confirmar Orden — $",
                    subtotal.toFixed(2)
                  ]
                }
              )
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsx(Grid.Col, { span: { base: 12, md: 5 }, children: /* @__PURE__ */ jsxs(Paper, { radius: "32px", p: 36, bg: "#F9F9F4", children: [
            /* @__PURE__ */ jsxs(Group, { justify: "space-between", mb: "lg", children: [
              /* @__PURE__ */ jsx(Text, { fw: 800, size: "xl", style: { fontFamily: '"Montserrat", sans-serif', color: "#0B3022" }, children: "Tu pedido" }),
              /* @__PURE__ */ jsxs(Badge, { color: "dark", radius: "xl", variant: "light", children: [
                cartItems.length,
                " ",
                cartItems.length === 1 ? "artículo" : "artículos"
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Stack, { gap: "sm", children: [
              cartItems.map((item) => /* @__PURE__ */ jsxs(Group, { wrap: "nowrap", align: "center", children: [
                /* @__PURE__ */ jsx(
                  Box,
                  {
                    w: 60,
                    h: 72,
                    style: { borderRadius: 12, overflow: "hidden", backgroundColor: "#F4F4E8", flexShrink: 0 },
                    children: /* @__PURE__ */ jsx(Image, { src: item.image, alt: item.name, height: 72, fit: "cover", style: { mixBlendMode: "darken" } })
                  }
                ),
                /* @__PURE__ */ jsxs(Box, { style: { flex: 1 }, children: [
                  /* @__PURE__ */ jsx(Text, { fw: 700, size: "sm", c: "#000000", style: { fontFamily: '"Montserrat", sans-serif', lineHeight: 1.2 }, children: item.name }),
                  (item.color || item.size) && /* @__PURE__ */ jsxs(Text, { size: "11px", c: "dimmed", fw: 600, style: { textTransform: "uppercase", letterSpacing: "0.05em" }, children: [
                    item.color,
                    " ",
                    item.color && item.size && "•",
                    " ",
                    item.size
                  ] }),
                  /* @__PURE__ */ jsxs(Group, { gap: 8, mt: "xs", children: [
                    /* @__PURE__ */ jsxs(Group, { gap: 4, bg: "#F4F4E8", style: { borderRadius: 20 }, p: 4, children: [
                      /* @__PURE__ */ jsx(
                        ActionIcon,
                        {
                          size: "sm",
                          radius: "xl",
                          variant: "transparent",
                          color: "dark",
                          onClick: () => updateQuantity(item.id, item.quantity - 1),
                          children: /* @__PURE__ */ jsx(IconMinus, { size: 14 })
                        }
                      ),
                      /* @__PURE__ */ jsx(Text, { size: "sm", fw: 700, w: 20, ta: "center", style: { fontFamily: '"Montserrat", sans-serif' }, children: item.quantity }),
                      /* @__PURE__ */ jsx(
                        ActionIcon,
                        {
                          size: "sm",
                          radius: "xl",
                          variant: "transparent",
                          color: "dark",
                          onClick: () => updateQuantity(item.id, item.quantity + 1),
                          children: /* @__PURE__ */ jsx(IconPlus, { size: 14 })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(
                      ActionIcon,
                      {
                        size: "md",
                        variant: "subtle",
                        color: "red",
                        onClick: () => removeFromCart(item.id),
                        children: /* @__PURE__ */ jsx(IconTrash, { size: 16 })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(Text, { fw: 800, size: "sm", c: "#000000", style: { fontFamily: '"Montserrat", sans-serif', flexShrink: 0 }, children: [
                  "$",
                  (parsePrice(item.price) * item.quantity).toFixed(2)
                ] })
              ] }, item.id)),
              /* @__PURE__ */ jsx(Divider, { my: "sm", color: "#E8E8E0" }),
              /* @__PURE__ */ jsxs(Group, { justify: "space-between", children: [
                /* @__PURE__ */ jsx(Text, { fw: 600, c: "dimmed", style: { fontFamily: '"Montserrat", sans-serif' }, children: "Total" }),
                /* @__PURE__ */ jsxs(Text, { fw: 800, size: "xl", c: "#000000", style: { fontFamily: '"Montserrat", sans-serif', letterSpacing: "-0.02em" }, children: [
                  "$",
                  subtotal.toFixed(2)
                ] })
              ] })
            ] })
          ] }) })
        ] })
      ),
      !success && suggestedProducts.length > 0 && /* @__PURE__ */ jsxs(Box, { mt: 64, children: [
        /* @__PURE__ */ jsx(Title, { order: 3, mb: "xl", c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }, children: "Productos Destacados" }),
        /* @__PURE__ */ jsx(SimpleGrid, { cols: { base: 1, xs: 2, md: 3 }, spacing: "xl", children: suggestedProducts.map((p) => {
          var _a2;
          return /* @__PURE__ */ jsxs(Card, { radius: "xl", p: "md", bg: "#FFFFFF", style: { border: "1px solid rgba(0,0,0,0.06)" }, children: [
            /* @__PURE__ */ jsx(Card.Section, { mb: "sm", children: /* @__PURE__ */ jsx(Box, { style: { aspectRatio: "1", backgroundColor: "#F0EFE6", overflow: "hidden" }, children: ((_a2 = p.images) == null ? void 0 : _a2[0]) ? /* @__PURE__ */ jsx(Image, { src: p.images[0], alt: p.name, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsx(Flex, { justify: "center", align: "center", h: "100%", children: /* @__PURE__ */ jsx(IconShoppingBag, { size: 40, color: "#C8C7BC", stroke: 1 }) }) }) }),
            /* @__PURE__ */ jsx(Text, { fw: 700, size: "sm", lineClamp: 1, style: { fontFamily: '"Montserrat", sans-serif' }, children: p.name }),
            /* @__PURE__ */ jsxs(Text, { fw: 800, size: "md", c: "#0B3022", mt: 2, mb: "md", style: { fontFamily: '"Montserrat", sans-serif' }, children: [
              "$",
              Number(p.price).toLocaleString("es-AR")
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                fullWidth: true,
                radius: "xl",
                variant: "light",
                color: "#0B3022",
                leftSection: /* @__PURE__ */ jsx(IconShoppingCartPlus, { size: 18 }),
                onClick: () => {
                  var _a3;
                  return addToCart({
                    id: p.id,
                    name: p.name,
                    price: typeof p.price === "number" ? p.price.toString() : p.price,
                    image: ((_a3 = p.images) == null ? void 0 : _a3[0]) || ""
                  });
                },
                style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600 },
                children: "Agregar rápido"
              }
            )
          ] }, p.id);
        }) })
      ] })
    ] }) })
  ] });
}
export {
  Checkout as default
};
