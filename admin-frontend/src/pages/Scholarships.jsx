import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  GraduationCap,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Scholarships = () => {
  const navigate = useNavigate();

  const [scholarships, setScholarships] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchScholarships = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/scholarships");

      setScholarships(
        data?.data?.scholarships ||
        data?.data ||
        data?.scholarships ||
        []
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
        "Unable to load scholarships."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const filteredScholarships = scholarships.filter((item) =>
    `${item.title || ""} ${item.provider || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const deleteScholarship = async (id) => {
    if (!window.confirm("Delete this scholarship?")) return;

    try {
      await api.delete(`/scholarships/${id}`);
      toast.success("Scholarship deleted.");
      fetchScholarships();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Unable to delete scholarship."
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Scholarships
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage scholarship opportunities.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/scholarships/create")}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold hover:bg-purple-500"
        >
          <Plus size={18} />
          Add Scholarship
        </button>
      </div>

      <div className="mb-5 flex gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scholarships..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm outline-none focus:border-purple-500"
          />
        </div>

        <button
          onClick={fetchScholarships}
          className="rounded-xl border border-white/10 px-4 text-slate-400 hover:bg-white/5"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b border-white/10 bg-white/[0.03]">
              <tr>
                <th className="px-5 py-4 text-sm text-slate-400">
                  Scholarship
                </th>
                <th className="px-5 py-4 text-sm text-slate-400">
                  Provider
                </th>
                <th className="px-5 py-4 text-sm text-slate-400">
                  Amount
                </th>
                <th className="px-5 py-4 text-sm text-slate-400">
                  Status
                </th>
                <th className="px-5 py-4 text-sm text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-slate-500"
                  >
                    Loading scholarships...
                  </td>
                </tr>
              ) : filteredScholarships.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-slate-500"
                  >
                    No scholarships found.
                  </td>
                </tr>
              ) : (
                filteredScholarships.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                          <GraduationCap size={19} />
                        </div>

                        <span className="font-medium">
                          {item.title || "Untitled"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-400">
                      {item.provider || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {item.amount
                        ? `₹${item.amount}`
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                        {item.active === false
                          ? "Inactive"
                          : "Active"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          deleteScholarship(item._id)
                        }
                        className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default Scholarships;