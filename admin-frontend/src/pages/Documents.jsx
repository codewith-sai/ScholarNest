import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  RefreshCw,
  Download,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ======================================================
  // FETCH DOCUMENTS
  // ======================================================

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/admin/documents"
      );

      setDocuments(
        data?.data?.documents ||
          data?.data ||
          data?.documents ||
          []
      );
    } catch (error) {
      console.error(
        "FETCH DOCUMENTS ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to load documents."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // VERIFY / UNVERIFY DOCUMENT
  // ======================================================

  const updateVerification = async (
    document
  ) => {
    if (
      !document?.studentId ||
      !document?._id
    ) {
      toast.error(
        "Document information is incomplete."
      );
      return;
    }

    try {
      setUpdatingId(document._id);

      const newStatus =
        !document.verified;

      await api.patch(
        `/admin/documents/${document.studentId}/${document._id}/verification`,
        {
          verified: newStatus,
        }
      );

      setDocuments((previous) =>
        previous.map((item) =>
          item._id === document._id
            ? {
                ...item,
                verified: newStatus,
              }
            : item
        )
      );

      toast.success(
        newStatus
          ? "Document verified successfully."
          : "Document verification removed."
      );
    } catch (error) {
      console.error(
        "UPDATE DOCUMENT ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to update document."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ======================================================
  // SEARCH
  // ======================================================

  const filteredDocuments =
    documents.filter((doc) => {
      const searchText = `
        ${doc.name || ""}
        ${doc.fileName || ""}
        ${doc.studentName || ""}
        ${doc.studentEmail || ""}
        ${doc.type || ""}
      `
        .toLowerCase()
        .trim();

      return searchText.includes(
        search.toLowerCase()
      );
    });

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Documents
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Review and verify student uploaded documents.
        </p>
      </div>

      {/* ==================================================
          SEARCH + REFRESH
      ================================================== */}

      <div className="mb-6 flex gap-3">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search documents, students..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
          />

        </div>

        <button
          type="button"
          onClick={fetchDocuments}
          disabled={loading}
          className="rounded-xl border border-white/10 px-4 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />
        </button>

      </div>

      {/* ==================================================
          DOCUMENT COUNT
      ================================================== */}

      <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
        <FileText size={16} />

        <span>
          {filteredDocuments.length} document
          {filteredDocuments.length !== 1
            ? "s"
            : ""}
        </span>
      </div>

      {/* ==================================================
          DOCUMENT GRID
      ================================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {/* LOADING */}

        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-500">
            <RefreshCw
              size={24}
              className="mx-auto mb-3 animate-spin"
            />

            Loading documents...
          </div>
        ) : filteredDocuments.length === 0 ? (

          /* EMPTY */

          <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] py-16 text-center">

            <FileText
              size={40}
              className="mx-auto mb-3 text-slate-700"
            />

            <p className="text-slate-500">
              No documents found.
            </p>

          </div>

        ) : (

          /* DOCUMENTS */

          filteredDocuments.map(
            (document) => {

              const isUpdating =
                updatingId ===
                document._id;

              return (
                <div
                  key={document._id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]"
                >

                  {/* ==================================================
                      TOP
                  ================================================== */}

                  <div className="flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                      <FileText
                        size={21}
                      />
                    </div>

                    {document.url && (
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                        title="Open document"
                      >
                        <Download
                          size={18}
                        />
                      </a>
                    )}

                  </div>

                  {/* ==================================================
                      DOCUMENT NAME
                  ================================================== */}

                  <h3 className="mt-4 truncate font-semibold text-white">
                    {document.name ||
                      document.fileName ||
                      "Document"}
                  </h3>

                  {/* ==================================================
                      STUDENT
                  ================================================== */}

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">

                    <User size={15} />

                    <span className="truncate">
                      {document.studentName ||
                        "Unknown student"}
                    </span>

                  </div>

                  {/* ==================================================
                      EMAIL
                  ================================================== */}

                  {document.studentEmail && (
                    <p className="mt-1 truncate text-xs text-slate-600">
                      {document.studentEmail}
                    </p>
                  )}

                  {/* ==================================================
                      TYPE
                  ================================================== */}

                  <div className="mt-3 flex items-center justify-between">

                    <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                      {document.type ||
                        "Unknown"}
                    </span>

                    {/* VERIFICATION STATUS */}

                    {document.verified ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle
                          size={14}
                        />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-400">
                        <XCircle
                          size={14}
                        />
                        Not verified
                      </span>
                    )}

                  </div>

                  {/* ==================================================
                      DATE
                  ================================================== */}

                  {document.uploadedAt && (
                    <p className="mt-3 text-xs text-slate-600">
                      Uploaded:{" "}
                      {new Date(
                        document.uploadedAt
                      ).toLocaleDateString()}
                    </p>
                  )}

                  {/* ==================================================
                      VERIFY BUTTON
                  ================================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      updateVerification(
                        document
                      )
                    }
                    disabled={isUpdating}
                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      document.verified
                        ? "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                    }`}
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw
                          size={16}
                          className="animate-spin"
                        />

                        Updating...
                      </>
                    ) : document.verified ? (
                      <>
                        <XCircle
                          size={16}
                        />

                        Remove Verification
                      </>
                    ) : (
                      <>
                        <CheckCircle
                          size={16}
                        />

                        Verify Document
                      </>
                    )}
                  </button>

                </div>
              );
            }
          )
        )}

      </div>
    </div>
  );
};

export default Documents;