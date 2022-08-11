import store from "../../Store/store";

export const getTotalPrices = (cartStatus) => {
  const ProductPrices = cartStatus?.map((obj) => {
    return obj?.product?.price?.total;
  });
  const total_prices = ProductPrices?.reduce(function (a, b) {
    return a + b;
  }, 0);

  return total_prices;
};

export const getProductPrice = (product) => {
  const productDiscount = product?.discount_value === false ? 0 : product?.discount_value;

  let price;
  // (Number(productPrice) - Number(productDiscount)) *

  if (product?.has_addons_or_variants === 0) {
    const productPrice = product?.discounted_price > 0 ? product?.discounted_price : product?.retail_price;
    const retail_price = Number(product?.retail_price);
    const discounted_price = Number(product?.discounted_price);
    const total = Number(productPrice) * Number(product?.quantity);
    price = {
      retail_price: Number(retail_price),
      discounted_price: discounted_price === null ? 0 : Number(discounted_price),
      discount_value: Number(productDiscount),
      addOnPrice: 0,
      total: total,
    };
  }
  if (product?.has_addons_or_variants === 1) {
    const productPrice = product?.discounted_price > 0 ? product?.discounted_price : product?.retail_price;
    const AddOnPrices = product?.addons
      ?.filter((obj) => {
        return obj?.selected === true;
      })
      ?.map((addon) => {
        return addon?.price;
      })
      .reduce(function (a, b) {
        return Number(a) + Number(b);
      }, 0);
    const retail_price = Number(product?.retail_price);
    const discounted_price = Number(product?.discounted_price);
    const addOnPrice = Number(AddOnPrices) ? Number(AddOnPrices) : 0;
    const total = (Number(productPrice) + Number(AddOnPrices)) * Number(product?.quantity);

    price = {
      retail_price: Number(retail_price),
      discounted_price: discounted_price === null ? 0 : Number(discounted_price),
      discount_value: Number(productDiscount),
      addOnPrice: addOnPrice,
      total: total,
    };
  } else if (product?.has_addons_or_variants === 2) {
    const selectedVariant = product?.variants?.filter((obj) => {
      return obj?.selected === true;
    })[0];
    let productPrice;
    productPrice =
      selectedVariant !== undefined
        ? selectedVariant?.discounted_price > 0
          ? selectedVariant?.discounted_price
          : selectedVariant?.retail_price
        : product?.discounted_price > 0
        ? product?.discounted_price
        : product?.retail_price;

    const retail_price = selectedVariant !== undefined ? selectedVariant?.retail_price : product?.retail_price;

    const discounted_price = selectedVariant !== undefined ? selectedVariant?.discounted_price : product?.discounted_price;
    const total = Number(productPrice) * Number(product?.quantity);

    price = {
      retail_price: Number(retail_price),
      discounted_price: discounted_price === null ? 0 : Number(discounted_price),
      discount_value: Number(productDiscount),
      addOnPrice: 0,
      total: total,
    };
  }
  return price;
};

export const productPriceExp = (prod) => {
  const businessInfo = store.getState().homepage.businessInfo;
  const brandColors = businessInfo && businessInfo.businessColors;

  return prod.product.price.discount_value > 0 ? (
    <>
      <del>{`AED ${prod.product.price.total}`}</del>
      <span style={{ color: brandColors.background }}>{`AED ${(prod.product.price.total - prod.product.price.discount_value).toFixed(2)}`}</span>
    </>
  ) : (
    <span>{`AED ${prod.product.price.total}`}</span>
  );
};

export const getProductsDiscountValue = (cartStatus) => {
  const allDiscountValues = cartStatus?.map((obj) => {
    return obj.product.price.discount_value;
  });
  const totalDiscountValues = allDiscountValues?.reduce(function (a, b) {
    return a + b;
  }, 0);

  return Number(totalDiscountValues);
};
