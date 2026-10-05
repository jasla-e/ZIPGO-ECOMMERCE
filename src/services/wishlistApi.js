import axios from "axios";
import { getUser } from "../utils/auth";

const getCurrentUser = () => getUser();

// FETCH USER WISHLIST
export const fetchWishlist = async () => {

  const token=localStorage.getItem("token");
   if(!token){
    return[]
   }

  const res = await axios.get(
    "https://localhost:7150/api/Wishlist",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.wishlistItems || [];
};

// ADD TO WISHLIST//
export const addWishlistItem = async (item) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login");
  }

  const res = await axios.post(
    `https://localhost:7150/api/Wishlist/items?productId=${item.id}`,
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

  await axios.delete(
    `https://localhost:7150/api/Wishlist/items/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};