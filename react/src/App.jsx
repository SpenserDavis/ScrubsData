import "./App.css";
import "./services/autoLogInService.js";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./components/AppRoutes";
import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "./redux/store";
import { ToastContainer } from "react-toastify";

class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <ToastContainer />
        <BrowserRouter basename="/">
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
