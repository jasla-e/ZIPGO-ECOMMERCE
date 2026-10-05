const BASE_URL = "https://localhost:7150/api/Product";


// GET ALL PRODUCTS
export const fetchProducts = async () => {

  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};


// GET SINGLE PRODUCT
export const fetchProductById = async (id) => {

  const res = await fetch(`${BASE_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};


// ADD PRODUCT
export const addProduct = async (productData) => {

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    throw new Error("Failed to add product");
  }

  return res.json();
};


// UPDATE PRODUCT
export const updateProduct = async (id, updatedData) => {

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  return res.json();
};


// DELETE PRODUCT
export const deleteProduct = async (id) => {

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }

  return id;
};