import { jsxs, jsx } from "react/jsx-runtime";
import createServer from "@inertiajs/react/server";
import { createInertiaApp } from "@inertiajs/react";
import ReactDOMServer from "react-dom/server";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const darkGreen = [
  "#e6f0ec",
  "#c2dbcf",
  "#9ec6b2",
  "#7ab195",
  "#569c78",
  "#32875b",
  "#19583e",
  "#0b3022",
  // primary brand color
  "#072118",
  "#04120d"
];
const mustardGold = [
  "#fdf8e8",
  "#f8eabc",
  "#f3dc90",
  "#eece64",
  "#e9c038",
  "#e4b20c",
  "#d4a017",
  // primary brand color
  "#a87f12",
  "#7d5e0d",
  "#513d09"
];
const creamBackground = [
  "#fbfbf6",
  "#f5f5dc",
  // primary brand color
  "#dfdfba",
  "#c8c898",
  "#b2b276",
  "#9c9c54",
  "#818143",
  "#666635",
  "#4b4b27",
  "#303019"
];
const theme = createTheme({
  /**
   * Custom colors definition extending the default Mantine colors.
   */
  colors: {
    darkGreen,
    mustardGold,
    creamBackground
  },
  /**
   * Default primary color key.
   */
  primaryColor: "darkGreen",
  /**
   * Defines the default font family for the application.
   * Uses a robust modern sans-serif stack as per brand guidelines.
   */
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  /**
   * Default radius for all components to give a modern look.
   */
  defaultRadius: "md",
  /**
   * Component default properties overrides.
   */
  components: {
    Button: {
      defaultProps: {
        radius: "md"
      }
    },
    Card: {
      defaultProps: {
        radius: "md"
      }
    },
    TextInput: {
      defaultProps: {
        radius: "md"
      }
    },
    PasswordInput: {
      defaultProps: {
        radius: "md"
      }
    },
    Select: {
      defaultProps: {
        radius: "md"
      }
    }
  }
});
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => `${title}`,
    resolve: (name) => resolvePageComponent(
      `./Pages/${name}.tsx`,
      /* @__PURE__ */ Object.assign({ "./Pages/Auth/ConfirmPassword.tsx": () => import("./assets/ConfirmPassword-HxrMvhXW.js"), "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-UaIwbqIm.js"), "./Pages/Auth/Login.tsx": () => import("./assets/Login-DHIM79g5.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-DLHGzcc2.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-B7-uXokG.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-Dx_qzYcj.js"), "./Pages/Catalog/Index.tsx": () => import("./assets/Index-C2W6a2TT.js"), "./Pages/Checkout/Checkout.tsx": () => import("./assets/Checkout-G97th6Tb.js"), "./Pages/Contact.tsx": () => import("./assets/Contact-BpCgsEX8.js"), "./Pages/CustomDesign.tsx": () => import("./assets/CustomDesign-ByQM-XfH.js"), "./Pages/Dashboard.tsx": () => import("./assets/Dashboard-DgOa9NtF.js"), "./Pages/Product/BetaShow.tsx": () => import("./assets/BetaShow-CCCjNiyu.js"), "./Pages/Product/Show.tsx": () => import("./assets/Show-BdEK6agf.js"), "./Pages/Profile/Edit.tsx": () => import("./assets/Edit-IWIH3UN-.js"), "./Pages/Profile/Partials/DeleteUserForm.tsx": () => import("./assets/DeleteUserForm-DMAgHnqq.js"), "./Pages/Profile/Partials/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-7zOtsyBF.js"), "./Pages/Profile/Partials/UpdateProfileInformationForm.tsx": () => import("./assets/UpdateProfileInformationForm-BCtDDuZM.js"), "./Pages/Welcome.tsx": () => import("./assets/Welcome-C39FJtST.js") })
    ),
    setup({ App, props }) {
      return /* @__PURE__ */ jsxs(MantineProvider, { theme, defaultColorScheme: "light", children: [
        /* @__PURE__ */ jsx(Notifications, {}),
        /* @__PURE__ */ jsx(App, { ...props })
      ] });
    }
  })
);
