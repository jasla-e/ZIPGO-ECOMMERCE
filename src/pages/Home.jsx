import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import CategoryBar from "../components/CategoryBar";
import ProductCard from "../components/ProductCard";


import { fetchProducts, setSearchQuery } from "../redux/slices/productSlice";

function Home() {
  const dispatch = useDispatch();
  const location = useLocation();


  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category");

  
  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL || "ALL");

  const [selectedDropdownCategory, setSelectedDropdownCategory] = useState("ALL");

  const [sortOption, setSortOption] = useState("default");
  const [priceFilter, setPriceFilter] = useState("all");

  const {
    items = [],
    loading,
    error,
    searchQuery = "",
  } = useSelector((state) => state.products || {});

  // FETCH PRODUCTS//
  useEffect(() => {
    if (!items.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  // UPDATE CATEGORY WHEN URL CHANGES//
  useEffect(() => {
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
    } else {
      setSelectedCategory("ALL");
    }
  }, [categoryFromURL]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // FILTER & SORT PRODUCTS//
  const filteredItems = useMemo(() => {
    let filtered = items.filter((product) => {
      // CATEGORYBAR FILTER//
      const matchesCategory =
        selectedCategory === "ALL" ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();

      // SUBCATEGORY DROPDOWN FILTER//
      const matchesDropdownCategory =
        selectedDropdownCategory === "ALL" ||
        product.subCategory?.toLowerCase() === selectedDropdownCategory.toLowerCase();

      // SEARCH FILTER//
      const query = searchQuery.toLowerCase().trim();
      const searchWords = query ? query.split(" ") : [];

      const productText = (
        (product.title || "") +
        " " +
        (product.category || "") +
        " " +
        (product.details || "")
      ).toLowerCase();

      const matchesSearch =
        query === "" ||
        searchWords.every((word) => productText.includes(word));

      // PRICE FILTER//
      const price = Number(product.price) || 0;
      let matchesPrice = true;

      if (priceFilter === "under500") {
        matchesPrice = price < 500;
      } else if (priceFilter === "500to1000") {
        matchesPrice = price >= 500 && price <= 1000;
      } else if (priceFilter === "1000to5000") {
        matchesPrice = price > 1000 && price <= 5000;
      } else if (priceFilter === "above5000") {
        matchesPrice = price > 5000;
      }

      return (
        matchesCategory &&
        matchesDropdownCategory &&
        matchesSearch &&
        matchesPrice
      );
    });

    // SORTING//
    if (sortOption === "lowToHigh") {
      filtered.sort(
        (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0)
      );
    } else if (sortOption === "highToLow") {
      filtered.sort(
        (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0)
      );
    }

    return filtered;
  }, [
    items,
    selectedCategory,
    selectedDropdownCategory,
    searchQuery,
    sortOption,
    priceFilter,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* FIXED CATEGORY BAR */}
      <CategoryBar setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />

      {/* SPACE BELOW FIXED CATEGORY BAR */}
      <div className="h-40 md:h-43"></div>

      <section className="px-4 md:px-10 pb-10">
        {/* HEADER + FILTERS */}
        <div className="flex flex-col lg:flex-row lg:items-center mb-8">
          {/* TITLE */}
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>

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
            
            
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery || ""}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="border border-gray-300 px-4 py-2 rounded-full w-full sm:w-56 bg-white outline-none"
            />

            {/* CATEGORY FILTER DROPDOWN */}
            <select
              value={selectedDropdownCategory}
              onChange={(e) => setSelectedDropdownCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none"
            >
              <option value="ALL">Trending Types</option>
              <option value="PACKING & ORGANIZERS">Packing & Organizers</option>
              <option value="TROLLEYS & BACKPACKS">Trolleys & Backpacks</option>
              <option value="TECH & GADGETS">Tech & Gadgets</option>
              <option value="OUTDOOR & ADVENTURES">Outdoor & Adventures</option>
              <option value="COMFORT">Comfort</option>
              <option value="TOILETRIES">Toiletries</option>
            </select>

            {/* PRICE FILTER */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none"
            >
              <option value="all">All Prices</option>
              <option value="under500">Under ₹500</option>
              <option value="500to1000">₹500 - ₹1000</option>
              <option value="1000to5000">₹1000 - ₹5000</option>
              <option value="above5000">Above ₹5000</option>
            </select>

            {/* SORT */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none"
            >
              <option value="default">Sort By</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* LOADING */}
        {loading && <p>Loading...</p>}

        {/* ERROR */}
        {error && <p className="text-red-500">{error}</p>}

        {/* EMPTY */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <h3 className="text-2xl font-bold">No Products Found</h3>
            <p className="text-gray-500 mt-2">
              Try changing filters or category
            </p>
          </div>
        )}

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((product) => (
            <ProductCard key={String(product.id)} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;