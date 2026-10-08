import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteProduct,
  setSearchQuery,
  setCurrentPage,
} from "../../redux/slices/productSlice";

import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";

function ProductTable({
  products,
  searchQuery,
  currentPage,
  setSearchQuery,
}) {
  const dispatch = useDispatch();

  const { totalPages } = useSelector((state) => state.products);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // DELETE
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteProduct(deleteId));

    setDeleteId(null);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5">

          <h1 className="text-2xl md:text-3xl font-bold">
            Products
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
  setSearchQuery(e.target.value);
  dispatch(setCurrentPage(1));
}}
              className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black w-full sm:w-72"
            />

            {/* ADD PRODUCT */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-90 transition whitespace-nowrap"
            >
              + Add Product
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <div className="min-w-[1100px]">

            {/* TABLE HEADER */}
            <div className="grid grid-cols-9 gap-4 bg-blue-400 p-4 font-semibold text-black">

              <div>Image</div>
              <div>Product</div>
              <div>Details</div>
              <div>Price</div>
              <div>Category</div>
              <div>SubCategory</div>
              <div>Stock</div>
              <div>Rating</div>
              <div>Actions</div>

            </div>

            {/* PRODUCTS */}
            <div>

              {products.length > 0 ? (
                products.map((product) => (

                  <div
                    key={product.id}
                    className="grid grid-cols-9 gap-4 items-center p-4 border-b hover:bg-gray-50 transition"
                  >

                    {/* IMAGE */}
                    <div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>

                    {/* PRODUCT */}
                    <div>

                      <div className="font-medium">
                        {product.name}
                      </div>

                      {product.offer && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-red-500 text-white rounded">
                          OFFER
                        </span>
                      )}

                    </div>

                    {/* DESCRIPTION */}
                    <div className="text-sm text-gray-600">
                      {product.description}
                    </div>

                    {/* PRICE */}
                    <div className="font-medium">
                      ₹ {product.price}
                    </div>

                    {/* CATEGORY */}
                    <div className="uppercase text-sm text-gray-600">
                      {product.mainCategoryId}
                    </div>

                    {/* SUB CATEGORY */}
                    <div className="uppercase text-sm text-gray-600">
                      {product.subCategoryId}
                    </div>

                    {/* STOCK */}
                    <div className="font-medium">
                      {product.stock}
                    </div>

                    {/* RATING */}
                    <div className="font-medium">
                      ⭐ {product.rating}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2">

                      {/* EDIT */}
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowEditModal(true);
                        }}
                        className="w-20 h-10 bg-blue-500 text-white rounded-lg"
                      >
                        Edit
                      </button>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          handleDeleteClick(product.id)
                        }
                        className="w-20 h-10 bg-red-500 text-white rounded-lg"
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                ))
              ) : (
                <div className="p-10 text-center text-gray-500">
                  No matching products found
                </div>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 0 && (
        <div className="flex justify-center gap-2 mt-5">

          {/* PREVIOUS */}
          <button
            disabled={currentPage === 1}
            onClick={() =>
              dispatch(setCurrentPage(currentPage - 1))
            }
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {/* PAGE NUMBERS */}
          {Array.from(
            { length: totalPages },
            (_, i) => (
              <button
                key={i}
                onClick={() =>
                  dispatch(setCurrentPage(i + 1))
                }
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-black text-white"
                    : ""
                }`}
              >
                {i + 1}
              </button>
            )
          )}

          {/* NEXT */}
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              dispatch(setCurrentPage(currentPage + 1))
            }
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}

      {/* ADD MODAL */}
      {showModal && (
        <AddProduct
          setShowModal={setShowModal}
        />
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedProduct && (
        <EditProduct
          product={selectedProduct}
          setShowEditModal={setShowEditModal}
        />
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center">

            <h2 className="text-xl font-semibold mb-3">
              Delete Product?
            </h2>

            <p className="text-gray-600 mb-5">
              Are you sure you want to delete this product?
            </p>

            <div className="flex justify-center gap-3">

              <button
                onClick={cancelDelete}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default ProductTable;