import { React, useEffect } from "react";
import { useSelector } from "react-redux";
import { AllProductsSelector } from "../Home/HomeSlice";
import { Link } from "react-router-dom";
import SideBarCategories from "./SideBarCategories";
import UserOptions from "./../Home/Components/UserOptions";
import $ from "jquery";
import { businessUrlSelector } from "./../Home/HomeSlice";
import Footer from "./Footer";
import { AuthStatusSelector } from "../Auth/AuthSlice";
import CartTrigger from "./CartTrigger";
import BusinessInfo from "./BusinessInfo";

export default function SideBar() {
  const businessUrl = useSelector(businessUrlSelector);
  const products = useSelector(AllProductsSelector);
  const AuthStatus = useSelector(AuthStatusSelector);

  useEffect(() => {
    if ($(".close-sidebar").length === 0) {
      $("body").append('<div class="close-sidebar"></div>');
    }
    $(".close-sidebar").on("click", function () {
      $(".sidebar").removeClass("active");
      $(this).removeClass("active");
    });
  }, []);

  return (
    <aside className="sidebar">
      <button
        type="button"
        className="sidebar-setting desktop-hide"
        onClick={() => {
          $(".sidebar").toggleClass("active");
          $(".close-sidebar").toggleClass("active");
        }}
      ></button>

      <BusinessInfo type={"desktop-hide"} />

      <div className="desktop-hide">
        {!AuthStatus ? (
          <div
            className="footer-infos text-center"
            onClick={() => {
              $(".sidebar").removeClass("active");
              $(".close-sidebar").removeClass("active");
            }}
          >
            <Link to={`/${businessUrl}/login`}>Login/Register</Link>
          </div>
        ) : (
          <div className="col text-center">
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
      {/* </li> */}
      <ul className="navbar-nav sidebar-list mt-4 scroll-menu">
        <div className="mobile-hide">
          <SideBarCategories props={"mobile-hide"} />
        </div>
      </ul>

      {/* Cart Modal */}
      {products && <CartTrigger />}
      {products && <Footer props={{ classnames: "web-footer desktop-hide" }} />}
    </aside>
  );
}
