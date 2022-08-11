import { React } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { businessInfoSelector, businessUrlSelector } from "../Home/HomeSlice";
import StoreModaTrigger from "./storeModalTrigger";
import { defaultColor } from "./../Home/Defaults";

export default function BusinessInfo() {
  const businessUrl = useSelector(businessUrlSelector);
  const businessInfo = useSelector(businessInfoSelector);
  const brandColors = businessInfo && businessInfo.businessColors;

  return (
    <div className="sidebar-top pb-3">
      <Link to={`/${businessUrl}`} className="sidebar-brand mb-3">
        <img alt="" src={businessInfo && businessInfo.logo ? businessInfo.logo : null} style={{ borderRadius: "100%" }} />
      </Link>
      <p className="side-name dark-one font-weight-700" style={{ color: brandColors ? brandColors.background : defaultColor }}>
        {businessUrl && businessUrl}
      </p>

      {/* <!-- trigger modal --> */}
      <StoreModaTrigger />
    </div>
  );
}
