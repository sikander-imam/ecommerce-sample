/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useState } from "react";
import { resizeWindow } from "../../usejQuery";
import ProfileOptions from "../Home/Components/ProfileOptions";
import axios from "./../../library/axios";
import { app_token } from "./../../App_Token";
import { accessTokenSelector, businessInfoSelector, businessUrlSelector } from "./../Home/HomeSlice";
import { useDispatch, useSelector } from "react-redux";
import { myOrdersSelector, newOrderSelector, setMyOrders, setNewOrder } from "./OrderHistorySlice";
import { Link } from "react-router-dom";
import { loggedInUserSelector } from "./../Auth/AuthSlice";
import { Helmet } from "react-helmet";
import { paginationSelector, setPagination } from "./OrderHistorySlice";
import { useHistory } from "react-router";
import { setHasData, setPageRefresh } from "../Layout/LayoutSlice";
import { useParams } from "react-router";

export default function OrderHistory(props) {
  const accessToken = useSelector(accessTokenSelector);
  const businessUrl = useSelector(businessUrlSelector);
  const loggedInUser = useSelector(loggedInUserSelector);
  const businessInfo = useSelector(businessInfoSelector);
  const brandColors = businessInfo && businessInfo.businessColors;
  const newOrder = useSelector(newOrderSelector);
  let myOrders = useSelector(myOrdersSelector);
  let pagination = useSelector(paginationSelector);

  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const storageBusinessUrl = localStorage.getItem("business_url");
  storageBusinessUrl !== params.business_url && dispatch(setHasData(false));

  const [OrderKeyword, setOrderKeyword] = useState("");

  useEffect(() => {
    loggedInUser === null && history.push(`/${businessUrl}`);
  }, [loggedInUser]);

  useEffect(() => {
    resizeWindow();
    dispatch(setPageRefresh(false));
  }, []);

  useEffect(() => {
    if (props.props.location.redirectToInvoice === true) {
      history.push({
        pathname: `/${businessUrl}/orderinvoice`,
        state: { order: props.props.location.order },
      });
    }
  }, []);

  const getOrdersHistory = (url = `${process.env.REACT_APP_API_URL}/my-orders`) => {
    axios
      .post(
        url,
        {
          app_token: app_token,
          // customer_id: loggedInUser === null ? 1 : loggedInUser.id,
          customer_id: loggedInUser.id,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.status === true) {
          dispatch(setMyOrders(response.data.data));
          dispatch(setPagination(response.data.pagination));
          dispatch(setNewOrder(false));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (myOrders.length === 0 || newOrder === true) {
      getOrdersHistory();
    }
  }, []);

  if (OrderKeyword !== "" && myOrders !== null) {
    const newOrders = myOrders.filter((obj) => {
      const order_number = obj.order_number.toUpperCase();
      const keyword = OrderKeyword.toUpperCase();
      return order_number.includes(keyword);
    });

    console.log(newOrders);
    myOrders = newOrders;
  }

  const handlePagination = (url) => {
    getOrdersHistory(url);
  };

  return (
    <>
      <Helmet>
        <title>Store | Order History</title>
      </Helmet>
      <main className="wrapper">
        <section id="main-body" className="pl-3 pt-4 pb-70">
          <div className="container-fluid">
            <div className="mobile-hide">
              <ProfileOptions props={{ searchBar: false }} />
            </div>
            <div className="d-flex justify-content-between mid-top">
              <div className="form-group search-order form-icon dark-two mb-0">
                <input
                  type="search"
                  placeholder="Search ..."
                  className="form-control sm-control"
                  onChange={(e) => {
                    setOrderKeyword(e.target.value);
                  }}
                />
                <span className="form-icon-ico">
                  <img alt="" src={`${process.env.PUBLIC_URL}/assets/images/search.png`} />
                </span>
              </div>
              <div className="text-right mobile-hide">
                <div className="dropdown dropdown-orders">
                  <button
                    className="dropdown-toggle btn-md dark-one"
                    type="button"
                    id="dropOrder"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    All Orders
                  </button>
                  <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropOrder">
                    <a className="dropdown-item" href="/">
                      View Orders
                    </a>
                    <a className="dropdown-item" href="/">
                      Order History
                    </a>
                    <a className="dropdown-item" href="/">
                      Order History
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-repeat order-history mb-4">
              <div className="top-flexer margin-inner">
                <h4 className="dark-one font-weight-500">Order History </h4>
                <div className="dropdown dropdown-orders desktop-hide">
                  <button
                    className="dropdown-toggle btn-md dark-one"
                    type="button"
                    id="dropOrder1"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    All Orders
                  </button>
                  <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropOrder1">
                    <a className="dropdown-item" href="/">
                      View Orders
                    </a>
                    <a className="dropdown-item" href="/">
                      Order History
                    </a>
                    <a className="dropdown-item" href="/">
                      Order History
                    </a>
                  </div>
                </div>
              </div>

              {myOrders !== null && (
                <div className="padding-inner">
                  <div className="table-responsive scroll-bar-thin">
                    <table className="table table-spacer mb-0">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col" style={{ width: 210 }}>
                            Order ID:
                          </th>
                          <th scope="col" style={{ width: 210 }}>
                            Ordered on
                          </th>
                          <th scope="col">amount</th>
                          <th scope="col">Status</th>
                          <th scope="col" style={{ width: 160 }}>
                            &nbsp;
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {myOrders.map((obj, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <p className="table-text font-weight-500">{pagination && pagination.from + index}</p>
                              </td>
                              <td>
                                <Link
                                  className="table-text font-weight-500"
                                  to={{
                                    pathname: `/${businessUrl}/order_invoice/${obj.order_number}`,
                                    order: obj,
                                  }}
                                >
                                  {obj.order_number}
                                </Link>
                              </td>
                              <td>
                                <p className="table-text font-weight-500">{new Date(obj.created_at).toDateString()}</p>
                              </td>
                              <td>
                                <p className="table-text font-weight-50">{`AED ${Math.round(Number(obj.total))}`}</p>
                              </td>
                              <td>
                                <p className="table-text font-weight-700 text--primary">{obj.order_status.title}</p>
                              </td>
                              <td>
                                <div className="table-action">
                                  <button type="button" className="btn-size btn-rounded btn--primary-border mr-3">
                                    Add to cart
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <ul className="pagination justify-content-center mt-5">
                    {pagination &&
                      pagination.links.map((obj, index) => {
                        return (
                          <li
                            className="page-item"
                            key={`pagination${index}`}
                            onClick={() => {
                              handlePagination(obj.url);
                            }}
                            style={({ ...brandColors }, { cursor: "pointer" })}
                          >
                            <span className={`page-link ${obj.active === true && "active"}`} tabIndex="-1">
                              {index === 0 ? <img alt="" src={`${process.env.PUBLIC_URL}/assets/images/arrow-left.png`} /> : null}

                              {obj.url !== null && index !== pagination.links.length - 1 && index > 0 ? obj.label : null}

                              {index === pagination.links.length - 1 ? (
                                <img alt="" src={`${process.env.PUBLIC_URL}/assets/images/arrow-right.png`} />
                              ) : null}
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
