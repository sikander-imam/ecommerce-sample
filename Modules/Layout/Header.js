import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CartProductsSelector } from "../Cart/CartSlice";
import { AllProductsSelector, businessInfoSelector, isHomePageSelector, mainViewSelector, storesSelector } from "../Home/HomeSlice";
import SideBarCategories from "./SideBarCategories";
import $ from "jquery";
import { businessUrlSelector } from "../Home/HomeSlice";
import { setSearchKeyword } from "../Home/Components/SearchKeywordSlice";
import Announcements from "./Announcements";
import { getCartStatus } from "../Home/HomeHelpers";
import { resizeWindow } from "../../usejQuery";
import BackButton from "./BackButton";
import { defaultMobileLogo } from "./../Home/Defaults";

export default function Header() {
  const stores = useSelector(storesSelector);
  const cart = useSelector(CartProductsSelector);
  const cartStatus = getCartStatus(stores, cart);
  const businessUrl = useSelector(businessUrlSelector);
  const isHomePage = useSelector(isHomePageSelector);
  const businessInfo = useSelector(businessInfoSelector);
  const products = useSelector(AllProductsSelector);
  const brandColors = businessInfo && businessInfo.businessColors;
  const banner = businessInfo && businessInfo.slider;
  const mobile_logo = banner && banner.mobile_logo ? banner.mobile_logo : defaultMobileLogo;

  const mainView = useSelector(mainViewSelector);

  $(window).scroll(function () {
    $(".dropdown-menu-right").removeClass("show");
  });

  useEffect(() => {
    if (mainView === true) {
      resizeWindow();
    }
  }, [mainView]);

  const dispatch = useDispatch();

  return (
    <header className="web-header">
      <div className="mobile-header  desktop-hide bg-light">
        <nav className="navbar" style={{ backgroundColor: "#444444" }}>
          <ul className="navbar-nav not-collapse ml-auto mr-auto">{products && <Announcements />}</ul>
        </nav>
        <div className="container-fluid">
          <div className="mobil-flexer">
            {isHomePage === true ? (
              <span
                className="sidebar-toggle"
                onClick={() => {
                  $(".sidebar").toggleClass("active");
                  $(".close-sidebar").toggleClass("active");
                }}
              >
                <i></i> <i></i> <i></i>
              </span>
            ) : (
              <BackButton />
            )}
            <Link to={`/${businessUrl}`} className="sidebar-brand mb-3">
              <div>
                <img src={mobile_logo} alt="" />
              </div>
            </Link>

            <div className="mobile-metas">
              {isHomePage === true ? (
                <span
                  className="btn-profilter filter-opener"
                  onClick={() => {
                    window.$("body").toggleClass("filter-modal-open");
                  }}
                >
                  <img src={`${process.env.REACT_APP_URL}/assets/images/filter.png`} alt="" />
                </span>
              ) : null}
              {isHomePage === true && (
                <div className="dropdown search-dropdown">
                  <button className="dropdown-toggle" type="button" id="dropSearch" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/search.png`} />
                  </button>

                  <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropSearch">
                    <div className="form-group form-icon m-3">
                      <input
                        type="search"
                        placeholder="Search ..."
                        className="form-control sm-control"
                        onChange={(e) => {
                          dispatch(setSearchKeyword(e.target.value));
                        }}
                      />
                      <span className="form-icon-ico">
                        <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/search.png`} />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {cartStatus && (
                <Link className="cart-header cart-opener" to={`/${businessUrl}/cart`}>
                  <img alt="" src={`${process.env.REACT_APP_URL}/assets/images/cart.png`} />
                  <span className="bege" style={brandColors}>
                    {cartStatus && cartStatus.length}
                  </span>
                </Link>
              )}
              <span
                className="header-meta-collapse"
                onClick={() => {
                  $(".header-flexer").toggleClass("active");
                }}
              >
                <i></i> <i></i> <i></i>
              </span>
            </div>
          </div>
        </div>

        {isHomePage === true && (
          <>
            <div className="mobile-header-divider"></div>
            <div className="mobile-category bg-white">
              <div className="container-fluid">
                <ul className="mobile-category-list scroller-h scroll-menu justify-content-center">
                  <SideBarCategories props={"desktop-hide"} />
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="container-fluid mobile-hide">
        <nav className="navbar">
          <ul className="navbar-nav not-collapse ml-auto mr-auto">
            <Announcements />
          </ul>
        </nav>
      </div>
    </header>
  );
}
