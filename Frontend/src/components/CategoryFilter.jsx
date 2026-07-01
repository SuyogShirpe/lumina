import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../stylesheets/categoryFilter.css";

export default function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}) {
  const [incidentCategories, setIncidentCategories] = useState([]);

  useEffect(() => {
    const fetchIncidentCategories = async () => {
      try {
        const response = await api.get("/api/incidents/categories");
        setIncidentCategories(response.data);
      } catch (error) {
        console.error("Error fetching incident categories:", error);
      }
    };
    fetchIncidentCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  return (
  <div className="filter-card">
    <div className="filter-header">
      <h2>FILTER BY TYPE</h2>
    </div>

    <div className="filter-list">
      {incidentCategories.map((category) => {
        const checked = selectedCategories.includes(category.categoryId);

        return (
          <label
            key={category.categoryId}
            className={`filter-item ${checked ? "selected" : ""}`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => handleCategoryChange(category.categoryId)}
            />

            <span className="material-symbols-outlined filter-icon">
              {category.iconName}
            </span>

            <span className="filter-name">{category.name}</span>
          </label>
        );
      })}
    </div>
  </div>
);
}
