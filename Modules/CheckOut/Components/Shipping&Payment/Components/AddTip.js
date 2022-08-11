import { React } from "react";
import { useDispatch } from "react-redux";
import { setTipAmount } from "../../../CheckOutSlice";

export default function AddTip(props) {
  const type = props.props.type;

  const dispatch = useDispatch();

  return (
    <>
      {type === "mobile-hide" ? (
        <div className="form-group ">
          <input
            type="number"
            placeholder="Enter Amount"
            className="form-control sm-control line-control"
            onChange={(e) => {
              dispatch(setTipAmount(e.target.value));
            }}
          />
        </div>
      ) : (
        <div className="form-icon checkout-discount">
          <input
            type="number"
            class="form-control sm-control"
            placeholder="Enter Amount"
            onChange={(e) => {
              dispatch(setTipAmount(e.target.value));
            }}
          />
        </div>
      )}
    </>
  );
}
