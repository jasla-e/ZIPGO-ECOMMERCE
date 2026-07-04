import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCartAsync } from "../redux/slices/cartSlice";
import { isLoggedIn } from "../utils/auth";

import {
  addToWishlistAsync,
  removeFromWishlistAsync,
} from "../redux/slices/wishlistSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector(
    (state) => state.wishlist?.items || []
  );

  const wishlistedItem = wishlistItems.find(
    (item) => String(item.productId) === String(product.id)
  );

  const wishlisted = !!wishlistedItem;

  const toggleWishlist = (e) => {
    e.stopPropagation();

    if (!isLoggedIn()) {
     // save pending wishlist item //
      localStorage.setItem(
        "pending_wishlist_item",
        JSON.stringify(product)
      );
      navigate("/login");
      return;
    }

    if (wishlisted) {
      dispatch(removeFromWishlistAsync(wishlistedItem.id));
    } else {
      dispatch(addToWishlistAsync(product));
    }
  };

  const goToProductDetails = () => {
    if (!product?.id) return;
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={goToProductDetails}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-gray-50">

     {product.offer && (
      <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
      OFFER
    </span>
     )}

        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-md hover:scale-110 transition"
        >
          {wishlisted ? (
            <svg viewBox="0 0 24 24" fill="red" className="w-5 h-5">
              <path d="M12 21s-6.7-4.35-9.33-7.3C.88 11.2 2.1 7.6 5.6 6.4c1.9-.6 3.7.1 4.8 1.5 1.1-1.4 2.9-2.1 4.8-1.5 3.5 1.2 4.7 4.8 2.93 7.3C18.7 16.65 12 21 12 21z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-600">
              <path d="M12 21s-6.7-4.35-9.33-7.3C.88 11.2 2.1 7.6 5.6 6.4c1.9-.6 3.7.1 4.8 1.5 1.1-1.4 2.9-2.1 4.8-1.5 3.5 1.2 4.7 4.8 2.93 7.3C18.7 16.65 12 21 12 21z" />
            </svg>
          )}
        </button>

        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex flex-col gap-2">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest">
          {product.category}
        </p>

        <h2 className="font-extrabold text-[16px] text-gray-900 line-clamp-1">
          {product.title}
        </h2>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xl font-bold text-gray-900">
            ₹{product.price}
          </p>

          <span className={`text-xs px-2 py-1 rounded-full ${
            product.stock > 0
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-500"
          }`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;