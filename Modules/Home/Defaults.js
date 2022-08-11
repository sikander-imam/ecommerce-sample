export const defaultBanner = `${process.env.PUBLIC_URL}/assets/images/no_banner.jpg`;
export const defaultMobileBanner = `${process.env.PUBLIC_URL}/assets/images/400_x_260.jpg`;
export const defaultAnnouncements = ["Stay connected to see promotions"];
export const defaultLogo = `${process.env.PUBLIC_URL}/assets/images/default_web_logo.jpg`;
export const defaultMobileLogo = `${process.env.PUBLIC_URL}/assets/images/default_mobile_logo.jpg`;
export const defaultColor = "#21B6A8";
export const defaultSlider = {
  image: `${process.env.PUBLIC_URL}/assets/images/no_banner.jpg`,
  mobile_image: `${process.env.PUBLIC_URL}/assets/images/400_x_260.jpg`,
  heading: "Season Sale",
  sub_heading: "UP-TO 50% Off",
  description: "Special Featured Announcements or About Shop",
};

export const getDefaultBanner = (image) => {
  return `${process.env.PUBLIC_URL}/assets/images/${image}`;
};

export const defaultBusinessInfo = {
  logo: `${process.env.REACT_APP_URL}/assets/images/logo.png`,
  slider: {
    image: `${process.env.REACT_APP_URL}/assets/images/banner.png`,
    heading: "Season Sale",
    sub_heading: "UP-TO 50% Off",
    description: "Special Featured Announcements or About Shop",
  },
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  },
  contact: {
    email: "",
    phone: "",
    mobile: "",
    address_1: "",
    address_2: "",
  },
  brand_color: "#9a8989",
  checkout_setting: {
    with_mobile: "1",
    with_email: "1",
    tip_option: "1",
    otp_account: "1",
    same_billing: "1",
    allow_change_billing: "1",
    cash_payment: "1",
    card_payment: "1",
    tax_inclusive: "1",
  },
  businessColors: {
    background: "#9a8989",
    color: "white",
  },
};
