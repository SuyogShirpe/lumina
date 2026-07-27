import { useEffect, useMemo, useState } from "react";
import api from "../api/axiosInstance";
import { toast } from "sonner";
import "../stylesheets/adminPanel.css";

export default function AdminPanel() {
  const [incidents, setIncidents] = useState([]);
  const [incidentLoading, setIncidentLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    flagged: 0,
  });
  const [statLoading, setStatLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchIncidents = async (page = 0, status = "") => {
    try {
      setIncidentLoading(true);
      const params = { page, size: 10 };

      if (status) params.status = status;

      const response = await api.get("/api/admin/incidents", { params });

      setIncidents(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch incidents");
    } finally {
      setIncidentLoading(false);
    }
  };
  useEffect(() => {
    fetchIncidents(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const fetchStats = async () => {
    try {
      setStatLoading(true);

      const response = await api.get("/api/admin/stats");
      setStats({
        total: response.data.total,
        active: response.data.active,
        resolved: response.data.resolved,
        flagged: response.data.flagged,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setStatLoading(false);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (incidentId, newStatus) => {
    try {
      setUpdatingId(incidentId);
      await api.put(`/api/incidents/${incidentId}/status`, {
        status: newStatus,
      });

      setIncidents((prevIncident) =>
        prevIncident.map((incident) =>
          incident.incidentId === incidentId
            ? { ...incident, status: newStatus }
            : incident,
        ),
      );
      fetchStats();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update incident status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (incidentId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this incident? This cannot be undone.",
      );
      if (!confirmed) return;

      setDeletingId(incidentId);
      await api.delete(`/api/incidents/${incidentId}`);

      setIncidents((prevIncident) =>
        prevIncident.filter((incident) => incident.incidentId !== incidentId),
      );

      fetchStats();
      toast.success("Incident deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete incident.");
    } finally {
      setDeletingId(null);
    }
  };

  const displayedIncidents = useMemo(() => {
    if (!searchQuery.trim()) return incidents;

    return incidents.filter((incident) =>
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [incidents, searchQuery]);

  const handleRefresh = () => {
    fetchIncidents();
  };

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;

    setCurrentPage(newPage);
  };

  return (
    <div className="dashboard">
      <div className="stats-bar">
        <div className="stat-card">
          <h3>Total Reported Incidents</h3>
          <span>{stats.total}</span>
        </div>

        <div className="stat-card">
          <h3>Active Incidents</h3>
          <span>{stats.active}</span>
        </div>

        <div className="stat-card">
          <h3>Incidents Resolved</h3>
          <span>{stats.resolved}</span>
        </div>

        <div className="stat-card">
          <h3>Flagged Incidents</h3>
          <span>{stats.flagged}</span>
        </div>
      </div>

      <div className="row mb-3 align-items-center">
        <div className="col-md-5 mb-2 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, category, or reporter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="col-md-3 mb-2 mb-md-0">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="RESOLVED">Resolved</option>
            <option value="FLAGGED">Flagged</option>
          </select>
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-outline-primary w-100"
            onClick={handleRefresh}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Reporter</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {displayedIncidents.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No incidents found.
                </td>
              </tr>
            ) : (
              displayedIncidents.map((incident) => (
                <tr key={incident.incidentId}>
                  <td>{incident.incidentId}</td>

                  <td>{incident.title}</td>

                  <td>{incident.category.name}</td>

                  <td>{incident.reporter?.name}</td>

                  <td>{new Date(incident.createdAt).toLocaleDateString()}</td>

                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={incident.status}
                      disabled={updatingId === incident.incidentId}
                      onChange={(e) =>
                        handleStatusChange(incident.incidentId, e.target.value)
                      }
                    >
                      <option value="ACTIVE">ACTIVE</option>

                      <option value="RESOLVED">RESOLVED</option>

                      <option value="FLAGGED">FLAGGED</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      disabled={deletingId === incident.incidentId}
                      onClick={() => handleDelete(incident.incidentId)}
                    >
                      {deletingId === incident.incidentId
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage == 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>

          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index ? "active" : ""}`}
            >
              <button className="page-link" onClick={() =>handlePageChange(index)}>
                {index + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              disabled={currentPage === totalPages - 1}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
