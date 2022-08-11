import { React, useState, useEffect } from "react";
import * as Scroll from "react-scroll";
import { useDispatch, useSelector } from "react-redux";
import { AllProductsSelector, isHomePageSelector, activeCategorySelector, businessUrlSelector } from "../Home/HomeSlice";
import { useHistory } from "react-router";
import { setScrollToCategory } from "./LayoutSlice";

export default function SideBarCategories(props) {
  const activeCategory = useSelector(activeCategorySelector);
  const products = useSelector(AllProductsSelector);
  const isHomePage = useSelector(isHomePageSelector);
  const businessUrl = useSelector(businessUrlSelector);
  const [firstCateAsActive, setFirstCateAsActive] = useState(true);
  const type = props?.props;
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      let elem = products && document.querySelector(`#${products[0].title}`);
      let rect = elem && elem.getBoundingClientRect().top;
      rect <= 0 && setFirstCateAsActive(false);
      rect > 0 && setFirstCateAsActive(true);
    });
  }, [products]);

  const scrollProps = {
    smooth: false,
    offset: 20,
  };

  const handleCateSelection = (element) => {
    if (isHomePage === false) {
      history.push(`/${businessUrl}`);
      dispatch(setScrollToCategory(element));

      setTimeout(() => {
        Scroll.scroller.scrollTo(element, scrollProps);
        setTimeout(() => {
          Scroll.scroller.scrollTo(element, scrollProps);
        }, 500);
      }, 500);
    }
  };

  return (
    <>
      {products &&
        products.map((obj, index) => {
          return (
            <li className="nav-item" key={index} style={{ cursor: "pointer" }}>
              <Scroll.Link
                activeClass="active"
                to={obj.title}
                spy={true}
                smooth={true}
                offset={type === "desktop-hide" ? -70 : 10}
                duration={300}
                className={obj.title === activeCategory || (index === 0 && firstCateAsActive === true && isHomePage === true) ? "active" : null}
                onClick={() => handleCateSelection(obj.title)}
              >
                {obj?.title}
              </Scroll.Link>
            </li>
          );
        })}
    </>
  );
}
