import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  deleteProduct,
  setSearchQuery,
} from "../../redux/slices/productSlice";

import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";

function ProductTable({
  products,
  searchQuery,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // RESET PAGE ON SEARCH//
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

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

  // SEARCH FILTER//
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // PAGINATION //
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

 

  return (
    <>
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5">
          <h1 className="text-2xl md:text-3xl font-bold">Products</h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black w-full sm:w-72"
            />

            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-90 transition whitespace-nowrap"
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">

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
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-9 gap-4 items-center p-4 border-b hover:bg-gray-50 transition"
                  >
                    <div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>

                    <div>
     <div className="font-medium">{product.name}</div>

       {product.offer && (
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-red-500 text-white rounded">
               OFFER
             </span>
              )}
           </div>

                    <div className="text-sm text-gray-600">
                      {product.description}
                    </div>

                    <div className="font-medium">₹ {product.price}</div>

                    <div className="uppercase text-sm text-gray-600">
                      {product.mainCategoryId}
                    </div>

                    <div className="uppercase text-sm text-gray-600">
                      {product.subCategoryId}
                    </div>

                    <div className="font-medium">{product.stock}</div>

                    <div className="font-medium">⭐ {product.rating}</div>

                    {/* ACTIONS */}
                    <div className="flex gap-2">

                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowEditModal(true);
                        }}
                        className="w-20 h-10 bg-blue-500 text-white rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteClick(product.id)}
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
      <div className="flex justify-center gap-2 mt-5">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-black text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

      {/* ADD MODAL */}
      {showModal && <AddProduct setShowModal={setShowModal} />}

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