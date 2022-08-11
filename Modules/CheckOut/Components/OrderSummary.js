import { React, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CartDiscountSelector, CartGiftStatusSelector, CartProductsSelector, CartTaxSelector, setGift } from "../../Cart/CartSlice";
import { businessUrlSelector, storesSelector } from "./../../Home/HomeSlice";
import { getTotalPrices, productPriceExp } from "./../../Cart/PricesHelper";
import { commentSelector, redirectedFromCCAvenueSelector, saveComment, tipAmountSelector } from "../CheckOutSlice";
import $ from "jquery";
import VerifyDiscount from "./Shipping&Payment/Components/VerifyDiscount";
import { useHistory } from "react-router";
import { getBrandColors, getCheckOutSettings, getOrderPrices, toggleTabs, variant_label } from "./Shipping&Payment/Components/OrderHelper";
import { getCartStatus } from "../../Home/HomeHelpers";
import AddTip from "./Shipping&Payment/Components/AddTip";
import DeleteButton from "../../Cart/Components/DeleteButton";
import { getCartItemImage } from "../../Product-Details/ProductDetailsHelpers";

export default function OrderSummary() {
  const stores = useSelector(storesSelector);
  const cart = useSelector(CartProductsSelector);
  const cartStatus = getCartStatus(stores, cart);
  const businessUrl = useSelector(businessUrlSelector);
  const Discount = useSelector(CartDiscountSelector);
  const Gift = useSelector(CartGiftStatusSelector);
  const Tax = useSelector(CartTaxSelector);
  const Comment = useSelector(commentSelector);
  const tip = useSelector(tipAmountSelector);
  const brandColors = getBrandColors();
  const checkOutSettings = getCheckOutSettings();
  const tax_inclusive = checkOutSettings.tax_inclusive;
  const tip_option = checkOutSettings.tip_option;

  const redirectedFromCCAvenue = useSelector(redirectedFromCCAvenueSelector);

  const dispatch = useDispatch();
  const history = useHistory();

  const total_prices = getTotalPrices(cartStatus);

  useEffect(() => {
    if (redirectedFromCCAvenue === true) {
      toggleTabs();
    }
  }, [redirectedFromCCAvenue]);

  useEffect(() => {
    if (cartStatus?.length === 0) {
      history.push(`/${businessUrl}`);
    }
  }, [cartStatus, history, businessUrl]);

  const orderPrices = getOrderPrices(total_prices, tip, Discount, Tax, tax_inclusive);

  // console.log(orderPrices);

  return (
    <div className="tab-pane fade show active" id="orderSummary" role="tabpanel" aria-labelledby="orderSummary-tab">
      <div className="row">
        <div className="col-xl-8">
          <div className="card-repeat mt-4 mb-4">
            <div className="top-flexer margin-inner">
              <h6 className="darkcolor font-weight-700">In Your Cart</h6>
              <div className="mobile-hide">
                <button
                  type="button"
                  className="text--danger font-weight-700 editcart mobile-hide"
                  onClick={() => {
                    $("body").toggleClass("cart-modal-open");
                  }}
                >
                  <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/arrow-backR.png`} />
                  Edit Cart
                </button>
              </div>
              <div className="desktop-hide">
                <Link className="text--danger font-weight-700 editcart desktop-hide" to={`/${businessUrl}/cart`}>
                  <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/arrow-backR.png`} />
                  Edit Cart
                </Link>
              </div>
            </div>
            <div className="table-responsive scroll-bar-thin">
              <table className="table table-web mb-0">
                <thead>
                  <tr>
                    <th scope="col">item</th>
                    <th scope="col">qty</th>
                    <th scope="col">total</th>
                    <th scope="col" style={{ width: 100 }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartStatus &&
                    cartStatus.map((obj, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <div className="table-flex">
                              <div className="table-img">
                                <img alt="" src={getCartItemImage(obj)} />
                              </div>
                              <div className="table-txt">
                                <strong className="dark-one d-block mb-1 cart-pro-title">
                                  <Link
                                    to={{
                                      pathname: `/${businessUrl}/product-detail/${obj.product.category_id}/${obj.product.id}`,
                                    }}
                                  >
                                    {obj.product.title}
                                  </Link>
                                </strong>
                                <p className="d-table mobile-tbl-color mt-2 mb-2">
                                  {
                                    obj.product.has_addons_or_variants === 2 && variant_label(obj)
                                    // variant_label(obj).map((obj) => {
                                    //   return (
                                    //     <span
                                    //       className="d-table-cell pr-3"
                                    //       key={`variantlable${obj}`}
                                    //     >
                                    //       {obj}
                                    //     </span>
                                    //   );
                                    // })
                                  }
                                </p>
                                {/* <p className="mb-1">{obj.product.description}</p> */}
                                <p className="pro-price">
                                  <b>{`AED ${obj.product.price.total / obj.product.quantity}`}</b>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="table-text font-weight-600">{obj.product.quantity}</p>
                          </td>
                          <td>
                            <p className="table-text font-weight-600 cart-pro-price">{productPriceExp(obj)}</p>
                          </td>
                          <td>
                            <div className="table-action text-center">
                              <DeleteButton props={{ type: "checkout", index: index }} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="table-layout">
              <hr className="m-0" />
              <div className="layout-row">
                <p className="table-text">Subtotal</p>
                <p className="table-text text-right">{`AED ${orderPrices && orderPrices.subtotal}`}</p>
              </div>
              <hr className="m-0" />
              <div className="mobile-hide">
                <div className="layout-row">
                  <p className="table-text font-weight-700">Discounts</p>
                  <p className="table-text font-weight-700 text--primary text-right" style={{ color: brandColors?.background }}>
                    {total_prices && `AED ${orderPrices && orderPrices.discount}`}
                  </p>
                </div>
              </div>
              {tip_option === 1 && (
                <>
                  <hr className="m-0" />
                  <div className="mobile-hide">
                    <div className="layout-row">
                      <p className="table-text font-weight-700">Tip Amount</p>
                      <p className="table-text font-weight-700 text--primary text-right" style={{ color: brandColors?.background }}>
                        {total_prices && `AED ${orderPrices && orderPrices.tip}`}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="desktop-hide">
                <div className="layout-row">
                  <div className="form-group mb-3">
                    <p className="table-text font-weight-700 mb-0">Discounts</p>
                    <VerifyDiscount
                      props={{
                        type: "dektop-hide",
                      }}
                    />
                  </div>
                  <p className="table-text font-weight-700 text--primary text-right" style={{ color: brandColors?.background }}>
                    {total_prices && `AED ${orderPrices && orderPrices.discount}`}
                  </p>
                </div>
                {tip_option === 1 && (
                  <div className="layout-row">
                    <div className="form-group mb-3">
                      <p className="table-text font-weight-700 mb-0">Add Tip</p>
                      <AddTip
                        props={{
                          type: "dektop-hide",
                        }}
                      />
                    </div>
                    <p className="table-text font-weight-700 text--primary text-right" style={{ color: brandColors?.background }}>
                      {total_prices && `AED ${orderPrices && orderPrices.tip}`}
                    </p>
                  </div>
                )}
              </div>
              <hr className="m-0" />
              {tax_inclusive === 0 && (
                <>
                  <div className="layout-row">
                    <p className="table-text">Tax @{total_prices && ` ${Tax} %`}</p>
                    <p className="table-text text-right">{`AED ${orderPrices?.tax}`}</p>
                  </div>
                  <hr className="m-0" />
                </>
              )}
              <div className="layout-row">
                <p className="table-text font-weight-700 text-uppercase">TOTAL</p>
                <p className="table-text font-weight-700 text-right">{total_prices && `AED ${orderPrices?.total}`}</p>
              </div>
            </div>
          </div>
          <div className="form-group mt-5 mb-0 pb-5 checkout-comment">
            <label>
              <span className="darkcolor font-weight-700 h6">Additional Comment</span>
            </label>
            <textarea
              placeholder="Type here..."
              className="form-control"
              onChange={(e) => dispatch(saveComment(e.target.value))}
              defaultValue={Comment}
            >
              {/* {Comment} */}
            </textarea>
            {/* <!-- <button type="button" className="btn-size btn-rounded btn--primary btn-md mt-3">Continue</button> --> */}
            <a
              id="shipAy-tab"
              data-toggle="tab"
              href="#shipAy"
              role="tab"
              aria-controls="shipAy"
              aria-selected="false"
              type="button"
              className="nav-link btn-size btn-rounded btn--primary btn-md mt-3 mobile-hide"
              onClick={toggleTabs}
              style={brandColors}
            >
              Continue
            </a>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card-repeat mt-4 mb-4 checkout-comment">
            <div className="top-flexer margin-inner gift-option">
              <h6 className="darkcolor font-weight-700">Gift Options</h6>
            </div>
            <hr className="mb-4 mt-0" />
            <div className="margin-inner pb-4">
              <div className="form-group custom-checkbox mb-0">
                <input type="checkbox" className="custom-control-input" id="checkGift" defaultChecked={Gift} readOnly={false} />
                <label
                  className="custom-control-label w-100 h-100 pl-4"
                  htmlFor="checkGift"
                  onClick={() => {
                    dispatch(setGift());
                  }}
                >
                  <span className="pl-2 h6">This order is a gift</span>
                </label>
              </div>
              <p className="mb-0 ml-4">
                <small>
                  Prices will be removed from packing <br />
                  slip: customs fees still apply.
                </small>
              </p>
            </div>
          </div>
          <div className="card-repeat mt-4 mb-4 mobile-hide">
            <div className="top-flexer margin-inner ">
              <h6 className="darkcolor font-weight-700">Discounts</h6>
            </div>
            <hr className="mb-4 mt-0" />
            <div className="margin-inner pb-4">
              {cartStatus && cartStatus.length > 0 && (
                <VerifyDiscount
                  props={{
                    type: "mobile-hide",
                  }}
                />
              )}
            </div>
          </div>
          {tip_option === 1 && (
            <div className="card-repeat mt-4 mb-4 mobile-hide">
              <div className="top-flexer margin-inner ">
                <h6 className="darkcolor font-weight-700">Add Tip</h6>
              </div>
              <hr className="mb-4 mt-0" />
              <div className="margin-inner pb-4">
                {cartStatus && cartStatus.length > 0 && (
                  <AddTip
                    props={{
                      type: "mobile-hide",
                    }}
                  />
                )}
              </div>
            </div>
          )}
          <div className="desktop-hide padding-inner mobile-cart-shower">
            <a
              id="shipAy-tab"
              data-toggle="tab"
              href="#shipAy"
              role="tab"
              aria-controls="shipAy"
              aria-selected="false"
              type="button"
              className="nav-link btn-size btn-rounded btn--primary w-100"
              onClick={toggleTabs}
              style={brandColors}
            >
              Continue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
