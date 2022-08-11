import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, CartProductsSelector, updateProduct } from "../../Cart/CartSlice";
import { activeProductSelector, setActiveProduct, variantOptionsSelector } from "../ProductDetailsSlice";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual";
import { getButtonStyle, getCartStatus } from "./../../Home/HomeHelpers";
import { storesSelector } from "./../../Home/HomeSlice";
import { getProductPrice } from "./../../Cart/PricesHelper";

export default function AddToCart(props) {
  const dispatch = useDispatch();
  const stores = useSelector(storesSelector);
  const cart = useSelector(CartProductsSelector);
  const cartStatus = getCartStatus(stores, cart);
  const variantOptions = useSelector(variantOptionsSelector);
  const activeProduct = useSelector(activeProductSelector);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (activeProduct.has_addons_or_variants === 2) {
      const activeVariant = activeProduct.variants.filter((obj) => {
        const active = Object.keys(obj.options).map((object) => {
          return obj.options[object];
        });

        return isEqual(active, variantOptions);
      })[0];

      const newProd = { ...activeProduct };
      newProd.variants = activeProduct.variants.map((obj) => {
        const newObj = { ...obj };
        if (activeVariant === undefined) {
          newObj.selected = false;
        } else {
          newObj.selected = obj.id === activeVariant.id ? true : false;
        }

        return newObj;
      });

      newProd.price = getProductPrice(newProd);
      dispatch(setActiveProduct(newProd));
    }
  }, [variantOptions]);

  const selectedAddOns = activeProduct.addons.filter((obj) => {
    return obj.selected === true;
  });

  const activeVariant = activeProduct.variants.find((obj) => {
    return obj.selected === true;
  });

  const getCartProduct = () => {
    const cart_product = {
      product: activeProduct,
      variant: activeVariant,
      addOns: selectedAddOns,
    };

    return cart_product;
  };

  const handleAddProduct = () => {
    setDisable(true);
    setTimeout(() => {
      setDisable(false);
    }, 1000);
    let check;
    if (activeProduct.has_addons_or_variants === 2) {
      check = cartStatus.some((obj) => {
        const c1 = obj.product.id === activeProduct.id;
        const c2 = obj.variant ? obj.product.id === activeProduct.id && obj.variant.id === activeVariant.id : obj.product.id === activeProduct.id;

        return obj.variant ? c2 : c1;
      });
    } else {
      check = cartStatus.some((obj) => {
        return obj.product.id === activeProduct.id && isEqual(obj.addOns, selectedAddOns);
      });
    }

    if (!check) {
      dispatch(addProduct(getCartProduct()));
      toast.success("Item Added Successfully");
    } else {
      const getProductIndex = cartStatus.findIndex((obj) => {
        if (activeProduct.has_addons_or_variants === 2) {
          const c1 = obj.product.id === activeProduct.id;
          const c2 = obj.variant ? obj.product.id === activeProduct.id && obj.variant.id === activeVariant.id : obj.product.id === activeProduct.id;

          return obj.variant ? c2 : c1;
        } else {
          return obj.product.id === activeProduct.id && isEqual(obj.addOns, selectedAddOns);
        }
      });
      const newCartItem = { ...cartStatus[getProductIndex] };
      const newProduct = { ...newCartItem.product };
      newProduct.quantity = cartStatus[getProductIndex].product.quantity + 1;
      newProduct.price = getProductPrice(newProduct);
      newCartItem.product = newProduct;
      dispatch(updateProduct({ index: getProductIndex, product: newCartItem }));
      toast.success("Item updated Successfully");
    }
  };

  return (
    <div className={`form-group mb-0 ${props && props.props}`}>
      <label
        style={{
          visibility: activeProduct.has_addons_or_variants === 2 && activeVariant === undefined && "hidden",
        }}
      >
        {`Sub Total: AED ${activeProduct.price.total}`}
      </label>
      <button
        onClick={handleAddProduct}
        className="btn-size btn-rounded btn--primary w-100 text-uppercase cart-opener"
        disabled={!activeProduct.is_available || (activeProduct.has_addons_or_variants === 2 && activeVariant === undefined) ? true : false}
        style={
          !activeProduct.is_available || (activeProduct.has_addons_or_variants === 2 && activeVariant === undefined)
            ? { background: "#F3F3F3" }
            : getButtonStyle(disable)
        }
      >
        Add To Cart
      </button>
      {!activeProduct.is_available && <p>This product is not available at the moment</p>}
      {activeProduct.has_addons_or_variants === 2 && activeProduct.is_available && activeVariant === undefined && <p> No variant selected </p>}
    </div>
  );
}
