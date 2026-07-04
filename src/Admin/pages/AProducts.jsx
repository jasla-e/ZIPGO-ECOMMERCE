import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../../redux/slices/productSlice";
import ProductTable from "../components/ProductTable";

function AProducts() {
  const dispatch = useDispatch();

  const { items, loading, searchQuery } = useSelector(
    (state) => state.products
  );

  //  PAGINATION STATE//
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductTable
          products={items}
          searchQuery={searchQuery}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}

export default AProducts;