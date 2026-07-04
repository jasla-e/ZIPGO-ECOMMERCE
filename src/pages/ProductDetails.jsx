import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../redux/slices/cartSlice";

import { isLoggedIn } from "../utils/auth";
import { fetchProductById } from "../services/productApi";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product?.id) return;

    if (!isLoggedIn()) {
      localStorage.setItem(
        "pending_cart_item",
        JSON.stringify({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock,
          quantity: qty,
        })
      );

      navigate("/login");
      return;
    }

    dispatch(
      addToCartAsync({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        quantity: qty,
      })
    );

    navigate("/cart");
  };

  const increaseQty = () => {
    if (product && qty < product.stock) {
      setQty((prev) => prev + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) setQty((prev) => prev - 1);
  };

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (!product) return <h2 className="text-center mt-10">Product not found</h2>;

  const outOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      
      {/* PRODUCT CARD */}
      <div className="bg-white shadow-xl rounded-2xl max-w-5xl w-full p-8 flex flex-col md:flex-row gap-10">

        {/* IMAGE SECTION */}
        <div className="flex justify-center items-center md:w-1/2">
          <img
            src={product.image}
            alt={product.title}
            className="w-full max-w-sm object-contain rounded-xl"
          />
        </div>

        {/* DETAILS SECTION */}
        <div className="md:w-1/2 flex flex-col gap-4">

          <p className="text-sm text-gray-400 uppercase tracking-widest">
            {product.category}
          </p>

          <h2 className="text-3xl font-bold text-gray-900">
            {product.title}
          </h2>

          <p className="text-gray-600">
            {product.details}
          </p>

          <h3 className="text-2xl font-bold text-black">
            ₹ {product.price}
          </h3>

          {/* STOCK */}
          {outOfStock ? (
            <p className="text-red-500 font-semibold">Out of Stock</p>
          ) : (
            <p className="text-green-600 font-semibold">
              In Stock: {product.stock}
            </p>
          )}

{/* ⭐ RATING */}
   <div className="flex items-center gap-2 mt-2">
  <div className="text-yellow-500 text-lg">
    {"★".repeat(Math.floor(product.rating))}
    <span className="text-gray-300">
      {"★".repeat(5 - Math.floor(product.rating))}
    </span>
  </div>

  <span className="text-sm text-gray-600 font-medium">
    {product.rating} / 5
  </span>
  </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`mt-5 py-3 rounded-lg font-semibold transition ${
              outOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;