/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect } from "react";
import { useDispatch } from "react-redux";
import ProductCategory from "./Components/ProductCategory";
import ProfileOptions from "./Components/ProfileOptions";
import { setIsHomePage } from "./HomeSlice";
import { useParams } from "react-router";
import { resizeWindow } from "../../usejQuery";
import SelectedFilters from "./Components/SelectedFilters";
import Banner from "./Components/Banner";
import { Helmet } from "react-helmet";
import { animateScrollToTop, checkStatus } from "./HomeHelpers";
import { setHasData, setPageRefresh } from "../Layout/LayoutSlice";
import { useSelector } from "react-redux";
import { redirectedFromCCAvenueSelector, setRedirectedFromCCAvenue } from "../CheckOut/CheckOutSlice";

export default function Home() {
  const dispatch = useDispatch();
  const params = useParams();
  const storageBusinessUrl = localStorage.getItem("business_url");
  storageBusinessUrl !== params.business_url && dispatch(setHasData(false));
  const redirectedFromCCAvenue = useSelector(redirectedFromCCAvenueSelector);

  useEffect(() => {
    if (redirectedFromCCAvenue === true) {
      dispatch(setRedirectedFromCCAvenue(false));
      checkStatus(params.business_url, false);
    }
  }, [redirectedFromCCAvenue]);

  useEffect(() => {
    resizeWindow();
    animateScrollToTop();
    dispatch(setIsHomePage(true));
    dispatch(setPageRefresh(false));
    return () => {
      dispatch(setIsHomePage(false));
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Store | Home</title>
      </Helmet>
      {
        //products !== null ?
        <main className="wrapper">
          <div className="desktop-hide">
            <Banner props={"desktop-hide"} />
            <SelectedFilters />
          </div>
          <section id="main-body" className="pl-3 pt-4 pb-70">
            {
              <div className="container-fluid">
                <div className="mobile-hide">
                  <ProfileOptions props={{ searchBar: true }} />
                  <Banner props={"mobile-hide"} />
                  <div className="product-filter-large w-100 radius-10 mt-3">
                    <SelectedFilters />
                    <span
                      className="btn-profilter filter-opener"
                      onClick={() => {
                        resizeWindow();
                        window.$("body").toggleClass("filter-modal-open");
                      }}
                    >
                      <img src={`${process.env.REACT_APP_URL}/assets/images/filter.png`} alt="" />
                      Filter
                    </span>
                  </div>
                </div>
                <div className="product-wrappers" style={{ minHeight: "21vh" }}>
                  {<ProductCategory />}
                </div>
              </div>
            }
          </section>
        </main>
      }
    </>
  );
}
