import { React } from "react";
import { useSelector } from "react-redux";
import { getTotalPrices } from "./../../../../Cart/PricesHelper";
import { CartDiscountSelector, CartProductsSelector, CartTaxSelector } from "./../../../../Cart/CartSlice";
import { tipAmountSelector } from "../../../CheckOutSlice";
import { storesSelector } from "../../../../Home/HomeSlice";
import { getCartStatus } from "../../../../Home/HomeHelpers";
import { getBrandColors, getCheckOutSettings, getOrderPrices } from "./OrderHelper";
import { deliveryInfoSelector } from "./../../../CheckOutSlice";

export default function OrderDetails() {
  const stores = useSelector(storesSelector);
  const cart = useSelector(CartProductsSelector);
  const cartStatus = getCartStatus(stores, cart);
  const total_prices = getTotalPrices(cartStatus);
  const discount = useSelector(CartDiscountSelector);
  const tax = useSelector(CartTaxSelector);

  const brandColors = getBrandColors();
  const checkOutSettings = getCheckOutSettings();
  const tax_inclusive = checkOutSettings.tax_inclusive;
  const tip_option = checkOutSettings.tip_option;
  const deliveryInfo = useSelector(deliveryInfoSelector);
  // const shipping = SelectedArea ? Number(SelectedArea.zone[0].charges) : 0;
  const tip = useSelector(tipAmountSelector);
  // console.log(deliveryInfo);

  const orderPrices = getOrderPrices(
    total_prices,
    tip,
    discount,
    tax,
    tax_inclusive,
    // shipping
    deliveryInfo
  );

  // console.log(orderPrices);
  return (
    <div className="col-xl-4">
      <div className="card-repeat mt-4 mb-4">
        <div className="top-flexer margin-inner">
          <h6 className="darkcolor font-weight-700">Your Order</h6>
        </div>
        <hr className="m-0" />
        <div className="table-layout">
          <div className="layout-row">
            <p className="table-text">Subtotal</p>
            <p className="table-text text-right">{total_prices && `AED ${orderPrices.subtotal}`}</p>
          </div>
          <div className="layout-row">
            <p className="table-text font-weight-700">Discounts</p>
            <p className="table-text font-weight-700 text--primary text-right" style={{ color: brandColors && brandColors.background }}>
              {total_prices && `AED ${orderPrices.discount}`}
            </p>
          </div>
          {tip_option === 1 && (
            <div className="layout-row">
              <p className="table-text">Tip Amount</p>
              <p className="table-text text-right">{total_prices && `AED ${orderPrices.tip}`}</p>
            </div>
          )}
          <div className="layout-row">
            <p className="table-text">Shipping</p>
            <p className="table-text text-right">{`AED ${orderPrices.shipping}`}</p>
          </div>
          <div className="layout-row">
            {tax_inclusive === 0 && (
              <>
                <p className="table-text">Tax {total_prices && `@ ${tax} %`}</p>
                <p className="table-text text-right">{total_prices && `AED ${orderPrices.tax}`}</p>
              </>
            )}
          </div>
          <hr className="mt-0 mb-0 margin-inner" />
          <div className="layout-row">
            <p className="table-text font-weight-700 text-uppercase">TOTAL</p>
            <h3 className="table-text font-weight-700 text--primary text-right" style={{ color: brandColors && brandColors.background }}>
              {total_prices && `AED ${orderPrices.total}`}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
