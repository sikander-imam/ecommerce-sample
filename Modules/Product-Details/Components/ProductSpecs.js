import React from "react";

function ProductSpecs(props) {
  const activeProduct = props.activeProduct;
  return (
    <>
      <div className="product-specs">
        <span>Brand: </span>
        <span>{activeProduct.brand.name}</span>
      </div>
      <div className="product-specs">
        <span>Availability: </span>
        <span>{activeProduct.is_available ? "Available" : "Out of Stock"}</span>
      </div>
      <div className="product-specs">
        <span>Category: </span>
        <span>{activeProduct.title}</span>
      </div>
    </>
  );
}

export default React.memo(ProductSpecs, function areEqual(prevProps, nextProps) {
  if (prevProps.myNumber !== nextProps.myNumber) {
    return false;
  }
  return true;
});
