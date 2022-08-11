import { React } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { businessInfoSelector, businessUrlSelector } from "../../Home/HomeSlice";
import { orderResponseSelector } from "../../CheckOut/CheckOutSlice";
import { getBrandColors } from "../../CheckOut/Components/Shipping&Payment/Components/OrderHelper";

export default function ThankYouOrder() {
  const BusinessURL = useSelector(businessUrlSelector);
  const orderResponse = useSelector(orderResponseSelector);
  const brandColors = getBrandColors();
  const businessInfo = useSelector(businessInfoSelector);
  const contact = businessInfo && businessInfo.contact;

  return (
    <main className="wrapper start-wrapper">
      <section id="main-body" className="full-height p-6 d-flex align-items-center">
        <div className="container-fluid">
          <div className="wrapp-outer">
            <div className="login-wrapp otp-wrap">
              <span className="otp-icon">
                <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/thankyou.png`} />
              </span>
              <div className="mb-5 text-center">
                <h2 className="darkcolor font-weight-700">Thank You for your purchase!</h2>
                <h4 className="text--primary mt-2 mb-4" style={{ color: brandColors && brandColors.background }}>
                  Your Order number is
                  <Link to={`/${BusinessURL}/track_order/${orderResponse && orderResponse.order_number}`}>
                    {` ${orderResponse && orderResponse.format_number}. Click here to track your order. `}
                  </Link>
                </h4>
              </div>
              <form className="login-inner mb-3">
                <h4 className="dark-two mb-5">
                  Thanks for being awesome, <br />
                  We hope you enjoy your purchase
                </h4>
                <Link to={`/${BusinessURL}`} className="btn-size btn-rounded btn--primary btn-large text-uppercase mb-3" style={brandColors}>
                  Back to Shopping
                </Link>
              </form>
            </div>
            <div className="text-center">
              <h4 className="dark-two mt-3  d-inline-block w-75">
                if you have any questions or concerns regarding this, do not hesitate to contact us at
                <a style={{ color: brandColors && brandColors.background }} href={`mailto:${contact.email}`}>
                  {` ${contact.email}`}
                </a>
              </h4>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
