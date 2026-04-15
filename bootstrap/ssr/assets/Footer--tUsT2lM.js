import { jsx, jsxs } from "react/jsx-runtime";
import { Drawer, Flex, Group, Text, ActionIcon, ScrollArea, Button, Stack, Box, Image, Container, TextInput, Anchor } from "@mantine/core";
import { IconX, IconTrash, IconMinus, IconPlus, IconArrowRight, IconBrandInstagram, IconBrandTiktok } from "@tabler/icons-react";
import { u as useAppStore } from "./Header-BA1_ggmj.js";
import { router } from "@inertiajs/react";
function CartDrawer() {
  const { isCartDrawerOpen, toggleCartDrawer, cartItems, removeFromCart, updateQuantity } = useAppStore();
  const parsePrice = (priceStr) => {
    const num = parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? 0 : num;
  };
  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
  return /* @__PURE__ */ jsx(
    Drawer,
    {
      opened: isCartDrawerOpen,
      onClose: toggleCartDrawer,
      position: "right",
      size: "md",
      withCloseButton: false,
      overlayProps: { backgroundOpacity: 0.2, blur: 4 },
      styles: {
        content: { backgroundColor: "#F9F9F4", borderRadius: "32px 0 0 32px" },
        header: { display: "none" },
        body: { padding: 0, height: "100%" }
        // Eliminamos padding nativo para control de overflow flex en Footer
      },
      zIndex: 2e6,
      children: /* @__PURE__ */ jsxs(Flex, { direction: "column", h: "100%", children: [
        /* @__PURE__ */ jsxs(Group, { justify: "space-between", align: "center", px: "24px", pt: "32px", pb: "24px", children: [
          /* @__PURE__ */ jsx(Text, { fw: 800, size: "2.5rem", c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif', letterSpacing: "-0.05em", lineHeight: 1 }, children: "Tu Bolsa" }),
          /* @__PURE__ */ jsx(
            ActionIcon,
            {
              onClick: toggleCartDrawer,
              variant: "subtle",
              color: "gray",
              size: "xl",
              radius: "xl",
              style: { backgroundColor: "transparent" },
              className: "joppa-drawer-close",
              children: /* @__PURE__ */ jsx(IconX, { stroke: 1.5, color: "#000000", size: 24 })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
                        .joppa-drawer-close:hover {
                            background-color: #E8E8E0 !important;
                        }
                    ` }),
        /* @__PURE__ */ jsx(ScrollArea, { style: { flex: 1 }, type: "scroll", px: "24px", children: cartItems.length === 0 ? /* @__PURE__ */ jsxs(Flex, { direction: "column", align: "center", justify: "center", h: "100%", mt: "4rem", children: [
          /* @__PURE__ */ jsx(Text, { c: "dimmed", size: "lg", style: { fontFamily: '"Montserrat", sans-serif', textAlign: "center" }, children: "Tu bolsa está vacía." }),
          /* @__PURE__ */ jsx(
            Button,
            {
              mt: "xl",
              radius: "xl",
              variant: "outline",
              color: "#0B3022",
              onClick: toggleCartDrawer,
              style: { fontWeight: 600, fontFamily: '"Montserrat", sans-serif', borderWidth: "2px" },
              children: "Seguir Comprando"
            }
          )
        ] }) : /* @__PURE__ */ jsx(Stack, { gap: "md", pb: "2rem", children: cartItems.map((item) => /* @__PURE__ */ jsx(
          Box,
          {
            bg: "#FFFFFF",
            style: {
              borderRadius: "24px",
              padding: "16px"
            },
            children: /* @__PURE__ */ jsxs(Group, { wrap: "nowrap", align: "flex-start", children: [
              /* @__PURE__ */ jsx(Box, { w: 84, h: 104, style: { borderRadius: "16px", overflow: "hidden", backgroundColor: "#F4F4E8", flexShrink: 0 }, children: /* @__PURE__ */ jsx(Image, { src: item.image, alt: item.name, height: 104, fit: "cover", style: { mixBlendMode: "darken" } }) }),
              /* @__PURE__ */ jsxs(Flex, { direction: "column", justify: "space-between", style: { flexGrow: 1 }, h: 104, children: [
                /* @__PURE__ */ jsxs(Box, { children: [
                  /* @__PURE__ */ jsxs(Group, { justify: "space-between", wrap: "nowrap", align: "flex-start", children: [
                    /* @__PURE__ */ jsxs(Box, { children: [
                      /* @__PURE__ */ jsx(Text, { size: "10px", fw: 800, c: "dimmed", style: { textTransform: "uppercase", letterSpacing: "0.1em" }, mb: 2, children: item.brand || "JOPPA" }),
                      /* @__PURE__ */ jsx(Text, { fw: 700, size: "md", c: "#000000", style: { fontFamily: '"Montserrat", sans-serif', lineHeight: 1.1 }, children: item.name }),
                      (item.color || item.size) && /* @__PURE__ */ jsxs(Text, { size: "11px", fw: 600, c: "dimmed", mt: 6, style: { textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: '"Montserrat", sans-serif' }, children: [
                        item.color && `Color: ${item.color}`,
                        " ",
                        item.color && item.size && "•",
                        " ",
                        item.size && `Size: ${item.size}`
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(ActionIcon, { onClick: () => removeFromCart(item.id), variant: "transparent", size: "sm", children: /* @__PURE__ */ jsx(IconTrash, { size: 18, stroke: 1.5, color: "#A0A0A0" }) })
                  ] }),
                  /* @__PURE__ */ jsx(Text, { size: "sm", fw: 800, c: "#000000", mt: 4, children: item.price })
                ] }),
                /* @__PURE__ */ jsxs(Group, { justify: "space-between", align: "center", mt: "auto", children: [
                  /* @__PURE__ */ jsxs(
                    Group,
                    {
                      gap: 0,
                      bg: "#FFFFFF",
                      style: {
                        borderRadius: "32px",
                        padding: "4px 8px",
                        minHeight: "36px"
                      },
                      children: [
                        /* @__PURE__ */ jsx(ActionIcon, { size: "sm", variant: "transparent", onClick: () => updateQuantity(item.id, item.quantity - 1), children: /* @__PURE__ */ jsx(IconMinus, { size: 14, color: "#000000", stroke: 2 }) }),
                        /* @__PURE__ */ jsx(Text, { size: "sm", fw: 700, w: 24, ta: "center", c: "#000000", style: { fontFamily: '"Montserrat", sans-serif' }, children: item.quantity }),
                        /* @__PURE__ */ jsx(ActionIcon, { size: "sm", variant: "transparent", onClick: () => updateQuantity(item.id, item.quantity + 1), children: /* @__PURE__ */ jsx(IconPlus, { size: 14, color: "#000000", stroke: 2 }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(Text, { fw: 800, size: "md", c: "#000000", style: { fontFamily: '"Montserrat", sans-serif' }, children: [
                    "$",
                    (parsePrice(item.price) * item.quantity).toFixed(2)
                  ] })
                ] })
              ] })
            ] })
          },
          item.id
        )) }) }),
        cartItems.length > 0 && /* @__PURE__ */ jsxs(
          Box,
          {
            px: "24px",
            py: "32px",
            bg: "#F9F9F4",
            style: {
              boxShadow: "0 -10px 40px rgba(0,0,0,0.06)",
              zIndex: 10
            },
            children: [
              /* @__PURE__ */ jsxs(Group, { justify: "space-between", mb: "lg", children: [
                /* @__PURE__ */ jsx(Text, { fw: 600, size: "lg", c: "dimmed", style: { fontFamily: '"Montserrat", sans-serif' }, children: "Subtotal" }),
                /* @__PURE__ */ jsxs(Text, { fw: 800, size: "24px", c: "#000000", style: { fontFamily: '"Montserrat", sans-serif', letterSpacing: "-0.02em" }, children: [
                  "$",
                  subtotal.toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  fullWidth: true,
                  size: "xl",
                  radius: "xl",
                  color: "#0B3022",
                  c: "#FFFFFF",
                  h: 60,
                  style: {
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontFamily: '"Montserrat", sans-serif'
                  },
                  onClick: () => {
                    toggleCartDrawer();
                    router.visit("/checkout");
                  },
                  children: "Checkout"
                }
              )
            ]
          }
        )
      ] })
    }
  );
}
function Footer() {
  return /* @__PURE__ */ jsx(
    Box,
    {
      bg: "#0B3022",
      pt: 80,
      pb: 80,
      style: {
        borderRadius: "32px 32px 0 0",
        color: "#F5F5DC",
        fontFamily: '"Inter", sans-serif'
      },
      children: /* @__PURE__ */ jsxs(Container, { size: "xl", children: [
        /* @__PURE__ */ jsxs(
          Flex,
          {
            direction: { base: "column", md: "row" },
            justify: "space-between",
            gap: { base: 60, md: 40 },
            mb: 60,
            children: [
              /* @__PURE__ */ jsxs(Stack, { gap: "xl", style: { maxWidth: "400px" }, children: [
                /* @__PURE__ */ jsx(
                  Text,
                  {
                    size: "2.5rem",
                    fw: 900,
                    style: {
                      fontFamily: '"Montserrat", sans-serif',
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                      color: "#F5F5DC"
                    },
                    children: "JOPPA"
                  }
                ),
                /* @__PURE__ */ jsx(Text, { size: "sm", style: { opacity: 0.8, lineHeight: 1.6 }, children: "Elevando los estándares del streetwear con estética minimalista, DTF de calidad y telas increibles." }),
                /* @__PURE__ */ jsxs(Box, { mt: "md", children: [
                  /* @__PURE__ */ jsx(Text, { fw: 700, mb: "xs", style: { fontFamily: '"Montserrat", sans-serif', color: "#F5F5DC" }, children: "Únete a nuestro newsletter" }),
                  /* @__PURE__ */ jsxs(
                    Flex,
                    {
                      bg: "rgba(245, 245, 220, 0.1)",
                      p: "6px",
                      style: { borderRadius: "100px" },
                      children: [
                        /* @__PURE__ */ jsx(
                          TextInput,
                          {
                            placeholder: "Tu correo electrónico",
                            variant: "unstyled",
                            size: "md",
                            style: { flex: 1, paddingLeft: "16px" },
                            styles: {
                              input: { color: "#F5F5DC" }
                            }
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          ActionIcon,
                          {
                            size: "lg",
                            radius: "xl",
                            bg: "#D4A017",
                            c: "#0B3022",
                            style: { minWidth: "40px", minHeight: "40px" },
                            children: /* @__PURE__ */ jsx(IconArrowRight, { size: 20, stroke: 2 })
                          }
                        )
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Stack, { gap: "sm", children: [
                /* @__PURE__ */ jsx(Text, { fw: 700, size: "lg", mb: "sm", style: { fontFamily: '"Montserrat", sans-serif', color: "#F5F5DC" }, children: "Links" }),
                /* @__PURE__ */ jsx(Anchor, { href: "/catalog", c: "#F5F5DC", style: { opacity: 0.7 }, underline: "never", children: "Catálogo" }),
                /* @__PURE__ */ jsx(Anchor, { href: "/custom-design", c: "#F5F5DC", style: { opacity: 0.7 }, underline: "never", children: "Crea tu Diseño" }),
                /* @__PURE__ */ jsx(Anchor, { href: "mailto:atencion@joppa.shop", c: "#F5F5DC", style: { opacity: 0.7 }, underline: "never", children: "Contáctanos" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Flex,
          {
            direction: { base: "column", sm: "row" },
            justify: "space-between",
            align: "center",
            gap: "md",
            pt: "xl",
            style: { borderTop: "1px solid rgba(245, 245, 220, 0.1)" },
            children: [
              /* @__PURE__ */ jsxs(Text, { size: "sm", style: { opacity: 0.6 }, children: [
                "© ",
                (/* @__PURE__ */ new Date()).getFullYear(),
                " JOPPA Studio. 2026."
              ] }),
              /* @__PURE__ */ jsxs(Group, { gap: "md", children: [
                /* @__PURE__ */ jsx(ActionIcon, { variant: "transparent", c: "#F5F5DC", size: "lg", style: { opacity: 0.8 }, component: "a", href: "https://instagram.com/joppa.shop", target: "_blank", rel: "noopener", children: /* @__PURE__ */ jsx(IconBrandInstagram, { size: 24 }) }),
                /* @__PURE__ */ jsx(ActionIcon, { variant: "transparent", c: "#F5F5DC", size: "lg", style: { opacity: 0.8 }, component: "a", href: "https://tiktok.com/joppa.shop", target: "_blank", rel: "noopener", children: /* @__PURE__ */ jsx(IconBrandTiktok, { size: 24 }) })
              ] })
            ]
          }
        )
      ] })
    }
  );
}
export {
  CartDrawer as C,
  Footer as F
};
