import { getProductsDiscountValue, getTotalPrices } from "../../../../Cart/PricesHelper";
import $ from "jquery";
import * as Scroll from "react-scroll";
import store from "../../../../../Store/store";
import { app_token } from "./../../../../../App_Token";
import { getCartStatus } from "../../../../Home/HomeHelpers";
import { getActiveStore } from "./../../../../Home/HomeHelpers";
import axios from "./../../../../../library/axios";
import { setAreaApiError, setDeliveryInfo, updateShippingInfo } from "../../../CheckOutSlice";
import { setLoading } from "../../../../Layout/LayoutSlice";

var validator = require("email-validator");

export const getCartItemsforOrder = (cartStatus) => {
  const cart = cartStatus.map((obj) => {
    return {
      category_id: obj.product.category_id,
      product_id: obj.product.id,
      qty: obj.product.quantity,
      price: obj.product.price.total / obj.product.quantity,
      discount: 0,
      total: obj.product.price.total,
      selectedVariant: obj.variant,
      addOns: obj.addOns,
    };
  });
  return cart;
};

export const getCartItemsforDiscount = (cartStatus) => {
  const cart = cartStatus.map((obj) => {
    return {
      product_id: obj.product.id,
      qty: obj.product.quantity,
      price: obj.product.price.total / obj.product.quantity,
    };
  });
  return cart;
};

export const getItemsQuantityforDiscount = (cartStatus) => {
  const total_qty = cartStatus
    .map((obj) => {
      return obj.product.quantity;
    })
    .reduce(function (a, b) {
      return Number(a) + Number(b);
    }, 0);
  return total_qty;
};

export const toggleTabs = () => {
  $("#orderSummary-tab").toggleClass("active");
  $("#shipAy-tab").toggleClass("active");
  $("#orderSummary-tab").attr("aria-selected", "false");
  $("#shipAy-tab").attr("aria-selected", "true");
  $("#orderSummary").toggleClass("show");
  $("#shipAy").toggleClass("show");
  $("#orderSummary").toggleClass("active");
  $("#shipAy").toggleClass("active");
  Scroll.animateScroll.scrollToTop();
};

export const getOrderPrices = (total_prices, tip, discount, tax, tax_inclusive, deliveryInfo) => {
  const stores = store.getState().homepage.Stores;
  const cart = store.getState().Cart.products;
  const cartStatus = getCartStatus(stores, cart);
  const products_discount = getProductsDiscountValue(cartStatus);
  const deliveryCharges = deliveryInfo ? deliveryInfo.delivery_charges : 0;

  discount = products_discount > 0 ? products_discount : discount;

  const total = Number(((total_prices - discount) * (1 + tax / 100) + Number(tip) + deliveryCharges).toFixed(1));

  return {
    subtotal: Number(total_prices),
    tip: Number(tip),
    discount: Number(discount),
    tax: tax_inclusive === 0 ? Number(((total_prices - discount + deliveryCharges) * (tax / 100)).toFixed(1)) : 0,
    shipping: Number(deliveryCharges),
    total: total,
  };
};

export const getOrderData = (paymentStatus) => {
  const stores = store.getState().homepage.Stores;
  const cart = store.getState().Cart.products;
  const cartStatus = getCartStatus(stores, cart);
  const ActiveStore = getActiveStore(stores);
  const billing = store.getState().Checkout.shippingInfo;
  const Gift = store.getState().Cart.gift;
  const tax = store.getState().Cart.tax;
  const Comment = store.getState().Checkout.additional_comment;
  const Discount = store.getState().Cart.discount;
  const discountCode = store.getState().Checkout.discount_code;
  const tip = store.getState().Checkout.TipAmount;
  const businessInfo = store.getState().homepage.businessInfo;
  const activeStore = getActiveStore(stores);
  const deliveryType = activeStore?.delivery_company;
  const total_prices = getTotalPrices(cartStatus);
  const deliveryInfo = store.getState().Checkout.DeliveryInfo;
  const shipping = deliveryInfo?.delivery_charges;
  const checkout_setting = businessInfo && businessInfo.checkout_setting;
  const tax_inclusive = checkout_setting && checkout_setting.tax_inclusive ? Number(checkout_setting.tax_inclusive) : 1;

  const orderPrices = getOrderPrices(
    total_prices,
    tip,
    Discount,
    tax,
    tax_inclusive,
    // shipping
    deliveryInfo
  );
  const subtotal = orderPrices.subtotal + orderPrices.shipping;
  const data = {
    app_token: app_token,
    cart: getCartItemsforOrder(cartStatus),
    shippingInfo: billing,
    discount_code: discountCode,
    store_id: ActiveStore.id,
    delivery_charges: shipping,
    delivery_company_id: deliveryType.id,
    subtotal: subtotal,
    total: orderPrices.total,
    tax: orderPrices.tax,
    tip: orderPrices.tip,
    discount: orderPrices.discount,
    is_gift: Gift,
    customer_notes: Comment,
    payment: paymentStatus,
    delivery_type: deliveryType.type,
  };
  return data;
};

