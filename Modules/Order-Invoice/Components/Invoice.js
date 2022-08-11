import { React } from "react";
import "../../../assets/css/pdf-generator.css";

export default function Invoice(props) {
  const order = props.props.order;

  return (
    <div className="col-xl-8 col-md-8 cls-m-12">
      <div className="card-repeat order-history mb-4">
        <div className="default-box">
          <div id="first-page">
            <div className="header-lefter d-flex justify-content-between align-items-center">
              <h4>Order Number: {order.format_number} </h4>
              <h4>Date: {new Date(order.created_at).toDateString()} </h4>
            </div>
            <hr className="mt-0" />
            <div className="row">
              <div className="col-xl-3 col-lg-6 col-sm-6">
                <div className="bill-to">
                  <h4 className="dark-one font-weight-700">Bill to</h4>
                  <h5 className="dark-one font-weight-700">{order.shipping_info.billing_address.name}</h5>
                  <p>{order.shipping_info.billing_address.city.name}, UAE</p>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-sm-6">
                <div className="ship-to">
                  <h4 className="dark-one font-weight-700">Ship to</h4>
                  <h5 className="dark-one font-weight-700">{order.shipping_info.shipping_address.name}</h5>
                  <p>{order.shipping_info.shipping_address.city.name} , UAE</p>
                  <p>Tel {order.shipping_info.shipping_address.phone}</p>
                </div>
              </div>
              <div className="col-xl-5 col-lg-12 col-sm-12">
                <div className="invoice-number">
                  <h4 className="dark-one font-weight-700">Invoice No. #{order.invoice_number}</h4>
                  <img src={`${process.env.PUBLIC_URL}/assets/images/barcode.png`} alt="" />
                  <div className="other-info">
                    <p className="m-0">Payment:</p>
                    <h5 className="dark-one font-weight-700">{order.payment_type.title}</h5>
                  </div>
                  <div className="other-info">
                    <p className="m-0">Shipping:</p>
                    <h5 className="dark-one font-weight-700">Standard</h5>
                  </div>
                  <div className="other-info">
                    <p className="m-0">Email:</p>
                    <h5 className="dark-one font-weight-700">{order.shipping_info.billing_address.email}</h5>
                  </div>
                </div>
              </div>
            </div>
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
                  {order.details.map((obj, index) => {
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
                  <span>{`AED ${order.sub_total}`}</span>
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
