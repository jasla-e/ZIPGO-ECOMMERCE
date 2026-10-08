import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAdminProducts,
  setSearchQuery,
} from "../../redux/slices/productSlice";

import ProductTable from "../components/ProductTable";

function AProducts() {
  const dispatch = useDispatch();

  const {
    items,
    loading,
    searchQuery,
    currentPage,
    pageSize,
  } = useSelector((state) => state.products);

  const [searchInput, setSearchInput] = useState(searchQuery);

  // SEARCH WITH DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(searchInput));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  // FETCH ADMIN PRODUCTS
  useEffect(() => {
    dispatch(
      fetchAdminProducts({
        search: searchQuery,
        page: currentPage,
        pageSize: pageSize,
      })
    );
  }, [dispatch, searchQuery, currentPage, pageSize]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductTable
          products={items}
          searchQuery={searchInput}
          setSearchQuery={setSearchInput}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}

export default AProducts;