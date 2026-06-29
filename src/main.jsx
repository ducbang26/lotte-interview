import "./styles/app.scss";

import React from "react";
import ReactDOM from "react-dom/client";
if (import.meta.env.VITE_ENABLE_MSW === "true") {
  await worker.start({
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
    onUnhandledRequest: "bypass",
  });
}
import App from "./App";
import { worker } from "./mocks/browser";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
