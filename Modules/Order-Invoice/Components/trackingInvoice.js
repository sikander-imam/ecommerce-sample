import { React } from "react";
import "../../../assets/css/pdf-generator.css";

export default function TrackingInvoice(props) {
  const order = props.props.order;
  return (
    <div className="col-xl-8 col-md-8 cls-m-12">
      <div className="card-repeat order-history mb-4">
        <div className="default-box">
          <div id="first-page">
            <div className="header-lefter d-flex justify-content-between align-items-center">
              <h4>Order Number: {order && order.format_number} </h4>
              <h4>Date: {new Date(order && order.created_at).toDateString()}</h4>
            </div>
            <hr className="mt-0" />
            <div className="table-responsive scroll-bar-thin">
              <table className="table table-space v-middle order-table">
                <thead>
                  <tr>
                    <th scope="col">Item Description</th>
                    <th scope="col">QTY</th>
                    <th scope="col">Price</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order &&
                    order.details.map((obj, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <div className="same-td">
                              <div className="pro-img">
                                <img src={obj.product.image} alt="" />
                              </div>
                              <div className="righter">
                                <p className="order-detail-product dark-one font-weight-700 mb-0">{obj.product.title}</p>
                                {/* <small className="order-detail-tagline dark-three">
                                {obj.product.description}
                              </small> */}
                              </div>
                            </div>
                          </td>
                          <td>X{obj.qty}</td>
                          <td>
                            {Number(obj.discount) > 0 ? (
                              <>
                                <p className="mb-0 order-total dark-three">
                                  <del>{`AED ${obj.price}`} </del>
                                </p>
                                <p className="mb-0 order-total">{`AED ${obj.price - Number(obj.discount)}`}</p>
                              </>
                            ) : (
                              <p className="mb-0 order-total">{`AED ${obj.price}`}</p>
                            )}
                          </td>
                          <td>
                            <p className="mb-0 order-total">{`AED ${obj.total}`}</p>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="text-right">
              <ul className="invoice-subtotal">
                <li>
                  <span> Subtotal: </span>
                  <span>{`AED ${order && order.sub_total}`}</span>
                </li>
                <li className="font-weight-700">
                  <span>Discounts:</span>
                  <span>{`AED ${order.discount !== null ? order.discount : 0}`}</span>
                </li>
                <li>
                  <span> Shipping: </span>
                  <span>{`AED ${order.shipping_charges !== null ? order.shipping_charges : 0}`}</span>
                </li>
                <li>
                  <span> Tax:</span>
                  <span>{`AED ${order.tax}`}</span>
                </li>
                <li>
                  <span>Total (incl. VAT):</span>
                  <span>{`AED ${Number(order.total)}`}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
