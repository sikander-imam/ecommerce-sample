import store from "../../Store/store";
import { resetAuth } from "../Auth/AuthSlice";
import { resetCart, setTax } from "../Cart/CartSlice";
import { resetCheckout } from "../CheckOut/CheckOutSlice";
import { resetOrderHistory } from "../Order-History/OrderHistorySlice";
import { resetOtpVerification } from "../Order-Invoice/OtpVerificationSlice";
import { resetProductDetails } from "../Product-Details/ProductDetailsSlice";
import { resetFilters, setActivePrices, setPriceFilters, setProductsFilters } from "./Components/FilterSlice";
import {
  getProductsSuccess,
  handleStoreSelectionReset,
  resetHome,
  setAnnouncements,
  setBusinessInfo,
  setBusinessUrl,
  setFooterPages,
  setStores,
} from "./HomeSlice";
import { getProductPrice } from "./../Cart/PricesHelper";
import * as Scroll from "react-scroll";
import { setApiError, setPageRefresh, setHasData } from "../Layout/LayoutSlice";
import axios from "./../../library/axios";
import { app_token } from "./../../App_Token";
import { defaultAnnouncements, defaultBanner, defaultLogo, defaultMobileBanner } from "./Defaults";
const tinycolor = require("tinycolor2");

export const scrollToTop = () => {
  Scroll.animateScroll.scrollTo(150, {
    duration: 200,
    smooth: true,
    offset: 50,
  });
};

export const animateScrollToTop = () => {
  Scroll.animateScroll.scrollToTop({
    duration: 100,
    smooth: true,
    offset: 0,
  });
};

export const resetState = () => {
  store.dispatch(resetCheckout());
  store.dispatch(resetFilters());
  store.dispatch(resetProductDetails());
  store.dispatch(resetOtpVerification());
  store.dispatch(resetOrderHistory());
};

export const handleBusinessReset = () => {
  localStorage.clear();
  resetState();
  store.dispatch(resetAuth());
  store.dispatch(resetHome());
  store.dispatch(resetCart());
};

export const handleStoreReset = () => {
  // localStorage.clear();
  resetState();
  store.dispatch(handleStoreSelectionReset());
};

export const handleHomeRefresh = () => {
  localStorage.clear();
  store.dispatch(resetHome());
};

export const setProductsSelectedStatus = (products) => {
  return products.map((obj) => {
    const newObj = { ...obj };
    newObj.selected = true;
    newObj.products = newObj.products.map((prod) => {
      const newProd = { ...prod };
      newProd.selected = true;
      newProd.quantity = 1;
      newProd.discount_value = 0;
      if (newProd.has_addons_or_variants === 2) {
        const variantDiscounts = newProd.variants.map((obj) => {
          return (obj.retail_price - obj.discounted_price) / obj.retail_price;
        });
        newProd.variants = prod.variants.map((obj, index) => {
          const newObj = { ...obj };
          newObj.selected = variantDiscounts.indexOf(Math.max(...variantDiscounts)) === index ? true : false;
          return newObj;
        });
      }
      return newProd;
    });
    return newObj;
  });
};

export const getActiveStore = (stores) => {
  return (
    stores &&
    stores.filter((obj) => {
      return obj.selected === true;
    })[0]
  );
};

export const getCartStatus = (stores, cart) => {
  const activeStore = getActiveStore(stores);
  return (
    cart &&
    activeStore &&
    cart.filter((obj) => {
      return obj.product.store_id === activeStore.id;
    })
  );
};

export const formatCategories = (storeID, allProducts) => {
  return allProducts.map((obj) => {
    const newObj = { ...obj };
    newObj.selected = true;
    newObj.products = obj.products.map((prod) => {
      return formatProduct(storeID, obj.id, prod);
    });
    return newObj;
  });
};

