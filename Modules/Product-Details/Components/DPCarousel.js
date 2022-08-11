import React, { useEffect, useState, useRef } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import $ from "jquery";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { calculateDiscount } from "../../Home/HomeHelpers";

export default function DPCarousel(props) {
  const card = props.product;
  const [ShowDots, setShowDots] = useState(false);
  const [ShowThumbs, setShowThumbs] = useState(true);
  const [productImages, setProductImages] = useState(card.images);
  const imgRef = useRef(null);

  function setCarouselProps() {
    if (window.innerWidth > 991) {
      setShowThumbs(true);
      setShowDots(false);
    } else {
      setShowThumbs(false);
      setShowDots(true);
    }
  }

  function toggleMainImage() {
    const selectedVariant = card.variants.find((variant) => {
      return variant.selected === true;
    });

    let newImages;

    if (selectedVariant && selectedVariant.image) {
      // newImages = [selectedVariant.image];
      newImages = card.images.map((image, index) => {
        return index === 0 && selectedVariant.image ? selectedVariant.image : image;
      });
    } else {
      newImages = card.images;
    }

    setProductImages(newImages);
  }

  useEffect(() => {
    toggleMainImage();
    // imgRef.current && imgRef.current.slideToIndex(2);
    // scrollToSelectedVariantImage();
    setCarouselProps();
    // setProductImages(getProductImages(card));
    $(window).on("resize", function () {
      setCarouselProps();
    });
  }, [props, card]);

  const images =
    //card.images
    productImages.map((image, index) => {
      return (
        index <= 4 && {
          original: image,
          thumbnail: image,
          // originalClass: "product-box radius-10",
          ...(card.price.discounted_price > 0 && {
            description: <span className="discount-tag-detail">{calculateDiscount(card)}</span>,
          }),
        }
      );
    });

  return (
    <div
      className="product-item mobile-product-detail mb-3"
      // onClick={handleClick}
    >
      <ImageGallery
        ref={imgRef}
        items={images}
        showPlayButton={false}
        showFullscreenButton={false}
        showNav={false}
        showThumbnails={ShowThumbs}
        showBullets={ShowDots}
        disableSwipe={false}
        // additionalClass="product-box radius-10"
      />
    </div>
  );
}
