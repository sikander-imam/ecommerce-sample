import { React } from "react";
import { CartProductsSelector, changeQuantity } from "../CartSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getCartStatus } from "../../Home/HomeHelpers";
import { storesSelector } from "./../../Home/HomeSlice";
import { getProductPrice } from "../PricesHelper";
import "react-popper-tooltip/dist/styles.css";
import DeleteButton from "./DeleteButton";
import { variant_label } from "../../CheckOut/Components/Shipping&Payment/Components/OrderHelper";
import { getCartItemImage } from "../../Product-Details/ProductDetailsHelpers";

export default function CartData() {
  const stores = useSelector(storesSelector);
  const cart = useSelector(CartProductsSelector);
  const cartStatus = getCartStatus(stores, cart);

  const dispatch = useDispatch();

  const handleQuantityChange = (obj, index, value) => {
    const newProduct = { ...obj.product };
    if (value) {
      newProduct.quantity++;
    } else {
      if (newProduct.quantity > 1) {
        newProduct.quantity--;
      }
    }
    newProduct.price = getProductPrice(newProduct);
    dispatch(
      changeQuantity({
        cart_product: {
          product: newProduct,
          variant: obj.variant,
          addOns: obj.addOns,
        },
        index: index,
      })
    );
  };
  return (
    <>
      {cartStatus?.length === 0 ? (
        <p style={{ background: "#F9FAFC" }}>You haven't added any products yet</p>
      ) : (
        cartStatus?.map((obj, index) => {
          return (
            <div className="card mb-3" key={index}>
              <div className="img-thumb">
                <img alt="" src={getCartItemImage(obj)} />
              </div>
              <div className="card-detail pl-3 w-100">
                <div className="d-flex justify-content-between">
                  <h4 className="font-weight-700 darkcolor font-raleway mb-2">{obj.product.title}</h4>
                  <DeleteButton props={{ type: "cart", index: index }} />
                </div>
                <div className="row">
                  <div className="col-6 md-4 form-group">
                    <label>{variant_label(obj)}</label>
                    <div className="input-group quantity-panel">
                      <span className="input-group-btn">
                        <button
                          type="button"
                          className="form-control sm-control minus-btn"
                          data-type="minus"
                          data-field="quant[1]"
                          onClick={() => {
                            handleQuantityChange(obj, index, false);
                          }}
                        >
                          <span>-</span>
                        </button>
                      </span>
                      <input
                        type="text"
                        name="quant[1]"
                        className="form-control sm-control input-number"
                        value={obj.product.quantity}
                        disabled=""
                        readOnly={true}
                      />
                      <span className="input-group-btn">
                        <button
                          type="button"
                          className="form-control sm-control plus-btn"
                          data-type="plus"
                          data-field="quant[1]"
                          onClick={() => {
                            handleQuantityChange(obj, index, true);
                          }}
                        >
                          <span>+</span>
                        </button>
                      </span>
                    </div>
                  </div>
                  <div className="col-6 md-4 form-group text-right">
                    <label>&nbsp;</label>
                    <h4 className="darkcolor font-weight-900 font-lato mt-2">
                      <span>{`AED ${obj.product.price.total}`}</span>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