export const formatProduct = (storeID, categoryID, product) => {
  const newProd = { ...product };
  newProd.quantity = 1;
  newProd.selected = true;
  newProd.discount_value = 0;
  newProd.store_id = storeID;
  newProd.category_id = categoryID;

  if (newProd.has_addons_or_variants === 1) {
    newProd.addons = product.addons?.map((obj) => {
      const newObj = { ...obj };
      newObj.selected = false;
      return newObj;
    });
  }
  if (newProd.has_addons_or_variants === 2) {
    newProd.variants = product.variants?.map((obj) => {
      const newObj = { ...obj };
      newObj.selected = false;
      return newObj;
    });
  }

  newProd.price = getProductPrice(newProd);

  return newProd;
};

export const setFilteredProducts = (products, value) => {
  return products.map((obj) => {
    const newObj = { ...obj };
    newObj.selected = value;
    return newObj;
  });
};

const checkEveryforFalse = (obj) => {
  return obj.selected === false;
};
const checkEveryforTrue = (obj) => {
  return obj.selected === true;
};

export const applyFilters = (activePrices, activeProducts) => {
  window.$("body").removeClass("filter-modal-open");
  const allPrices = activePrices.every(checkEveryforFalse) || activePrices.every(checkEveryforTrue);

  const allProducts = activeProducts.every(checkEveryforFalse) || activeProducts.every(checkEveryforTrue);

  const priceRange = activePrices.filter((price) => {
    return price.selected === true;
  })[0];

  let newProducts;

  if (allPrices === true && allProducts === true) {
    newProducts = activeProducts.map((Category) => {
      const newCategory = { ...Category };
      newCategory.selected = true;
      newCategory.products = Category.products.map((product) => {
        const newProduct = { ...product };
        newProduct.selected = true;
        return newProduct;
      });
      return newCategory;
    });
    store.dispatch(getProductsSuccess(null));
    store.dispatch(getProductsSuccess(newProducts));
    store.dispatch(setProductsFilters(setFilteredProducts(newProducts, false)));
  }

  if (allPrices === true && allProducts === false) {
    newProducts = newProducts = activeProducts.map((Category) => {
      const newCategory = { ...Category };
      newCategory.products = Category.products.map((product) => {
        const newProduct = { ...product };
        newProduct.selected = true;
        return newProduct;
      });
      return newCategory;
    });
    store.dispatch(getProductsSuccess(null));
    store.dispatch(getProductsSuccess(newProducts));
    store.dispatch(setProductsFilters(newProducts));
  }

  if (allPrices === false) {
    const min = priceRange.min;
    const max = priceRange.max;
    newProducts = activeProducts.map((Category) => {
      const newCategory = { ...Category };
      newCategory.products = Category.products.map((product) => {
        const newProduct = { ...product };
        if (min <= newProduct.price.total && newProduct.price.total <= max) {
          newProduct.selected = true;
        } else {
          newProduct.selected = false;
        }
        return newProduct;
      });
      return newCategory;
    });
    store.dispatch(getProductsSuccess(null));
    store.dispatch(getProductsSuccess(newProducts));
    store.dispatch(setProductsFilters(newProducts));
  }
  store.dispatch(setPriceFilters(activePrices));
  store.dispatch(setActivePrices(activePrices));
};

export const formatBusinessInfo = (data) => {
  const newData = Object.keys(data).reduce((object, key) => {
    if (key !== "products" && key !== "stores") {
      object[key] = data[key];
    }
    return object;
  }, {});

  return {
    businessInfo: newData,
    products: data.products,
    stores: data.stores,
  };
};

