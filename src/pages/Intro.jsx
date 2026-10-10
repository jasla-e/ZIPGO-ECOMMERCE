import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const CATEGORIES = [
  {
    name: "Bike Trips",
    tag: "On Two Wheels",
   
  },
  {
    name: "International Travel",
    tag: "Cross Borders",
  },
  {
    name: "Hiking & Trekking",
    tag: "Climb Higher",
  },
  {
    name: "Camping & Outdoors",
    tag: "Sleep Under Stars",
  },
  {
    name: "Workcation",
    tag: "Work + Wander",
  },
  {
    name: "City Explorer",
    tag: "Urban Escapes",
  },
];

function Intro() {
  const navigate = useNavigate();

  const images = [
    "/images/img1.png",
    "/images/img2.png",
    "/images/img3.png",
    "/images/img4.png",
    "/images/img5.png",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

   useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("https://localhost:7150/api/Product");

      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  const topRatedProducts = products.filter(
    (p) => Number(p.rating) > 4.7
  );


  return (
    <div className="w-full overflow-hidden bg-[#f8fafc] text-black">
     
     {/*Hero section*/}

      <section className="relative h-[68vh] sm:h-[62vh] md:h-[78vh] lg:h-[80vh] w-full overflow-hidden">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt=""
            loading={index === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1800ms]
            ${
              index === currentImage
                ? "opacity-100 scale-110"
                : "opacity-0 scale-100"
            }`}
          />
        ))}



        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

     
        

        {/* writing*/}

        <div className="relative z-10 flex h-full items-center px-6 pt-10 md:px-12 lg:px-20">
          <div className="max-w-3xl text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md animate-fadeUp">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />

              <span className="text-[10px] font-semibold tracking-[3px]">
                PREMIUM TRAVEL COLLECTION
              </span>
            </div>

            <h1 className="animate-fadeUp text-3xl font-black uppercase leading-tight tracking-[3px] sm:text-4xl md:text-5xl lg:text-6xl">
              Built For Journeys
              <span className="mt-1 block text-yellow-300">
                Made For Explorers
              </span>
            </h1>

            <p className="mt-5 max-w-xl animate-fadeUp text-sm leading-relaxed text-gray-200 md:text-lg">
              From city escapes to mountain peaks — gear that goes
              wherever you go.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 animate-fadeUp">
              <button
                onClick={() => navigate("/home")}
                className="group rounded-2xl bg-white px-6 py-3 font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(255,255,255,0.15)]"
              >
                SHOP NOW
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>

              <button
                onClick={() => navigate("/home")}
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black"
              >
                EXPLORE
              </button>
            </div>
          </div>
        </div>

        {/* scroll text */}

        <div className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center text-white/70 md:flex">
          <span className="mb-2 text-[10px] tracking-[4px]">
            SCROLL
          </span>

          <span className="h-8 w-[1px] bg-white/60 animate-scrollLine" />
        </div>
      </section>

     
{/*FEATURE SECTION */}

<section className="relative bg-[#f6f7fb] px-6 py-14 md:px-16 lg:px-24">
  
  <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
    <div>
      <p className="text-xs font-bold tracking-[4px] text-yellow-600">
        WHY ZIPGO
      </p>

      <h2 className="mt-3 text-3xl font-black uppercase md:text-4xl">
        Built For Modern Explorers
      </h2>
    </div>

    <p className="max-w-md text-sm leading-relaxed text-gray-500">
      Premium outdoor gear crafted for every kind of journey —
      from mountain trails to city escapes.
    </p>
  </div>

  {/* cards */}

  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
    {[
      {
        icon: "🚚",
        title: "Fast Shipping",
        desc: "Quick delivery across India with secure packaging.",
      },

      {
        icon: "🛡️",
        title: "Premium Quality",
        desc: "Tested gear designed to last through every trip.",
      },

      {
        icon: "🌍",
        title: "Adventure Ready",
        desc: "Curated essentials for travel, hiking & outdoors.",
      },

      {
        icon: "💬",
        title: "24/7 Support",
        desc: "Friendly support whenever you need assistance.",
      },
    ].map((item, i) => (
      <div
        key={i}
        className="group relative overflow-hidden rounded-[28px] border border-white/50 bg-white/70 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
      >
        {/* soft glow */}

        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-200/20 blur-3xl transition-all duration-500 group-hover:scale-125" />

    

        <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-3xl transition-all duration-500 group-hover:rotate-6 group-hover:bg-yellow-300">
          {item.icon}
        </div>


        <h3 className="relative z-10 text-xl font-black tracking-wide text-black transition-all duration-300 group-hover:translate-x-1">
          {item.title}
        </h3>

       

        <p className="relative z-10 mt-3 text-sm leading-relaxed text-gray-500">
          {item.desc}
        </p>

        {/* bottom line */}

        <div className="relative z-10 mt-6 flex items-center gap-2">
          <div className="h-[2px] w-10 bg-black transition-all duration-500 group-hover:w-16 group-hover:bg-yellow-500" />

          <span className="text-xs font-bold tracking-[2px] text-gray-400">
            ZIPGO
          </span>
        </div>

        {/* hover arrow */}

        <div className="absolute bottom-6 right-6 text-lg text-gray-300 transition-all duration-500 group-hover:translate-x-1 group-hover:text-black">
          ↗
        </div>
      </div>
    ))}
  </div>
</section>



{/* CATEGORIES*/}
<section 
  className="relative overflow-hidden bg-[#0f172a] px-6 pb-28 pt-28 md:px-12 lg:px-20"
  style={{
    clipPath: "ellipse(130% 100% at 50% 100%)",
    WebkitClipPath: "ellipse(130% 100% at 50% 100%)",
    borderRadius: "50% / 10%",
  }}
>
  {/* background glow */}
  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,#facc15_0%,transparent_25%),radial-gradient(circle_at_bottom_right,#0ea5e9_0%,transparent_30%)]" />

  {/* heading */}
  <div className="relative z-10 mb-8 text-center">
    <p className="text-xs font-bold tracking-[4px] text-yellow-300">
      SHOP BY CATEGORY
    </p>

    <h2 className="mt-4 text-3xl font-black uppercase text-white md:text-5xl">
      Choose Your Adventure
    </h2>

    <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
      Discover travel essentials curated for every explorer.
    </p>
  </div>

  {/* categories */}
  <div className="relative z-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
    {[
      { ...CATEGORIES[0], image: "/images/img3.png" },
      { ...CATEGORIES[1], image: "/images/img2.png" },
      { ...CATEGORIES[2], image: "/images/img8.png" },
      { ...CATEGORIES[3], image: "/images/img4.png" },
      { ...CATEGORIES[4], image: "/images/img6.png" },
      { ...CATEGORIES[5], image: "/images/img7.png" },
    ].map((c) => (
      <button
        key={c.name}
        onClick={() =>
          navigate(
            `/home?category=${encodeURIComponent(c.name)}`
          )
        }
        className="group relative h-[190px] overflow-hidden rounded-[24px] text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)] md:h-[250px]"
      >
        {/* image */}
        <img
          src={c.image}
          alt={c.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

        {/* top tag */}
        <div className="absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 backdrop-blur-md">
          <span className="text-[10px] font-bold tracking-[3px] text-white/90">
            {c.tag}
          </span>
        </div>

        
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5">
          <h3 className="text-base font-black uppercase leading-tight text-white md:text-2xl">
            {c.name}
          </h3>

          <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-[2px] text-yellow-300 md:text-sm">
            Explore

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>

        {/* hover border */}
        <div className="absolute inset-0 rounded-[24px] border border-white/10 transition-all duration-500 group-hover:border-yellow-300/50" />

        {/* shine */}
        <div className="absolute inset-0 bg-white/0 transition-all duration-700 group-hover:bg-white/5" />
      </button>
    ))}
  </div>
</section>

 {/*BEST PICKS */}
<section className="bg-white px-6 py-20 md:px-16 lg:px-24">

  <div className="mb-10">
    <p className="text-xs font-bold tracking-[4px] text-yellow-600">
      TOP RATED
    </p>

    <h2 className="mt-4 text-3xl font-black uppercase md:text-5xl">
      Best Picks
    </h2>

    <p className="mt-2 text-sm text-gray-500">
      Products rated above 4.7 by real customers.
    </p>
  </div>


  {loading ? (
    <p className="text-gray-500">Loading products...</p>
  ) : (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

      {topRatedProducts.length === 0 ? (
        <p className="col-span-4 text-gray-500">
          No products above 4.7 rating
        </p>
      ) : (
        topRatedProducts.map((p) => (
          <div
  key={p.id}
  onClick={() => navigate(`/product/${p.id}`)}
  className="group overflow-hidden rounded-3xl border bg-white transition hover:-translate-y-2 cursor-pointer"
   >

           
            <div className="relative w-full h-[230px] bg-gray-50 flex items-center justify-center overflow-hidden">
              <img
                src={p.image}
                alt={p.title}
                className="h-[85%] w-[85%] object-contain transition-transform duration-500 group-hover:scale-110"
              />

              {/* RATING BADGE */}
              <div className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
                ⭐ {p.rating}
              </div>
            </div>

            {/* DETAILS */}
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
                {p.category}
              </p>

              <h3 className="mt-2 font-bold line-clamp-1">
                {p.title}
              </h3>

              <div className="mt-3 flex justify-between">
                <span className="font-black">
                  ₹{p.price}
                </span>

                <span className="text-xs text-gray-500">
                  {p.stock} stock
                </span>
              </div>
            </div>

          </div>
        ))
      )}

    </div>
  )}
</section>



<section className="relative overflow-hidden bg-black px-6 py-20 text-white md:px-16 lg:px-24">
  {/* background glow */}
  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#facc15_0%,transparent_40%),radial-gradient(circle_at_80%_80%,#0ea5e9_0%,transparent_40%)]" />

  <div className="relative z-10 mx-auto max-w-5xl text-center">
    <p className="text-xs font-bold tracking-[4px] text-yellow-300">
      TRUSTED BY CREATORS
    </p>

    <h2 className="mt-5 text-3xl font-black uppercase leading-tight md:text-5xl">
      Loved by Explorers Worldwide
    </h2>

    <p className="mt-4 text-sm text-gray-300 md:text-base">
      Real feedback from people who live the adventure lifestyle.
    </p>

    {/* Reviews */}
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      
      {/* Review 1 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:border-yellow-300/40 transition">
        <p className="text-sm text-gray-300">
          “This platform completely changed how I plan my trips.
          The collections are insanely well curated.”
        </p>
        <div className="mt-4 font-bold text-yellow-300">— Alex Rivera</div>
        <div className="text-xs text-gray-400">Travel Photographer</div>
      </div>

      {/* Review 2 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:border-yellow-300/40 transition">
        <p className="text-sm text-gray-300">
          “Clean UI, fast browsing, and actually useful recommendations.
          Feels premium.”
        </p>
        <div className="mt-4 font-bold text-yellow-300">— Maya Chen</div>
        <div className="text-xs text-gray-400">Content Creator</div>
      </div>

      {/* Review 3 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:border-yellow-300/40 transition">
        <p className="text-sm text-gray-300">
          “I keep coming back for the trending drops.
          Everything feels handpicked and high quality.”
        </p>
        <div className="mt-4 font-bold text-yellow-300">— Daniel Brooks</div>
        <div className="text-xs text-gray-400">Adventure Blogger</div>
      </div>
    </div>
  </div>
</section>
  
   {/* FOOTER*/}

<footer className="bg-[#050505] px-6 pt-16 pb-8 text-gray-400 md:px-16 lg:px-24">
  
  <div className="grid gap-10 md:grid-cols-2">
    
    {/* BRAND */}
    <div>
      <h2 className="text-2xl font-black tracking-[6px] text-white">
        ZIPGO
      </h2>

      <p className="mt-4 text-sm leading-relaxed">
        Gear built for travelers, explorers, bikers,
        trekkers, and outdoor lovers.
      </p>
    </div>


    <div>
      <h4 className="mb-5 font-bold uppercase tracking-[2px] text-white">
        About
      </h4>

      <p className="text-sm leading-relaxed">
        ZIPGO is designed for modern adventure seekers.
        We focus on durable, lightweight, and performance-driven gear
        that supports every journey — from city rides to mountain trails.
      </p>
    </div>

  </div>

  {/* BOTTOM COPYRIGHT */}
  <div className="mt-14 border-t border-white/10 pt-6 text-center text-xs">
    © {new Date().getFullYear()} ZIPGO — All rights reserved.
  </div>

</footer>
      {/* ANIMATIONS */}

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeUp {
          opacity: 0;
          animation: fadeUp 1s ease forwards;
        }

        @keyframes float {
          0%,100% {
            transform: translateY(0px);
            opacity: .4;
          }

          50% {
            transform: translateY(-20px);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        @keyframes scrollLine {
          0% {
            transform: scaleY(0);
            transform-origin: top;
          }

          50% {
            transform: scaleY(1);
            transform-origin: top;
          }

          51% {
            transform: scaleY(1);
            transform-origin: bottom;
          }

          100% {
            transform: scaleY(0);
            transform-origin: bottom;
          }
        }

        .animate-scrollLine {
          animation: scrollLine 2s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default Intro;