import React from "react";
import { useSelector } from "react-redux";
import { businessUrlSelector } from "../Home/HomeSlice";
import { useHistory, useParams } from "react-router";
const isEqual = require("react-fast-compare");

const BackButton = () => {
  const businessUrl = useSelector(businessUrlSelector);

  const urlPath = window.location.pathname.split("/");
  const history = useHistory();
  const params = useParams();

  const handleBackButton = () => {
    if (urlPath[2] === "track_order" || (params.category_slug && params.product_slug) || history.goBack.length === 0) {
      history.push(`/${businessUrl}`);
    } else {
      history.goBack();
    }
  };
  return (
    <button type="button" className="btn-back" onClick={handleBackButton}>
      <h4 className="font-weight-700 dark-one">
        <img src={`${process.env.PUBLIC_URL}/assets/images/arrow-back.png`} alt="" className="mr-1" />
        Back
      </h4>
    </button>
  );
};

// export default React.memo(BackButton, function areEqual(prevProps, nextProps) {
//   if (prevProps !== nextProps) {
//     return false;
//   }
//   return true;
// });
export default React.memo(BackButton, isEqual);