export const fetchBusinessData = (businessURL, pageRefresh) => {
  localStorage.setItem("business_url", businessURL);
  store.dispatch(setBusinessUrl(businessURL));
  store.dispatch(setApiError(null));

  axios
    .post(`${process.env.REACT_APP_API_URL}/authToken`, {
      business_url: businessURL,
      app_token: app_token,
    })
    .then((response) => {
      console.log(response);
      if (response.data.status === true) {
        const data = formatBusinessInfo(response.data.data);
        // business Info
        const businessInfo = { ...data.businessInfo };
        businessInfo.logo = data.businessInfo.logo ? data.businessInfo.logo : defaultLogo;

        const newSlider = { ...businessInfo.slider };
        newSlider.image = businessInfo.slider.image ? businessInfo.slider.image : defaultBanner;
        newSlider.mobile_image = businessInfo.slider.mobile_image ? businessInfo.slider.mobile_image : defaultMobileBanner;
        businessInfo.slider = newSlider;
        businessInfo.businessColors = {
          background: businessInfo.brand_color,
          color: tinycolor(businessInfo.brand_color).isLight() ? "black" : "white",
        };

        store.dispatch(setBusinessInfo(businessInfo));
        if (businessInfo.checkout_setting) {
          if (businessInfo.checkout_setting.tax_inclusive !== "1") {
            store.dispatch(setTax(5));
          }
        }

        // Stores
        const stores = data.stores.map((obj, index) => {
          const newObj = { ...obj };
          newObj.selected = index === 0 ? true : false;
          return newObj;
        });
        store.dispatch(setStores(stores));
        if (pageRefresh === true && stores.length > 1) {
          window.$("#storeModal").modal("toggle");
        }

        // Products

        const products = formatCategories(stores[0].id, data.products);
        store.dispatch(getProductsSuccess(products));
        store.dispatch(setProductsFilters(setFilteredProducts(products, false)));
        store.dispatch(setPageRefresh(false));
        store.dispatch(setHasData(true));
      } else if (response.data.status === false) {
        store.dispatch(setApiError(response.data.message));
      }
    })
    .catch((err) => {
      console.log(err);
      store.dispatch(setApiError(err.message));
    });
};

export const getAnnouncements = (accessToken) => {
  axios
    .post(
      `${process.env.REACT_APP_API_URL}/announcement`,
      {
        app_token: app_token,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
    .then((response) => {
      if (response.data.status === true) {
        if (response.data.data !== null && response.data.data.length > 0) {
          store.dispatch(setAnnouncements(response.data.data));
        } else {
          store.dispatch(setAnnouncements(defaultAnnouncements));
        }
      }
    })
    .catch((err) => {
      console.log(err);
      store.dispatch(setApiError(err.message));
    });
};
export const getFooterPages = (accessToken) => {
  axios
    .post(
      `${process.env.REACT_APP_API_URL}/pages`,
      {
        app_token: app_token,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
    .then((response) => {
      if (response.data.status === true) {
        store.dispatch(setFooterPages(response.data.data));
      }
    })
    .catch((err) => {
      console.log(err);
      store.dispatch(setApiError(err.message));
    });
};

export const checkStatus = (businessURL, pageRefresh) => {
  const storageBusinessUrl = localStorage.getItem("business_url");
  const cart = store.getState().Cart.products;
  const loggedInUser = store.getState().auth.loggenInUser;

  if (
    storageBusinessUrl !== businessURL ||
    (cart.length === 0 && loggedInUser === null)
    //&& pageRefresh === true
  ) {
    store.dispatch(setHasData(false));
    localStorage.clear();
    handleBusinessReset();
    fetchBusinessData(businessURL, pageRefresh);
  }

  if (
    (storageBusinessUrl === businessURL &&
      // pageRefresh === true &&
      cart.length !== 0) ||
    (storageBusinessUrl === businessURL &&
      // pageRefresh === true &&
      loggedInUser !== null)
  ) {
    store.dispatch(setHasData(false));
    localStorage.clear();
    handleHomeRefresh();
    fetchBusinessData(businessURL, pageRefresh);
  }
};

export const getButtonStyle = (disabled) => {
  const businessInfo = store.getState().homepage.businessInfo;
  const brandColors = businessInfo && businessInfo.businessColors;
  if (disabled === true) {
    return {
      pointerEvents: "none",
      background: brandColors?.background,
      opacity: 0.3,
    };
  } else {
    return brandColors;
  }
};

export const calculateDiscount = (card) => {
  let discountTag;
  discountTag = `-${Math.round(((card.price.retail_price - card.price.discounted_price) / card.price.retail_price) * 100)}%`;
  return discountTag;
};

export const getCategoryById = (id) => {
  const products = store.getState().homepage.Products;
  const currentCategory =
    products &&
    products.find((obj) => {
      return obj.id === id;
    });
  return currentCategory;
};
