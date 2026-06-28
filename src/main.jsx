import "./styles/app.scss";

import React from "react";
import ReactDOM from "react-dom/client";
if (import.meta.env.DEV) {
  await worker.start({
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
    onUnhandledRequest: "warn",
  });
}
import App from "./App";
import { worker } from "./mocks/browser";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
