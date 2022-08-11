/* eslint-disable react/jsx-no-comment-textnodes */
import { React } from "react";
import { useSelector } from "react-redux";
import { FooterPagesSelector, businessUrlSelector, AllProductsSelector } from "../Home/HomeSlice";
import { Link } from "react-router-dom";
import $ from "jquery";
import { businessInfoSelector } from "./../Home/HomeSlice";

export default function Footer(props) {
  const businessUrl = useSelector(businessUrlSelector);
  const pages = useSelector(FooterPagesSelector);
  const products = useSelector(AllProductsSelector);
  const businessInfo = useSelector(businessInfoSelector);
  const brandColors = businessInfo && businessInfo.businessColors;

  const social = businessInfo && businessInfo.social;
  const contact = businessInfo && businessInfo.contact;

  return (
    <>
      {products && (
        <footer className={props.props.classnames}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 footer-inner">
                <ul className="socials">
                  {social &&
                    Object.keys(social).map((obj, index) => {
                      return (
                        social[obj] !== null && (
                          <li key={index}>
                            <a rel="noopener noreferrer" href={`${social[obj]}`} style={brandColors} target="_blank">
                              <i className={`fab fa-${obj}`}></i>
                            </a>
                          </li>
                        )
                      );
                    })}
                </ul>
                <div className="footer-infos">
                  <a href={`mailto:${contact?.email}`}>{contact?.email}</a>
                  <a href={`callto:${contact && contact?.mobile}`}>{contact && contact?.mobile}</a>
                </div>
                <ul className="simple-links">
                  {pages &&
                    pages.map((obj, index) => {
                      return (
                        obj.is_active === 1 && (
                          <li key={`page${index}`}>
                            <Link
                              to={{
                                pathname: `/${businessUrl}/pages/${obj.slug}`,
                                page: obj,
                              }}
                              onClick={() => {
                                $(".sidebar").removeClass("active");
                                $(".close-sidebar").removeClass("active");
                              }}
                            >
                              {obj.title}
                            </Link>
                          </li>
                        )
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
