import axios from "axios";
import { getUser } from "../utils/auth";

const BASE_URL = "http://localhost:4000/cart";


const getCurrentUser = () => {
  return getUser();
};


export const fetchCart = async () => {
  const user = getCurrentUser();

  if (!user) return [];

  const res = await axios.get(
    `${BASE_URL}?userEmail=${user.email}`
  );

  return res.data;
};


export const addCartItem = async (item) => {
  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please login");
  }

  const res = await axios.get(
    `${BASE_URL}?userEmail=${user.email}`
  );

  const cart = res.data;

  const existing = cart.find(
    (i) =>
      String(i.productId) === String(item.id)
  );

  if (existing) {
    const updated = {
      ...existing,
      quantity: Number(existing.quantity) + 1,
    };

    const resUpdate = await axios.put(
      `${BASE_URL}/${existing.id}`,
      updated
    );

    return resUpdate.data;
  }

  const newItem = {
    userEmail: user.email,
    productId: String(item.id),
    title: item.title,
    price: item.price,
    image: item.image,
    category: item.category,
    stock: item.stock,
    quantity: 1,
  };

  const resCreate = await axios.post(
    BASE_URL,
    newItem
  );

  return resCreate.data;
};


export const deleteCartItem = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateCartItem = async (
  id,
  updatedItem
) => {
  const res = await axios.put(
    `${BASE_URL}/${id}`,
    updatedItem
  );

  return res.data;
};


export const clearCartApi = async () => {
  const user = getCurrentUser();

  if (!user) return;

  // get all user cart items//
  const res = await axios.get(
    `${BASE_URL}?userEmail=${user.email}`
  );

  const items = res.data;

  // delete all items for that user//
  await Promise.all(
    items.map((item) =>
      axios.delete(`${BASE_URL}/${item.id}`)
    )
  );

  return true;
};