import { React, useEffect, useState } from "react";
import AuthHeader from "./AuthHeader";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerSuccess } from "../AuthSlice";
import { businessInfoSelector, businessUrlSelector, setMainView } from "../../Home/HomeSlice";
import { useSelector } from "react-redux";
import axios from "./../../../library/axios";
import { app_token } from "./../../../App_Token";
import { accessTokenSelector } from "./../../Home/HomeSlice";
import { Helmet } from "react-helmet";
import { hasDataSelector, loadingStateSelector, setHasData, setLoading, setPageRefresh } from "../../Layout/LayoutSlice";
import { getButtonStyle } from "./../../Home/HomeHelpers";

export default function Register(props) {
  const dispatch = useDispatch();

  const [User, setUser] = useState({ name: null, email: null, password: null });
  const [Error, setError] = useState("");

  const [PasswordType, setPasswordType] = useState(true);
  const accessToken = useSelector(accessTokenSelector);
  const businessUrl = useSelector(businessUrlSelector);
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
    const newUser = { ...User };
    newUser[e.target.name] = e.target.value;
    setUser(newUser);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/register`,
        {
          business_url: businessUrl,
          app_token: app_token,
          name: User.name,
          email: User.email,
          password: User.password,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        dispatch(setLoading(false));
        if (response.data.status === true) {
          dispatch(registerSuccess(response.data.data));
          props.history.goBack();
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
        <title>Store | Register </title>
      </Helmet>
      <AuthHeader />
      {hasData && (
        <main className="wrapper start-wrapper">
          <section id="main-body" className="full-height p-6 d-flex align-items-center">
            <div className="container-fluid">
              <div className="login-wrapp">
                <h2 className="darkcolor font-weight-700 mb-5 text-center">Register</h2>
                <form className="login-inner mb-3" onSubmit={handleRegister}>
                  <div className="form-group mb-4">
                    <label>Full Name</label>
                    <div className="form-icon">
                      <input
                        name="name"
                        type="text"
                        className="form-control"
                        required={true}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group mb-4">
                    <label>Email</label>
                    <div className="form-icon">
                      <input
                        name="email"
                        type="email"
                        className="form-control"
                        required={true}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      />
                      <span className="form-icon-ico">
                        <img alt="" src={`${process.env.PUBLIC_URL}/assets/images/email.png`} />
                      </span>
                    </div>
                  </div>
                  <div className="form-group mb-4">
                    <div className="d-flex justify-content-between">
                      <label>Password</label>
                    </div>
                    <div className="form-icon">
                      <input
                        name="password"
                        type={PasswordType === true ? "password" : "text"}
                        className="form-control"
                        minLength="8"
                        required={true}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      />
                      <span
                        className="form-icon-ico"
                        onClick={() => {
                          setPasswordType(!PasswordType);
                        }}
                      >
                        <img alt="" src={`${process.env.PUBLIC_URL}/assets/images/lock.png`} />
                      </span>
                    </div>
                  </div>
                  <p className="darkcolor mb-4">By creating an account, you agree to the ogoo.com Free Membership Agreement and Privacy Policy</p>
                  <p className="error-msg"> {Error} </p>
                  <input
                    type="submit"
                    disabled={loadingState}
                    className="btn-size btn-rounded btn--primary btn-large text-uppercase mb-3"
                    value="CREATE ACCOUNT"
                    style={getButtonStyle(loadingState)}
                  />
                </form>
                <div className="mt-4"></div>
                <p className="darkcolor font-weight-500 text-center">
                  Already have an account?
                  <Link to={`/${businessUrl}/login`} className="text--primary" style={{ color: brandColors && brandColors.background }}>
                    Sign in here
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
