import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { businessInfoSelector, businessUrlSelector } from "../../Home/HomeSlice";
import { accessTokenSelector } from "./../../Home/HomeSlice";
import { app_token } from "./../../../App_Token";
import axios from "./../../../library/axios";
import { useHistory } from "react-router";
import { setPaymentStatus, shippingInfoSelector, updateShippingInfo } from "../../CheckOut/CheckOutSlice";
import { redirectedSelector, setRedirected } from "./../OtpVerificationSlice";
import { CartProductsSelector } from "../../Cart/CartSlice";

export default function OrderOTP() {
  const businessUrl = useSelector(businessUrlSelector);
  const accessToken = useSelector(accessTokenSelector);
  const billing = useSelector(shippingInfoSelector);
  const businessInfo = useSelector(businessInfoSelector);
  const brandColors = businessInfo && businessInfo.businessColors;
  const [Error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const redirected = useSelector(redirectedSelector);
  const mobile_no = billing.billing_address.phone;
  const cart = useSelector(CartProductsSelector);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (cart.length === 0) {
      history.push(`/${businessUrl}`);
    }
  }, []);

  const updateMobileNo = (e) => {
    setError("");
    setPhoneError("");
    const newInfo = { ...billing };
    const newAddress = { ...newInfo.billing_address };
    newAddress.phone = e.target.value;
    newInfo.billing_address = newAddress;

    dispatch(updateShippingInfo(newInfo));
  };

  const getVerificationCode = () => {
    dispatch(setPaymentStatus(null));
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/get-otp`,
        {
          business_url: businessUrl,
          app_token: app_token,
          mobile_no: mobile_no,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.status === true) {
          dispatch(setRedirected(true));
          history.push(`/${businessUrl}/OtpVerification`);
        } else if (response.data.status === false) {
          setError(response.data.error);
          dispatch(setRedirected(true));
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
        dispatch(setRedirected(true));
      });
  };

  const getOTP = (event) => {
    event.preventDefault();
    if (mobile_no.length < 10 || mobile_no.length > 15) {
      setPhoneError("Phone number must contain 10 to 15 digits");
      return;
    } else {
      getVerificationCode();
    }
  };

  useEffect(() => {
    if (mobile_no !== null && redirected === false) {
      getVerificationCode();
    }
  }, []);

  return (
    <>
      {redirected === true && (
        <main className="wrapper start-wrapper">
          <section id="main-body" className="full-height p-6 d-flex align-items-center">
            {
              <div className="container-fluid">
                <div className="login-wrapp otp-wrap">
                  <span className="otp-icon">
                    <img alt="" src={`${process.env.PUBLIC_URL}/assets/images/verification.png`} />
                  </span>
                  <div className="mb-5 text-center">
                    <h2 className="darkcolor font-weight-700">Verification</h2>
                    <h4 className="dark-two mt-2">
                      You will get a OTP via <strong>SMS</strong>
                    </h4>
                  </div>

                  <form className="login-inner mb-3" onSubmit={getOTP}>
                    <div className="form-group mb-4">
                      <div className="otp-control">
                        <input
                          type="number"
                          name="phone"
                          placeholder="0XXXXXXXXXX"
                          className="input-otp"
                          value={mobile_no}
                          onChange={(e) => {
                            updateMobileNo(e);
                          }}
                        />
                      </div>
                      <p className="text--danger">{phoneError}</p>
                      <p className="text--danger">{Error}</p>
                    </div>
                    <input
                      type="submit"
                      className="btn-size btn-rounded btn--primary btn-large text-uppercase mb-3"
                      value="Verify"
                      style={brandColors}
                    />
                  </form>
                </div>
              </div>
            }
          </section>
        </main>
      )}
    </>
  );
}
