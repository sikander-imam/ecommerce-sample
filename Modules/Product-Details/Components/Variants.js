import { React } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeProductSelector, setVariantOptions, variantOptionsSelector } from "../ProductDetailsSlice";
import AddToCart from "./AddtoCart";

export default function ProductVariants() {
  const activeProduct = useSelector(activeProductSelector);
  const variantOptions = useSelector(variantOptionsSelector);
  const dispatch = useDispatch();

  const handleOptionChange = (e, indexNum) => {
    const newArray = [...variantOptions];
    newArray[indexNum] = e.target.value;
    dispatch(setVariantOptions(newArray));
  };

  const product_variants = activeProduct.product_variants;

  return (
    <>
      {activeProduct.has_addons_or_variants === 2 && Object.keys(product_variants).length === 0 && (
        <div className="row">
          <div className="col-lg-7"></div>
          <div className="col-lg-5">
            <div className="desktop-hide">
              <AddToCart props={"mt-5"} />
            </div>
            <div className="mobile-hide">
              <AddToCart />
            </div>
          </div>
        </div>
      )}

      {activeProduct.has_addons_or_variants === 2 &&
        product_variants.length !== 0 &&
        Object.keys(product_variants).map((obj, index) => {
          return (
            <div className="row" key={`variant${activeProduct.id + index}`}>
              <div className="col-lg-7">
                <>
                  <label> {obj} </label>
                  <div className="form-icon">
                    <select
                      className="form-control sm-control"
                      onChange={(e) => {
                        handleOptionChange(e, index);
                      }}
                    >
                      <option defaultValue={true} value="">
                        {`--Select ${obj}--`}
                      </option>
                      {Object.keys(product_variants[obj]).map((object) => {
                        return (
                          <option value={product_variants[obj][object]} key={object}>
                            {product_variants[obj][object]}
                          </option>
                        );
                      })}
                    </select>
                    <span className="form-icon-ico">
                      <img alt="" src={`${process.env.PUBLIC_URL}/assets/images/arrow-down.png`} />
                    </span>
                  </div>
                </>
              </div>
              <div className="col-lg-5">
                {index === Object.keys(product_variants).length - 1 && (
                  <>
                    <div className="desktop-hide">
                      <AddToCart props={"mt-5"} />
                    </div>
                    <div className="mobile-hide">
                      <AddToCart />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

      {activeProduct.has_addons_or_variants !== 2 && (
        <div className="row">
          <div className="col-lg-7"></div>
          <div className="col-lg-5">
            <div className="desktop-hide">
              <AddToCart props={"mt-5"} />
            </div>
            <div className="mobile-hide">
              <AddToCart />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
