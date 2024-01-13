import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App.tsx";
import store from "./redux/store.ts";
import "./scss/index.scss";

const Root = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          {loading ? (
            <div className="loader-container"><span className="loader"></span></div>
          ) : (
            <>
              <ToastContainer />
              <App />
            </>
          )}
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
