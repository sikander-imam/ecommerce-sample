import $ from "jquery";

export const scrollAnimation = () => {
  $(window).on("load", function () {
    $(".loader").fadeOut(800);

    setTimeout(function () {
      $(window).scrollTop(0);
    }, 200);

    $(".pagescroll").on("click", function (event) {
      event.preventDefault();
      $("html,body").animate(
        {
          scrollTop: $(this.hash).offset().top - 1,
        },
        2500
      );
    });
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $("body").addClass("nav-static");
    } else {
      $("body").removeClass("nav-static");
    }
  });
};

export const resizeWindow = () => {
  const spaceMeta = window.$(".wrapper, .web-footer,.web-header");
  if (window.$(".sidebar").length) {
    if (window.$(window).width() > 991) {
      spaceMeta.css({
        "padding-left": $(".sidebar").outerWidth(),
      });
    } else {
      spaceMeta.css({
        "padding-left": 0,
      });
    }
  }
};

export const launchOwlCarouselCard = () => {
  window.$(".product-thumbs").owlCarousel({
    items: 1,
    margin: 0,
    nav: false,
    dotsData: true,
  });
};

export const launchOwlCarouselDetail = () => {
  window.$(".higlight-thumb").owlCarousel({
    items: 1,
    margin: 0,
    nav: true,
    navText: [
      `<img src=${process.env.REACT_APP_URL}/assets/images/arrow-left.png>`,

      `<img src=${process.env.REACT_APP_URL}/assets/images/arrow-right.png>`,
    ],
    dots: true,
    dotsData: true,
    // responsive: {
    //   0: {
    //     dotsData: false,
    //     nav: true,
    //   },
    //   768: {
    //     dotsData: false,
    //     nav: true,
    //   },
    //   769: {
    //     dotsData: false,
    //     nav: true,
    //   },
    // },
  });
};

export const launchOwlCarousel = () => {
  window.$(".product-thumbs").owlCarousel({
    items: 1,
    margin: 0,
    nav: false,
    dotsData: true,
  });

  window.$(".higlight-thumb").owlCarousel({
    items: 1,
    margin: 0,
    nav: true,
    navText: [
      `<img src=${process.env.REACT_APP_URL}/assets/images/arrow-left.png>`,

      `<img src=${process.env.REACT_APP_URL}/assets/images/arrow-right.png>`,
    ],
    dots: true,
    dotsData: true,
    // responsive: {
    //   0: {
    //     dotsData: false,
    //     nav: true,
    //   },
    //   768: {
    //     dotsData: false,
    //     nav: true,
    //   },
    //   769: {
    //     dotsData: false,
    //     nav: true,
    //   },
    // },
  });
};
