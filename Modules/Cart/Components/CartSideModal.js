import { React } from "react";
import $ from "jquery";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { businessInfoSelector, businessUrlSelector } from "../../Home/HomeSlice";
import { getTotalPrices } from "./../PricesHelper";
import CartData from "./CartData";
import { getCartStatus } from "../../Home/HomeHelpers";
import { CartDiscountSelector, CartProductsSelector } from "../CartSlice";
import { storesSelector } from "./../../Home/HomeSlice";

export default function CartSideModal() {
  const stores = useSelector(storesSelector);
  const cart = useSelector(CartProductsSelector);
  const cartStatus = getCartStatus(stores, cart);
  const businessUrl = useSelector(businessUrlSelector);
  const discount = useSelector(CartDiscountSelector);
  const total_prices = getTotalPrices(cartStatus);

  const businessInfo = useSelector(businessInfoSelector);
  const brandColors = businessInfo && businessInfo.businessColors;

  return (
    <>
      {/* <!-- Cart Side Modal --> */}
      <div className="right-modal bg-light cart-modal scroll-bar-thin">
        <div className="panel-top">
          <h3 className="dark-one font-weight-700">Shopping Cart</h3>
          <span
            className="cart-opener right-modal-dismiss"
            onClick={() => {
              $("body").toggleClass("cart-modal-open");
            }}
          >
            <i></i> <i></i>
          </span>
        </div>
        {cartStatus?.length === 0 ? null : (
          <div className="panel-top mt-2">
            <>
              <h3 className="dark-one font-weight-400">Subtotal</h3>
              <h3 className="text--primary font-weight-700" style={{ color: brandColors?.background }}>
                {`AED ${total_prices - discount} `}
              </h3>
              <Link
                to={`/${businessUrl}/checkout`}
                className="btn-size btn-rounded btn--primary btn-large text-uppercase"
                onClick={() => $("body").toggleClass("cart-modal-open")}
                style={brandColors}
              >
                CHECKOUT
              </Link>
            </>
          </div>
        )}

        <div className="padding-inner">
          <CartData />
        </div>
      </div>
    </>
  );
}
