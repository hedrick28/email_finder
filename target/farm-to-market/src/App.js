import React, { Suspense, useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";
import RegisterPage from "./pages/register/RegisterPage";
import VerificationPage from "./pages/register/VerificationPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./scss/style.scss";
import { ToastContainer } from "react-toastify";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Resetpassword from "./pages/resetpassword/Resetpassword";
import Otpvalidation from "./pages/otpvalidation/Otpvalidation";
import { getAdmin, registerAdmin } from "./services/user";
import Calculator from "./components/calculator/Calculator";
import AdDetails from "./pages/advertisement/AdDetails";
const Landing = React.lazy(() => import("./pages/landing/Landing"));
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));
const ProductDetails = React.lazy(() =>
  import("./pages/product/ProductDetails")
);
const Cart = React.lazy(() => import("./pages/product/Cart"));
const Checkout = React.lazy(() => import("./pages/product/Checkout"));
const TransactionSuccess = React.lazy(() =>
  import("./pages/product/TransactionSuccess")
);

const TransactionFailed = React.lazy(() =>
  import("./pages/product/TransactionFailed")
);

const GcashPayment = React.lazy(() => import("./pages/product/GcashPayment"));
const Search = React.lazy(() => import("./pages/product/Search"));
const OrderDetails = React.lazy(() => import("./pages/orders/OrderDetails"));
const Categories = React.lazy(() => import("./pages/product/Categories"));

const App = () => {
  useEffect(() => {
    handleRegisterSuperAdmin();
  }, []);

  const handleRegisterSuperAdmin = () => {
    getAdmin().then((res) => {
      if (res.data.data === null) {
        registerAdmin().then((data) => {
          console.log("superadmin registered");
        });
      } else {
        console.log("superadmin already exist");
      }
    });
  };

  return (
    <BrowserRouter>
      <ToastContainer />
      <Header />
      <Calculator />
      <Suspense>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route
            path="/advertisement/details/:id"
            element={<AdDetails />}
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/ForgotPassword" element={<ForgotPassword />}></Route>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify/:username" element={<VerificationPage />} />
          <Route path="*" element={<DefaultLayout />} />
          <Route path="/details/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/reset-password" element={<Resetpassword />} />
          <Route path="/checkout/:code" element={<Checkout />} />
          <Route path="/otp-validation" element={<Otpvalidation />} />
          <Route
            path="/checkout/status/success/:code"
            element={<TransactionSuccess />}
          />
          <Route path="/checkout/payment/gcash" element={<GcashPayment />} />
          <Route
            path="/checkout/status/failed"
            element={<TransactionFailed />}
          />
          <Route path="/search" element={<Search />} />
          <Route path="/order/:type/details/:id" element={<OrderDetails />} />
          <Route path="/category/:type" element={<Categories />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
