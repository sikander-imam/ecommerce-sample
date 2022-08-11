import store from "../../Store/store";
import { getProductPrice } from "../Cart/PricesHelper";
import { setActiveProduct, setColor, setSize, setVariantOptions } from "./ProductDetailsSlice";

export const getCurrentCategory = (category_slug) => {
  const products = store.getState().homepage.Products;
  const currentCategory =
    products &&
    products.find((obj) => {
      return obj.slug === category_slug;
    });
  return currentCategory;
};

export const getCurrentProduct = (category_slug, product_slug) => {
  const currentProduct = getCurrentCategory(category_slug)?.products?.find((obj) => {
    return obj.slug === product_slug;
  });
  return currentProduct;
};

export const handleVariantChange = (product, color, size) => {
  const activeVariant = product.variants.filter((obj) => {
    return Object.values(obj.options)[0] === Number(color) && Object.values(obj.options)[1] === Number(size);
  })[0];
  const newProd = { ...product };
  newProd.variants = product.variants.map((obj) => {
    const newObj = { ...obj };
    if (activeVariant === undefined) {
      newObj.selected = false;
    } else {
      newObj.selected = obj.id === activeVariant.id ? true : false;
    }

    return newObj;
  });

  newProd.price = getProductPrice(newProd);
  store.dispatch(setActiveProduct(newProd));
};

export const resetActiveProduct = (product) => {
  const newProd = { ...product };
  newProd.variants = product.variants.map((obj) => {
    const newObj = { ...obj };
    newObj.selected = false;
    return newObj;
  });
  newProd.price = getProductPrice(newProd);
  store.dispatch(setColor(null));
  store.dispatch(setSize(null));
  store.dispatch(setActiveProduct(newProd));
};

export const getVariantPriceRanges = (product) => {
  const allPrices = [];
  const allDiscounts = [];
  product.variants.forEach((obj) => {
    const discounted_price = Number(obj.discounted_price);
    const retail_price = Number(obj.retail_price);
    allPrices.push(retail_price);
    allDiscounts.push(discounted_price > 0 ? ((retail_price - discounted_price) * 100) / retail_price : 0);
  });
  const price_range = {
    min: Math.min(...allPrices),
    max: Math.max(...allPrices),
  };
  const discount_range = {
    min: Math.min(...allDiscounts),
    max: Math.max(...allDiscounts),
  };

  const price = getPriceExpression(price_range);
  const discount = getDiscountExpression(discount_range);
  return { price: price, discount: discount };
};

const getPriceExpression = (price_range) => {
  const min = price_range.min;
  const max = price_range.max;
  let exp;
  if (min === 0) {
    exp = `AED ${price_range.max}`;
  }
  if (min > 0 && min === max) {
    exp = `AED ${price_range.max}`;
  }
  if (min > 0 && min !== max) {
    exp = `AED ${price_range.min} - AED ${price_range.max} `;
  }

  return exp;
};

const getDiscountExpression = (discount_range) => {
  const min = discount_range.min;
  const max = discount_range.max;
  let exp;
  if (min === 0 && max === 0) {
    exp = null;
  }
  if (min === 0 && max > 0) {
    exp = `-${max}%`;
  }
  if (min > 0 && min === max) {
    exp = `-${max}%`;
  }
  if (min > 0 && min !== max) {
    exp = `-${max}%`;
  }

  return exp;
};

export const getProductPriceExp = (product) => {
  const businessInfo = store.getState().homepage.businessInfo;
  const brandColors = businessInfo && businessInfo.businessColors;
  let exp;

  const getExp = (retail, discounted) => {
    // console.log(retail, discounted);
    return discounted > 0 && discounted !== retail ? (
      <>
        <del>{`AED ${retail}`}</del>
        <span className="text--primary" style={{ color: brandColors && brandColors.background }}>
          {`AED ${discounted}`}
        </span>
      </>
    ) : (
      <span className="text--primary" style={{ color: brandColors && brandColors.background }}>{`AED ${retail}`}</span>
    );
  };

  if (product.has_addons_or_variants === 0) {
    exp = getExp(product.price.retail_price, product.price.discounted_price);
  }

  if (product.has_addons_or_variants === 1) {
    exp = getExp(product.price.retail_price, product.price.discounted_price);
  }

  if (product.has_addons_or_variants === 2) {
    const activeVariant = product.variants.filter((obj) => {
      return obj.selected === true;
    })[0];
    if (activeVariant === undefined) {
      if (product.variants.length > 0) {
        exp = (
          <span className="text--primary" style={{ color: brandColors && brandColors.background }}>
            {getVariantPriceRanges(product).price}
          </span>
        );
      } else if (product.variants.length === 0) {
        exp = getExp(Number(product.price.retail_price), Number(product.price.discounted_price));
      }
    }
    if (activeVariant !== undefined) {
      exp = getExp(Number(activeVariant.retail_price), Number(activeVariant.discounted_price));
    }
  }

  return exp;
};

export const getProductDiscountExp = (product) => {
  let exp;

  const getExp = (retail, discounted) => {
    return discounted === 0 ? null : (
      <div className="sale-tag">
        <span>{`-${Math.round(((retail - discounted) / retail) * 100)}%`}</span>
      </div>
    );
  };

  if (product.has_addons_or_variants === 0 && product.price.discounted_price > 0 && product.price.discounted_price !== product.price.retail_price) {
    exp = getExp(product.price.retail_price, product.price.discounted_price);
  }

  if (product.has_addons_or_variants === 1 && product.price.discounted_price > 0 && product.price.discounted_price !== product.price.retail_price) {
    exp = getExp(product.price.retail_price, product.price.discounted_price);
  }

  if (product.has_addons_or_variants === 2) {
    const activeVariant = product.variants.filter((obj) => {
      return obj.selected === true;
    })[0];
    if (activeVariant === undefined) {
      if (product.variants.length > 0) {
        const discount = getVariantPriceRanges(product).discount;
        if (discount !== null) {
          exp = (
            <div className="sale-tag">
              <span>{discount}</span>
            </div>
          );
        }
      }
    }
    if (activeVariant !== undefined) {
      exp = getExp(Number(activeVariant.retail_price), Number(activeVariant.discounted_price));
    }
  }

  return exp;
};

export const setActiveProductStatus = (product) => {
  if (store.getState().ProductDetails.activeProduct !== null) {
    store.dispatch(setActiveProduct(null));
    store.dispatch(setVariantOptions(null));
  }
  if (product?.has_addons_or_variants !== 2) {
    store.dispatch(setVariantOptions(null));
  }
  if (product?.has_addons_or_variants === 2) {
    const newOptions = Object.keys(product.product_variants).map((obj, index) => {
      return `option${index}`;
    });
    store.dispatch(setVariantOptions(newOptions));
  }
  store.dispatch(setActiveProduct(product));
};

export const getProductImages = (product) => {
  let images = [];
  if (product?.has_addons_or_variants === 2) {
    product.variants.forEach((variant, index) => {
      images.push(variant.image ? variant.image : product.images[index]);
    });
  } else {
    images = product.images;
  }
  return images;
};

export const getCartItemImage = (cartItem) => {
  let image;
  if (cartItem.product.has_addons_or_variants === 2 && cartItem.variant) {
    image = cartItem.variant.image ? cartItem.variant.image : cartItem.product.images[0];
  } else {
    image = cartItem.product.images[0];
  }

  return image;
};
