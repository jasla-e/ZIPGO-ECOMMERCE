import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/slices/productSlice";
import { toast } from "react-toastify";

function AddProduct({ setShowModal }) {
  const dispatch = useDispatch();

  

  const [formData, setFormData] = useState({
  name: "",
  description: "",
  price: "",
  mainCategoryId: "",
  subCategoryId: "",
  image: null,
  stock: "",
  rating: "",
  offer: false,
   });

  const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      type === "checkbox"
        ? checked
        : type === "file"
        ? files[0]
        : value,
  }));
};

        const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) {
    toast.error("Name is required");
    return;
  }

  if (!formData.image) {
    toast.error("Please upload an image");
    return;
  }

  try {
    const data = new FormData();

data.append("Name", formData.name);
data.append("Description", formData.description);
data.append("Price", formData.price);
data.append("Rating", formData.rating || 0);
data.append("Stock", formData.stock || 0);
data.append("Offer", formData.offer);
data.append("MainCategoryId", formData.mainCategoryId);
data.append("SubCategoryId", formData.subCategoryId);
data.append("image", formData.image);

    await dispatch(addProduct(data)).unwrap();

    toast.success("Product added successfully");
    setShowModal(false);

  } catch (error) {
    console.error(error);
    toast.error("Failed to add product");
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
          name="name"
          placeholder="Name"
          value={formData.name}
         onChange={handleChange}
         className="border p-3 rounded-lg"
        />

         <input
         name="description"
         placeholder="Description"
         value={formData.description}
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
            name="mainCategoryId"
            type="number"
           placeholder="Main Category ID"
            value={formData.mainCategoryId}
            onChange={handleChange}
           className="border p-3 rounded-lg"
           />

          <input
           name="subCategoryId"
           type="number"
           placeholder="Sub Category ID"
           value={formData.subCategoryId}
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
         type="file"
         name="image"
         accept="image/*"
         onChange={handleChange}
         className="border p-3 rounded-lg"
         />

          {formData.image && (
  <img
    src={URL.createObjectURL(formData.image)}
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