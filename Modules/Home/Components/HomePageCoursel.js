import React from "react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { animateScrollToTop } from "../../Home/HomeHelpers";
import { setActiveProductStatus } from "../../Product-Details/ProductDetailsHelpers";

export default function HomePageCoursel(props) {
  const card = props.props.product;

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: "pro-slider",
    dotsClass: "Custom-dots-images",
    customPaging: (i) => (
      <div>
        <img src={card.images[i]} alt="" />
      </div>
    ),
  };

  return (
    <>
      <Slider {...settings}>
        {card.images.map((obj) => {
          return (
            <div className="product-box radius-10">
              {card.price.discounted_price > 0 && (
                <div className="sale-tag">
                  <span>{`-${Math.round(((card.price.retail_price - card.price.discounted_price) / card.price.retail_price) * 100)}%`}</span>
                </div>
              )}
              {props.props.pathname ? (
                <Link to={props.props.pathname}>
                  {obj && (
                    <img
                      className="item"
                      alt=""
                      src={obj && obj}
                      onClick={() => {
                        animateScrollToTop();
                        setActiveProductStatus(card);
                      }}
                    />
                  )}
                </Link>
              ) : (
                obj && <img className="item" alt="" src={obj && obj} />
              )}
            </div>
          );
        })}
      </Slider>
    </>
  );
}
