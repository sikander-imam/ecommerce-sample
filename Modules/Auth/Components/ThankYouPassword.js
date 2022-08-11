import { React, useEffect } from "react";
import AuthHeader from "./AuthHeader";
import { useDispatch } from "react-redux";
import { setMainView } from "../../Home/HomeSlice";
import { setPageRefresh } from "../../Layout/LayoutSlice";

export default function ThankYouPassword() {
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
            <div className="login-wrapp">
              <h2 className="darkcolor font-weight-700 mb-5 text-center">Thank You</h2>
              <form className="login-inner mb-3">
                <div className="form-group mb-4">
                  <p className="dark-one mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod incididunt labore et dolore magna aliqua.
                  </p>
                </div>
                <a href="login.html" className="btn-size btn-rounded btn--primary btn-large text-uppercase mb-3">
                  ok
                </a>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
