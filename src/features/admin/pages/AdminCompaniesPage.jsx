import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import CompanyCard from "../components/CompanyCard";
import CompanyDetailModal from "../components/CompanyDetailModal";
import { useAdminCompanies, useVerifyCompany, useRejectCompany } from "../../../hooks/useAdmin";

const statusTabs = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

const AdminCompaniesPage = () => {
  const [filters, setFilters] = useState({ status: "", page: 1, limit: 20 });
  const [selected, setSelected] = useState(null);

  const { data, isLoading } = useAdminCompanies(filters);
  const verifyMutation = useVerifyCompany();
  const rejectMutation = useRejectCompany();

  const handleVerify = (id) => {
    verifyMutation.mutate(id);
    setSelected(null);
  };
  const handleReject = (id, reason) => {
    rejectMutation.mutate({ id, reason });
    setSelected(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-6">Companies</h1>

        <div className="card flex flex-wrap gap-2 mb-5">
          {statusTabs.map((tab) => (
            <button
              key={tab.value || "all"}
              onClick={() => setFilters((f) => ({ ...f, status: tab.value, page: 1 }))}
              className={`btn ${filters.status === tab.value ? "btn-primary" : "btn-secondary"} px-3 py-1.5 text-xs`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-sm text-[var(--text-muted)]">Loading…</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {data?.companies?.map((company) => (
            <CompanyCard key={company._id} company={company} onClick={setSelected} />
          ))}
        </div>

        {data?.companies?.length === 0 && !isLoading && (
          <p className="text-sm text-[var(--text-muted)] py-10 text-center">No companies found.</p>
        )}

        {data?.pagination && (
          <div className="flex items-center justify-between mt-6 text-sm text-[var(--text-secondary)]">
            <span>
              Page {data.pagination.page} of {data.pagination.pages} ({data.pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={filters.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                className="btn btn-secondary px-3 py-1.5 text-xs"
              >
                Prev
              </button>
              <button
                disabled={filters.page >= data.pagination.pages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                className="btn btn-secondary px-3 py-1.5 text-xs"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <CompanyDetailModal
        company={selected}
        onClose={() => setSelected(null)}
        onVerify={handleVerify}
        onReject={handleReject}
        isVerifying={verifyMutation.isPending}
        isRejecting={rejectMutation.isPending}
      />
    </div>
  );
};

export default AdminCompaniesPage;