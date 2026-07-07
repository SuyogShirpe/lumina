import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";

const CategoryContext = createContext();

export default function CategoryContext({ children }) {
  const [incidentCategories, setIncidentCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidentCategories = async () => {
      try {
        const response = await api.get("/api/incidents/categories");
        setIncidentCategories(response.data);
      } catch (error) {
        console.error("Error fetching incident categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidentCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ incidentCategories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategoryContext = () => {
  const context = useContect(CategoryContext);

  if (!context) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }

  return context;
};
