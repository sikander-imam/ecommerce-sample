import { React } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutSuccess } from "../../Auth/AuthSlice";
import { businessUrlSelector } from "./../HomeSlice";
import { loggedInUserSelector } from "./../../Auth/AuthSlice";
import $ from "jquery";

export default function UserOptions(props) {
  const dispatch = useDispatch();
  const businessUrl = useSelector(businessUrlSelector);
  const loggedInUser = useSelector(loggedInUserSelector);

  return (
    <div className="dropdown dropdown-profile">
      <button
        className="dropdown-toggle dark-one"
        type="button"
        id={props.props.id}
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/profile.png`} className="pro-thumb" />
        <span className="pro-txt">{loggedInUser && loggedInUser.name}</span>
      </button>
      <div className={props?.props?.classNames} aria-labelledby={props?.props?.arialabelledby}>
        <Link
          className="dropdown-item"
          to={`/${businessUrl}/account/orders`}
          onClick={() => {
            $(".sidebar").removeClass("active");
            $(".close-sidebar").removeClass("active");
          }}
        >
          Order History
        </Link>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            $(".sidebar").removeClass("active");
            $(".close-sidebar").removeClass("active");
            dispatch(logoutSuccess());
          }}
          className="dropdown-item"
        >
          Log Out
        </span>
      </div>
    </div>
  );
}
