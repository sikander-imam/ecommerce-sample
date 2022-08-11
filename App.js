/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ThankYouPassword from "./Modules/Auth/Components/ThankYouPassword";
import ThankYouOrder from "./Modules/Cart/Components/ThankYouOrder";
import OrderHistory from "./Modules/Order-History/OrderHistory";
import OrderInvoice from "./Modules/Order-Invoice/OrderInvoice";
import ProductDetails from "./Modules/Product-Details/ProductDetails";
import Home from "./Modules/Home/Home";
import CheckOut from "./Modules/CheckOut/CheckOut";
import ForgotPassword from "./Modules/Auth/Components/ForgotPassword1";
import OtpVerification from "./Modules/Auth/Components/OtpVerification";
import ResetPassword from "./Modules/Auth/Components/ResetPassword";
import Login from "./Modules/Auth/Components/Login";
import Register from "./Modules/Auth/Components/Register";
import OrderOTP from "./Modules/Order-Invoice/Components/OTP";
import Layout from "./Modules/Layout/Layout";
import { useSelector } from "react-redux";
import { businessInfoSelector, hasAccessTokenSelector, hasProductsSelector, hasStoresSelector } from "./Modules/Home/HomeSlice";
import ErrorPage from "./Modules/404Pages/404Page";
import CartMobile from "./Modules/Cart/CartMobile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPasswordOTP from "./Modules/Auth/Components/ForgotPasswordOTP";
import BusinessPage from "./Modules/Layout/BusinessPages";
import CCAvenue from "./Modules/CheckOut/Components/Shipping&Payment/Components/CCAvenue";
import { apiErrorSelector } from "./Modules/Layout/LayoutSlice";
import { resizeWindow } from "./usejQuery";
import TrackOrder from "./Modules/Order-Invoice/trackOrder";
import { checkStatus } from "./Modules/Home/HomeHelpers";

// // REACT_APP_URL= https://store.oogo.ae
// // REACT_APP_URL=http://localhost:3000
// // "proxy": "https://verifypayment.oogo.ae"
// // "proxy": "http://localhost:5000"
// // const  = lazy(() => import());

function App() {
  const hasAccessToken = useSelector(hasAccessTokenSelector);
  const hasStores = useSelector(hasStoresSelector);
  const hasProducts = useSelector(hasProductsSelector);
  const urlPaths = window.location.pathname.split("/");
  const businessUrl = window.location.pathname.split("/")[1];
  const apiError = useSelector(apiErrorSelector);
  const businessInfo = useSelector(businessInfoSelector);
  const fbPixelScript = businessInfo?.fb_pixel;

  useEffect(() => {
    if (businessUrl && businessUrl !== "ccavenue") {
      if (urlPaths.length >= 3 && urlPaths[2] !== "") {
        checkStatus(businessUrl, false);
      } else {
        checkStatus(businessUrl, true);
      }
    }
    resizeWindow();
  }, []);

  useEffect(() => {
    fbPixelScript && window.$("head").append(fbPixelScript);
    return () => {};
  }, []);

  if (!businessUrl) {
    return <ErrorPage />;
  }

  // const variable = process.env.REACT_APP_VARIABLE;
  // console.log(variable);

  return (
    <BrowserRouter>
      <div className="App">
        {hasAccessToken === false || hasStores === false || hasProducts === false ? <Redirect to="/404Page" /> : null}
        {apiError !== null && <Redirect to="/404Page" />}
        {!businessUrl && <Redirect to="/404Page" />}

        <Switch>
          <Route exact path="/ccavenue/response/:payload" component={CCAvenue} />
          <Route exact path={`/404Page`} component={ErrorPage} />
          <Route exact path={`/:business_url`} component={(props) => <Layout {...props} component={<Home />} />} />

          <Route exact path={`/:business_url/login`} component={Login} />
          <Route exact path={`/:business_url/register`} component={Register} />
          <Route exact path={`/:business_url/forgot-password`} component={ForgotPassword} />
          <Route exact path={`/:business_url/forgot-password-otp`} component={ForgotPasswordOTP} />
          <Route exact path={`/:business_url/getOTP`} component={OrderOTP} />
          <Route exact path={`/:business_url/OtpVerification`} component={OtpVerification} />
          <Route exact path={`/:business_url/password/:type/:email`} component={ResetPassword} />
          <Route exact path={`/:business_url/Resetconfirm`} component={ThankYouPassword} />
          <Route
            exact
            path={`/:business_url/account/orders`}
            component={(props) => <Layout {...props} component={<OrderHistory props={props} />} />}
          />
          <Route exact path={`/:business_url/cart`} component={(props) => <Layout {...props} component={<CartMobile />} />} />
          <Route exact path={`/:business_url/checkout`} component={(props) => <Layout {...props} component={<CheckOut />} />} />
          <Route
            exact
            path={`/:business_url/order_invoice/:order_no`}
            component={(props) => <Layout {...props} component={<OrderInvoice props={props} />} />}
          />
          <Route
            exact
            path={`/:business_url/track_order/:order_no`}
            component={(props) => <Layout {...props} component={<TrackOrder props={props} />} />}
          />
          {/* <Route exact path={`/:business_url/order/otp`} component={OrderOTP} /> */}
          <Route exact path={`/:business_url/order/confirmed`} component={ThankYouOrder} />
          <Route
            exact
            path={`/:business_url/pages/:page_slug`}
            component={(props) => <Layout {...props} component={<BusinessPage props={props} />} />}
          />
          <Route
            exact
            path={`/:business_url/:category_slug/:product_slug`}
            component={(props) => <Layout {...props} component={<ProductDetails props={props} />} />}
          />
          <Route component={ErrorPage} />
        </Switch>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable={true}
          pauseOnHover={true}
          progress={false}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
