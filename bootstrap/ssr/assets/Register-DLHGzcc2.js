import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { Stack, TextInput, PasswordInput, Group, Anchor, Button } from "@mantine/core";
import { G as Guest } from "./GuestLayout-D5SsJsBz.js";
function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxs(Guest, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Register" }),
    /* @__PURE__ */ jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
      /* @__PURE__ */ jsx(
        TextInput,
        {
          id: "name",
          name: "name",
          label: "Name",
          value: data.name,
          autoComplete: "name",
          onChange: (e) => setData("name", e.target.value),
          error: errors.name,
          required: true,
          "data-autofocus": true
        }
      ),
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
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        PasswordInput,
        {
          id: "password",
          name: "password",
          label: "Password",
          value: data.password,
          autoComplete: "new-password",
          onChange: (e) => setData("password", e.target.value),
          error: errors.password,
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        PasswordInput,
        {
          id: "password_confirmation",
          name: "password_confirmation",
          label: "Confirm Password",
          value: data.password_confirmation,
          autoComplete: "new-password",
          onChange: (e) => setData("password_confirmation", e.target.value),
          error: errors.password_confirmation,
          required: true
        }
      ),
      /* @__PURE__ */ jsxs(Group, { justify: "space-between", mt: "md", children: [
        /* @__PURE__ */ jsx(Anchor, { component: Link, href: route("login"), size: "sm", c: "dimmed", children: "Already registered?" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", loading: processing, color: "darkGreen", radius: "md", children: "Register" })
      ] })
    ] }) })
  ] });
}
export {
  Register as default
};
