import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../redux/slices/productSlice";

function EditProduct({ product, setShowEditModal }) {
  const dispatch = useDispatch();

const [formData, setFormData] = useState({
  name: "",
  description: "",
  price: "",
  mainCategoryId: "",
  subCategoryId: "",
  stock: "",
  rating: "",
  offer: false,
  image: "",
});

  // LOAD PRODUCT DATA//
 useEffect(() => {
  if (product) {
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      mainCategoryId: product.mainCategoryId || "",
      subCategoryId: product.subCategoryId || "",
      stock: product.stock || "",
      rating: product.rating || "",
      offer: product.offer || false,
      image: product.image || "",
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

  setFormData((prev) => ({
    ...prev,
    image: file,
  }));
};

const handleSubmit = (e) => {
  e.preventDefault();

  const data = new FormData();

  data.append("Name", formData.name);
  data.append("Description", formData.description);
  data.append("Price", formData.price);
  data.append("Rating", formData.rating);
  data.append("Stock", formData.stock);
  data.append("Offer", formData.offer);
  data.append("MainCategoryId", formData.mainCategoryId);
  data.append("SubCategoryId", formData.subCategoryId);

  if (formData.image instanceof File) {
    data.append("image", formData.image);
  }

  dispatch(
    updateProduct({
      id: product.id,
      updatedData: data,
    })
  )
    .unwrap()
    .then(() => {
      setShowEditModal(false);
    })
    .catch((err) => {
      console.log("UPDATE ERROR:", err);
    });
};


  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div
        className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-bold mb-5">Edit Product</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input name="name" value={formData.name} onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="description" value={formData.description} onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="price" type="number" value={formData.price} onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="mainCategoryId" value={formData.mainCategoryId} onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="subCategoryId" value={formData.subCategoryId} onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="rating" type="number" step="0.1" value={formData.rating} onChange={handleChange} className="border p-3 rounded-lg" />

          {/* IMAGE */}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 rounded-lg" />

           {formData.image &&
            (<img src={ formData.image instanceof File? URL.createObjectURL(formData.image) : product.image}className="w-24 h-24 object-cover rounded border" />)}

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