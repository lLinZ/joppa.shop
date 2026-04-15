import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { AppShell, Group, Burger, Box, Anchor, Image, ActionIcon, Indicator, UnstyledButton, Drawer, Stack } from "@mantine/core";
import { IconSearch, IconShoppingCart } from "@tabler/icons-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
const useAppStore = create()(
  persist(
    (set) => ({
      theme: "light",
      primaryColor: "#000000",
      activeColor: "#0B3022",
      isCartDrawerOpen: false,
      cartItems: [],
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setPrimaryColor: (color) => set(() => ({ primaryColor: color })),
      setActiveColor: (color) => set(() => ({ activeColor: color })),
      toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
      addToCart: (item) => set((state) => {
        const cartItemId = `${item.id}-${item.size || ""}-${item.color || ""}-${item.gender || ""}`;
        const existing = state.cartItems.find((i) => i.id === cartItemId);
        if (existing) {
          return {
            cartItems: state.cartItems.map((i) => i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i),
            isCartDrawerOpen: true
          };
        }
        return {
          cartItems: [...state.cartItems, { ...item, id: cartItemId, productId: item.id, quantity: 1 }],
          isCartDrawerOpen: true
        };
      }),
      removeFromCart: (id) => set((state) => ({
        cartItems: state.cartItems.filter((i) => i.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        cartItems: state.cartItems.map((i) => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
      })),
      clearCart: () => set(() => ({ cartItems: [], isCartDrawerOpen: false }))
    }),
    {
      name: "joppa-app-store"
    }
  )
);
const NAVIGATION_LINKS = [
  { label: "Shop", href: "/catalog" },
  { label: "Crea tu diseño", href: "/custom-design" },
  { label: "Novedades", href: "/catalog" },
  { label: "Contacto", href: "/contact" }
];
const Header = ({ opened, toggle }) => {
  const { cartItems, toggleCartDrawer } = useAppStore();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      AppShell.Header,
      {
        h: 100,
        bg: "rgba(244, 244, 232, 0.8)",
        withBorder: false,
        zIndex: 1e3,
        style: {
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)"
        },
        children: [
          /* @__PURE__ */ jsx(Group, { h: "100%", px: "xl", justify: "space-between", align: "center", wrap: "nowrap", hiddenFrom: "md", w: "100%", children: /* @__PURE__ */ jsxs(Group, { justify: "space-between", w: "100%", align: "center", children: [
            /* @__PURE__ */ jsx(
              Burger,
              {
                opened,
                onClick: toggle,
                size: "sm",
                color: "#000000",
                "aria-label": "Toggle navigation mobile"
              }
            ),
            /* @__PURE__ */ jsx(Box, { style: { position: "absolute", left: "50%", transform: "translateX(-50%)" }, children: /* @__PURE__ */ jsx(Anchor, { href: "/", style: { textDecoration: "none", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsx(Image, { src: "/logo.png", alt: "JOPPA Logo", h: 40, w: "auto" }) }) }),
            /* @__PURE__ */ jsxs(Group, { gap: "sm", children: [
              /* @__PURE__ */ jsx(ActionIcon, { radius: "xl", variant: "subtle", color: "dark", size: "lg", "aria-label": "Search", children: /* @__PURE__ */ jsx(IconSearch, { color: "#000000", size: 20, stroke: 1.5 }) }),
              /* @__PURE__ */ jsx(ActionIcon, { radius: "xl", variant: "subtle", color: "dark", size: "lg", "aria-label": "Cart", style: { position: "relative" }, onClick: toggleCartDrawer, children: /* @__PURE__ */ jsx(
                Indicator,
                {
                  color: "#0B3022",
                  size: totalItems > 0 ? 18 : 12,
                  offset: 4,
                  withBorder: true,
                  label: totalItems > 0 ? totalItems : void 0,
                  styles: { indicator: { fontWeight: 800, fontSize: "10px" } },
                  children: /* @__PURE__ */ jsx(IconShoppingCart, { color: "#000000", size: 20, stroke: 1.5 })
                }
              ) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(Group, { h: "100%", px: "xl", justify: "space-between", align: "center", wrap: "nowrap", visibleFrom: "md", w: "100%", children: [
            /* @__PURE__ */ jsx(Anchor, { href: "/", style: { textDecoration: "none", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsx(Image, { src: "/logo.png", alt: "JOPPA Logo", h: 40, w: "auto" }) }),
            /* @__PURE__ */ jsxs(Group, { gap: "2.5rem", align: "center", children: [
              /* @__PURE__ */ jsx("style", { children: `
                                .soft-nav-link {
                                    color: #4A4A4A;
                                    transition: color 0.2s ease;
                                    text-decoration: none;
                                }
                                .soft-nav-link:hover {
                                    color: #0B3022;
                                }
                            ` }),
              NAVIGATION_LINKS.map((link) => /* @__PURE__ */ jsx(
                Anchor,
                {
                  href: link.href,
                  className: "soft-nav-link",
                  underline: "never",
                  style: {
                    fontWeight: 600,
                    fontSize: "16px",
                    textTransform: "capitalize",
                    fontFamily: '"Montserrat", sans-serif',
                    color: "#4A4A4A"
                  },
                  children: link.label
                },
                link.label
              ))
            ] }),
            /* @__PURE__ */ jsxs(Group, { gap: "lg", wrap: "nowrap", align: "center", children: [
              /* @__PURE__ */ jsx(UnstyledButton, { "aria-label": "Search", children: /* @__PURE__ */ jsx(IconSearch, { color: "#000000", size: 20, stroke: 1.5 }) }),
              /* @__PURE__ */ jsx(UnstyledButton, { "aria-label": "Cart", style: { position: "relative" }, onClick: toggleCartDrawer, children: /* @__PURE__ */ jsx(
                Indicator,
                {
                  color: "#0B3022",
                  size: totalItems > 0 ? 18 : 12,
                  offset: 4,
                  withBorder: true,
                  label: totalItems > 0 ? totalItems : void 0,
                  styles: { indicator: { fontWeight: 800, fontSize: "10px" } },
                  children: /* @__PURE__ */ jsx(IconShoppingCart, { color: "#000000", size: 20, stroke: 1.5 })
                }
              ) })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      Drawer,
      {
        opened,
        onClose: toggle,
        size: "100%",
        padding: "xl",
        hiddenFrom: "md",
        title: /* @__PURE__ */ jsx(Anchor, { href: "/", style: { textDecoration: "none", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsx(Image, { src: "/logo.png", alt: "JOPPA Logo", h: 40, w: "auto" }) }),
        zIndex: 1e6,
        styles: {
          content: { backgroundColor: "#F4F4E8" },
          header: { backgroundColor: "#F4F4E8", borderBottom: "none", paddingBottom: "24px", paddingTop: "24px" },
          close: { color: "#000000" }
        },
        children: /* @__PURE__ */ jsx(Stack, { mt: "4rem", gap: "2rem", children: NAVIGATION_LINKS.map((link) => /* @__PURE__ */ jsx(
          Anchor,
          {
            href: link.href,
            underline: "never",
            onClick: toggle,
            display: "block",
            c: "#000000",
            style: { fontWeight: 500, fontSize: "2rem", textTransform: "capitalize", fontFamily: '"Montserrat", sans-serif' },
            children: link.label
          },
          `mobile-${link.label}`
        )) })
      }
    )
  ] });
};
export {
  Header as H,
  useAppStore as u
};
