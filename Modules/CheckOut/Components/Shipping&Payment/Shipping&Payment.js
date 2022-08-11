import { React, useEffect, useState } from "react";
import OrderDetails from "./Components/OrderDetails";
import {
  shippingInfoSelector,
  updateShippingInfo,
  SelectedPaymentTypeSelector,
  setSelectedPaymentType,
  setSelectedArea,
  showCCAvenueSelector,
  setShowCCAvenue,
  redirectedFromCCAvenueSelector,
  shippingAreasSelector,
  setShippingAreas,
  setBillingAreas,
  setDeliveryInfo,
  areaApiErrorSelector,
} from "./../../CheckOutSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  accessTokenSelector,
  businessInfoSelector,
  businessUrlSelector,
  citiesSelector,
  paymentTypesSelector,
  storesSelector,
} from "../../../Home/HomeSlice";
import { getKeyByValue } from "../../../Product-Details/Components/ProductDetailsHelpers";
import axios from "./../../../../library/axios";
import { app_token } from "../../../../App_Token";
import { useHistory } from "react-router";
import PaymentForm from "./Components/PaymentForm";
import { animateScrollToTop, getActiveStore, getButtonStyle } from "./../../../Home/HomeHelpers";
import { setRedirected } from "../../../Order-Invoice/OtpVerificationSlice";
import * as Scroll from "react-scroll";
import {
  getCheckOutSettings,
  getDeliveryInfo,
  getOrderData,
  getPaymentData,
  getPhoneNumLength,
  validateEmail,
  validatePhoneNumber,
} from "./Components/OrderHelper";
import { loadingStateSelector, setLoading } from "../../../Layout/LayoutSlice";

