import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import rootReducer from "./components/reducer";
import {configureStore} from "@reduxjs/toolkit"
import { Toaster } from "react-hot-toast";

// create store using configureStore method and  pass reducer in it
const store = configureStore({
  reducer : rootReducer,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster/>
      </BrowserRouter>
    </Provider>
    
  </React.StrictMode>
);


// components = auth,common,course,dashboard
/*
hooks , slices  , reducers , pages  ,, services
*/


