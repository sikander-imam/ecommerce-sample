import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { resizeWindow } from "../../usejQuery";
import ProfileOptions from "../Home/Components/ProfileOptions";
import { setHasData, setPageRefresh } from "../Layout/LayoutSlice";
import History from "./Components/History";
import TrackingInvoice from "./Components/trackingInvoice";
import { useParams } from "react-router";
import { setTrackOrder, trackOrderSelector } from "../Order-History/OrderHistorySlice";
import axios from "../../library/axios";
import { app_token } from "../../App_Token";
import { accessTokenSelector, setIsHomePage } from "../Home/HomeSlice";
import { animateScrollToTop } from "../Home/HomeHelpers";

export default function TrackOrder() {
  const trackOrder = useSelector(trackOrderSelector);
  let accessToken = useSelector(accessTokenSelector);
  const [error, SetError] = useState("");

  const dispatch = useDispatch();
  const params = useParams();

  const storageBusinessUrl = localStorage.getItem("business_url");
  storageBusinessUrl !== params.business_url && dispatch(setHasData(false));

  if (storageBusinessUrl !== params.business_url) {
    dispatch(setHasData(false));
    accessToken = null;
  }

  useEffect(() => {
    resizeWindow();
  }, [trackOrder]);

  useEffect(() => {
    animateScrollToTop();
  }, []);

  useEffect(() => {
    if (storageBusinessUrl === params.business_url && accessToken !== null) {
      getOrdersHistory();
    }
    resizeWindow();
    dispatch(setPageRefresh(false));
    dispatch(setIsHomePage(false));
  }, [accessToken, dispatch, params.business_url, storageBusinessUrl]);

  const getOrdersHistory = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/track-order/${params.order_no}`,
        {
          app_token: app_token,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        resizeWindow();
        console.log(response);
        if (response.data.status === true) {
          dispatch(setTrackOrder(response.data.data));
        }
        if (response.data.status === false) {
          SetError(response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        SetError("Order details not found");
      });
  };

  return (
    <>
      <Helmet>
        <title>Store | Order Invoice</title>
      </Helmet>
      <main className="wrapper">
        <section id="main-body" className="pl-3 pt-4 pb-70" style={{ minHeight: "85vh" }}>
          <div className="container-fluid">
            <div className="mobile-hide">
              <ProfileOptions props={{ searchBar: false }} />
            </div>
            <div className="row">
              {trackOrder && error !== null ? (
                <>
                  <div className="col-xl-4 col-md-4 cls-m-12 order-sm-1 order-md-1 order-lg-0">
                    <History props={{ order: trackOrder }} />
                  </div>
                  <TrackingInvoice props={{ order: trackOrder }} />
                </>
              ) : (
                error
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
