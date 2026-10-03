import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Search, X, SlidersHorizontal } from "lucide-react";

const ScholarshipSearch = ({
  value = "",
  onSearch,
  onFilterClick,
  placeholder = "Search scholarships...",
}) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [searchValue, setSearchValue] = useState(value);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  useEffect(() => {
    if (!containerRef.current) return;

    const animation = gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: 15,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSearch?.(searchValue.trim());
  };

  const handleChange = (event) => {
    const newValue = event.target.value;

    setSearchValue(newValue);

    // Optional live search
    onSearch?.(newValue);
  };

  const handleClear = () => {
    setSearchValue("");
    onSearch?.("");

    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col gap-3 sm:flex-row"
    >
      {/* Search Box */}
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-1 items-center"
      >
        <Search
          size={19}
          className="pointer-events-none absolute left-4 text-gray-400"
        />

        <input
          ref={inputRef}
          type="search"
          value={searchValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Clear search"
          >
            <X size={17} />
          </button>
        )}
      </form>

      {/* Search Button */}
      <button
        type="button"
        onClick={handleSubmit}
        className="h-12 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95"
      >
        Search
      </button>

      {/* Filter Button */}
      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
        >
          <SlidersHorizontal size={17} />
          <span>Filters</span>
        </button>
      )}
    </div>
  );
};

export default ScholarshipSearch;