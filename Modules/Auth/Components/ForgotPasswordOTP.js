import { React, useEffect, useState } from "react";
import AuthHeader from "./AuthHeader";
import { useDispatch, useSelector } from "react-redux";
import { businessUrlSelector, accessTokenSelector, setMainView } from "./../../Home/HomeSlice";
import { useHistory } from "react-router";
import { app_token } from "./../../../App_Token";
import axios from "./../../../library/axios";
import { EmailForPasswordResetSelector } from "../AuthSlice";
import { hasDataSelector, loadingStateSelector, setHasData, setLoading, setPageRefresh } from "../../Layout/LayoutSlice";
import { Base64 } from "js-base64";
import { useParams } from "react-router-dom";
import { getButtonStyle } from "../../Home/HomeHelpers";

export default function ForgotPasswordOTP() {
  const [OTP, setOTP] = useState([]);
  const [Error, setError] = useState("");
  const loadingState = useSelector(loadingStateSelector);

  const businessUrl = useSelector(businessUrlSelector);
  const accessToken = useSelector(accessTokenSelector);
  const EmailForPasswordReset = useSelector(EmailForPasswordResetSelector);
  const encEmail = Base64.encode(EmailForPasswordReset);

  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams();

  const storageBusinessUrl = localStorage.getItem("business_url");
  storageBusinessUrl !== params.business_url && dispatch(setHasData(false));
  const hasData = useSelector(hasDataSelector);

  useEffect(() => {
    dispatch(setPageRefresh(false));
    dispatch(setMainView());
    return () => {
      dispatch(setMainView());
    };
  }, [dispatch]);

  const handleOTPInput = (e, index) => {
    const value = e.target.value;
    const newOTP = [...OTP];
    newOTP[index] = value.charAt(0);
    setOTP(newOTP);
  };

  const verifyOTP = () => {
    dispatch(setLoading(true));
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/validate-code`,
        {
          business_url: businessUrl,
          app_token: app_token,
          email: EmailForPasswordReset,
          code: OTP.join(""),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(setLoading(false));
        if (response.data.status === true) {
          history.push(`/${businessUrl}/password/reset/${encEmail}`);
        } else if (response.data.status === false) {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
        setError(err.message);
      });
  };
  return (
    <>
      <AuthHeader />
      {hasData && (
        <main className="wrapper start-wrapper">
          <section id="main-body" className="full-height p-6 d-flex align-items-center">
            <div className="container-fluid">
              <div className="login-wrapp">
                <h2 className="darkcolor font-weight-700 mb-5 text-center">Enter 4 Digits Code</h2>
                <form className="login-inner mb-3">
                  <div className="form-group mb-4">
                    <p className="dark-one mb-4">Enter the 4 digits code that you recevied on your email.</p>
                    <div className="password-control">
                      <input
                        type="number"
                        value={OTP[0]}
                        className="input-code mt-3"
                        onChange={(e) => {
                          handleOTPInput(e, 0);
                        }}
                      />
                      <input
                        type="number"
                        value={OTP[1]}
                        className="input-code mt-3"
                        onChange={(e) => {
                          handleOTPInput(e, 1);
                        }}
                      />
                      <input
                        type="number"
                        value={OTP[2]}
                        className="input-code mt-3"
                        onChange={(e) => {
                          handleOTPInput(e, 2);
                        }}
                      />
                      <input
                        type="number"
                        value={OTP[3]}
                        className="input-code mt-3"
                        onChange={(e) => {
                          handleOTPInput(e, 3);
                        }}
                      />
                    </div>
                    <p> {Error} </p>
                  </div>
                  <button
                    type="button"
                    disabled={loadingState}
                    style={getButtonStyle(loadingState)}
                    className="btn-size btn-rounded btn--primary btn-large text-uppercase mb-3"
                    onClick={(e) => {
                      verifyOTP();
                    }}
                  >
                    Continue
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
}
