import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import theme from "./theme";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <React.StrictMode>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.initialColorMode} />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
