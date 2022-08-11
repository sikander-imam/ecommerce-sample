import React, { useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { calculateDiscount, getCategoryById } from "../../Home/HomeHelpers";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import ImageGallery from "react-image-gallery";
import $ from "jquery";

import "react-image-gallery/styles/css/image-gallery.css";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { businessUrlSelector } from "../HomeSlice";

export default function HCoursel(props) {
  const card = props.props.product;
  const activeCategory = getCategoryById(card.category_id);
  const businessUrl = useSelector(businessUrlSelector);

  const images = card.images.map((image) => {
    return {
      original: image,
      thumbnail: image,
      ...(card.price.discounted_price > 0 && {
        description: <span className="discount-tag">{calculateDiscount(card)}</span>,
      }),
    };
  });

  useEffect(() => {
    $(".image-gallery-slide-wrapper") && $(".image-gallery-slide-wrapper").addClass("product-box radius-10");
  }, []);

  const history = useHistory();

  return (
    <>
      <ImageGallery
        items={images}
        showPlayButton={false}
        showFullscreenButton={false}
        showNav={false}
        onClick={() => {
          history.push(`/${businessUrl}/${activeCategory.slug}/${card.slug}`);
        }}
      />
    </>
  );
}
