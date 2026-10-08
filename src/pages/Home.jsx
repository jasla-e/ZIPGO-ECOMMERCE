import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import CategoryBar from "../components/CategoryBar";
import ProductCard from "../components/ProductCard";

import {
  fetchProducts,
  setSearchQuery,
  fetchFilteredProducts,
} from "../redux/slices/productSlice";

import { fetchSubCategoriesAsync } from "../redux/slices/categorySlice";

function Home() {
  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromURL || "ALL"
  );

  const [selectedDropdownCategory, setSelectedDropdownCategory] =
    useState("ALL");

  const [sortOption, setSortOption] = useState("default");
  const [priceFilter, setPriceFilter] = useState("all");

  // PRODUCTS
  const {
    items = [],
    loading,
    error,
    searchQuery = "",
  } = useSelector((state) => state.products || {});

  // CATEGORIES
  const { mainCategories = [], subCategories = [] } = useSelector(
    (state) => state.category || {}
  );

  // FETCH SUBCATEGORIES
  useEffect(() => {
    if (!subCategories.length) {
      dispatch(fetchSubCategoriesAsync());
    }
  }, [dispatch, subCategories.length]);

  // UPDATE CATEGORY WHEN URL CHANGES
  useEffect(() => {
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
    } else {
      setSelectedCategory("ALL");
    }
  }, [categoryFromURL]);

  // SCROLL TO TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // FIND SELECTED MAIN CATEGORY ID
  const selectedMainCategoryId = useMemo(() => {
    if (selectedCategory === "ALL") {
      return null;
    }

    const category = mainCategories.find(
      (item) =>
        item.name.toLowerCase() === selectedCategory.toLowerCase()
    );

    return category?.id || null;
  }, [mainCategories, selectedCategory]);

  // FIND SELECTED SUBCATEGORY ID
  const selectedSubCategoryId = useMemo(() => {
    if (selectedDropdownCategory === "ALL") {
      return null;
    }

    const subCategory = subCategories.find(
      (item) =>
        item.name.toLowerCase() ===
        selectedDropdownCategory.toLowerCase()
    );

    return subCategory?.id || null;
  }, [subCategories, selectedDropdownCategory]);

  console.log("MAIN CATEGORIES:", mainCategories);
  console.log("SUB CATEGORIES:", subCategories);
  console.log("PRODUCTS:", items);
  console.log("SELECTED CATEGORY:", selectedCategory);
  console.log("SELECTED CATEGORY ID:", selectedMainCategoryId);
  console.log("SELECTED SUBCATEGORY:", selectedDropdownCategory);
  console.log("SELECTED SUBCATEGORY ID:", selectedSubCategoryId);

  // BACKEND PRODUCT FILTER
  // SEARCH + MAIN CATEGORY + SUBCATEGORY
  useEffect(() => {
    const timer = setTimeout(() => {
      const filters = {};

      // SEARCH
      if (searchQuery.trim() !== "") {
        filters.Search = searchQuery.trim();
      }

      // MAIN CATEGORY
      if (selectedMainCategoryId) {
        filters.MainCategoryId = selectedMainCategoryId;
      }

      // SUBCATEGORY
      if (selectedSubCategoryId) {
        filters.SubCategoryId = selectedSubCategoryId;
      }
      // PRICE RANGE
    if (priceFilter !== "all") {
    const priceRanges = {
    under500: "under 500",
    "500to1000": "500 - 1000",
    "1000to5000": "1000 - 5000",
     above5000: "above 5000",
    };

  filters.PriceRange = priceRanges[priceFilter];
}
  // SORT
if (sortOption === "lowToHigh") {
  filters.Sort = "price_asc";
} else if (sortOption === "highToLow") {
  filters.Sort = "price_desc";
}

      // NO FILTERS
      if (Object.keys(filters).length === 0) {
        dispatch(fetchProducts());
        return;
      }

      dispatch(fetchFilteredProducts(filters));
    }, 400);

    return () => clearTimeout(timer);
  }, [
    dispatch,
    searchQuery,
    selectedMainCategoryId,
    selectedSubCategoryId,
    priceFilter,
    sortOption,
  ]);

  // PRODUCTS ARE ALREADY FILTERED BY BACKEND
  const filteredItems = items;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* FIXED CATEGORY BAR */}
      <CategoryBar
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      {/* SPACE BELOW FIXED CATEGORY BAR */}
      <div className="h-40 md:h-43"></div>

      <section className="px-4 md:px-10 pb-10">

        {/* HEADER + FILTERS */}
        <div className="flex flex-col lg:flex-row lg:items-center mb-8">

          {/* TITLE */}
          <div>
            <h2 className="text-3xl font-bold">
              Featured Products
            </h2>

            {selectedCategory !== "ALL" && (
              <p className="text-gray-500 mt-2">
                Showing category:
                <span className="font-semibold text-black ml-2">
                  {selectedCategory}
                </span>
              </p>
            )}
          </div>

          {/* FILTERS PANEL */}
          <div className="flex flex-wrap gap-3 mt-4 lg:mt-0 lg:ml-auto items-center">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery || ""}
              onChange={(e) =>
                dispatch(setSearchQuery(e.target.value))
              }
              className="border border-gray-300 px-4 py-2 rounded-full w-full sm:w-56 bg-white outline-none"
            />

            {/* SUBCATEGORY FILTER */}
            <select
              value={selectedDropdownCategory}
              onChange={(e) =>
                setSelectedDropdownCategory(e.target.value)
              }
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none"
            >
              <option value="ALL">
                Trending Types
              </option>

              {subCategories.map((subCategory) => (
                <option
                  key={subCategory.id}
                  value={subCategory.name}
                >
                  {subCategory.name}
                </option>
              ))}
            </select>

            {/* PRICE FILTER */}
            <select
              value={priceFilter}
              onChange={(e) =>
                setPriceFilter(e.target.value)
              }
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none"
            >
              <option value="all">
                All Prices
              </option>

              <option value="under500">
                Under ₹500
              </option>

              <option value="500to1000">
                ₹500 - ₹1000
              </option>

              <option value="1000to5000">
                ₹1000 - ₹5000
              </option>

              <option value="above5000">
                Above ₹5000
              </option>
            </select>

            {/* SORT */}
            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value)
              }
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none"
            >
              <option value="default">
                Sort By
              </option>

              <option value="lowToHigh">
                Price: Low to High
              </option>

              <option value="highToLow">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>

        {/* LOADING */}
        {loading && <p>Loading...</p>}

        {/* ERROR */}
        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredItems.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
              <h3 className="text-2xl font-bold">
                No Products Found
              </h3>

              <p className="text-gray-500 mt-2">
                Try changing filters or category
              </p>
            </div>
          )}

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((product) => (
            <ProductCard
              key={String(product.id)}
              product={product}
            />
          ))}
        </div>

      </section>
    </div>
  );
}

export default Home;