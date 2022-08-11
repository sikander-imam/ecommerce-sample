import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyFilters, setFilteredProducts } from "../HomeHelpers";
import { businessInfoSelector } from "../HomeSlice";
import { activePricesSelector, ProductsFiltersSelector, setActivePrices, setProductsFilters } from "./FilterSlice";

const FilterSideModal = () => {
  const dispatch = useDispatch();
  const businessInfo = useSelector(businessInfoSelector);
  const brandColors = businessInfo && businessInfo.businessColors;

  const activePrices = useSelector(activePricesSelector);
  const activeProducts = useSelector(ProductsFiltersSelector);

  const checkEveryforFalse = (obj) => {
    return obj.selected === false;
  };
  const checkEveryforTrue = (obj) => {
    return obj.selected === true;
  };

  const handleCategoryFilter = (object) => {
    const newCategories = [...activeProducts].map((obj) => {
      const newObj = { ...obj };
      if (object.id === newObj.id) {
        newObj.selected = !newObj.selected;
      }
      return newObj;
    });

    if (newCategories?.every(checkEveryforFalse) || newCategories?.every(checkEveryforTrue)) {
      dispatch(setProductsFilters(setFilteredProducts(newCategories, false)));
    } else {
      dispatch(setProductsFilters(newCategories));
    }
  };

  const handleAllCategories = () => {
    dispatch(setProductsFilters(setFilteredProducts(activeProducts, false)));
  };

  const handleAllPriceRanges = () => {
    const newPrices = [...activePrices]?.map((obj) => {
      const newObj = { ...obj };
      newObj.selected = false;
      return newObj;
    });
    dispatch(setActivePrices(newPrices));
  };

  const handlePricesFilter = (indexNum) => {
    const newPrices = [...activePrices]?.map((obj, index) => {
      const newObj = { ...obj };
      index === indexNum ? (newObj.selected = !obj.selected) : (newObj.selected = false);
      return newObj;
    });
    dispatch(setActivePrices(newPrices));
  };

  return (
    <>
      <div data-backdrop="static" data-keyboard="false" className="right-modal profilter-modal scroll-bar-thin">
        <div className="panel-top">
          <h3 className="dark-one font-weight-700">Filters</h3>
          <span
            className="filter-opener right-modal-dismiss"
            onClick={() => {
              window.$("body").toggleClass("filter-modal-open");
            }}
          >
            <i></i> <i></i>
          </span>
        </div>
        <div className="bg-white padding-inner mt-3 mb-4">
          <div className="modal-boxer">
            <p className="font-weight-700 dark-one mb-4">Categories</p>
            {activeProducts &&
              activeProducts.map((obj, index) => {
                return (
                  <div className="form-group custom-checkbox" key={index}>
                    <input type="checkbox" checked={obj.selected} className="custom-control-input" id={`sc${index + 1}`} readOnly={true} />
                    <label
                      className="custom-control-label w-100 h-100 pl-4"
                      htmlFor={`sc${index + 1}`}
                      onClick={() => {
                        handleCategoryFilter(obj);
                      }}
                    >
                      <span className="pl-2">{obj.title}</span>
                    </label>
                  </div>
                );
              })}
            <div className="form-group custom-checkbox">
              <input
                type="checkbox"
                checked={activeProducts?.every(checkEveryforFalse)}
                className="custom-control-input"
                id={`scAll`}
                readOnly={true}
              />
              <label className="custom-control-label w-100 h-100 pl-4" htmlFor={`scAll`} onClick={handleAllCategories}>
                <span className="pl-2">All</span>
              </label>
            </div>
          </div>
          <div className="modal-boxer">
            <p className="font-weight-700 dark-one mb-4 mt-4">Price</p>
            {activePrices &&
              activePrices.map((obj, index) => {
                return (
                  <div className="form-group custom-checkbox" key={index}>
                    <input type="checkbox" checked={obj.selected} className="custom-control-input" id={`pr${index + 1}`} readOnly={true} />
                    <label
                      className="custom-control-label w-100 h-100 pl-4"
                      htmlFor={`pr${index + 1}`}
                      onClick={() => {
                        handlePricesFilter(index);
                      }}
                    >
                      <span className="pl-2">{obj.max === Infinity ? `more than AED ${obj.min}` : `AED ${obj.min} to AED ${obj.max}`}</span>
                    </label>
                  </div>
                );
              })}
            <div className="form-group custom-checkbox">
              <input type="checkbox" checked={activePrices?.every(checkEveryforFalse)} className="custom-control-input" id="pr4" readOnly={true} />
              <label className="custom-control-label w-100 h-100 pl-4" htmlFor="pr4" onClick={handleAllPriceRanges}>
                <span className="pl-2">All Prices</span>
              </label>
            </div>
          </div>
          <button
            style={brandColors}
            type="button"
            className="btn-size btn-rounded btn--primary btn-large text-uppercase w-100 mt-4"
            onClick={() => applyFilters(activePrices, activeProducts)}
          >
            Apply
          </button>
        </div>
      </div>
      {/* <div className="body-overlay"></div> */}
    </>
  );
};

export default FilterSideModal;
