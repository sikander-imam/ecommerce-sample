import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileOptions from "../Home/Components/ProfileOptions";
import { CartDiscountSelector, CartProductsSelector } from "./CartSlice";
import { businessUrlSelector, storesSelector } from "../Home/HomeSlice";
import { getTotalPrices } from "./PricesHelper";
import { Link } from "react-router-dom";
import CartData from "./Components/CartData";
import { setPageRefresh } from "../Layout/LayoutSlice";
import { getCartStatus } from "../Home/HomeHelpers";

export default function CartMobile() {
  const stores = useSelector(storesSelector);
  const cart = useSelector(CartProductsSelector);
  const cartStatus = getCartStatus(stores, cart);
  const businessUrl = useSelector(businessUrlSelector);
  const discount = useSelector(CartDiscountSelector);
  const total_prices = getTotalPrices(cartStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageRefresh(false));
  }, [dispatch]);

  return (
    <main className="wrapper">
      <section id="main-body" className="full-height pl-3 pt-4 pb-70" style={{ minHeight: "600px" }}>
        <div className="container-fluid">
          <div className="mobile-hide">
            <ProfileOptions props={{ searchBar: false }} />
          </div>
          <div className="cart-wrapper">
            {cartStatus.length > 0 && (
              <div className="panel-top mt-2 mb-3">
                <h3 className="dark-one font-weight-400 cart-subtotals">Subtotal</h3>

                <h3 className="text--primary font-weight-700 cart-totals">{`AED ${total_prices - discount} `}</h3>
                <Link to={`/${businessUrl}/checkout`} className="btn-size btn-rounded btn--primary btn-large text-uppercase">
                  CHECKOUT
                </Link>
              </div>
            )}

            <CartData />
          </div>
        </div>
      </section>
    </main>
  );
}
