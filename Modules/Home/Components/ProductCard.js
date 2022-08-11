import { React, useEffect } from "react";
import { Link } from "react-router-dom";
import { businessInfoSelector, businessUrlSelector } from "../HomeSlice";
import { useSelector } from "react-redux";
import { resizeWindow } from "./../../../usejQuery";
import { animateScrollToTop } from "../HomeHelpers";
import { getProductPriceExp, setActiveProductStatus } from "./../../Product-Details/ProductDetailsHelpers";
import LazyLoad from "react-lazyload";
import HCoursel from "./HCarousel";

export default function ProductCard(props) {
  useEffect(() => {
    resizeWindow();
  }, []);

  const card = props.props.data;
  const category_slug = props.props.category_slug;
  const businessUrl = useSelector(businessUrlSelector);
  const businessInfo = useSelector(businessInfoSelector);
  const brandColors = businessInfo && businessInfo.businessColors;

  return (
    <div className="col-xl-3 col-sm-6">
      <div className="product-item mb-4" style={{ paddingBottom: "15px", borderRadius: "10px" }}>
        <LazyLoad height={200} offset={100}>
          {card && (
            <HCoursel
              props={{
                product: card,
                classnames: "product-thumbs owl-carousel mb-3",
                pathname: `/${businessUrl}/${category_slug}/${card.slug}`,
              }}
            />
          )}
        </LazyLoad>
        <Link
          onClick={() => {
            animateScrollToTop();
            setActiveProductStatus(card);
          }}
          to={{
            pathname: `/${businessUrl}/${category_slug}/${card.slug}`,
            props: { product: card },
          }}
          className="dark-one font-weight-500 d-inline-block"
        >
          {props.props.categrory_title}
        </Link>
        <h6>
          <Link
            onClick={() => {
              animateScrollToTop();
              setActiveProductStatus(card);
            }}
            to={{
              pathname: `/${businessUrl}/${category_slug}/${card.slug}`,
              props: { card },
            }}
            className="dark-one font-weight-600 d-inline-block text-uppercase"
          >
            {card.title}
          </Link>
        </h6>
        <p className="product-price font-weight-500 mt-2">{getProductPriceExp(card)}</p>
        <Link
          onClick={() => {
            animateScrollToTop();
            setActiveProductStatus(card);
          }}
          to={`/${businessUrl}/${category_slug}/${card.slug}`}
          className="btn-size btn-rounded btn--primary btn-md"
          style={brandColors}
        >
          Add
        </Link>
      </div>
    </div>
  );
}
