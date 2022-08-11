import React from "react";
// import "./loader.css";

export default function LoadingScreen() {
  return (
    <div class="loader loading-screen" id="loading-screen" style={{ display: "block", opacity: 1 }}>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__ball"></div>
    </div>
  );
}
