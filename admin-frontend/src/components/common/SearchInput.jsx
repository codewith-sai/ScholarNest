import { Search, X } from "lucide-react";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  const handleClear = () => {
    onChange({
      target: {
        value: "",
      },
    });
  };

  return (
    <div className={`relative ${className}`}>

      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-10 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-purple-500 focus:bg-white/[0.05]"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-white/5 hover:text-white"
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}

    </div>
  );
};

export default SearchInput;