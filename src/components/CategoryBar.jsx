import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMainCategoriesAsync } from "../redux/slices/categorySlice";

function CategoryBar({ selectedCategory, setSelectedCategory }) {
  const dispatch = useDispatch();

  const { mainCategories, loading } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(fetchMainCategoriesAsync());
  }, [dispatch]);

  const categories = [
    "ALL",
    ...mainCategories.map((category) => category.name.toUpperCase()),
  ];

  return (
    <div
      className="
        bg-white 
        border-b border-gray-200 
        fixed 
        top-[64px] 
        left-0 
        w-full 
        z-40
      "
    >
      <div className="flex w-full h-20">
        {loading && mainCategories.length === 0 ? (
          <div className="flex items-center justify-center w-full">
            Loading categories...
          </div>
        ) : (
          categories.map((cat) => {
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  flex-1
                  flex items-center justify-center
                  px-2
                  border-b-2
                  transition-all duration-200

                  text-sm font-medium
                  whitespace-nowrap
                  overflow-hidden
                  text-ellipsis

                  ${
                    isActive
                      ? "text-black border-black"
                      : "text-black border-transparent hover:text-gray-500"
                  }
                `}
              >
                {cat}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CategoryBar;