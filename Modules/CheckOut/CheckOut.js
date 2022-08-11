
/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect } from "react";
import OrderSummary from "./Components/OrderSummary";
import ShippingAndPayment from "./Components/Shipping&Payment/Shipping&Payment";
import { useDispatch } from "react-redux";
import { resizeWindow } from "../../usejQuery";
import ProfileOptions from "../Home/Components/ProfileOptions";
import { Helmet } from "react-helmet";
import { setPageRefresh } from "../Layout/LayoutSlice";
import { animateScrollToTop } from "../Home/HomeHelpers";
import { useParams } from "react-router";
import { useHistory } from "react-router";
import { getBrandColors } from "./Components/Shipping&Payment/Components/OrderHelper";

export default function CheckOut() {
  const brandColors = getBrandColors();
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();
  const storageBusinessUrl = localStorage.getItem("business_url");

  useEffect(() => {
    if (storageBusinessUrl !== params.business_url) {
      history.push(`/${params.business_url}`);
    }
  }, [params.business_url, dispatch]);

  useEffect(() => {
    resizeWindow();
    animateScrollToTop();
    dispatch(setPageRefresh(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Store | CheckOut</title>
      </Helmet>
      <main className="wrapper">
        <section id="main-body" className="pl-3 pt-4 pb-70 mobile-cart-color">
          <div className="container-fluid">
            <div className="mobile-hide">
              <ProfileOptions props={{ searchBar: false }} />
            </div>
            <div className="checkout-tabs radius-10 checkout-page">
              <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="orderSummary-tab"
                    data-toggle="tab"
                    href="#orderSummary"
                    role="tab"
                    aria-controls="orderSummary"
                    aria-selected="true"
                  >
                    <span style={{ color: brandColors && brandColors.background }}>1</span>
                    ORDER SUMMARY
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" id="shipAy-tab" data-toggle="tab" href="#shipAy" role="tab" aria-controls="shipAy" aria-selected="false">
                    <span style={{ color: brandColors && brandColors.background }}>2</span>
                    SHIPPING & PAYMENT
                  </a>
                </li>
              </ul>
              <div className="tab-content padding-inner" id="myTabContent">
                {storageBusinessUrl === params.business_url && (
                  <>
                    <OrderSummary />
                    <ShippingAndPayment />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
