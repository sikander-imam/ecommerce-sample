import { React, useEffect, useState } from "react";
import ProfileOptions from "../Home/Components/ProfileOptions";
import { useParams } from "react-router";
import { setActiveCategory, setIsHomePage } from "../Home/HomeSlice";
import { useDispatch, useSelector } from "react-redux";
import AddOn from "./Components/AddOn";
import RelatedProducts from "./RelatedProducts";
import * as Scroll from "react-scroll";
import { Helmet } from "react-helmet";
import { hasDataSelector, setHasData, setPageRefresh } from "../Layout/LayoutSlice";
import { resizeWindow } from "../../usejQuery";
import { getCurrentCategory, getCurrentProduct, getProductPriceExp, setActiveProductStatus } from "./ProductDetailsHelpers";
import { activeProductSelector, setIsDetailPage } from "./ProductDetailsSlice";
import { animateScrollToTop } from "../Home/HomeHelpers";
import ProductVariants from "./Components/Variants";
import ProductSpecs from "./Components/ProductSpecs";
import DPCarousel from "./Components/DPCarousel";

export default function ProductDetails() {
  const dispatch = useDispatch();
  const params = useParams();
  const storageBusinessUrl = localStorage.getItem("business_url");
  storageBusinessUrl !== params.business_url && dispatch(setHasData(false));
  const hasData = useSelector(hasDataSelector);
  const [forceUpdate, setForceUpdate] = useState(false);

  let getCategory = getCurrentCategory(params.category_slug);
  let getProduct = getCurrentProduct(params.category_slug, params.product_slug);

  let activeProduct = useSelector(activeProductSelector);

  useEffect(() => {
    setForceUpdate(true);
    resizeWindow();
    animateScrollToTop();
    dispatch(setIsHomePage(false));
    hasData && setActiveProductStatus(getCurrentProduct(params.category_slug, params.product_slug));
  }, [params.category_slug, params.product_slug, hasData, dispatch]);

  useEffect(() => {
    hasData && dispatch(setActiveCategory(getCategory?.title));
    hasData && dispatch(setPageRefresh(false));
    hasData && dispatch(setIsDetailPage(true));

    return () => {
      dispatch(setActiveCategory(null));
      dispatch(setIsDetailPage(false));
    };
  }, [dispatch, getCategory, hasData]);

  const getRelatedProducts = () => {
    const relatedCategory = { ...getCategory };
    relatedCategory.title = "Related Products";
    relatedCategory.products =
      getCategory &&
      getCategory.products.filter((obj) => {
        return obj.slug !== params.product_slug;
      });
    return relatedCategory;
  };

  return (
    <>
      <Helmet>
        <title>Store | Product Details</title>
      </Helmet>
      <Scroll.Element name={getCategory?.title} className="element">
        <main className="wrapper">
          <section id="main-body" className="pl-3 pt-4 pb-70">
            <div className="container-fluid">
              <div className="mobile-hide">{hasData && <ProfileOptions props={{ searchBar: false }} />}</div>
              <div className="product-wrappers">
                <div className="product-wrap radius-10 mt-4" style={{ minHeight: "60vh" }}>
                  {getCategory === undefined || getProduct === undefined || activeProduct === undefined ? (
                    "No Product Found"
                  ) : (
                    <div class="row">
                      <div class="col-lg-5">{activeProduct && forceUpdate && <DPCarousel product={activeProduct} />}</div>
                      <div class="col-lg-7">
                        <div class="product-item product-detail single-product-detail">
                          <h3 className="mb-3 text-center text-lg-left">
                            <p className="dark-one font-weight-600 d-inline-block">{hasData && getProduct?.title}</p>
                          </h3>
                          <h4 className="product-price font-weight-500 mb-4 text-center desktop-hide">
                            {activeProduct && hasData && getProductPriceExp(activeProduct)}
                          </h4>
                          <div className="mobile-hide">
                            {activeProduct && <ProductSpecs activeProduct={activeProduct} />}

                            <h3 className="product-price font-weight-500 mt-4 mb-4">
                              {activeProduct && hasData && getProductPriceExp(activeProduct)}
                            </h3>
                            <p className="mb-0 text-justify">{activeProduct && hasData && activeProduct?.description}</p>
                          </div>
                          {activeProduct && hasData && activeProduct?.has_addons_or_variants === 1 && activeProduct?.addons && (
                            <AddOn props={activeProduct?.addons} />
                          )}
                          {/* <ProductVariants /> */}
                          <div class="dropdown dropdown-detail w-100 mt-4 desktop-hide">
                            <button
                              class="dropdown-toggle"
                              type="button"
                              id="dropDetail"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              Description
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropDetail">
                              {activeProduct && <ProductSpecs activeProduct={activeProduct} />}
                              {activeProduct && hasData && activeProduct.has_addons_or_variants !== 1 && (
                                <p className="mb-0 text-justify">{activeProduct.description}</p>
                              )}
                            </div>
                          </div>
                          {activeProduct && hasData && <ProductVariants activeProduct={activeProduct} />}
                        </div>
                      </div>
                    </div>
                  )}
                  {activeProduct && hasData && getCategory && <RelatedProducts props={{ data: getRelatedProducts() }} />}
                </div>
              </div>
            </div>
          </section>
        </main>
      </Scroll.Element>
    </>
  );
}
