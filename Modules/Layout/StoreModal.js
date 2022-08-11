/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { businessUrlSelector, setStores, accessTokenSelector, getProductsSuccess, businessInfoSelector } from "../Home/HomeSlice";
import { storesSelector } from "./../Home/HomeSlice";
import axios from "./../../library/axios";
import { app_token } from "./../../App_Token";
import { useHistory } from "react-router";
import $ from "jquery";
import { formatCategories, handleStoreReset } from "../Home/HomeHelpers";
import { resizeWindow } from "../../usejQuery";
import { setPageRefresh } from "./LayoutSlice";

export default function StoreModal() {
  const businessUrl = useSelector(businessUrlSelector);
  const accessToken = useSelector(accessTokenSelector);
  const stores = useSelector(storesSelector);

  const businessInfo = useSelector(businessInfoSelector);
  const brandColors = businessInfo && businessInfo.businessColors;

  const [StoreChanged, setStoreChanged] = useState(false);
  const [AllStores, setAllStores] = useState(stores);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setAllStores(stores);
  }, [stores]);

  useEffect(() => {
    resizeWindow();
  }, []);

  const cities =
    AllStores &&
    AllStores.map((obj) => {
      return obj.city;
    }).filter((x, i, a) => a.indexOf(x) === i);

  const city_stores =
    cities &&
    cities.map((city) => {
      return {
        city: city,
        stores: AllStores.filter((store) => {
          return store.city === city;
        }),
      };
    });

  const handleStoreSelection = (store) => {
    const newStores = AllStores.map((obj) => {
      const newObj = { ...obj };
      if (store.id === obj.id) {
        newObj.selected = true;
      } else {
        newObj.selected = false;
      }
      return newObj;
    });

    setAllStores(newStores);
    setStoreChanged(true);
  };

  const getProducts = (store) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/get-products`,
        {
          business_url: businessUrl,
          app_token: app_token,
          store_id: store.id,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        dispatch(getProductsSuccess(formatCategories(store.id, response.data.data)));
        $(".sidebar").removeClass("active");
        $(".close-sidebar").removeClass("active");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ApplyStoreSelection = () => {
    setTimeout(() => {
      resizeWindow();
    }, 2000);

    window.$(".sidebar").removeClass("active");
    window.$(".close-sidebar").removeClass("active");

    if (StoreChanged === true) {
      const selectedStore = AllStores.filter((obj) => {
        return obj.selected === true;
      });

      setStoreChanged(false);
      handleStoreReset();
      dispatch(setStores(AllStores));
      dispatch(setPageRefresh(false));
      getProducts(selectedStore[0]);
      history.push(`/${businessUrl}`);
    } else {
      window.$("body").toggleClass("modal-open");
    }
    //
  };

  return (
    <>
      {/* <!-- Modal --> */}

      <div
        className="modal fade customer-modal"
        id="storeModal"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered model-lg" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h3 className="dark-one font-weight-700 mb-3 text-center">You are in</h3>
              <h3 className="dark-one font-weight-700 mb-3 text-center text--primary" style={{ color: brandColors?.background }}>
                United Arab Emirates
              </h3>

              <label className="addons-lbl">
                <b>Slecet Nearest Store</b>
              </label>
              <div>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group mb-0 card mb-5">
                      {city_stores &&
                        city_stores.map((city, index) => {
                          return (
                            <React.Fragment key={index}>
                              {index > 0 && <hr />}
                              {<strong className="mb-3">{city.city}</strong>}
                              {city.stores.map((obj, index) => {
                                return (
                                  <React.Fragment key={`store${index}`}>
                                    <div className="desktop-hide">
                                      <div
                                        className={`form-check addon-flexer Addons-extra ${obj.selected === true ? "selected" : null}`}
                                        onClick={() => {
                                          handleStoreSelection(obj);
                                        }}
                                      >
                                        <p className="font-weight-500 mb-0">{obj.name}</p>
                                        <p className="font-weight-500 mb-0">{obj.selected === true ? <i className="fas fa-check"></i> : null}</p>
                                      </div>
                                    </div>

                                    <div className="mobile-hide">
                                      <div
                                        className={`form-check addon-flexer Addons-extra ${obj.selected === true ? "selected" : null}`}
                                        onClick={() => {
                                          handleStoreSelection(obj);
                                        }}
                                      >
                                        <p className="font-weight-500 mb-0">{obj.name}</p>
                                        <p className="font-weight-500 mb-0">{obj.selected === true ? <i className="fas fa-check"></i> : null}</p>
                                      </div>
                                    </div>
                                  </React.Fragment>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={ApplyStoreSelection}
                type="button"
                className="btn-size btn-rounded btn--primary ml-1 mr-1"
                data-dismiss="modal"
                style={brandColors}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
