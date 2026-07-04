function CategoryBar({ selectedCategory, setSelectedCategory }) {
  const categories = [
    "ALL",
    "HIKING & TREKKING",
    "BIKE TRIPS",
    "INTERNATIONAL TRAVEL",
    "CAMPING & OUTDOORS",
    "CITY EXPLORER",
    "WEEKEND GETAWAYS",
    "WORKCATION"
  ];

  return (
    <div className="
      bg-white 
      border-b border-gray-200 
      fixed 
      top-[64px] 
      left-0 
      w-full 
      z-40
    ">
      
      <div className="flex w-full h-20">
        {categories.map((cat) => {
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
        })}
      </div>
    </div>
  );
}

export default CategoryBar;