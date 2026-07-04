import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/slices/productSlice";

function AddProduct({ setShowModal }) {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!formData.image) {
      alert("Please upload an image");
      return;
    }

    try {
      await dispatch(
        addProduct({
          ...formData,
          price: Number(formData.price || 0),
          stock: Number(formData.stock || 0),
          rating: Number(formData.rating || 0),
        })
      ).unwrap();

      alert("Product added successfully");
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div
        className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-bold mb-5">
          Add Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="details"
            placeholder="Details"
            value={formData.details}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="subCategory"
            placeholder="SubCategory"
            value={formData.subCategory}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="rating"
            type="number"
            step="0.1"
            placeholder="Rating"
            value={formData.rating}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

       
        <input
     type="text"
      name="image"
      placeholder="Paste image URL"
      value={formData.image}
       onChange={handleChange}
       className="border p-3 rounded-lg"
       />

          {formData.image && (
            <img
              src={formData.image}
              alt="preview"
              className="w-24 h-24 object-cover rounded border"
            />
          )}

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
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

         <button
          type="submit"
           className="px-4 py-2 bg-black text-white rounded-lg"
            >
           Add Product
         </button>
         
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;