import { React, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMainView } from "../../Home/HomeSlice";
import { setPageRefresh } from "../../Layout/LayoutSlice";
import AuthHeader from "./AuthHeader";

export default function Start() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageRefresh(false));
    dispatch(setMainView());
    return () => {
      dispatch(setMainView());
    };
  }, [dispatch]);
  return (
    <>
      <AuthHeader />
      <main className="wrapper start-wrapper">
        <section id="main-body" className="full-height p-6 d-flex align-items-center">
          <div className="container-fluid">
            <div className="login-wrapp text-center">
              <h2 className="darkcolor font-weight-700 mb-5 mobile-hide">Sign In</h2>
              <div className="login-inner mb-3">
                <a href="/" className="btn-size btn-rounded btn--primary btn-large text-uppercase mb-3">
                  For Retail
                </a>
                <a href="/" className="btn-size btn-rounded btn--primary btn-large text-uppercase mb-3">
                  For Resturents
                </a>
              </div>
              <div className="mt-7 mobile-hide">
                <p className="darkcolor font-weight-600">
                  Don't have an account?
                  <a href="/" className="text--primary">
                    Create one here.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
