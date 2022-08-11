import { React, useEffect } from "react";
import Footer from "./Footer";
import SideBar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { AllProductsSelector } from "../Home/HomeSlice";
import * as Scroll from "react-scroll";
import Header from "./Header";
import StoreModal from "./StoreModal";
import CartSideModal from "../Cart/Components/CartSideModal";
import FilterSideModal from "./../Home/Components/Filters";
import { PriceFiltersSelector, setActivePrices, setProductsFilters } from "../Home/Components/FilterSlice";
import { resizeWindow } from "../../usejQuery";
import { setFilteredProducts } from "../Home/HomeHelpers";

export default function Layout({ component }) {
  const products = useSelector(AllProductsSelector);
  const PriceFilters = useSelector(PriceFiltersSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    window.$(".body-overlay").click(function () {
      Scroll.animateScroll.scrollToTop();
      window.$("body").removeClass("filter-modal-open");
      window.$("body").removeClass("cart-modal-open");
    });
  }, []);

  useEffect(() => {
    resizeWindow();
  }, [component]);

  const handleOverlayClick = () => {
    dispatch(setActivePrices(PriceFilters));
    dispatch(
      setProductsFilters(
        products.every((obj) => {
          return obj.selected === true;
        })
          ? setFilteredProducts(products, false)
          : products
      )
    );
  };

  return (
    <>
      <Header props={{ type: component.type.name }} />
      <SideBar />
      {component}
      {products && <Footer props={{ classnames: "web-footer mobile-hide" }} />}
      <div className="body-overlay" onClick={handleOverlayClick}></div>
      {<StoreModal />}
      {products && <CartSideModal />}
      {products && <FilterSideModal />}
    </>
  );
}
