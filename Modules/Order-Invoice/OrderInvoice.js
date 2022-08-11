import { React, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { resizeWindow } from "../../usejQuery";
import ProfileOptions from "../Home/Components/ProfileOptions";
import History from "./Components/History";
import Invoice from "./Components/Invoice";
import { useDispatch, useSelector } from "react-redux";
import { setPageRefresh } from "../Layout/LayoutSlice";
import { myOrdersSelector } from "../Order-History/OrderHistorySlice";
import { useHistory, useParams } from "react-router";
import axios from "./../../library/axios";
import { app_token } from "../../App_Token";
import { accessTokenSelector, businessUrlSelector, setIsHomePage } from "../Home/HomeSlice";
import { animateScrollToTop } from "../Home/HomeHelpers";
import { loggedInUserSelector } from "../Auth/AuthSlice";

export default function OrderInvoice(props) {
  const params = useParams();
  const accessToken = useSelector(accessTokenSelector);
  const businessUrl = useSelector(businessUrlSelector);
  const loggedInUser = useSelector(loggedInUserSelector);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    animateScrollToTop();
  }, []);

  useEffect(() => {
    loggedInUser === null && history.push(`/${businessUrl}`);
  }, [businessUrl, history, loggedInUser]);

  let myOrders = useSelector(myOrdersSelector);

  const [order, setOrder] = useState(
    myOrders &&
      myOrders.find((obj) => {
        return obj.order_number === params.order_no;
      })
  );

  useEffect(() => {
    if (order === undefined) {
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
          // console.log(response);
          if (response.data.status === true) {
            setOrder(response.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [accessToken, order, params.order_no]);

  useEffect(() => {
    resizeWindow();
    dispatch(setPageRefresh(false));
    dispatch(setIsHomePage(false));
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Store | Order Invoice</title>
      </Helmet>
      <main className="wrapper">
        <section id="main-body" className="pl-3 pt-4 pb-70" style={{ minHeight: "84vh" }}>
          <div className="container-fluid">
            <div className="mobile-hide">
              <ProfileOptions props={{ searchBar: false }} />
            </div>
            {order ? (
              <div className="row">
                <div className="col-xl-4 col-md-4 cls-m-12 order-sm-1 order-md-1 order-lg-0">
                  <History props={{ order: order }} />
                </div>
                <Invoice props={{ order: order }} />
              </div>
            ) : (
              "Order details not found"
            )}
          </div>
        </section>
      </main>
    </>
  );
}
