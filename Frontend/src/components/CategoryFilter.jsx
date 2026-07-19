import "../stylesheets/categoryFilter.css";
import { useCategoryContext } from "../contexts/CategoriesProvider";

export default function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}) {
  const { incidentCategories, loading } = useCategoryContext();

  if (loading) {
    return <div className="filter-card">Loading categories...</div>;
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);

      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  return (
    <div className="filter-card">
      <div className="filter-header">
        <h2>FILTER BY TYPE</h2>
      </div>

      <div className="filter-list">
        {incidentCategories?.map((category) => {
          const checked = selectedCategories.has(category.categoryId);

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
