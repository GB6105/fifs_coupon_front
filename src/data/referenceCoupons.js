// src/data/referenceCoupons.js

export const REFERENCE_COUPONS = [
  {
    coupon_name: "StarBugs",
    display_name: "StarBugs",
    total_stock: 10,
    id: 1 
  },
  {
    coupon_name: "TwoThumb Place",
    display_name: "TwoThumb Place",
    total_stock: 10,
    id: 2
  },
  {
    coupon_name: "Megabyte Coffee",
    display_name: "Megabyte Coffee",
    total_stock: 10,
    id: 3
  }
];

export const COUPON_NAME_TO_ID = REFERENCE_COUPONS.reduce((map, coupon) => {
    map[coupon.coupon_name] = coupon.id;
    return map;
}, {});