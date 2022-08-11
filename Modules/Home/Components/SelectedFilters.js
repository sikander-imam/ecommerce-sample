import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyFilters } from "../HomeHelpers";
import { AllProductsSelector, getProductsSuccess } from "../HomeSlice";
import { PriceFiltersSelector } from "./FilterSlice";
import { SearchKeywordSelector, setSearchKeyword } from "./SearchKeywordSlice";

export default function SelectedFilters() {
  const Prices = useSelector(PriceFiltersSelector);
  const SearchKeyword = useSelector(SearchKeywordSelector);

  let Products = useSelector(AllProductsSelector);

  const SelectedCategories =
    Products &&
    Products.filter((obj) => {
      return obj.selected === true;
    });

  const SelectedPrices = Prices.filter((obj) => {
    return obj.selected === true;
  });

  const dispatch = useDispatch();

  const deleteCategoryFilter = (object) => {
    const newCategories = [...Products].map((obj) => {
      const newObj = { ...obj };
      if (object.id === obj.id) {
        newObj.selected = false;
      }
      return newObj;
    });
    applyFilters(Prices, newCategories);
  };

  const deletePriceFilter = (object) => {
    const newPrices = [...Prices].map((obj) => {
      if (object.id === obj.id) {
        const newObj = { ...obj };
        newObj.selected = false;
        return newObj;
      } else {
        return obj;
      }
    });

    applyFilters(newPrices, Products);
  };

  useEffect(() => {
    if (SelectedCategories.length === 0) {
      const newCategories = [...Products].map((obj) => {
        const newObj = { ...obj };
        newObj.selected = true;
        return newObj;
      });
      dispatch(getProductsSuccess(newCategories));
    }
  }, [SelectedCategories, Products, dispatch]);

  return (
    <>
      <div className="d-flex align-items-lg-center align-items-start">
        {SelectedCategories?.length === Products?.length && SelectedPrices?.length === 0 && SearchKeyword === "" ? (
          <div style={{ flexGrow: 1 }} className="mobile-hide">
            <p className="font-weight-500 m-0 dark-one">No Filters Selected</p>
          </div>
        ) : (
          <>
            <span className="mobile-hide">Filtered By:</span>
            <div className="filter-tags">
              {SearchKeyword !== "" && (
                <span onClick={() => dispatch(setSearchKeyword(""))}>
                  {SearchKeyword}
                  <img src={process.env.REACT_APP_URL + "/assets/images/small-crose.png"} alt="" />
                </span>
              )}
              {SelectedCategories?.length !== 0 &&
                SelectedCategories?.length !== Products?.length &&
                SelectedCategories?.map((obj, index) => {
                  return (
                    <span onClick={() => deleteCategoryFilter(obj)} key={`sc${index}`}>
                      {obj.title}
                      <img src={process.env.REACT_APP_URL + "/assets/images/small-crose.png"} alt="" />
                    </span>
                  );
                })}
              {SelectedPrices.length > 0 &&
                SelectedPrices.map((obj, index) => {
                  return (
                    <span onClick={() => deletePriceFilter(obj)} key={`sf${index}`}>
                      {obj.max === Infinity ? `more than AED ${obj.min}` : `AED ${obj.min} to AED ${obj.max}`}
                      <img src={process.env.PUBLIC_URL + "/assets/images/small-crose.png"} alt="" />
                    </span>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
