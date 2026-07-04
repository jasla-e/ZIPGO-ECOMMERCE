import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../redux/slices/productSlice";

function EditProduct({ product, setShowEditModal }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    details: "",
    price: "",
    category: "",
    subCategory: "",
    image: "",
    stock: "",
    rating: "",
    offer: false,
  });

  // LOAD PRODUCT DATA//
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        details: product.details || "",
        price: product.price || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        image: product.image || "",
        stock: product.stock || "",
        rating: product.rating || "",
        offer: product.offer || false,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateProduct({
        id: product.id,
        updatedData: {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          rating: Number(formData.rating),
        },
      })
    );

    setShowEditModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div
        className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-bold mb-5">Edit Product</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input name="title" value={formData.title} onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="details" value={formData.details} onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="price" type="number" value={formData.price} onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="category" value={formData.category} onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="subCategory" value={formData.subCategory} onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="rating" type="number" step="0.1" value={formData.rating} onChange={handleChange} className="border p-3 rounded-lg" />

          {/* IMAGE */}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 rounded-lg" />

          {formData.image && (
            <img src={formData.image} className="w-24 h-24 object-cover rounded border" />
          )}

          {/* OFFER */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="offer"
              checked={formData.offer}
              onChange={handleChange}
            />
            Offer Available
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button className="px-4 py-2 bg-black text-white rounded-lg">
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProduct;