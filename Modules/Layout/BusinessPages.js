import { React, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { resizeWindow } from "../../usejQuery";
import ProfileOptions from "../Home/Components/ProfileOptions";
import { FooterPagesSelector } from "../Home/HomeSlice";
import { useParams } from "react-router";
import purify from "dompurify";

export default function BusinessPage(props) {
  const params = useParams();
  const page = useSelector(FooterPagesSelector).filter((obj) => {
    return obj.slug === params.page_slug;
  })[0];

  useEffect(() => {
    resizeWindow();
  }, [props]);

  return (
    <>
      <Helmet>
        <title>Store | {page.title}</title>
        <meta name="description" content={page.meta_discription} />
      </Helmet>
      <main className="wrapper" style={{ minHeight: "610px" }}>
        <section id="main-body" className="pl-3 pt-4 pb-70">
          <div className="container-fluid">
            <div className="mobile-hide">
              <ProfileOptions props={{ searchBar: false }} />
            </div>
            <div className="product-wrappers">
              <div className="product-wrap radius-10 mt-4">
                <div className="row">
                  <section id="main-body" className="full-height p-6 d-flex align-items-center">
                    <div className="container">
                      <h1>{page.heading} </h1>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: purify.sanitize(page.content),
                        }}
                      ></p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
