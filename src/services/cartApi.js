import axios from "axios";
import { getUser } from "../utils/auth";

const BASE_URL = "https://localhost:7150/api/Cart";


const getCurrentUser = () => {
  return getUser();
};


export const fetchCart = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return [];
  }

  const res = await axios.get(
    BASE_URL,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.cartItems || [];
};

export const addCartItem = async (item) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login");
  }

  await axios.post(
    `${BASE_URL}/items?productId=${item.id}&quantity=${item.quantity || 1}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Get the updated cart from backend
  const cartResponse = await axios.get(
    BASE_URL,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const cartItems = cartResponse.data.cartItems || [];

  // Find the product we just added
  const updatedItem = cartItems.find(
    (cartItem) =>
      String(cartItem.productId) === String(item.id)
  );

  return updatedItem;
};

export const deleteCartItem = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login");
  }

  await axios.delete(
    `${BASE_URL}/items/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return true;
};


export const updateCartItem = async (id, updatedItem) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login");
  }

  await axios.put(
    `${BASE_URL}/items/${id}?quantity=${updatedItem.quantity}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Get the updated cart
  const cartResponse = await axios.get(
    BASE_URL,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const cartItems = cartResponse.data.cartItems || [];

  // Find the updated item
  const updatedCartItem = cartItems.find(
    (item) => item.id === id
  );

  return updatedCartItem;
};

export const clearCartApi = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login");
  }

  await axios.delete(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return true;
};