import { React } from "react";
import { useSelector } from "react-redux";
import { CartProductsSelector } from "../Cart/CartSlice";
import { getTotalPrices } from "../Cart/PricesHelper";
import { businessInfoSelector, storesSelector } from "../Home/HomeSlice";
import $ from "jquery";
import { getCartStatus } from "../Home/HomeHelpers";
import { CartDiscountSelector } from "./../Cart/CartSlice";
import { resizeWindow } from "../../usejQuery";

export default function CartTrigger() {
  const stores = useSelector(storesSelector);
  const cart = useSelector(CartProductsSelector);
  const discount = useSelector(CartDiscountSelector);
  const cartStatus = getCartStatus(stores, cart);
  const total_prices = getTotalPrices(cartStatus);
  const businessInfo = useSelector(businessInfoSelector);
  const brandColors = businessInfo && businessInfo.businessColors;

  return (
    <div className="cartview mobile-hide">
      <p>
        <span className="sidecarti" style={{ color: brandColors?.background, fontSize: "18px" }}>
          <i className="far fa-shopping-bag" />
        </span>
        &nbsp;
        <span className="font-weight-600 text--primary" style={{ color: brandColors?.background }}>
          Your Cart ({cartStatus?.length})
        </span>
        <span className="font-weight-600 darkcolor" style={{ color: brandColors?.background }}>
          {cartStatus?.length === 0 ? null : `AED ${total_prices - discount} `}
        </span>
      </p>
      <button
        type="button"
        style={brandColors && brandColors}
        className="btn-size btn-rounded btn--primary cart-opener"
        onClick={() => {
          $("body").toggleClass("cart-modal-open");
          resizeWindow();
        }}
      >
        View Cart
      </button>
    </div>
  );
}
