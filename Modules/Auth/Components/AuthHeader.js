import { React } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { defaultMobileLogo } from "../../Home/Defaults";
import { businessInfoSelector, businessUrlSelector } from "../../Home/HomeSlice";
import Announcements from "../../Layout/Announcements";

export default function AuthHeader(props) {
  const businessUrl = useSelector(businessUrlSelector);
  const businessInfo = useSelector(businessInfoSelector);

  return (
    <header className={`web-header header-dark ${!props ? "mobile-hide" : null} `}>
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg">
          <Link className="navbar-brand" to={`/${businessUrl}`}>
            <img alt="" src={businessInfo?.logo ? businessInfo?.logo : defaultMobileLogo} />
          </Link>
          <button
            className="navbar-toggler d-none"
            type="button"
            data-toggle="collapse"
            data-target="#navWeb"
            aria-controls="navWeb"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navWeb">
            <ul className="navbar-nav ml-auto mr-auto">
              <Announcements />
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
