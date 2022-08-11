/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useState } from "react";
import AuthHeader from "./AuthHeader";
import { useDispatch, useSelector } from "react-redux";
import { businessUrlSelector, accessTokenSelector, setMainView } from "./../../Home/HomeSlice";
import { useHistory } from "react-router";
import { app_token } from "./../../../App_Token";
import axios from "./../../../library/axios";
import { setMobileNoVerificationStatus } from "../../Order-Invoice/OtpVerificationSlice";
import { setOrderResponse, setPaymentStatus, shippingInfoSelector } from "../../CheckOut/CheckOutSlice";
import { CartProductsSelector, resetCart } from "../../Cart/CartSlice";
import { Helmet } from "react-helmet";
import { setNewOrder } from "../../Order-History/OrderHistorySlice";
import { loadingStateSelector, setLoading, setPageRefresh } from "../../Layout/LayoutSlice";
import { getOrderData } from "./../../CheckOut/Components/Shipping&Payment/Components/OrderHelper";
import { resizeWindow } from "../../../usejQuery";
import { getButtonStyle } from "./../../Home/HomeHelpers";

export default function OtpVerification() {
  const businessUrl = useSelector(businessUrlSelector);
  const accessToken = useSelector(accessTokenSelector);
  const cart = useSelector(CartProductsSelector);
  const billing = useSelector(shippingInfoSelector);
  const loadingState = useSelector(loadingStateSelector);

  const mobile_no = billing.billing_address.phone;

  const [Error, setError] = useState("");
  const [OTP, setOTP] = useState("");

  resizeWindow();

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (cart && cart.length === 0) {
      history.push(`/${businessUrl}`);
    }
  }, []);

  useEffect(() => {
    dispatch(setPageRefresh(false));
    dispatch(setMainView());
    return () => {
      dispatch(setMainView());
    };
  }, []);

  const handleOrderPlacement = (paymentStatus) => {
    dispatch(setLoading(true));
    const data = getOrderData(paymentStatus);
    axios
      .post(`${process.env.REACT_APP_API_URL}/orders`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log(response);

        dispatch(setOrderResponse(response.data.data));
        dispatch(setNewOrder(response.data.data));
        if (response.data.status === true) {
          dispatch(resetCart());
          history.push({
            pathname: `/${businessUrl}/order/confirmed`,
            state: response.data.data,
          });
        }
        dispatch(setLoading(false));
      })
      .catch((err) => {
        console.log(err.response);
        setError(err.message);
        dispatch(setLoading(false));
      });
  };

  const handleOTPInput = (e, index) => {
    setError("");
    const value = e.target.value;
    const newOTP = [...OTP];
    newOTP[index] = value.charAt(0);
    setOTP(newOTP);
  };

  const handlePaymentConfirmation = (response) => {
    const payment = {
      type: 1,
      payment_method_id: 1,
      payment_status: "Pending",
      payment_response: response.data,
    };

    dispatch(setPaymentStatus(payment));
    handleOrderPlacement(payment);
  };

  const verifyOTP = () => {
    dispatch(setLoading(true));
    setError("");
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/verify-otp`,
        {
          business_url: businessUrl,
          app_token: app_token,
          mobile_no: mobile_no,
          code: OTP.join(""),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        dispatch(setLoading(false));
        console.log(response);
        if (response.data.status === true) {
          dispatch(setMobileNoVerificationStatus());
          handlePaymentConfirmation(response);
          // history.push(`/${businessUrl}/checkout`);
        } else if (response.data.status === false) {
          setError(response.data.error);
          // handlePaymentConfirmation(response);
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
        dispatch(setLoading(false));
      });
  };

  return (
    <>
      <Helmet>
        <title>Store | Verify OTP </title>
      </Helmet>
      <AuthHeader />
      <main className="wrapper start-wrapper">
        <section id="main-body" className="full-height p-6 d-flex align-items-center">
          <div className="container-fluid">
            <div className="login-wrapp">
              <h2 className="darkcolor font-weight-700 mb-5 text-center">Enter 4 Digits Code</h2>
              <form className="login-inner mb-3">
                <div className="form-group mb-4">
                  <p className="dark-one mb-4">Enter the 4 digits code that you recevied on your mobile.</p>
                  <div className="password-control">
                    <input type="number" maxlength="1" value={OTP[0]} className="input-code mt-3" onChange={(e) => handleOTPInput(e, 0)} />
                    <input type="number" maxlength="1" value={OTP[1]} className="input-code mt-3" onChange={(e) => handleOTPInput(e, 1)} />
                    <input type="number" maxlength="1" value={OTP[2]} className="input-code mt-3" onChange={(e) => handleOTPInput(e, 2)} />
                    <input type="number" maxlength="1" value={OTP[3]} className="input-code mt-3" onChange={(e) => handleOTPInput(e, 3)} />
                  </div>
                  <p className="text--danger"> {Error} </p>
                </div>
                <button
                  type="button"
                  className="btn-size btn-rounded btn--primary btn-large text-uppercase mb-3"
                  disabled={loadingState}
                  onClick={verifyOTP}
                  style={getButtonStyle(loadingState)}
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
