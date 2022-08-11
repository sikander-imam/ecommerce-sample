import React, { useEffect } from "react";
import { launchOwlCarousel, resizeWindow } from "./../../../usejQuery";
import { Link } from "react-router-dom";
import { setActiveProductStatus } from "../ProductDetailsHelpers";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { animateScrollToTop } from "../../Home/HomeHelpers";

export default function ProductCarousel(props) {
  const card = props.props.product;
  const classnames = props.props.classnames;

  useEffect(() => {
    resizeWindow();
  }, []);

  useEffect(() => {
    launchOwlCarousel();
    // OwlCarousel.create();
    window.$(".disabled").parent(".owl-dot").css("pointer-events", "none");
    return () => {
      window.$(".product-thumbs").owlCarousel("destroy");
      window.$(".higlight-thumb").owlCarousel("destroy");
    };
  }, [props]);

  const numbers = [0, 1, 2, 3];
  const imagesArray = numbers.map((obj) => {
    return card.images[obj];
  });

  return (
    <>
      {/* here */}
      <div className={classnames}>
        {imagesArray.map((obj, index) => {
          return (
            index < 4 && (
              <div className="item" key={index} data-dot={obj ? `<img src=${obj && obj}>` : "<p class = 'disabled'></p>"}>
                {obj && (
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
                )}
              </div>
            )
          );
        })}
      </div>
    </>
  );
}
