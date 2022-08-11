import store from "../../../Store/store";
import { setActiveCategory } from "../../Home/HomeSlice";
import { setAddon, setVariant } from "../ProductDetailsSlice";

export const destroyProductSelection = () => {
  store.dispatch(setVariant(null));
  store.dispatch(setAddon([]));
  store.dispatch(setActiveCategory(null));
};

export function getKeyByValue(object, value) {
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (object[prop] === value) return prop;
    }
  }
}
