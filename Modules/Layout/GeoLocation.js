import { React } from "react";
import axios from "./../../library/axios";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchUserById } from "./../../thunkFunctions";

export default function GeoLocation() {
  const dispatch = useDispatch();

  const data = { a: 1 };
  const fetchOneUser = () => {
    dispatch(fetchUserById(data))
      .then(unwrapResult)
      .then((originalPromiseResult) => {
        console.log(originalPromiseResult);
      })
      .catch((rejectedValueOrSerializedError) => {
        console.log(rejectedValueOrSerializedError);
      });

    // .then((result) => {
    //   console.log(result.payload);
    // })
    // .catch((err) => {
    //   console.log(err);
    // });

    // try {
    //   const resultAction = await dispatch(fetchUserById());
    //   const user = unwrapResult(resultAction);
    //   console.log(user);
    //   // showToast("success", `Fetched ${user.name}`);
    // } catch (err) {
    //   console.log(err);
    //   // showToast("error", `Fetch failed: ${err.message}`);
    // }
  };

  const getLocation = () => {
    dispatch(fetchUserById(2))
      .then(unwrapResult)
      .then((originalPromiseResult) => {
        console.log(originalPromiseResult);
      })
      .catch((rejectedValueOrSerializedError) => {
        console.log(rejectedValueOrSerializedError);
      });
    // .then((result) => {
    //     console.log(result.payload);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // // navigator.geolocation.getCurrentPosition(function (position) {
    //   const lat = position.coords.latitude;
    //   const long = position.coords.longitude;
    //   axios
    //     .get(
    //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`,
    //       {},
    //       {
    //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //       }
    //     )
    //     .then((response) => {
    //       console.log(response);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // });
  };

  return (
    <>
      <button onClick={getLocation} className="btn-size btn-rounded btn--primary w-100 text-uppercase cart-opener">
        Get Location
      </button>
    </>
  );
}
