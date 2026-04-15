import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
const InputError = forwardRef(function InputError2(props, ref) {
  return /* @__PURE__ */ jsx("input", { ...props, ref });
});
const TextInput = forwardRef(function TextInput2(props, ref) {
  return /* @__PURE__ */ jsx("input", { ...props, ref });
});
export {
  InputError as I,
  TextInput as T
};
