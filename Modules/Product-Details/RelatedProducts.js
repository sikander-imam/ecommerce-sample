import { React } from "react";
import ProductCard from "./../Home/Components/ProductCard";

export default function RelatedProducts(props) {
  const relatedProducts = props.props.data;
  return (
    <>
      {relatedProducts.products.length > 0 && (
        <>
          <h4 className="dark-one font-weight-700 mb-3 mt-7">
            {`${relatedProducts.title}`}
          </h4>
          <div className="row mob-50">
            {relatedProducts.products.map((obj, index) => {
              return index < 4 ? (
                <ProductCard
                  props={{
                    data: obj,
                    category_slug: relatedProducts.slug,
                    categrory_title: relatedProducts.title,
                  }}
                  key={index}
                />
              ) : null;
            })}
          </div>
        </>
      )}
    </>
  );
}
