import { jsx, jsxs } from "react/jsx-runtime";
import { Center, Container, Anchor, Title, Paper } from "@mantine/core";
import { Link } from "@inertiajs/react";
function Guest({ children }) {
  return /* @__PURE__ */ jsx(Center, { style: { minHeight: "100vh", backgroundColor: "#F5F5DC" }, children: /* @__PURE__ */ jsxs(Container, { size: "xs", w: "100%", children: [
    /* @__PURE__ */ jsx(Center, { mb: "xl", children: /* @__PURE__ */ jsx(Anchor, { component: Link, href: "/", underline: "never", children: /* @__PURE__ */ jsx(Title, { c: "#0B3022", order: 1, style: { letterSpacing: "-0.05em", fontWeight: 900 }, children: "JOPPA" }) }) }),
    /* @__PURE__ */ jsx(Paper, { radius: "md", p: "xl", shadow: "sm", withBorder: true, children })
  ] }) });
}
export {
  Guest as G
};
