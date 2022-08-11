import { React, useEffect } from "react";
import { useSelector } from "react-redux";
import { CartDiscountSelector, CartProductsSelector, CartTaxSelector } from "../../../../Cart/CartSlice";
import { deliveryInfoSelector, shippingInfoSelector, tipAmountSelector } from "../../../CheckOutSlice";
import { getTotalPrices } from "../../../../Cart/PricesHelper";
import { storesSelector } from "../../../../Home/HomeSlice";
import { getCartStatus } from "../../../../Home/HomeHelpers";
import { getCheckOutSettings, getOrderPrices } from "./OrderHelper";
import { citiesSelector } from "./../../../../Home/HomeSlice";
const nodeCCAvenue = require("node-ccavenue");

export default function PaymentForm() {
  const states = useSelector(citiesSelector);
  const stores = useSelector(storesSelector);
  const cart = useSelector(CartProductsSelector);
  const cartStatus = getCartStatus(stores, cart);
  const billing = useSelector(shippingInfoSelector);
  const discount = useSelector(CartDiscountSelector);
  const tax = useSelector(CartTaxSelector);
  const checkOutSettings = getCheckOutSettings();
  const tax_inclusive = checkOutSettings.tax_inclusive;
  const deliveryInfo = useSelector(deliveryInfoSelector);
  const tip = useSelector(tipAmountSelector);
  const merchant_id = process.env.REACT_APP_MERCHANT_ID;
  const access_code = process.env.REACT_APP_ACCESS_CODE;
  const Encryption_Key = process.env.REACT_APP_ENCRYPTION_KEY;
  const total_prices = getTotalPrices(cartStatus);

  const orderPrices = getOrderPrices(total_prices, tip, discount, tax, tax_inclusive, deliveryInfo);

  const ccav = new nodeCCAvenue.Configure({
    merchant_id: merchant_id,
    working_key: Encryption_Key,
  });

  const ccAvenue = {
    merchant_id: merchant_id,
    currency: "AED",
    order_id: "978413749",
    redirect_url: "http://localhost:5000/validate-payment-ccavenue",
    // redirect_url: "https://verifypayment.oogo.ae/validate-payment-ccavenue",

    cancel_url: `http://localhost:3000/store/checkout`,
    // cancel_url: `${process.env.REACT_APP_URL}/store/checkout`,

    language: "EN",
    amount: orderPrices.total,
    merchant_param1: "Oogo Pay App",
    billing_name: billing.billing_address && billing.billing_address.name,
    billing_email: billing.billing_address && billing.billing_address.email,
    billing_address: billing.billing_address && billing.billing_address.address,
    billing_city: billing.billing_address && states && states[billing.billing_address.state],
    billing_country: "United Arab Emirates",
    billing_tel: billing.billing_address && billing.billing_address.phone,
    card_type: "CRDC",
    payment_option: "OPTCRDC",
    integration_type: "iframe_normal",
    merchant_param2: billing.billing_address && billing.billing_address.state,
    merchant_param3: "1",
  };

  console.log(ccAvenue);

  const encryptedOrderData = ccav.getEncryptedOrder(ccAvenue);
  console.log(encryptedOrderData);

  const endPoint = `https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction&merchant_id='+POST.${merchant_id}+'&encRequest=${encryptedOrderData}&access_code=${access_code}`;

  useEffect(() => {
    document.redirect.submit();
  }, []);

  return (
    <>
      <div>
        <iframe title="CCAVENUE" name="payment_iframe" src="" frameBorder="0" style={{ width: "100%", height: "275px", overflow: "hidden" }}></iframe>
      </div>

      <form method="post" target="payment_iframe" name="redirect" action={endPoint}>
        <input type="hidden" name="encRequest" value={encryptedOrderData} />
        <input type="hidden" name="access_code" value={access_code} />
      </form>
    </>
  );
}
