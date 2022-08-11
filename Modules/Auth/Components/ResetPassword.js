import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { accessTokenSelector, businessUrlSelector, setMainView } from "../../Home/HomeSlice";
import AuthHeader from "./AuthHeader";
import axios from "./../../../library/axios";
import { app_token } from "./../../../App_Token";
import { toast } from "react-toastify";
import { hasDataSelector, loadingStateSelector, setHasData, setLoading, setPageRefresh } from "../../Layout/LayoutSlice";
import { Base64 } from "js-base64";
import { getButtonStyle } from "./../../Home/HomeHelpers";

export default function ResetPassword() {
  let accessToken = useSelector(accessTokenSelector);
  const businessUrl = useSelector(businessUrlSelector);

  const [Error, setError] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [PasswordType, setPasswordType] = useState(true);
  const [ConfirmPasswordType, setConfirmPasswordType] = useState(true);
  const loadingState = useSelector(loadingStateSelector);

  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams();
  const titleString = params.type.charAt(0).toUpperCase() + params.type.slice(1);

  const decEmail = Base64.decode(params.email);
  const userStatus = Boolean(history.location.search.split("=")[1]);

  const storageBusinessUrl = localStorage.getItem("business_url");

  if (storageBusinessUrl !== params.business_url) {
    dispatch(setHasData(false));
    accessToken = null;
  }
  const hasData = useSelector(hasDataSelector);

  useEffect(() => {
    if (userStatus === true && storageBusinessUrl === params.business_url && accessToken !== null) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/verify/user`,
          {
            app_token: app_token,
            business_url: params.business_url,
            email: decEmail,
            new_customer: params.type === "update" ? true : false,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.data.status === true) {
            toast.success(response.data.message, {});
          } else if (response.data.status === false) {
            setError(response.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
        });
    }
  }, [accessToken, businessUrl, decEmail, history, params.business_url, params.type, storageBusinessUrl, userStatus]);

  useEffect(() => {
    dispatch(setPageRefresh(false));
    dispatch(setMainView());
    return () => {
      dispatch(setMainView());
    };
  }, [dispatch]);

  const handleResetPassword = (e) => {
    e.preventDefault();
    // handleDisable(e);
    if (Password === ConfirmPassword) {
      dispatch(setLoading(true));
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/reset-password`,
          {
            app_token: app_token,
            business_url: businessUrl,
            email: decEmail,
            password: Password,
            password_confirmation: ConfirmPassword,
            new_customer: params.type === "update" ? true : false,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .then((response) => {
          dispatch(setLoading(false));
          if (response.data.status === true) {
            toast.success(response.data.message, {});
            setTimeout(() => {
              history.push(`/${businessUrl}/login`);
            }, 500);
          } else if (response.data.status === false) {
            setError(response.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
          dispatch(setLoading(false));
        });
    } else {
      setError("Passwords do not match");
    }
  };

  return (
    <>
      {userStatus !== true && (
        <>
          <AuthHeader />
          {hasData && (
            <main className="wrapper start-wrapper">
              <section id="main-body" className="full-height p-6 d-flex align-items-center">
                <div className="container-fluid">
                  <div className="login-wrapp">
                    <h2 className="darkcolor font-weight-700 mb-5 text-center">{titleString} Password</h2>
                    <form className="login-inner mb-3" onSubmit={(e) => handleResetPassword(e)}>
                      <div className="form-group mb-4">
                        <p className="dark-one mb-4">Set the new password for your account so you can login and access all the features.</p>
                        <label>Password</label>
                        <div className="form-icon">
                          <input
                            type={PasswordType === true ? "password" : "text"}
                            id="reset_password"
                            className="form-control font-weight-600"
                            onChange={(e) => {
                              setPassword(e.target.value);
                            }}
                          />
                          <span
                            className="form-icon-ico"
                            onClick={() => {
                              setPasswordType(!PasswordType);
                            }}
                          >
                            <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/eye.png`} />
                          </span>
                        </div>
                      </div>
                      <div className="form-group mb-4">
                        <label>New Password</label>
                        <div className="form-icon">
                          <input
                            type={ConfirmPasswordType === true ? "password" : "text"}
                            id="confirm_reset_password"
                            className="form-control font-weight-600"
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                            }}
                          />
                          <span
                            className="form-icon-ico"
                            onClick={() => {
                              setConfirmPasswordType(!ConfirmPasswordType);
                            }}
                          >
                            <img alt="" src={`${process.env.PUBLIC_URL}/assets/images/eye.png`} />
                          </span>
                        </div>
                      </div>
                      <p>{Error}</p>
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
      )}
    </>
  );
}
