import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import axios from "../../../../../library/axios";
import { CartProductsSelector, resetCart } from "../../../../Cart/CartSlice";
import { accessTokenSelector, businessUrlSelector } from "../../../../Home/HomeSlice";
import { setPaymentStatus, SelectedPaymentTypeSelector, setRedirectedFromCCAvenue, setOrderResponse } from "../../../CheckOutSlice";
import { getOrderData } from "./OrderHelper";
import { setNewOrder } from "../../../../Order-History/OrderHistorySlice";

const nodeCCAvenue = require("node-ccavenue");

export default function CCAvenue() {
  const BusinessURL = useSelector(businessUrlSelector);
  const accessToken = useSelector(accessTokenSelector);
  const SelectedPaymentType = useSelector(SelectedPaymentTypeSelector);
  const cart = useSelector(CartProductsSelector);
  const businessUrl = useSelector(businessUrlSelector);

  const params = useParams();
  const CCResp = params.payload;
  const [Error, setError] = useState("");

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (cart && cart.length === 0) {
      history.push(`/${businessUrl}`);
    }
  }, []);

  const handleOrderPlacement = (paymentStatus) => {
    const data = getOrderData(paymentStatus);
    dispatch(setRedirectedFromCCAvenue(true));
    console.log(data);
    axios
      .post(`${process.env.REACT_APP_API_URL}/orders`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === true) {
          dispatch(setNewOrder(response.data.data));
          dispatch(setOrderResponse(response.data.data));
          dispatch(resetCart());
          history.push(`/${BusinessURL}/order/confirmed`);
        }
        if (response.data.status === false) {
          setError("Error: Order could not be placed");
          setTimeout(() => {
            history.push(`/${BusinessURL}`);
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Error: Order could not be placed");
        setTimeout(() => {
          history.push(`/${BusinessURL}`);
        }, 3000);
      });
  };

  const merchant_id = process.env.REACT_APP_MERCHANT_ID;
  const Encryption_Key = process.env.REACT_APP_ENCRYPTION_KEY;

  const ccav = new nodeCCAvenue.Configure({
    merchant_id: merchant_id,
    working_key: Encryption_Key,
  });

  const decryptedJsonResponse = ccav.redirectResponseToJson(CCResp);

  useEffect(() => {
    if (decryptedJsonResponse.order_status === "Success" && cart && cart.length !== 0) {
      const payment = {
        type: SelectedPaymentType,
        payment_method_id: SelectedPaymentType,
        payment_status: "done",
        payment_response: decryptedJsonResponse,
      };
      dispatch(setPaymentStatus(decryptedJsonResponse));
      handleOrderPlacement(payment);
    } else if (decryptedJsonResponse.order_status !== "Success") {
      setError(true);
      dispatch(setRedirectedFromCCAvenue(true));
      history.push(`/${BusinessURL}/checkout`);
    }
  }, []);

  return <p className="text--danger">{Error}</p>;
}
