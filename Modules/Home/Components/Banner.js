/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector } from "react-redux";
import { businessInfoSelector } from "./../HomeSlice";

function Banner(props) {
  const type = props.props;
  const businessInfo = useSelector(businessInfoSelector);
  const banner = businessInfo && businessInfo.slider;

  const heading = banner && banner?.heading ? banner?.heading : null;
  const sub_heading = banner && banner?.sub_heading ? banner?.sub_heading : null;
  const description = banner && banner?.description ? banner?.description : null;
  const image = banner && banner?.image ? banner?.image : null;
  const mobile_image = banner && banner?.mobile_image ? banner?.mobile_image : null;

  return (
    <>
      {type === "desktop-hide" ? (
        <div
          className="promotion-banner radius-10 text-white"
          style={{
            backgroundImage: `url(${mobile_image})`,
            borderRadius: "0px",
            minHeight: "260px",
          }}
        >
          {
            <h2 className="font-weight-700 mb-3" style={{ wordBreak: "break-word" }}>
              {heading !== null ? heading : `   `}
              <span className="d-block" style={{ wordBreak: "break-word" }}>
                {sub_heading !== null ? sub_heading : `   `}
              </span>
            </h2>
          }
          <h3 style={{ wordBreak: "break-word" }}>{description !== null || description !== "" ? description : `   `}</h3>
        </div>
      ) : (
        <div
          className="promotion-banner radius-10 text-white"
          style={{
            backgroundImage: `url(${image})`,
            borderRadius: "0px",
            minHeight: "240px",
          }}
        >
          {
            <h2 className="font-weight-700 mb-3">
              {heading}
              {sub_heading && <span className="d-block">{sub_heading}</span>}
            </h2>
          }
          {description && <h3>{description}</h3>}
        </div>
      )}
    </>
  );
}

export default React.memo(Banner);
