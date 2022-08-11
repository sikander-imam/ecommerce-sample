import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthStatusSelector } from "../../Auth/AuthSlice";
import { businessInfoSelector, businessUrlSelector } from "../HomeSlice";
import UserOptions from "./UserOptions";
import { SearchKeywordSelector, setSearchKeyword } from "./SearchKeywordSlice";
import BackButton from "../../Layout/BackButton";

const ProfileOptions = (props) => {
  const AuthStatus = useSelector(AuthStatusSelector);
  const businessUrl = useSelector(businessUrlSelector);
  const SearchKeyword = useSelector(SearchKeywordSelector);

  const businessInfo = useSelector(businessInfoSelector);
  const brandColors = businessInfo && businessInfo.businessColors;

  const dispatch = useDispatch();

  return (
    <div className="row justify-content-between mid-top">
      <div className="col">
        {props.props.searchBar ? (
          <div className="form-group form-icon dark-two">
            <input
              type="search"
              placeholder="Search ..."
              className="form-control sm-control"
              value={SearchKeyword}
              onChange={(e) => {
                dispatch(setSearchKeyword(e.target.value));
              }}
            />
            <span className="form-icon-ico">
              <img alt="" src={`${process.env.PUBLIC_URL}/assets/images/search.png`} />
            </span>
          </div>
        ) : (
          <BackButton />
        )}
      </div>
      {!AuthStatus ? (
        <div className="col text-right">
          <Link to={`/${businessUrl}/register`} className="btn-simple darkcolor">
            Register
          </Link>
          <Link to={`/${businessUrl}/login`} className="btn-size btn-rounded btn--primary darkcolor ml-2" style={brandColors}>
            Login
          </Link>
        </div>
      ) : (
        <div className="col text-right">
          <UserOptions
            props={{
              id: "dropProfile1",
              classNames: "dropdown-menu dropdown-menu-right",
              arialabelledby: "dropProfile1",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(ProfileOptions, function areEqual(prevProps, nextProps) {
  if (prevProps.myNumber !== nextProps.myNumber) {
    return false;
  }
  return true;
});
