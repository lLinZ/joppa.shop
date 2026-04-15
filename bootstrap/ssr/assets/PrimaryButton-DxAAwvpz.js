import { jsx } from "react/jsx-runtime";
function PrimaryButton({ className = "", disabled, children, ...props }) {
  return /* @__PURE__ */ jsx("button", { ...props, disabled, className, children });
}
export {
  PrimaryButton as P
};
