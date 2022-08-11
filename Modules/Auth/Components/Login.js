/* eslint-disable no-useless-escape */
import { React, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AuthHeader from "./AuthHeader";
import { loginSuccess } from "../AuthSlice";
import { Link } from "react-router-dom";
import { businessInfoSelector, businessUrlSelector, setMainView } from "../../Home/HomeSlice";
import { useSelector } from "react-redux";
import { accessTokenSelector } from "./../../Home/HomeSlice";
import axios from "./../../../library/axios";
import { app_token } from "./../../../App_Token";
import { useHistory, useParams } from "react-router";
import { Helmet } from "react-helmet";
import { hasDataSelector, loadingStateSelector, setHasData, setLoading, setPageRefresh } from "../../Layout/LayoutSlice";
import { getButtonStyle } from "./../../Home/HomeHelpers";

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [User, setUser] = useState({ email: null, password: null });
  const [PasswordType, setPasswordType] = useState(true);
  const [Error, setError] = useState("");

  const businessUrl = useSelector(businessUrlSelector);
  const accessToken = useSelector(accessTokenSelector);
  const businessInfo = useSelector(businessInfoSelector);
  const brandColors = businessInfo && businessInfo.businessColors;
  const params = useParams();
  const storageBusinessUrl = localStorage.getItem("business_url");
  storageBusinessUrl !== params.business_url && dispatch(setHasData(false));
  const hasData = useSelector(hasDataSelector);
  const loadingState = useSelector(loadingStateSelector);

  useEffect(() => {
    dispatch(setPageRefresh(false));
    dispatch(setMainView());
    return () => {
      dispatch(setMainView());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setError("");
    const newUser = { ...User };
    newUser[e.target.name] = e.target.value;
    setUser(newUser);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          business_url: businessUrl,
          app_token: app_token,
          email: User.email,
          password: User.password,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(setLoading(false));
        if (response.data.status === true) {
          dispatch(loginSuccess(response.data.data));
          history.push(`/${businessUrl}`);
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
      <Helmet>
        <title>Store | Login </title>
      </Helmet>
      <AuthHeader />
      {hasData && (
        <main className="wrapper start-wrapper">
          <section id="main-body" className="full-height p-6 d-flex align-items-center">
            <div className="container-fluid">
              <div className="login-wrapp">
                <h2 className="darkcolor font-weight-700 mb-5 text-center">Sign In</h2>
                <form className="login-inner mb-3" onSubmit={handleLogin}>
                  <div className="form-group mb-4">
                    <label>Email</label>
                    <div className="form-icon">
                      <input name="email" type="email" className="form-control" required={true} onChange={(e) => handleChange(e)} />
                      <span className="form-icon-ico">
                        <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/email.png`} />
                      </span>
                    </div>
                  </div>
                  <div className="form-group mb-4">
                    <div className="d-flex justify-content-between">
                      <label>Password</label>
                      <Link to={`/${businessUrl}/forgot-password`} className="darkcolor font-weight-600 d-inline-block">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="form-icon">
                      <input
                        name="password"
                        type={PasswordType === true ? "password" : "text"}
                        className="form-control"
                        minLength="8"
                        required={true}
                        onChange={(e) => handleChange(e)}
                      />
                      <span className="form-icon-ico" onClick={() => setPasswordType(!PasswordType)}>
                        <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/lock.png`} />
                      </span>
                    </div>
                  </div>
                  <p className="error-msg"> {Error} </p>
                  <input
                    type="submit"
                    disabled={loadingState}
                    className="btn-size btn-rounded btn--primary btn-large text-uppercase mb-3"
                    value="Sign In"
                    style={getButtonStyle(loadingState)}
                  />
                </form>
                <div className="mt-4"></div>
                <p className="darkcolor font-weight-500 text-center">
                  Don't have an account?
                  <Link to={`/${businessUrl}/register`} className="text--primary" style={{ color: brandColors && brandColors.background }}>
                    Create one here .
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
}
