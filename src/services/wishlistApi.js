
import axios from "axios";
import { getUser } from "../utils/auth";

const BASE_URL = "https://d3gliasorrrnwn.cloudfront.net/api/Wishlist";

const getCurrentUser = () => getUser();

// FETCH USER WISHLIST
export const fetchWishlist = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return [];
  }

  const res = await axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.wishlistItems || [];
};

// ADD TO WISHLIST
export const addWishlistItem = async (item) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login");
  }

  const res = await axios.post(
    `${BASE_URL}/items?productId=${item.id}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    id: res.data.id,
    productId: res.data.productId,
    product: item,
  };
};

// REMOVE FROM WISHLIST
export const deleteWishlistItem = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login");
  }

  await axios.delete(`${BASE_URL}/items/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

