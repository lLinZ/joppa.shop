import { jsx } from "react/jsx-runtime";
function DangerButton({ className = "", disabled, children, ...props }) {
  return /* @__PURE__ */ jsx("button", { ...props, disabled, className, children });
}
function Modal(props) {
  return /* @__PURE__ */ jsx("div", { ...props });
}
function SecondaryButton({ className = "", disabled, children, ...props }) {
  return /* @__PURE__ */ jsx("button", { ...props, disabled, className, children });
}
export {
  DangerButton as D,
  Modal as M,
  SecondaryButton as S
};
