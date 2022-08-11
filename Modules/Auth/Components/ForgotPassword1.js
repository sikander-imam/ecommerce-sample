import { React, useEffect, useState } from "react";
import AuthHeader from "./AuthHeader";
import { useDispatch, useSelector } from "react-redux";
import { accessTokenSelector, businessUrlSelector, setMainView } from "../../Home/HomeSlice";
import axios from "./../../../library/axios";
import { app_token } from "./../../../App_Token";
import { useHistory, useParams } from "react-router";
import { setEmailForPasswordReset } from "../AuthSlice";
import { Helmet } from "react-helmet";
import { hasDataSelector, loadingStateSelector, setHasData, setLoading, setPageRefresh } from "../../Layout/LayoutSlice";
import { getButtonStyle } from "./../../Home/HomeHelpers";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  const [Email, setEmail] = useState(null);
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);

  const loadingState = useSelector(loadingStateSelector);
  const businessUrl = useSelector(businessUrlSelector);
  const accessToken = useSelector(accessTokenSelector);
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

  const handleForgotPassword = (event) => {
    event.preventDefault();
    dispatch(setLoading(true));
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/forgot-password`,
        {
          // business_url: storeName,
          app_token: app_token,
          email: Email,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        dispatch(setLoading(false));
        if (response.data.status === true) {
          dispatch(setEmailForPasswordReset(Email));
          setSuccess(response.data.message);
          history.push(`/${businessUrl}/forgot-password-otp`);
        } else if (response.data.status === false) {
          setError(response.data.error.email[0]);
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
        <title>Store | Forgot Password </title>
      </Helmet>
      <AuthHeader />
      {hasData && (
        <main className="wrapper start-wrapper">
          <section id="main-body" className="full-height p-6 d-flex align-items-center">
            <div className="container-fluid">
              <div className="login-wrapp">
                <h2 className="darkcolor font-weight-700 mb-5 text-center">Forgot Password</h2>
                <form className="login-inner mb-3" onSubmit={handleForgotPassword}>
                  <div className="form-group mb-4">
                    <p className="dark-one mb-4">Enter your email for the verification proccess we will send 4 digits code to your email.</p>
                    <label>Email</label>
                    <div className="form-icon">
                      <input
                        type="email"
                        className="form-control font-weight-600 darkcolor"
                        onChange={(e) => {
                          setError(null);
                          setSuccess(null);
                          setEmail(e.target.value);
                        }}
                      />
                      <span className="form-icon-ico">
                        <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/email.png`} />
                      </span>
                    </div>
                    {Error !== null && <p className="text--danger">{Error}</p>}
                    {Success !== null && <p className="text--success">{Success}</p>}
                  </div>
                  <input
                    type="submit"
                    disabled={loadingState}
                    className="btn-size btn-rounded btn--primary btn-large text-uppercase mb-3"
                    value="Continue"
                    style={getButtonStyle(loadingState)}
                  />
                </form>
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
}
