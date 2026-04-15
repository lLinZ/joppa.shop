import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { Text, Stack, TextInput, PasswordInput, Checkbox, Group, Anchor, Button } from "@mantine/core";
import { G as Guest } from "./GuestLayout-D5SsJsBz.js";
function Login({
  status,
  canResetPassword
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("login"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs(Guest, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Log in" }),
    status && /* @__PURE__ */ jsx(Text, { c: "green", size: "sm", fw: 500, mb: "md", children: status }),
    /* @__PURE__ */ jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
      /* @__PURE__ */ jsx(
        TextInput,
        {
          id: "email",
          type: "email",
          name: "email",
          label: "Email",
          value: data.email,
          autoComplete: "username",
          onChange: (e) => setData("email", e.target.value),
          error: errors.email,
          required: true,
          "data-autofocus": true
        }
      ),
      /* @__PURE__ */ jsx(
        PasswordInput,
        {
          id: "password",
          name: "password",
          label: "Password",
          value: data.password,
          autoComplete: "current-password",
          onChange: (e) => setData("password", e.target.value),
          error: errors.password,
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        Checkbox,
        {
          name: "remember",
          label: "Remember me",
          checked: data.remember,
          onChange: (e) => setData("remember", e.currentTarget.checked),
          color: "darkGreen"
        }
      ),
      /* @__PURE__ */ jsxs(Group, { justify: "space-between", mt: "md", children: [
        canResetPassword ? /* @__PURE__ */ jsx(Anchor, { component: Link, href: route("password.request"), size: "sm", c: "dimmed", children: "Forgot your password?" }) : /* @__PURE__ */ jsx("div", {}),
        /* @__PURE__ */ jsx(Button, { type: "submit", loading: processing, color: "darkGreen", radius: "md", children: "Log in" })
      ] })
    ] }) })
  ] });
}
export {
  Login as default
};
