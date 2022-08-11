import { React } from "react";
import { useSelector } from "react-redux";
import { businessInfoSelector, storesSelector } from "../Home/HomeSlice";
import { getActiveStore } from "./../Home/HomeHelpers";

export default function StoreModaTrigger() {
  const stores = useSelector(storesSelector);
  const ActiveStore = getActiveStore(stores);
  const businessInfo = useSelector(businessInfoSelector);
  const brandColors = businessInfo && businessInfo.businessColors;

  return (
    <button
      type="button"
      className="btn-sidebar font-weight-500 text--primary"
      data-toggle="modal"
      data-target="#storeModal"
      style={{ color: brandColors?.background }}
    >
      {ActiveStore && ActiveStore.name}
      <br />
      <span className="ml-2 change-store" style={{ color: "grey" }}>
        Change Store
      </span>
    </button>
  );
}
