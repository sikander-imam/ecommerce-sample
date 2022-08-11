import { React } from "react";
import { format } from "date-fns";

export default function History(props) {
  const history = props?.props?.order?.history;

  return (
    <div className="card-repeat order-history mb-4">
      <div className="print-box">
        <div className="mb-4">
          <h4 className="dark-one">History</h4>
          <hr className="mt-0" />
          <ul className="mb-4 pt-3 pl-4 pr-4">
            {history?.map((obj, index) => {
              return (
                <li className="shiporder" key={`history${index}`}>
                  <div className="print-meta-txt">
                    <h6>{obj.title}</h6>
                    <p>{format(new Date(obj.created_at), "dd-MM-yyyy hh:mm a")}</p>
                  </div>
                </li>
              );
            })}
            {/* <li className="placeorder">
              <div className="print-meta-txt">
                <h6>Place Order</h6>
                <p>21-Oct-2020 09:23 AM</p>
              </div>
            </li>
            <li className="payorder">
              <div className="print-meta-txt">
                <h6>Pay Success</h6>
                <p>21-Oct-2020 09:23 AM</p>
              </div>
            </li>
            <li className="shiporder">
              <div className="print-meta-txt">
                <h6>Shipment</h6>
                <p>21-Oct-2020 09:23 AM</p>
              </div>
            </li>
            <li className="comporder">
              <div className="print-meta-txt">
                <h6>Order Complete</h6>
                <p>21-Oct-2020 09:23 AM</p>
              </div>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}
