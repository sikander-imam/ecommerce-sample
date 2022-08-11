import { React, useEffect } from "react";
import ProductCard from "./ProductCard";
import * as Scroll from "react-scroll";
import { useSelector } from "react-redux";
import { AllProductsSelector } from "../HomeSlice";
import { SearchKeywordSelector } from "./SearchKeywordSlice";
import { resizeWindow } from "../../../usejQuery";

export default function ProductCategory() {
  let products = useSelector(AllProductsSelector);
  const SearchKeyword = useSelector(SearchKeywordSelector);

  if (SearchKeyword !== "") {
    const newProducts = products.map((category) => {
      const newCategory = { ...category };
      const newProduct = newCategory.products.filter((obj) => {
        const title = obj.title.toUpperCase();
        const keyword = SearchKeyword.toUpperCase();
        return title.includes(keyword);
      });
      newCategory.products = newProduct;
      return newCategory;
    });
    products = newProducts;
  }

  const checkEveryProduct = (obj) => {
    return obj.selected === false;
  };
  resizeWindow();

  useEffect(() => {
    resizeWindow();
  }, []);

  return (
    <>
      {products &&
        products.map((obj, index) => {
          return (
            obj.selected === true && (
              <Scroll.Element name={obj.title} className="element" key={index} id={obj.title}>
                <div className="product-wrap radius-10">
                  <h4 className="dark-one font-weight-700 mb-3">{`${obj.title}`}</h4>
                  <div className="row mob-50">
                    {obj.products.length === 0 || obj.products.every(checkEveryProduct)
                      ? "No products found"
                      : obj.products.map((object, index) => {
                          return (
                            object.selected === true && (
                              <ProductCard
                                props={{
                                  data: object,
                                  category_slug: obj.slug,
                                  categrory_title: obj.title,
                                }}
                                key={index}
                              />
                            )
                          );
                        })}
                  </div>
                </div>
              </Scroll.Element>
            )
          );
        })}
    </>
  );
}