export default function ShippingAndPayment() {
  const billing = useSelector(shippingInfoSelector);
  const accessToken = useSelector(accessTokenSelector);
  const stores = useSelector(storesSelector);
  const activeStore = getActiveStore(stores);
  const BusinessURL = useSelector(businessUrlSelector);
  const paymentTypes = useSelector(paymentTypesSelector);
  const SelectedPaymentType = useSelector(SelectedPaymentTypeSelector);
  const showCCAvenue = useSelector(showCCAvenueSelector);
  const shippingAreas = useSelector(shippingAreasSelector);
  const [billingPhoneError, setBillingPhoneError] = useState("");
  const [shippingPhoneError, setShippingPhoneError] = useState("");
  const [dataValidationError, setDataValidationError] = useState("");
  const loadingState = useSelector(loadingStateSelector);

  const [PaymentError, setPaymentError] = useState(null);
  const AreaApiError = useSelector(areaApiErrorSelector);

  const checkOutSettings = getCheckOutSettings();
  const with_mobile = checkOutSettings.with_mobile;
  const with_email = checkOutSettings.with_email;
  const allow_change_billing = checkOutSettings.allow_change_billing;
  const cash_payment = checkOutSettings.cash_payment;
  const card_payment = checkOutSettings.card_payment;

  const deliveryType = activeStore?.delivery_company;
  const ownDeliveryStates = useSelector(citiesSelector);
  const aramexCities = useSelector(businessInfoSelector)?.aramex_cities;
  const storeAreas = deliveryType?.id === 1 ? aramexCities : shippingAreas;
  const [areas, setAreas] = useState(null);

  const states = deliveryType && deliveryType.id === 0 ? ownDeliveryStates : aramexCities;

  const dispatch = useDispatch();
  const history = useHistory();

  const shipping_address = "shipping_address";
  const billing_address = "billing_address";

  const phoneNumLength = getPhoneNumLength(billing);

  useEffect(() => {
    dispatch(setShowCCAvenue(false));
    dispatch(setDeliveryInfo(null));
    return () => {
      dispatch(setShowCCAvenue(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateBillingInfo = (value, name, type) => {
    setShippingPhoneError("");
    setBillingPhoneError("");
    setDataValidationError("");
    dispatch(setShowCCAvenue(false));
    const newInfo = { ...billing };
    const newAddress = { ...newInfo[type] };
    newAddress[name] = value;
    newInfo[type] = newAddress;

    if (newInfo.same_billing_address === true) {
      newInfo[billing_address] = newAddress;
    }
    dispatch(updateShippingInfo(newInfo));
  };

  const updateInfo = (status) => {
    setDataValidationError("");
    const newInfo = { ...billing };
    newInfo.same_billing_address = status;
    if (newInfo.same_billing_address === true) {
      newInfo[billing_address] = billing.shipping_address;
    } else if (newInfo.same_billing_address === false) {
      newInfo[billing_address] = { is_subscribed: false };
    }
    dispatch(updateShippingInfo(newInfo));
  };

  const handleShipInfoChange = (e, addressType) => {
    dispatch(setShowCCAvenue(false));
    updateBillingInfo(e.target.value, e.target.name, addressType);
  };

  const handleStateSelection = (e, addressType) => {
    dispatch(setDeliveryInfo(null));

    if (deliveryType?.id === 1) {
      setAreas(null);

      const newInfo = { ...billing };
      const newAddress = { ...newInfo[addressType] };
      newAddress.area = "";
      newAddress[e.target.name] = e.target.value;
      newInfo[addressType] = newAddress;
      if (newInfo.same_billing_address === true) {
        newInfo[billing_address] = newAddress;
      }
      dispatch(updateShippingInfo(newInfo));

      if (e.target.value === "") {
        return;
      }

      const activeState = aramexCities.find((city) => {
        return city.id === Number(e.target.value);
      });
      setAreas(activeState.areas);
      dispatch(setDeliveryInfo(null));
      dispatch(setShowCCAvenue(false));

      if (addressType === billing_address) {
        dispatch(setBillingAreas(null));
      } else if (addressType === shipping_address) {
        dispatch(setShippingAreas(null));
      }
    }

    if (deliveryType?.id === 0) {
      dispatch(setSelectedArea(null));

      if (e.target.value) {
        const key = getKeyByValue(states, e.target.value);
        updateBillingInfo(key, e.target.name, addressType);
        dispatch(setLoading(true));
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/store-areas`,
            {
              business_url: BusinessURL,
              app_token: app_token,
              store_id: activeStore.id,
              state_id: key,
            },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          )
          .then((response) => {
            if (addressType === billing_address) {
              if (response.data.data.length > 0) {
                dispatch(setBillingAreas(response.data.data));
              }
            } else if (addressType === shipping_address) {
              dispatch(setShippingAreas(response.data.data));
            }
            dispatch(setLoading(false));
          })
          .catch((err) => {
            console.log(err);
            dispatch(setLoading(false));
          });
      }
    }
  };

  const handleAreaSelection = (e, addressType) => {
    const stateId = billing[addressType].state;
    const areaId = e.target.value;
    const areaName = e.target.name;

    dispatch(setShowCCAvenue(false));
    dispatch(setDeliveryInfo(null));

    updateBillingInfo(areaId, areaName, addressType);
    if (e.target.value === "") {
      dispatch(setDeliveryInfo(null));
    } else {
      getDeliveryInfo(areaId, stateId);
    }
  };

  const handleKeepUpdated = (addressType) => {
    const newInfo = { ...billing };
    const newAddress = { ...newInfo[addressType] };
    newAddress.is_subscribed = !newAddress.is_subscribed;
    newInfo[addressType] = newAddress;
    if (newInfo.same_billing_address === true) {
      newInfo[billing_address] = newAddress;
    }
    dispatch(updateShippingInfo(newInfo));
  };

  const handlePaymentTypeSelection = (type) => {
    setPaymentError(null);
    dispatch(setSelectedPaymentType(type));
    if (type === 1) {
      dispatch(setShowCCAvenue(false));
    }
  };

  const placeOrder = () => {
    if (SelectedPaymentType === 1) {
      dispatch(setRedirected(false));
      history.push(`/${BusinessURL}/getOTP`);
    } else if (SelectedPaymentType === 3) {
      dispatch(setShowCCAvenue(true));
    }
  };

  const handleDisable = (e) => {
    e.target.disabled = true;
    setTimeout(() => {
      e.target.disabled = false;
    }, 3000);
  };

  const handleOrderPlacement = (e) => {
    e.preventDefault();
    handleDisable(e);

    //check phone length
    if (
      SelectedPaymentType === null ||
      phoneNumLength.shippingPhoneLength < 10 ||
      phoneNumLength.shippingPhoneLength > 15 ||
      phoneNumLength.billingPhoneLength < 10 ||
      phoneNumLength.billingPhoneLength > 15 ||
      AreaApiError !== ""
    ) {
      if (SelectedPaymentType === null) {
        setPaymentError("Please select a payment type");
      }
      if (phoneNumLength.shippingPhoneLength < 10 || phoneNumLength.shippingPhoneLength > 15) {
        setShippingPhoneError("Phone number must contain 10 to 15 digits");
        Scroll.scroller.scrollTo("phone", {});
      }
      if (phoneNumLength.billingPhoneLength < 10 || phoneNumLength.billingPhoneLength > 15) {
        setBillingPhoneError("Phone number must contain 10 to 15 digits");
        Scroll.scroller.scrollTo("phone", {});
      }
      if (AreaApiError !== "") {
        animateScrollToTop();
      }

      return;
    }

    // check phone validity
    const shippingPhone = billing?.shipping_address?.phone;
    const billingPhone = billing?.billing_address?.phone;

    const isShippingPhoneValid = validatePhoneNumber(shippingPhone);
    const isBillingPhoneValid = validatePhoneNumber(billingPhone);

    if (!isShippingPhoneValid || !isBillingPhoneValid) {
      if (!isShippingPhoneValid) {
        setShippingPhoneError("Phone number must contain only digits");
        Scroll.scroller.scrollTo("phone", {});
      }
      if (phoneNumLength.billingPhoneLength < 10 || phoneNumLength.billingPhoneLength > 15) {
        setBillingPhoneError("Phone number must contain only digits");
        Scroll.scroller.scrollTo("phone", {});
      }

      return;
    }

    // validate data through API
    const payment = getPaymentData();
    const data = getOrderData(payment);

    axios
      .post(`${process.env.REACT_APP_API_URL}/orders/validate`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === true) {
          // if data varified, move to order placement
          placeOrder();
        } else {
          setDataValidationError("Invalid data ");
        }
      })
      .catch((err) => {
        console.log(err);
        const errorMessage = Object.values(err?.response?.data?.errors)[0][0];
        setDataValidationError(errorMessage);
      });
  };

  return (
    <div className="tab-pane fade" id="shipAy" role="tabpanel" aria-labelledby="shipAy-tab">
      <form
        name="checkoutform"
        id="checkoutform"
        onSubmit={(e) => {
          handleOrderPlacement(e);
          return false;
        }}
      >
        <div className="row">
          {/* <ShippingInformation /> */}
          <div className="col-xl-8">
            <div className="card-repeat mt-4 mb-4">
              {/* <AddressForm props={{ type: "shipping_address" }} /> */}
              <div className="top-flexer margin-inner">
                <h6 className="darkcolor font-weight-700">Shipping Information</h6>
              </div>
              <hr className="mt-0 mobile-hide" />
              <div className="row padding-inner">
                <div className="col-md-6 form-group">
                  <label>Email</label>
                  <input
                    value={billing.shipping_address.email && billing.shipping_address.email}
                    name="email"
                    type="email"
                    placeholder=""
                    className="form-control sm-control"
                    onChange={(e) => handleShipInfoChange(e, shipping_address)}
                    required={with_email === 1 ? true : false}
                  />

                  <div className="form-group custom-checkbox mb-0 mt-2">
                    <input
                      name="is_subscribed"
                      type="checkbox"
                      className="custom-control-input"
                      checked={billing.shipping_address.is_subscribed}
                      readOnly={true}
                    />
                    <label
                      className="custom-control-label w-100 h-100 pl-4"
                      htmlFor="is_subscribed"
                      name="is_subscribed"
                      onClick={() => {
                        handleKeepUpdated(shipping_address);
                      }}
                    >
                      <small className="ml-2">keep me update on news & Exclusive offers</small>
                    </label>
                  </div>
                </div>
                <div className="col-md-6 form-group">
                  <label>Name</label>
                  <input
                    value={billing.shipping_address.name && billing.shipping_address.name}
                    name="name"
                    type="text"
                    placeholder=""
                    className="form-control sm-control"
                    onChange={(e) => handleShipInfoChange(e, shipping_address)}
                    required={true}
                  />
                </div>
                {/* {deliveryType && deliveryType.id === 1 && ( */}
                <div className="col-md-6 form-group">
                  <label>City</label>
                  <div className="form-icon">
                    <select
                      name="state"
                      className="form-control sm-control"
                      required={true}
                      disabled={loadingState}
                      onChange={(e) => handleStateSelection(e, shipping_address)}
                    >
                      <option selected value="">
                        Select
                      </option>
                      {deliveryType && deliveryType.id === 1
                        ? aramexCities &&
                          aramexCities.map((city) => {
                            return (
                              <option key={city.id} value={city.id}>
                                {city.title}
                              </option>
                            );
                          })
                        : ownDeliveryStates &&
                          Object.keys(ownDeliveryStates).map((obj, index) => {
                            return (
                              <option key={index} value={ownDeliveryStates[obj]}>
                                {ownDeliveryStates[obj]}
                              </option>
                            );
                          })}
                    </select>
                    <span className="form-icon-ico">
                      <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/arrow-down.png`} />
                    </span>
                  </div>
                </div>
                {/* )} */}
                <div className="col-md-6 form-group">
                  <label>Area</label>
                  <div className="form-icon">
                    <select
                      name="area"
                      className="form-control sm-control"
                      required={true}
                      onChange={(e) => {
                        handleAreaSelection(e, shipping_address);
                      }}
                      disabled={(shippingAreas === null && deliveryType?.id !== 1) || loadingState ? true : false}
                    >
                      <option selected value="">
                        Select
                      </option>
                      {deliveryType && deliveryType.id === 1
                        ? areas &&
                          areas.map((area) => {
                            return (
                              <option key={area.id} value={area.id}>
                                {area.area}
                              </option>
                            );
                          })
                        : storeAreas &&
                          storeAreas.map((obj, index) => {
                            return (
                              <option key={index} value={obj.id}>
                                {obj.title}
                              </option>
                            );
                          })}
                    </select>
                    <span className="form-icon-ico">
                      <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/arrow-down.png`} />
                    </span>
                  </div>
                  <p className="text--danger">{AreaApiError}</p>
                </div>
                <div className="col-md-6 form-group">
                  <label>Address</label>
                  <input
                    value={billing.shipping_address.address && billing.shipping_address.address}
                    name="address"
                    type="text"
                    placeholder=""
                    className="form-control sm-control"
                    required={true}
                    onChange={(e) => handleShipInfoChange(e, shipping_address)}
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Company (optional)</label>
                  <input
                    value={billing.shipping_address.company && billing.shipping_address.company}
                    name="company"
                    type="text"
                    placeholder=""
                    className="form-control sm-control"
                    onChange={(e) => handleShipInfoChange(e, shipping_address)}
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Phone</label>
                  <input
                    value={billing.shipping_address.phone && billing.shipping_address.phone}
                    name="phone"
                    type="number"
                    placeholder=""
                    minLength={10}
                    className="form-control sm-control"
                    required={(with_mobile === 1 && SelectedPaymentType === 3) || SelectedPaymentType === 1 ? true : false}
                    onChange={(e) => handleShipInfoChange(e, shipping_address)}
                  />
                  <p className="text--danger">{shippingPhoneError}</p>
                </div>
                <div className="col-md-6 form-group">
                  <label>Zip</label>
                  <input
                    value={billing.shipping_address.zip && billing.shipping_address.zip}
                    name="zip"
                    type="text"
                    placeholder=""
                    className="form-control sm-control"
                    onChange={(e) => handleShipInfoChange(e, shipping_address)}
                  />
                </div>
              </div>
              <hr className="mt-0" />
              <div className="row padding-inner">
                <div className="col-12">
                  <h6 className="darkcolor font-weight-700">Billing Address</h6>
                </div>
              </div>
              <hr className="mt-3" />
              <div className="form-group custom-checkbox padding-inner mb-5">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="sShipping"
                  name="tab"
                  disabled={allow_change_billing === 1 ? false : true}
                  defaultChecked={billing.same_billing_address}
                />
                <label
                  className="custom-control-label w-100 h-100 pl-4"
                  htmlFor="sShipping"
                  onClick={() => updateInfo(!billing.same_billing_address)}
                  style={allow_change_billing !== 1 ? { pointerEvents: "none" } : null}
                >
                  <span className="ml-2">Same as shipping address</span>
                </label>
              </div>
              {billing.same_billing_address === false ? (
                <div className="row padding-inner">
                  <div className="col-md-6 form-group">
                    <label>Email</label>
                    <input
                      value={billing.billing_address.email && billing.billing_address.email}
                      name="email"
                      type="email"
                      placeholder=""
                      className="form-control sm-control"
                      onChange={(e) => handleShipInfoChange(e, billing_address)}
                      required={billing.same_billing_address === false && with_email === 1 ? true : false}
                    />
                    <div className="form-group custom-checkbox mb-0 mt-2">
                      <input
                        name="KUpate"
                        type="checkbox"
                        className="custom-control-input"
                        checked={billing.billing_address.is_subscribed}
                        readOnly={true}
                      />
                      <label
                        className="custom-control-label w-100 h-100 pl-4"
                        htmlFor="is_subscribed"
                        name="is_subscribed"
                        onClick={() => {
                          handleKeepUpdated(billing_address);
                        }}
                      >
                        <small className="ml-2">keep me update on news & Exclusive offers</small>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Name</label>
                    <input
                      value={billing.billing_address.name && billing.billing_address.name}
                      name="name"
                      type="text"
                      placeholder=""
                      className="form-control sm-control"
                      onChange={(e) => handleShipInfoChange(e, billing_address)}
                      required={billing.same_billing_address === false ? true : false}
                    />
                  </div>
                  {deliveryType && deliveryType.id !== 1 && (
                    <div className="col-md-6 form-group">
                      <label>City</label>
                      <div className="form-icon">
                        <select
                          name="state"
                          className="form-control sm-control"
                          required={billing.same_billing_address === false ? true : false}
                          onChange={(e) => handleStateSelection(e, billing_address)}
                        >
                          <option selected value="">
                            Select
                          </option>
                          {deliveryType && deliveryType.id === 1
                            ? aramexCities &&
                              aramexCities.map((city) => {
                                return (
                                  <option key={city.id} value={city.id}>
                                    {city.title}
                                  </option>
                                );
                              })
                            : ownDeliveryStates &&
                              Object.keys(ownDeliveryStates).map((obj, index) => {
                                return (
                                  <option key={index} value={ownDeliveryStates[obj]}>
                                    {ownDeliveryStates[obj]}
                                  </option>
                                );
                              })}
                        </select>
                        <span className="form-icon-ico">
                          <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/arrow-down.png`} />
                        </span>
                      </div>
                    </div>
                  )}
                  {/* <div className="col-md-6 form-group">
                    <label>Area</label>
                    <div className="form-icon">
                      <select
                        name="area"
                        className="form-control sm-control"
                        required={
                          billing.same_billing_address === false ? true : false
                        }
                        disabled={billingAreas === null ? true : false}
                      >
                        <option value="">Select</option>
                        {billingAreas &&
                          billingAreas.map((obj, index) => {
                            return (
                              <option
                                key={index}
                                onClick={() => {
                                  handleAreaSelection(obj, billing_address);
                                }}
                                value={obj.title}
                              >
                                {obj.title}
                              </option>
                            );
                          })}
                      </select>
                      <span className="form-icon-ico">
                        <img
                          alt=""
                          src={`${process.env.REACT_APP_URL}/assets/images/arrow-down.png`}
                        />
                      </span>
                    </div>
                  </div> */}
                  <div className="col-md-6 form-group">
                    <label>Address</label>
                    <input
                      value={billing.billing_address.address && billing.billing_address.address}
                      name="address"
                      type="text"
                      placeholder=""
                      className="form-control sm-control"
                      required={billing.same_billing_address === false ? true : false}
                      onChange={(e) => handleShipInfoChange(e, billing_address)}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Company (optional)</label>
                    <input
                      value={billing.billing_address.company && billing.billing_address.company}
                      name="company"
                      type="text"
                      placeholder=""
                      className="form-control sm-control"
                      onChange={(e) => handleShipInfoChange(e, billing_address)}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Phone</label>
                    <input
                      value={billing.billing_address.phone && billing.billing_address.phone}
                      name="phone"
                      type="number"
                      minLength={10}
                      placeholder=""
                      className="form-control sm-control"
                      required={billing.same_billing_address === false && with_mobile === 1 ? true : false}
                      onChange={(e) => handleShipInfoChange(e, billing_address)}
                    />
                    <p className="text--danger">{billingPhoneError}</p>
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Zip</label>
                    <input
                      value={billing.billing_address.zip && billing.billing_address.zip}
                      name="zip"
                      type="text"
                      placeholder=""
                      // required={
                      //   billing.same_billing_address === false ? true : false
                      // }
                      className="form-control sm-control"
                      onChange={(e) => handleShipInfoChange(e, billing_address)}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <OrderDetails />
          {!paymentTypes ? null : (
            <div className="col-xl-8">
              <div className="card-repeat mb-5">
                <div className="top-flexer margin-inner">
                  <h6 className="darkcolor font-weight-700">Payment Method</h6>
                </div>
                <hr className="mt-0 mb-4" />
                <div className="margin-inner">
                  <table className="table table-web table-cash">
                    <tbody>
                      <tr>
                        {cash_payment === 1 && (
                          <>
                            <td>
                              <div className="form-group custom-control custom-radio mb-0">
                                <input
                                  type="radio"
                                  id="cCOD"
                                  name="customRadio"
                                  className="custom-control-input"
                                  defaultChecked={SelectedPaymentType === 1 ? true : false}
                                />
                                <label
                                  className="custom-control-label w-100 h-100 pl-4"
                                  htmlFor="cCOD"
                                  onClick={() => {
                                    handlePaymentTypeSelection(1);
                                  }}
                                >
                                  <span className="darkcolor font-weight-700 ml-2 h6">{paymentTypes[1]}</span>
                                </label>
                              </div>
                            </td>
                            <td>
                              <p className="table-text text-right">
                                <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/cash.png`} />
                              </p>
                            </td>
                          </>
                        )}
                      </tr>
                      <tr>
                        {card_payment === 1 && (
                          <>
                            <td>
                              <div className="form-group custom-control custom-radio mb-0">
                                <input
                                  type="radio"
                                  id="cCRD"
                                  name="customRadio"
                                  className="custom-control-input"
                                  defaultChecked={SelectedPaymentType === 3 ? true : false}
                                />
                                <label
                                  className="custom-control-label w-100 h-100 pl-4"
                                  htmlFor="cCRD"
                                  onClick={() => {
                                    handlePaymentTypeSelection(3);
                                  }}
                                >
                                  <span className="darkcolor font-weight-700 ml-2 h6">
                                    Card Payment
                                    {/* {paymentTypes[3]} */}
                                  </span>
                                </label>
                              </div>
                            </td>
                            <td>
                              <p className="table-text text-right">
                                <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/card.png`} />
                              </p>
                            </td>
                          </>
                        )}
                      </tr>
                    </tbody>
                  </table>
                  {PaymentError && <p className="error-msg">{PaymentError}</p>}
                  {showCCAvenue === true && (
                    <>
                      <PaymentForm />
                      {/* {redirectedFromCCAvenue === true && (
                        <p className="error-msg">
                          Your payment could not be processed. Please Try again
                        </p>
                      )} */}
                    </>
                  )}
                  {showCCAvenue === false && (
                    <div className="form-group mt-5 mb-0 pb-5 mobile-hide">
                      <input
                        disabled={loadingState}
                        type="submit"
                        className="btn-size btn-rounded btn--primary btn-md mt-3"
                        value="PLACE ORDER"
                        style={getButtonStyle(loadingState)}
                      />
                      {dataValidationError !== "" && <p className="text--danger">{dataValidationError}</p>}
                    </div>
                  )}
                </div>
              </div>

              {showCCAvenue === false && (
                <div className="desktop-hide padding-inner mobile-cart-shower">
                  <input
                    disabled={loadingState}
                    type="submit"
                    id="checkOutSubmit"
                    className="btn-size btn-rounded btn--primary w-100"
                    value="PLACE ORDER"
                    style={getButtonStyle(loadingState)}
                  />
                  {dataValidationError !== "" && <p className="text--danger">{dataValidationError}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
