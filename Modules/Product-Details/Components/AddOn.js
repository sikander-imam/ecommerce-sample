import { React } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeProductSelector, setActiveProduct } from "./../ProductDetailsSlice";
import { getProductPrice } from "./../../Cart/PricesHelper";

export default function AddOn(props) {
  const dispatch = useDispatch();
  const activeProduct = useSelector(activeProductSelector);
  const addOns = props.props;

  const handleAddOns = (indexNum) => {
    const newProd = { ...activeProduct };
    newProd.addons = activeProduct.addons.map((obj, index) => {
      const newObj = { ...obj };
      if (indexNum === index) {
        newObj.selected = !activeProduct.addons[index].selected;
      }
      return newObj;
    });

    newProd.price = getProductPrice(newProd);
    dispatch(setActiveProduct(newProd));
  };

  return (
    <div className="form-group mb-0 mt-4">
      <label className="addons-lbl">Addons </label>
      {addOns &&
        addOns.map((obj, index) => {
          return (
            <div
              className={`addon-flexer Addons-extra mt-2 ${obj.selected === true ? "selected" : null}`}
              key={index}
              onClick={() => {
                handleAddOns(index);
              }}
            >
              <p className="font-weight-500 mb-0"> {obj.name} </p>
              <p className="font-weight-500 mb-0"> {`AED ${obj.price}`} </p>
            </div>
          );
        })}
    </div>
  );
}
