import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import { AppShell, Box, Container, Badge, Title, Text, rem, Notification, SimpleGrid, Card, Stack, TextInput, Textarea, Button, ThemeIcon, Anchor, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconX, IconSend, IconBrandWhatsapp, IconBrandInstagram, IconMail, IconMessageCircle, IconPhone } from "@tabler/icons-react";
import axios from "axios";
import { H as Header } from "./Header-BA1_ggmj.js";
import { C as CartDrawer, F as Footer } from "./Footer--tUsT2lM.js";
import "zustand";
import "zustand/middleware";
const CRM_API_URL = "https://crm.joppa.shop/api";
function Contact() {
  const [opened, { toggle }] = useDisclosure(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    },
    validate: {
      name: (value) => value.length < 2 ? "Nombre muy corto" : null,
      email: (value) => /^\S+@\S+$/.test(value) ? null : "Correo inválido",
      message: (value) => value.length < 10 ? "El mensaje debe ser más detallado" : null
    }
  });
  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.post(`${CRM_API_URL}/contact-messages`, values);
      setSuccess(true);
      form.reset();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al enviar el mensaje. Intenta de nuevo o contáctanos por WhatsApp.");
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ jsxs(AppShell, { header: { height: 100, collapsed: false, offset: true }, children: [
    /* @__PURE__ */ jsx(Head, { title: "Contacto - JOPPA" }),
    /* @__PURE__ */ jsx(CartDrawer, {}),
    /* @__PURE__ */ jsx(Header, { opened, toggle }),
    /* @__PURE__ */ jsxs(AppShell.Main, { bg: "#F4F4E8", pt: rem(140), pb: rem(120), style: { position: "relative", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsx(Box, { style: { position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0) 70%)", zIndex: 0 } }),
      /* @__PURE__ */ jsxs(Container, { size: "lg", style: { position: "relative", zIndex: 1 }, children: [
        /* @__PURE__ */ jsxs(Box, { style: { textAlign: "center", marginBottom: rem(80) }, children: [
          /* @__PURE__ */ jsx(Badge, { color: "#0B3022", variant: "filled", size: "lg", radius: "xl", mb: "md", style: { letterSpacing: "0.1em", fontWeight: 800 }, children: "ESTAMOS PARA TI" }),
          /* @__PURE__ */ jsxs(Title, { order: 1, c: "#0B3022", style: { fontFamily: '"Montserrat", sans-serif', fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.04em" }, children: [
            "Hablemos de tu ",
            /* @__PURE__ */ jsx("span", { style: { color: "#D4AF37" }, children: "visión." })
          ] }),
          /* @__PURE__ */ jsx(Text, { c: "#4A4A4A", mt: "xl", size: "xl", style: { fontFamily: '"Montserrat", sans-serif', maxWidth: "600px", margin: "0 auto", lineHeight: 1.6, fontWeight: 500 }, children: "¿Tienes una duda, quieres una cotización especial o solo quieres saludar? Nuestro equipo está listo para escucharte." })
        ] }),
        success && /* @__PURE__ */ jsx(Notification, { icon: /* @__PURE__ */ jsx(IconCheck, { size: 20 }), color: "teal", title: "¡Mensaje Enviado!", onClose: () => setSuccess(false), mb: rem(48), radius: "xl", children: "Hemos recibido tu mensaje. Te contactaremos lo antes posible." }),
        error && /* @__PURE__ */ jsx(Notification, { icon: /* @__PURE__ */ jsx(IconX, { size: 20 }), color: "red", title: "Error", onClose: () => setError(null), mb: rem(48), radius: "xl", children: error }),
        /* @__PURE__ */ jsxs(SimpleGrid, { cols: { base: 1, md: 2 }, spacing: rem(40), children: [
          /* @__PURE__ */ jsx(Card, { shadow: "xl", radius: "32px", p: { base: 32, md: 48 }, bg: "white", style: { border: "1px solid rgba(11,48,34,0.03)" }, children: /* @__PURE__ */ jsx("form", { onSubmit: form.onSubmit(handleSubmit), children: /* @__PURE__ */ jsxs(Stack, { gap: "xl", children: [
            /* @__PURE__ */ jsx(
              TextInput,
              {
                withAsterisk: true,
                label: "Tu Nombre",
                placeholder: "Escribe tu nombre completo",
                radius: "xl",
                size: "md",
                ...form.getInputProps("name"),
                styles: { label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: 8 } }
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                withAsterisk: true,
                label: "Correo Electrónico",
                placeholder: "tu@email.com",
                radius: "xl",
                size: "md",
                ...form.getInputProps("email"),
                styles: { label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: 8 } }
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                label: "Teléfono (Opcional)",
                placeholder: "+58 4XX XXX XXXX",
                radius: "xl",
                size: "md",
                ...form.getInputProps("phone"),
                styles: { label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: 8 } }
              }
            ),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                withAsterisk: true,
                label: "Tu Mensaje",
                placeholder: "¿En qué podemos ayudarte?",
                minRows: 5,
                radius: "xl",
                size: "md",
                ...form.getInputProps("message"),
                styles: { label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: 8 } }
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                fullWidth: true,
                radius: "xl",
                size: "xl",
                bg: "#0B3022",
                leftSection: /* @__PURE__ */ jsx(IconSend, { size: 20 }),
                loading: submitting,
                style: { height: 64, fontSize: "1.2rem", fontWeight: 800, transition: "all 0.3s ease" },
                children: "Enviar Mensaje"
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsxs(Stack, { gap: "xl", children: [
            /* @__PURE__ */ jsxs(SimpleGrid, { cols: { base: 1, sm: 2 }, spacing: "xl", children: [
              /* @__PURE__ */ jsxs(Card, { radius: "32px", p: "xl", bg: "#0B3022", c: "white", shadow: "md", children: [
                /* @__PURE__ */ jsx(ThemeIcon, { variant: "light", color: "white", size: "xl", radius: "md", mb: "md", children: /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 24 }) }),
                /* @__PURE__ */ jsx(Text, { fw: 800, size: "lg", mb: "sm", children: "WhatsApp" }),
                /* @__PURE__ */ jsx(Text, { size: "sm", mb: "xl", opacity: 0.8, children: "Respuesta rápida para ventas directas." }),
                /* @__PURE__ */ jsx(Anchor, { href: "https://wa.me/584222030200", c: "white", fw: 700, target: "_blank", underline: "always", children: "+58 422 203 0200" })
              ] }),
              /* @__PURE__ */ jsxs(Card, { radius: "32px", p: "xl", bg: "white", shadow: "sm", style: { border: "1px solid rgba(11,48,34,0.05)" }, children: [
                /* @__PURE__ */ jsx(ThemeIcon, { variant: "light", color: "#0B3022", size: "xl", radius: "md", mb: "md", children: /* @__PURE__ */ jsx(IconBrandInstagram, { size: 24 }) }),
                /* @__PURE__ */ jsx(Text, { fw: 800, size: "lg", mb: "sm", c: "#0B3022", children: "Instagram" }),
                /* @__PURE__ */ jsx(Text, { size: "sm", mb: "xl", c: "dimmed", children: "Mira nuestras últimas piezas." }),
                /* @__PURE__ */ jsx(Anchor, { href: "https://instagram.com/joppa.shop", c: "#0B3022", fw: 700, target: "_blank", underline: "always", children: "@joppa.shop" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Card, { radius: "32px", p: "xl", bg: "#D4AF37", c: "white", shadow: "lg", children: /* @__PURE__ */ jsxs(Group, { justify: "space-between", align: "center", children: [
              /* @__PURE__ */ jsxs(Box, { children: [
                /* @__PURE__ */ jsx(ThemeIcon, { variant: "white", color: "#D4AF37", size: "xl", radius: "md", mb: "md", children: /* @__PURE__ */ jsx(IconMail, { size: 24 }) }),
                /* @__PURE__ */ jsx(Text, { fw: 800, size: "xl", mb: "xs", children: "Email de Atención" }),
                /* @__PURE__ */ jsx(Text, { opacity: 0.9, fw: 600, size: "lg", children: "atencion@joppa.shop" })
              ] }),
              /* @__PURE__ */ jsx(IconMessageCircle, { size: 80, stroke: 0.5, opacity: 0.3 })
            ] }) }),
            /* @__PURE__ */ jsx(Card, { radius: "32px", p: "xl", bg: "white", shadow: "sm", style: { border: "1px solid rgba(11,48,34,0.05)" }, children: /* @__PURE__ */ jsxs(Group, { children: [
              /* @__PURE__ */ jsx(ThemeIcon, { variant: "light", color: "#0B3022", size: 48, radius: "xl", children: /* @__PURE__ */ jsx(IconPhone, { size: 24 }) }),
              /* @__PURE__ */ jsxs(Box, { children: [
                /* @__PURE__ */ jsx(Text, { fw: 800, c: "#0B3022", children: "Atención al Cliente" }),
                /* @__PURE__ */ jsx(Text, { size: "sm", c: "dimmed", children: "Lunes a Sábado: 9am - 6pm" })
              ] })
            ] }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  Contact as default
};
