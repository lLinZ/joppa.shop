import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link, Head } from "@inertiajs/react";
import { Box, SimpleGrid, Flex, Text, Title, Group, Button, rem, Skeleton, Card, AspectRatio, Image, Stack, Tooltip, ActionIcon, Badge, AppShell, Grid, Center, ThemeIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch, IconBrandWhatsapp, IconArrowRight, IconBrandInstagram, IconPalette, IconTruck, IconHeart, IconMessageCircle2, IconMail, IconPhone, IconStar } from "@tabler/icons-react";
import { H as Header } from "./Header-BA1_ggmj.js";
import { useState, useEffect } from "react";
import { C as CartDrawer, F as Footer } from "./Footer--tUsT2lM.js";
import "zustand";
import "zustand/middleware";
const portadaDario = "/build/assets/portada_dario_pro-DkM02sAp.webp";
function HeroProduct() {
  return /* @__PURE__ */ jsx(
    Box,
    {
      w: "100%",
      bg: "transparent",
      pt: 0,
      pb: rem(40),
      children: /* @__PURE__ */ jsxs(
        SimpleGrid,
        {
          cols: { base: 1, md: 2 },
          spacing: "lg",
          p: "lg",
          style: {
            minHeight: "calc(100vh - 120px)",
            // Restamos header y offset padding
            margin: 0
          },
          children: [
            /* @__PURE__ */ jsxs(
              Flex,
              {
                direction: "column",
                justify: { base: "center", md: "space-between" },
                bg: "#F9F9F4",
                p: { base: "32px", md: "60px" },
                gap: { base: "lg", md: "xl" },
                style: {
                  borderRadius: "32px",
                  minHeight: "100%"
                },
                children: [
                  /* @__PURE__ */ jsxs(Box, { children: [
                    /* @__PURE__ */ jsx(
                      Text,
                      {
                        component: "span",
                        c: "#0B3022",
                        style: {
                          display: "block",
                          fontSize: "1rem",
                          fontWeight: 700,
                          fontFamily: '"Montserrat", sans-serif',
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: "1rem"
                        },
                        children: "Tu idea, nuestra tinta"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Title,
                      {
                        order: 1,
                        c: "#0B3022",
                        style: {
                          fontSize: "clamp(2.5rem, 6vw, 4rem)",
                          fontWeight: 700,
                          lineHeight: 1.1,
                          fontFamily: '"Montserrat", sans-serif',
                          letterSpacing: "-0.02em"
                        },
                        children: "Estampados DTF y Ropa Streetwear en Venezuela"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Text,
                      {
                        c: "#4A4A4A",
                        mt: "xl",
                        style: {
                          fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                          fontWeight: 400,
                          fontFamily: '"Montserrat", sans-serif',
                          lineHeight: 1.6,
                          maxWidth: "90%"
                        },
                        children: "Diseños con alma vintage y la resistencia del estampado premium. Creamos piezas que no solo visten, sino que cuentan tu historia. Frescura urbana en cada fibra."
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(Box, { mt: { base: 0, md: "auto" }, mb: { base: 0, md: "auto" }, children: /* @__PURE__ */ jsx(Group, { gap: "sm", children: /* @__PURE__ */ jsx(
                    Button,
                    {
                      component: Link,
                      href: "/catalog",
                      h: 64,
                      radius: "xl",
                      color: "#0B3022",
                      c: "#FFFFFF",
                      style: {
                        padding: "0 40px",
                        width: "fit-content",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        fontFamily: '"Montserrat", sans-serif',
                        letterSpacing: "0.02em"
                      },
                      children: "Comprar ahora"
                    }
                  ) }) }),
                  /* @__PURE__ */ jsx(Box, { mt: { base: "xl", md: 0 }, children: /* @__PURE__ */ jsx(Group, { gap: "xl", children: /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsx(Text, { size: "md", c: "#000000", style: { fontWeight: 700, fontFamily: '"Montserrat", sans-serif', letterSpacing: "0.05em", textTransform: "uppercase" }, children: "Hecho en Valencia" }) }) }) })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Box,
              {
                component: Link,
                href: "/catalog",
                style: {
                  display: "block",
                  borderRadius: "32px",
                  overflow: "hidden",
                  height: "100%",
                  minHeight: "500px",
                  width: "100%",
                  position: "relative",
                  backgroundColor: "transparent"
                },
                children: /* @__PURE__ */ jsx(
                  Box,
                  {
                    style: {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${portadaDario})`,
                      // Portada optimizada inyectada por Vite
                      backgroundPosition: "center center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat"
                    }
                  }
                )
              }
            )
          ]
        }
      )
    }
  );
}
const CRM_BASE = "https://crm.joppa.shop/api";
function ProductCardItem({ product }) {
  return /* @__PURE__ */ jsxs(Card, { p: "md", radius: "32px", shadow: "none", withBorder: false, bg: "#F9F9F4", children: [
    /* @__PURE__ */ jsxs(Box, { bg: "#F4F4E8", pos: "relative", style: { borderRadius: "24px", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsx(Link, { href: `/catalog/${product.slug || product.id}`, style: { textDecoration: "none", display: "block", height: "100%" }, children: /* @__PURE__ */ jsx(AspectRatio, { ratio: 3 / 4, children: product.images && product.images.length > 0 ? /* @__PURE__ */ jsx(Image, { src: product.images[0], alt: product.name, style: { mixBlendMode: "darken" } }) : /* @__PURE__ */ jsx(Box, { w: "100%", h: "100%", bg: "#E5E5E5" }) }) }),
      /* @__PURE__ */ jsx(Box, { pos: "absolute", bottom: "16px", left: "16px", right: "16px", className: "joppa-quick-add", children: /* @__PURE__ */ jsx(
        Button,
        {
          component: Link,
          href: `/catalog/${product.slug || product.id}`,
          fullWidth: true,
          color: "#0B3022",
          c: "#FFFFFF",
          radius: "xl",
          style: { fontWeight: 700, textTransform: "capitalize", fontFamily: '"Inter", sans-serif' },
          leftSection: /* @__PURE__ */ jsx(IconSearch, { size: 18 }),
          children: "Ver Detalle"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs(Stack, { gap: "sm", mt: "lg", px: 0, children: [
      /* @__PURE__ */ jsxs(Group, { justify: "space-between", mb: "4px", children: [
        /* @__PURE__ */ jsx(Text, { size: "13px", fw: 600, c: "dimmed", style: { letterSpacing: "0.05em", fontFamily: '"Inter", sans-serif' }, children: "JOPPA" }),
        /* @__PURE__ */ jsxs(Title, { order: 3, c: "#000000", style: { fontFamily: '"Inter", sans-serif', fontWeight: 800 }, children: [
          "$",
          Number(product.price).toLocaleString("es-AR")
        ] })
      ] }),
      /* @__PURE__ */ jsx(Link, { href: `/catalog/${product.slug || product.id}`, style: { textDecoration: "none" }, children: /* @__PURE__ */ jsx(Text, { size: "lg", fw: 700, c: "#000000", style: { fontFamily: '"Inter", sans-serif', lineHeight: 1.2 }, children: product.name }) })
    ] })
  ] });
}
function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${CRM_BASE}/catalog/featured`).then((res) => res.json()).then((data) => {
      setProducts(data.products || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);
  return /* @__PURE__ */ jsxs(Box, { bg: "transparent", w: "100%", children: [
    /* @__PURE__ */ jsx(
      Title,
      {
        c: "#0B3022",
        order: 2,
        ta: "left",
        mb: 50,
        style: {
          fontWeight: 800,
          fontFamily: '"Montserrat", sans-serif',
          fontSize: "clamp(2rem, 4vw, 3rem)"
        },
        children: "Novedades de la Temporada"
      }
    ),
    /* @__PURE__ */ jsx(SimpleGrid, { cols: { base: 1, sm: 2, md: 4 }, spacing: "xl", verticalSpacing: "3rem", children: loading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxs(Box, { children: [
      /* @__PURE__ */ jsx(Skeleton, { height: 350, radius: "24px", mb: "sm" }),
      /* @__PURE__ */ jsx(Skeleton, { height: 14, radius: "xl", mb: "xs", width: "70%" }),
      /* @__PURE__ */ jsx(Skeleton, { height: 14, radius: "xl", width: "40%" })
    ] }, i)) : products.length > 0 ? products.map((product) => /* @__PURE__ */ jsx(ProductCardItem, { product }, product.id)) : /* @__PURE__ */ jsx(Text, { c: "dimmed", mt: "xl", children: "Pronto añadiremos más productos." }) })
  ] });
}
const FloatingWhatsApp = ({
  phone = "584222030200",
  message = "Hola! Me gustaría obtener información sobre sus productos."
}) => {
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return /* @__PURE__ */ jsx(Tooltip, { label: "Contáctanos por WhatsApp", position: "left", withArrow: true, offset: 15, children: /* @__PURE__ */ jsx(
    ActionIcon,
    {
      component: "a",
      href: whatsappUrl,
      target: "_blank",
      variant: "filled",
      size: 60,
      radius: "xl",
      bg: "#0B3022",
      style: {
        position: "fixed",
        bottom: rem(30),
        right: rem(30),
        zIndex: 9999,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        transition: "transform 0.3s ease, background-color 0.3s ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.transform = "scale(1.1) translateY(-5px)";
        e.currentTarget.style.backgroundColor = "#0e3d2b";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "scale(1) translateY(0)";
        e.currentTarget.style.backgroundColor = "#0B3022";
      },
      children: /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 35, stroke: 1.5, color: "white" })
    }
  ) });
};
function JoppaCrew() {
  return /* @__PURE__ */ jsx(Box, { w: "100%", children: /* @__PURE__ */ jsxs(SimpleGrid, { cols: { base: 1, md: 3 }, spacing: "lg", children: [
    /* @__PURE__ */ jsxs(
      Card,
      {
        bg: "#0B3022",
        radius: "32px",
        p: { base: 40, lg: 60 },
        shadow: "xl",
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          border: "1px solid rgba(212, 175, 55, 0.2)"
        },
        children: [
          /* @__PURE__ */ jsxs(Box, { children: [
            /* @__PURE__ */ jsx(Badge, { color: "#D4AF37", variant: "outline", size: "lg", radius: "xl", mb: "md", style: { letterSpacing: "0.1em", fontWeight: 800 }, children: "COMUNIDAD" }),
            /* @__PURE__ */ jsxs(
              Title,
              {
                order: 2,
                c: "white",
                style: {
                  fontSize: "clamp(1.5rem, 5vw, 3rem)",
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em"
                },
                children: [
                  "Únete al equipo ",
                  /* @__PURE__ */ jsx("span", { style: { color: "#D4AF37" }, children: "JOPPA" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Text, { size: "lg", mt: "xl", c: "rgba(255,255,255,0.7)", style: { fontFamily: '"Inter", sans-serif', lineHeight: 1.6, fontWeight: 500 }, children: [
            "Etiquétanos en tus fotos usando ",
            /* @__PURE__ */ jsx("strong", { style: { color: "white" }, children: "@joppa.shop" }),
            " para aparecer en nuestro feed y unirte a nuestra comunidad exclusiva."
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              mt: "2.5rem",
              size: "xl",
              radius: "xl",
              bg: "#D4AF37",
              c: "#0B3022",
              component: "a",
              href: "https://instagram.com/joppa.shop",
              target: "_blank",
              leftSection: /* @__PURE__ */ jsx(IconBrandInstagram, { size: 24 }),
              rightSection: /* @__PURE__ */ jsx(IconArrowRight, { size: 20 }),
              style: {
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                letterSpacing: "0.05em",
                alignSelf: "flex-start",
                height: 64,
                boxShadow: "0 4px 20px rgba(212, 175, 55, 0.3)"
              },
              children: "JOPPA.SHOP"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      Card,
      {
        radius: "32px",
        p: 0,
        shadow: "lg",
        style: { overflow: "hidden" },
        children: /* @__PURE__ */ jsx(
          Image,
          {
            src: "/images/crew/joppa.crew1.jpeg",
            alt: "Joppa Crew Lifestyle 1",
            h: "100%",
            fit: "cover",
            style: { transition: "transform 0.5s ease" },
            className: "hover:scale-110"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs(Stack, { gap: "lg", children: [
      /* @__PURE__ */ jsx(
        Card,
        {
          radius: "32px",
          p: 0,
          shadow: "md",
          style: { overflow: "hidden", flex: 1 },
          children: /* @__PURE__ */ jsx(
            Image,
            {
              src: "/images/crew/joppa.crew2.jpeg",
              alt: "Joppa Crew Lifestyle 2",
              h: "100%",
              fit: "cover",
              style: { transition: "transform 0.5s ease" },
              className: "hover:scale-110"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        Card,
        {
          radius: "32px",
          p: 0,
          shadow: "md",
          style: { overflow: "hidden", flex: 1 },
          children: /* @__PURE__ */ jsx(
            Image,
            {
              src: "/images/crew/joppa.crew3.jpeg",
              alt: "Joppa Crew Lifestyle 3",
              h: "100%",
              fit: "cover",
              style: { transition: "transform 0.5s ease" },
              className: "hover:scale-110"
            }
          )
        }
      )
    ] })
  ] }) });
}
function Welcome() {
  const [opened, { toggle }] = useDisclosure(false);
  const features = [
    {
      title: "Impresión DTF Premium",
      description: "Servicio de estampados DTF en Valencia, Carabobo con colores vivos y de alta durabilidad para tus prendas.",
      icon: IconStar
    },
    {
      title: "Envío Rápido",
      description: "Entregamos tu estilo JOPPA directamente a tu puerta en tiempo récord.",
      icon: IconTruck
    },
    {
      title: "Diseños Únicos",
      description: "Patrones exclusivos y drops de edición limitada en streetwear.",
      icon: IconPalette
    }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      AppShell,
      {
        header: { height: 100, collapsed: false, offset: true },
        className: "page-transition",
        children: [
          /* @__PURE__ */ jsxs(Head, { children: [
            /* @__PURE__ */ jsx("title", { children: "JOPPA | Estampados DTF y Franelas Personalizadas en Venezuela" }),
            /* @__PURE__ */ jsx("meta", { "head-key": "description", name: "description", content: "Lleva tu marca al siguiente nivel. Impresión DTF premium, franelas streetwear y estampados personalizados. Envíos desde Valencia a toda Venezuela. ¡Cotiza hoy!" }),
            /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://joppa.shop/#website",
                  "url": "https://joppa.shop/",
                  "name": "JOPPA",
                  "description": "Franelas Personalizadas y Estampados DTF en Venezuela",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://joppa.shop/catalog?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://joppa.shop/#organization",
                  "name": "JOPPA",
                  "url": "https://joppa.shop/",
                  "logo": "https://joppa.shop/images/logo.png",
                  "image": "https://joppa.shop/images/modelo-joppa-home.webp",
                  "description": "Servicio de impresión DTF premium y personalización de franelas. Envíos nacionales desde Valencia.",
                  "telephone": "+584222030200",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Valencia",
                    "addressRegion": "Carabobo",
                    "addressCountry": "VE"
                  },
                  "priceRange": "$$",
                  "sameAs": [
                    "https://www.instagram.com/joppa.shop"
                  ]
                }
              ]
            }) })
          ] }),
          /* @__PURE__ */ jsx(CartDrawer, {}),
          /* @__PURE__ */ jsx(Header, { opened, toggle }),
          /* @__PURE__ */ jsxs(AppShell.Main, { bg: "#F4F4E8", pt: rem(120), children: [
            /* @__PURE__ */ jsx(Box, { w: "100%", pb: rem(80), px: { base: "md", md: "xl" }, children: /* @__PURE__ */ jsxs(Stack, { gap: "xl", children: [
              /* @__PURE__ */ jsx(HeroProduct, {}),
              /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsx(ProductGrid, {}) }),
              /* @__PURE__ */ jsx(Box, { mt: "2rem", children: /* @__PURE__ */ jsxs(
                Card,
                {
                  radius: "32px",
                  p: { base: 24, md: 60 },
                  shadow: "xl",
                  bg: "#0B3022",
                  c: "white",
                  style: { overflow: "hidden", position: "relative" },
                  children: [
                    /* @__PURE__ */ jsx(Box, { style: { position: "absolute", top: -50, right: -50, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)" } }),
                    /* @__PURE__ */ jsxs(Grid, { gutter: { base: 40, md: 80 }, align: "center", style: { position: "relative", zIndex: 1 }, children: [
                      /* @__PURE__ */ jsxs(Grid.Col, { span: { base: 12, md: 5 }, children: [
                        /* @__PURE__ */ jsx(Badge, { color: "rgba(255,255,255,0.2)", c: "white", variant: "filled", size: "lg", radius: "xl", mb: "xl", children: "Edición Ilimitada" }),
                        /* @__PURE__ */ jsxs(
                          Title,
                          {
                            order: 2,
                            mb: "xl",
                            style: {
                              fontSize: "clamp(2rem, 5vw, 3.5rem)",
                              lineHeight: 1.1,
                              fontFamily: '"Montserrat", sans-serif',
                              fontWeight: 900,
                              letterSpacing: "-0.03em"
                            },
                            children: [
                              "Tu Visión.",
                              /* @__PURE__ */ jsx("br", {}),
                              "Nuestro DTF."
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsx(Text, { size: "lg", mb: 40, style: { fontFamily: '"Inter", sans-serif', opacity: 0.9, lineHeight: 1.6, maxWidth: 450, fontWeight: 500 }, children: "No te conformes con lo que ya existe. Únete a nuestro programa de diseño personalizado y da vida a la prenda exacta que siempre has imaginado, con el mejor servicio de impresión DTF en Valencia y calidad premium habitual de JOPPA." }),
                        /* @__PURE__ */ jsx(
                          Button,
                          {
                            component: "a",
                            href: "/custom-design",
                            size: "xl",
                            radius: "xl",
                            bg: "#D4AF37",
                            c: "#FFFFFF",
                            rightSection: /* @__PURE__ */ jsx(IconPalette, { size: 20 }),
                            style: {
                              boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                              transition: "transform 0.2s ease",
                              fontFamily: '"Montserrat", sans-serif',
                              fontWeight: 800,
                              width: "max-content",
                              maxWidth: "100%"
                            },
                            onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-4px)",
                            onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)",
                            children: "Inicia Tu Solicitud"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx(Grid.Col, { span: { base: 12, md: 7 }, children: /* @__PURE__ */ jsxs(Box, { h: { base: 380, md: 500 }, style: { display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }, children: [
                        /* @__PURE__ */ jsx("style", { children: `
                                                @keyframes floating {
                                                    0% { transform: translateY(0px); }
                                                    50% { transform: translateY(-15px); }
                                                    100% { transform: translateY(0px); }
                                                }
                                                .float-box {
                                                    animation: floating 4s ease-in-out infinite;
                                                }
                                            ` }),
                        /* @__PURE__ */ jsxs(Box, { ml: { base: 0, md: -60 }, h: "100%", w: "100%", style: { position: "relative" }, children: [
                          /* @__PURE__ */ jsx(
                            Box,
                            {
                              className: "float-box",
                              w: { base: "85%", md: "75%" },
                              h: "85%",
                              style: {
                                position: "absolute",
                                top: "5%",
                                left: "0%",
                                zIndex: 2,
                                transform: "rotate(-2deg)",
                                animationDelay: "0s"
                              },
                              children: /* @__PURE__ */ jsx(
                                Image,
                                {
                                  src: "/images/custom_design_section/Lista 2.png",
                                  alt: "JOPPA Custom Design 1",
                                  fit: "contain",
                                  h: "100%"
                                }
                              )
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Box,
                            {
                              className: "float-box",
                              w: { base: "60%", md: "55%" },
                              h: "60%",
                              style: {
                                position: "absolute",
                                top: "0%",
                                right: "5%",
                                zIndex: 1,
                                transform: "rotate(5deg)",
                                animationDelay: "0.8s"
                              },
                              children: /* @__PURE__ */ jsx(
                                Image,
                                {
                                  src: "/images/custom_design_section/Lista 4.png",
                                  alt: "JOPPA Custom Design 2",
                                  fit: "contain",
                                  h: "100%"
                                }
                              )
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Box,
                            {
                              className: "float-box",
                              w: { base: "55%", md: "50%" },
                              h: "55%",
                              style: {
                                position: "absolute",
                                bottom: "0%",
                                right: "0%",
                                zIndex: 3,
                                transform: "rotate(-8deg)",
                                animationDelay: "1.5s"
                              },
                              children: /* @__PURE__ */ jsx(
                                Image,
                                {
                                  src: "/images/custom_design_section/Lista 6.png",
                                  alt: "JOPPA Custom Design 3",
                                  fit: "contain",
                                  h: "100%"
                                }
                              )
                            }
                          ),
                          /* @__PURE__ */ jsx("div", { style: {
                            position: "absolute",
                            bottom: "10%",
                            left: "-5%",
                            background: "#F4F4E8",
                            color: "#0B3022",
                            padding: "8px 16px",
                            borderRadius: "100px",
                            fontWeight: 800,
                            fontFamily: '"Montserrat", sans-serif',
                            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                            zIndex: 10,
                            transform: "rotate(-12deg)",
                            fontSize: "clamp(10px, 3vw, 14px)",
                            letterSpacing: "0.05em",
                            whiteSpace: "nowrap"
                          }, children: "HECHO A MEDIDA" })
                        ] })
                      ] }) })
                    ] })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx(Box, { mt: "2rem", children: /* @__PURE__ */ jsx(
                Card,
                {
                  radius: "32px",
                  p: { base: 40, md: 60 },
                  bg: "#F9F9F4",
                  style: { border: "2px solid #0B3022" },
                  children: /* @__PURE__ */ jsxs(SimpleGrid, { cols: { base: 1, md: 2 }, spacing: "xl", children: [
                    /* @__PURE__ */ jsxs(Stack, { justify: "center", children: [
                      /* @__PURE__ */ jsx(Badge, { color: "#0B3022", variant: "filled", size: "lg", radius: "xl", children: "Venta al Mayor" }),
                      /* @__PURE__ */ jsxs(
                        Title,
                        {
                          order: 2,
                          c: "#0B3022",
                          style: {
                            fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 900,
                            lineHeight: 1.2
                          },
                          children: [
                            "¿Tienes una tienda?",
                            /* @__PURE__ */ jsx("br", {}),
                            "Lleva JOPPA a tus clientes."
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(Text, { size: "lg", c: "#0B3022", style: { opacity: 0.8, fontWeight: 500 }, children: "Ofrecemos precios competitivos en estampados DTF al mayor y diseños exclusivos para que tu negocio destaque en Carabobo y toda Venezuela. Contáctanos por WhatsApp para recibir nuestro catálogo de mayoristas y comenzar a trabajar juntos." }),
                      /* @__PURE__ */ jsx(Group, { children: /* @__PURE__ */ jsx(
                        Button,
                        {
                          component: "a",
                          href: "https://wa.me/584222030200",
                          target: "_blank",
                          size: "xl",
                          radius: "xl",
                          bg: "#0B3022",
                          leftSection: /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 24 }),
                          style: { fontWeight: 800 },
                          children: "Contactar Ventas"
                        }
                      ) })
                    ] }),
                    /* @__PURE__ */ jsx(Center, { children: /* @__PURE__ */ jsx(Box, { bg: "#0B3022", p: 40, style: { borderRadius: "32px", width: "100%", maxWidth: 350 }, children: /* @__PURE__ */ jsxs(Stack, { align: "center", gap: "md", children: [
                      /* @__PURE__ */ jsx(IconTruck, { size: 80, color: "#D4AF37", stroke: 1.5 }),
                      /* @__PURE__ */ jsx(Text, { ta: "center", c: "white", fw: 800, style: { fontSize: "clamp(1.2rem, 4vw, 1.5rem)", lineHeight: 1.2 }, children: "Envío Nacional Garantizado" }),
                      /* @__PURE__ */ jsx(Text, { ta: "center", c: "white", style: { opacity: 0.7 }, children: "Llegamos a todo el país con logística premium." })
                    ] }) }) })
                  ] })
                }
              ) }),
              /* @__PURE__ */ jsx(Box, { mt: "2rem", children: /* @__PURE__ */ jsx(JoppaCrew, {}) }),
              /* @__PURE__ */ jsx(Box, { mt: "2rem", children: /* @__PURE__ */ jsx(
                Card,
                {
                  radius: "32px",
                  p: { base: 40, md: 60 },
                  bg: "#F9F9F4",
                  shadow: "sm",
                  children: /* @__PURE__ */ jsxs(SimpleGrid, { cols: { base: 1, md: 2 }, spacing: "xl", style: { alignItems: "center" }, children: [
                    /* @__PURE__ */ jsxs(Box, { children: [
                      /* @__PURE__ */ jsx(Badge, { color: "#0B3022", variant: "light", size: "lg", radius: "xl", mb: "xl", bg: "rgba(11, 48, 34, 0.05)", children: "Nuestra Historia" }),
                      /* @__PURE__ */ jsx(
                        Title,
                        {
                          order: 2,
                          c: "#0B3022",
                          mb: "xl",
                          style: {
                            fontSize: "2.5rem",
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 900,
                            lineHeight: 1.1
                          },
                          children: "Quiénes Somos"
                        }
                      ),
                      /* @__PURE__ */ jsxs(Text, { size: "lg", c: "#0B3022", style: { opacity: 0.8, lineHeight: 1.7, maxWidth: 500 }, children: [
                        "Somos una pareja de emprendedores en Valencia apasionados por el diseño, la cultura urbana y la estampación digital. Lo que comenzó como un sueño compartido se convirtió en JOPPA, un espacio donde la impresión en DTF de alta precisión se encuentra con la creatividad sin límites.",
                        /* @__PURE__ */ jsx("br", {}),
                        /* @__PURE__ */ jsx("br", {}),
                        "Cada prenda que diseñamos lleva una parte de nosotros, enfocándonos en la calidad premium y en piezas que cuentan una historia. ¡Gracias por ser parte de este viaje con nosotros!"
                      ] }),
                      /* @__PURE__ */ jsxs(Group, { mt: "2rem", children: [
                        /* @__PURE__ */ jsx(IconHeart, { size: 30, color: "#D4AF37", fill: "#D4AF37" }),
                        /* @__PURE__ */ jsx(Text, { fw: 700, c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif' }, children: "Hecho con pasión por JOPPA Team" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsxs(SimpleGrid, { cols: { base: 1, xs: 2 }, spacing: "md", children: [
                      /* @__PURE__ */ jsxs(
                        Card,
                        {
                          radius: "24px",
                          p: 0,
                          shadow: "md",
                          style: {
                            overflow: "hidden",
                            aspectRatio: "4/5",
                            border: "1px solid rgba(11,48,34,0.1)",
                            transition: "transform 0.3s ease"
                          },
                          className: "hover:scale-105",
                          children: [
                            /* @__PURE__ */ jsx(
                              Image,
                              {
                                src: "/images/founders/founder_male.jpeg",
                                alt: "Founder JOPPA",
                                fit: "cover",
                                h: "100%"
                              }
                            ),
                            /* @__PURE__ */ jsx(Box, { style: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem", background: "linear-gradient(to top, rgba(11,48,34,0.8) 0%, transparent 100%)" }, children: /* @__PURE__ */ jsx(Text, { c: "white", fw: 800, size: "sm", style: { letterSpacing: "0.05em" }, children: "Jose Miguel" }) })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        Card,
                        {
                          radius: "24px",
                          p: 0,
                          shadow: "md",
                          style: {
                            overflow: "hidden",
                            aspectRatio: "4/5",
                            border: "1px solid rgba(11,48,34,0.1)",
                            transition: "transform 0.3s ease",
                            marginTop: rem(20)
                            // Staggered look
                          },
                          className: "hover:scale-105",
                          children: [
                            /* @__PURE__ */ jsx(
                              Image,
                              {
                                src: "/images/founders/founder_female.jpeg",
                                alt: "Founder JOPPA",
                                fit: "cover",
                                h: "100%"
                              }
                            ),
                            /* @__PURE__ */ jsx(Box, { style: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem", background: "linear-gradient(to top, rgba(11,48,34,0.8) 0%, transparent 100%)" }, children: /* @__PURE__ */ jsx(Text, { c: "white", fw: 800, size: "sm", style: { letterSpacing: "0.05em" }, children: "Patricia" }) })
                          ]
                        }
                      )
                    ] }) })
                  ] })
                }
              ) }),
              /* @__PURE__ */ jsx(Box, { mt: "2rem", children: /* @__PURE__ */ jsxs(SimpleGrid, { cols: { base: 1, md: 3 }, spacing: "xl", children: [
                /* @__PURE__ */ jsx(
                  Card,
                  {
                    radius: "32px",
                    p: "xl",
                    bg: "#25D366",
                    c: "white",
                    component: "a",
                    href: "https://wa.me/584222030200",
                    target: "_blank",
                    style: { transition: "transform 0.2s ease", cursor: "pointer" },
                    onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-8px)",
                    onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)",
                    children: /* @__PURE__ */ jsxs(Stack, { h: "100%", justify: "space-between", children: [
                      /* @__PURE__ */ jsxs(Group, { justify: "space-between", children: [
                        /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 40 }),
                        /* @__PURE__ */ jsx(IconMessageCircle2, { size: 24, style: { opacity: 0.6 } })
                      ] }),
                      /* @__PURE__ */ jsxs(Box, { children: [
                        /* @__PURE__ */ jsx(Title, { order: 3, style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }, children: "WhatsApp" }),
                        /* @__PURE__ */ jsx(Text, { fw: 600, size: "lg", children: "+58 422 203 0200" })
                      ] })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Card,
                  {
                    radius: "32px",
                    p: "xl",
                    bg: "#000000",
                    c: "white",
                    component: "a",
                    href: "https://instagram.com/joppa.shop",
                    target: "_blank",
                    style: { transition: "transform 0.2s ease", cursor: "pointer" },
                    onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-8px)",
                    onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)",
                    children: /* @__PURE__ */ jsxs(Stack, { h: "100%", justify: "space-between", children: [
                      /* @__PURE__ */ jsxs(Group, { justify: "space-between", children: [
                        /* @__PURE__ */ jsx(IconBrandInstagram, { size: 40 }),
                        /* @__PURE__ */ jsx(Box, { style: { opacity: 0.6 }, children: "@joppa.shop" })
                      ] }),
                      /* @__PURE__ */ jsxs(Box, { children: [
                        /* @__PURE__ */ jsx(Title, { order: 3, style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }, children: "Instagram" }),
                        /* @__PURE__ */ jsx(Text, { fw: 500, children: "Síguenos para novedades" })
                      ] })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Card,
                  {
                    radius: "32px",
                    p: "xl",
                    bg: "#D4AF37",
                    c: "white",
                    component: "a",
                    href: "mailto:atencion@joppa.shop",
                    style: { transition: "transform 0.2s ease", cursor: "pointer" },
                    onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-8px)",
                    onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)",
                    children: /* @__PURE__ */ jsxs(Stack, { h: "100%", justify: "space-between", children: [
                      /* @__PURE__ */ jsxs(Group, { justify: "space-between", children: [
                        /* @__PURE__ */ jsx(IconMail, { size: 40 }),
                        /* @__PURE__ */ jsx(IconPhone, { size: 24, style: { opacity: 0.6 } })
                      ] }),
                      /* @__PURE__ */ jsxs(Box, { children: [
                        /* @__PURE__ */ jsx(Title, { order: 3, style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }, children: "Email" }),
                        /* @__PURE__ */ jsx(Text, { fw: 600, children: "atencion@joppa.shop" })
                      ] })
                    ] })
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs(
                Card,
                {
                  radius: "32px",
                  p: { base: 48, md: 80 },
                  shadow: "none",
                  bg: "#F9F9F4",
                  withBorder: false,
                  children: [
                    /* @__PURE__ */ jsx(
                      Title,
                      {
                        c: "#0B3022",
                        order: 2,
                        ta: "center",
                        mb: "4rem",
                        style: { letterSpacing: "-0.02em", fontWeight: 800, fontFamily: '"Montserrat", sans-serif' },
                        children: "Nuestros servicios"
                      }
                    ),
                    /* @__PURE__ */ jsx(SimpleGrid, { cols: { base: 1, sm: 3 }, spacing: "xl", children: features.map((feature, index) => {
                      const Icon = feature.icon;
                      return /* @__PURE__ */ jsxs(Box, { children: [
                        /* @__PURE__ */ jsx(Center, { mb: "lg", children: /* @__PURE__ */ jsx(ThemeIcon, { size: 80, radius: "100%", color: "gray", variant: "light", bg: "#F9F9F4", children: /* @__PURE__ */ jsx(Icon, { size: 40, stroke: 1.5, color: "#000000" }) }) }),
                        /* @__PURE__ */ jsx(Text, { fw: 800, ta: "center", size: "xl", mb: "xs", c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif' }, children: feature.title }),
                        /* @__PURE__ */ jsx(Text, { c: "dimmed", ta: "center", size: "md", style: { fontFamily: '"Montserrat", sans-serif', lineHeight: 1.6 }, children: feature.description })
                      ] }, index);
                    }) })
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsx(Footer, {})
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(FloatingWhatsApp, {})
  ] });
}
export {
  Welcome as default
};
