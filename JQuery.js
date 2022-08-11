import $ from "jquery";

//LOADER
export const Loader = () => {
  $(window).on("load", function () {
    $(".loader").fadeOut(800);

    setTimeout(function () {
      $(window).scrollTop(0);
    }, 200);

    // $("a.pagescroll").on("click", function (event) {
    // 	event.preventDefault();
    // 	$("html,body").animate({
    // 	   scrollTop: $(this.hash).offset().top
    // 	}, 1200);
    //  });

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

export const jQuery = () => {
  var Body = $("body");

  //  sidebar Space specific
  sidebarSpace();
  // footerAppend() ;

  $(window).on("resize", function () {
    sidebarSpace();
    // footerAppend();
  });

  function sidebarSpace() {
    var spaceMeta = $(".wrapper, .web-footer,.web-header");
    if ($(".sidebar").length) {
      if ($(window).width() > 991) {
        spaceMeta.css({
          "padding-left": $(".sidebar").outerWidth(),
        });
      } else {
        spaceMeta.css({
          "padding-left": 0,
        });
      }
    }
  }
  // function footerAppend() {
  // 	if($(window).width() < 992) {
  // 		$( "footer" ).appendTo( ".sidebar" );
  // 	}
  // }

  // right Popup
  $(function () {
    $(".cart-opener").on("click", function () {
      Body.toggleClass("cart-modal-open");
    });
  });
  $(function () {
    $(".filter-opener").on("click", function () {
      Body.toggleClass("filter-modal-open");
    });
  });

  // Filter selected
  $(function () {
    $(".order-list-drop .filter-opt, .Addons-extra").on("click", function () {
      $(this).toggleClass("selected");
    });
  });

  $(function () {
    $(".input-number").prop("disabled", true);
    $(".plus-btn").click(function () {
      $(".input-number").val(parseInt($(".input-number").val()) + 1);
    });
    $(".minus-btn").click(function () {
      $(".input-number").val(parseInt($(".input-number").val()) - 1);
      if ($(".input-number").val() === 0) {
        $(".input-number").val(1);
      }
    });
  });

  $(document).on("click.bs.dropdown.data-api", ".dropdown-menu", function (e) {
    e.stopPropagation();
  });

  $(".sidebar .dropdown, .dropdown-detail").on(
    "show.bs.dropdown",
    function (e) {
      $(this).find(".dropdown-menu").first().stop(true, true).slideDown(300);
    }
  );
  $(".sidebar  .dropdown, .dropdown-detail").on(
    "hide.bs.dropdown",
    function (e) {
      $(this).find(".dropdown-menu").first().stop(true, true).slideUp(300);
    }
  );

  // POpup on checked
  $(".show-selected .custom-control-input").on("change", function () {
    if ($(this).is(":checked")) {
      $(".selected-item-panel").addClass("active");
    } else {
      $(".selected-item-panel").removeClass("active");
    }
  });
  $(function () {
    $(".item-show span").on("click", function () {
      $(".selected-item-panel").removeClass("active");
    });
  });

  //  Responsive Header
  if ($(".mobile-header").length) {
    Body.append('<div class="close-sidebar"></div>');

    $(".sidebar-toggle").on("click", function () {
      $(".sidebar, .close-sidebar").addClass("active");
    });
    $(".close-sidebar").on("click", function () {
      $(".sidebar").removeClass("active");
      $(this).removeClass("active");
    });
    $(".header-meta-collapse").on("click", function () {
      $(".header-flexer").toggleClass("active");
    });
  }

  // right Popup
  $(function () {
    $(".add-customer-btn").on("click", function () {
      $("body").toggleClass("add-customer");
    });
  });

  // right Popup
  $(function () {
    $(".add-discount-btn").on("click", function () {
      $("body").toggleClass("add-discount");
    });
  });

  $(function () {
    $(".manage-discount-btn").on("click", function () {
      $("body").toggleClass("manage-discount");
    });
  });

  $(function () {
    $(".all-product-btn").on("click", function () {
      $("body").toggleClass("all-product");
    });
  });

  // Checkbox showhide content
  $("[name=tab]").on("change", function () {
    $(".item-tab").toggleClass("on");
  });

  // Product Thumbs
  //   $(".product-thumbs").owlCarousel({
  //     items: 1,
  //     margin: 0,
  //     nav: false,
  //     dotsData: true,
  //   });

  //   $(".higlight-thumb").owlCarousel({
  //     items: 1,
  //     margin: 0,
  //     nav: true,
  //     navText: [
  //       "<img src='images/arrow-left.png'>",
  //       "<img src='images/arrow-right.png'>",
  //     ],
  //     dots: true,
  //     dotsData: true,
  //     // responsive : {
  //     // 	0 : {
  //     // 		dotsData: false,
  //     // 		nav: true,
  //     // 	},
  //     // 	768 : {
  //     // 		dotsData: false,
  //     // 		nav: true,
  //     // 	},
  //     // 	769 : {
  //     // 		dotsData: false,
  //     // 		nav: true,
  //     // 	}
  //     // }
  //   });
};
