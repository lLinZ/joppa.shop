import { jsxs, jsx } from "react/jsx-runtime";
import { Box } from "@mantine/core";
function ProductAura() {
  return /* @__PURE__ */ jsxs(Box, { style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }, children: [
    /* @__PURE__ */ jsx(Box, { style: {
      position: "absolute",
      top: "-10%",
      right: "10%",
      width: "600px",
      height: "600px",
      backgroundColor: "#0B3022",
      borderRadius: "50%",
      filter: "blur(150px)",
      opacity: 0.04
    } }),
    /* @__PURE__ */ jsx(Box, { style: {
      position: "absolute",
      bottom: "10%",
      left: "-5%",
      width: "800px",
      height: "800px",
      backgroundColor: "#0B3022",
      borderRadius: "50%",
      filter: "blur(150px)",
      opacity: 0.05
    } })
  ] });
}
export {
  ProductAura as P
};
