import axios from "axios";
import { getUser } from "../utils/auth";

const BASE_URL = "http://localhost:4000/wishlist";

const getCurrentUser = () => getUser();

// FETCH USER WISHLIST
export const fetchWishlist = async () => {
  const user = getCurrentUser();
  if (!user) return [];

  const res = await axios.get(`${BASE_URL}?userEmail=${user.email}`);
  return res.data;
};

// ADD TO WISHLIST//
export const addWishlistItem = async (item) => {
  const user = getCurrentUser();
  if (!user) throw new Error("Please login");

  const res = await axios.get(`${BASE_URL}?userEmail=${user.email}`);
  const wishlist = res.data;

  // CHECK IF ALREADY EXISTS//
  const existing = wishlist.find(
    (i) => String(i.productId) === String(item.id)
  );

  if (existing) return existing;

  // NEW ITEM//
  const newItem = {
    userEmail: user.email,
    productId: String(item.id),
    title: item.title,
    price: item.price,
    image: item.image,
    category: item.category,
    stock: item.stock,
  };

  const resCreate = await axios.post(BASE_URL, newItem);
  return resCreate.data;
};

// REMOVE FROM WISHLIST
export const deleteWishlistItem = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};