import { useSelector, useDispatch } from "react-redux";
import {getWishlist, removeFromWishlistAsync } from "../redux/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Wishlist() {
  const items = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
  dispatch(getWishlist());
}, [dispatch]);

  const removeItem = (id) => {
    dispatch(removeFromWishlistAsync(id));
  };

  return (
    <div className="p-6 mt-20">
      <h2 className="text-2xl font-bold mb-4">
        ❤️ My Wishlist
      </h2>

      {items.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg shadow"
            >
              <img
                src={item.product?.image}
                className="w-full h-40 object-cover"
              />

              <h3 className="font-bold mt-2">
                {item.product.name}
              </h3>

              <p>₹{item.product.price}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/product/${item.productId}`)}
                  className="px-3 py-1 bg-black text-white rounded"
                >
                  View
                </button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;