export const variant_label = (cart_item) => {
  const variant_options = {
    product_variants: Object.keys(cart_item.product.product_variants).map((obj) => {
      return obj;
    }),
    variant: cart_item.variant && cart_item.variant.name.split("/"),
  };
  return variant_options.product_variants
    .map((obj, index) => {
      return `${obj} : ${variant_options.variant[index]}`;
    })
    .map((obj) => {
      return (
        <span className="d-table-cell pr-3" key={`variantlable${obj}`}>
          {obj}
        </span>
      );
    });
};

export const getPhoneNumLength = (billing) => {
  const shippingPhone = billing.shipping_address.phone;
  const billingPhone = billing.billing_address.phone;

  return {
    shippingPhoneLength: shippingPhone ? shippingPhone.length : 0,
    billingPhoneLength: billingPhone ? billingPhone.length : 0,
  };
};

export const getCheckOutSettings = () => {
  const businessInfo = store.getState().homepage.businessInfo;
  const checkout_setting = businessInfo && businessInfo.checkout_setting;

  const getSettingValue = (parameter) => {
    return checkout_setting && checkout_setting[parameter] ? Number(checkout_setting[parameter]) : 1;
  };

  return {
    with_mobile: getSettingValue("with_mobile"),
    with_email: getSettingValue("with_email"),
    tip_option: getSettingValue("tip_option"),
    allow_change_billing: getSettingValue("allow_change_billing"),
    cash_payment: getSettingValue("cash_payment"),
    card_payment: getSettingValue("card_payment"),
    tax_inclusive: getSettingValue("tax_inclusive"),
  };
};

export const getBrandColors = () => {
  const businessInfo = store.getState().homepage.businessInfo;
  const brandColors =
    businessInfo && businessInfo.businessColors
      ? businessInfo.businessColors
      : {
          background: "black",
          color: "white",
        };

  return brandColors;
};

export function resetAreaSelection() {
  const billing = store.getState().Checkout.shippingInfo;

  const newInfo = { ...billing };
  const newAddress = { ...newInfo.shipping_address };
  newAddress.area = "";

  if (newInfo.same_billing_address === true) {
    newInfo.billing_address = newAddress;
  }
  store.dispatch(updateShippingInfo(newInfo));
}

export const getDeliveryInfo = (areaID, stateId) => {
  store.dispatch(setAreaApiError(""));

  console.log(areaID);

  const stores = store.getState().homepage.Stores;
  const activeStore = getActiveStore(stores);
  const cart = store.getState().Cart.products;
  const cartStatus = getCartStatus(stores, cart);
  const deliveryType = activeStore?.delivery_company;
  const aramexCities = store.getState().homepage.businessInfo.aramex_cities;
  const accessToken = store.getState().homepage.businessInfo.accessToken;

  if (deliveryType.id === 1) {
    const activeState = aramexCities.find((state) => {
      return state.id === Number(stateId);
    });

    console.log(activeState);

    const activeArea = activeState.areas.find((area) => {
      return area.id === Number(areaID);
    });

    const totalQuantity = getItemsQuantityforDiscount(cartStatus);
    store.dispatch(setLoading(true));
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/calculate_rate`,
        {
          city: activeState.title,
          area: activeArea.area,
          app_token: app_token,
          number_of_products: totalQuantity,
          store_id: activeStore.id,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        console.log(response);
        store.dispatch(setLoading(false));
        if (response.data.status === true) {
          const deliveryInfo = {
            delivery_charges: response.data.data,
            delivery_comapny_id: deliveryType.id,
          };
          store.dispatch(setDeliveryInfo(deliveryInfo));
        }
        if (response.data.status === false) {
          store.dispatch(setAreaApiError("Request failed: Please try again"));
        }
      })
      .catch((err) => {
        console.log(err);
        store.dispatch(setLoading(false));
        store.dispatch(setAreaApiError("Request failed: Please try again"));
      });
  }
  if (deliveryType.id === 0) {
    const shippingAreas = store.getState().Checkout.shippingAreas;
    const selectedArea = shippingAreas.find((area) => {
      return area.id === Number(areaID);
    });
    const deliveryInfo = {
      delivery_charges: Number(selectedArea.zone[0].charges),
      delivery_comapny_id: selectedArea.zone[0].delivery_company_id,
    };
    store.dispatch(setDeliveryInfo(deliveryInfo));
  }
};

export const validateEmail = () => {
  const billing = store.getState().Checkout.shippingInfo;
  console.log(billing);
  const email = billing.billing_address.email;
  console.log(email);
  const result = validator.validate(email);
  console.log(result);
  // var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  // if (email.match(validRegex)) {
  //   console.log(true);
  //   return true;
  // } else {
  //   console.log(false);
  //   return false;
  // }
};

export const getPaymentData = () => {
  const payment = {
    type: 1,
    payment_method_id: 1,
    payment_status: "Pending",
  };

  return payment;
};

export const validatePhoneNumber = (phone) => {
  var numbers = /^[0-9]+$/;

  if (phone.match(numbers)) {
    return true;
  } else {
    return false;
  }
};
