import React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { deleteProduct } from "../CartSlice";

export default function DeleteButton(props) {
  const type = props.props.type;
  const index = props.props.index;
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

  const dispatch = useDispatch();

  const deleteCartItem = (index) => {
    toast.error("Item Deleted Successfully");
    dispatch(deleteProduct(index));
  };

  return (
    <>
      {type === "cart" && (
        <button
          ref={setTriggerRef}
          type="button"
          className="modal-card-dismiss"
          onClick={() => {
            deleteCartItem(index);
          }}
        >
          <i className="far fa-times fa-2x mobile-hide" style={{ color: "#FF8484" }}></i>
          <i className="far fa-times fa-1x desktop-hide" style={{ color: "#FF8484" }}></i>
        </button>
      )}

      {type === "checkout" && (
        <button type="button" ref={setTriggerRef} className="delrcd">
          <img
            onClick={() => {
              deleteCartItem(index);
            }}
            alt=""
            src={`${process.env.REACT_APP_URL}/assets/images/del.png`}
          />
        </button>
      )}

      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>
          <div {...getArrowProps({ className: "tooltip-arrow" })} />
          Delete product?
        </div>
      )}
    </>
  );
}
