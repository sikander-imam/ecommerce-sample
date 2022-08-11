import { React, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDiscount, CartProductsSelector, setCartProducts } from "../../../../Cart/CartSlice";
import { getProductPrice, getTotalPrices } from "../../../../Cart/PricesHelper";
import { getButtonStyle, getCartStatus } from "../../../../Home/HomeHelpers";
import { accessTokenSelector, storesSelector } from "../../../../Home/HomeSlice";
import { loadingStateSelector, setLoading } from "../../../../Layout/LayoutSlice";
import { app_token } from "./../../../../../App_Token";
import axios from "./../../../../../library/axios";
import { discountCodeSelector, setDiscountCode } from "./../../../CheckOutSlice";
import { getBrandColors, getCartItemsforDiscount, getItemsQuantityforDiscount } from "./OrderHelper";

export default function VerifyDiscount(props) {
  const type = props.props.type;
  const accessToken = useSelector(accessTokenSelector);
  const discount_code = useSelector(discountCodeSelector);
  const loadingState = useSelector(loadingStateSelector);
  const stores = useSelector(storesSelector);
  const cart = useSelector(CartProductsSelector);
  const cartStatus = getCartStatus(stores, cart);
  const [Error, setError] = useState(null);
  const [DiscountSuccess, setDiscountSuccess] = useState(null);
  const brandColors = getBrandColors();

  const dispatch = useDispatch();

  const resetCartDiscounts = () => {
    const newCartItems = cartStatus.map((obj) => {
      const newObj = { ...obj };
      newObj.product = { ...obj.product };
      newObj.product.discount_value = 0;
      newObj.product.price = getProductPrice(newObj.product);
      return newObj;
    });
    dispatch(setCartProducts(newCartItems));
    dispatch(addDiscount(0));
  };

  const applyDiscountToProducts = (discountedProducts) => {
    const newCartItems = cartStatus.map((obj, index) => {
      const newObj = { ...obj };
      newObj.product = { ...obj.product };
      newObj.product.discount_value = discountedProducts[index].discount_value;
      newObj.product.price = getProductPrice(newObj.product);
      return newObj;
    });
    dispatch(setCartProducts(newCartItems));
  };

  const handleDisable = (e) => {
    e.target.disabled = true;
    setTimeout(() => {
      e.target.disabled = false;
    }, 3000);
  };

  const handleDiscount = () => {
    dispatch(setLoading(true));
    setError(null);
    resetCartDiscounts();
    console.log({
      app_token: app_token,
      cart: getCartItemsforDiscount(cartStatus),
      discount_code: discount_code,
      total_qty: getItemsQuantityforDiscount(cartStatus),
      total: getTotalPrices(cartStatus),
    });
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/validate-discount`,
        {
          app_token: app_token,
          cart: getCartItemsforDiscount(cartStatus),
          discount_code: discount_code,
          total_qty: getItemsQuantityforDiscount(cartStatus),
          total: getTotalPrices(cartStatus),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(setLoading(false));
        if (response.data.status === true) {
          setDiscountSuccess("Discount Code Applied Successfully");
          if (response.data.data.discount_type === 1) {
            dispatch(addDiscount(response.data.data.discount_value));
          } else if (response.data.data.discount_type === 2) {
            applyDiscountToProducts(response.data.data.cart);
          }
        } else if (response.data.status === false) {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        setError(err.message);
        dispatch(setLoading(false));
      });
  };

  return (
    <>
      {type === "mobile-hide" ? (
        <>
          <div className="form-group ">
            <input
              type="text"
              placeholder="coupon Code"
              className="form-control sm-control line-control"
              onChange={(e) => {
                setError(null);
                setDiscountSuccess(null);
                dispatch(setDiscountCode(e.target.value));
              }}
            />
          </div>
          <button
            type="button"
            disabled={loadingState}
            className="btn-size btn-rounded btn--primary w-100"
            onClick={(e) => {
              handleDiscount();
              handleDisable(e);
            }}
            style={getButtonStyle(loadingState)}
          >
            Apply
          </button>

          {Error !== null && <p className="error-msg">{Error}</p>}
          {DiscountSuccess !== null && <p className="text-success">{DiscountSuccess}</p>}
        </>
      ) : (
        <>
          <div className="form-icon checkout-discount">
            <input
              type="text"
              className="form-control sm-control"
              placeholder="Enter Code"
              onChange={(e) => {
                setError(null);
                setDiscountSuccess(null);
                dispatch(setDiscountCode(e.target.value));
              }}
            />
            <span
              className="form-icon-ico text--primary"
              onClick={(e) => {
                handleDiscount();
                handleDisable(e);
              }}
              style={{ cursor: "pointer", color: brandColors?.background }}
            >
              Apply
            </span>
          </div>
          {Error !== null && <p className="error-msg">{Error}</p>}
          {DiscountSuccess !== null && <p className="text-success">{DiscountSuccess}</p>}
        </>
      )}
    </>
  );
}
