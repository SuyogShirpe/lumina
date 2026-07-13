import api from "../api/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategoryContext } from "../contexts/CategoriesProvider";
import { toast } from "sonner";
import "../stylesheets/reportPage.css"

export default function ReportPage() {
  const { incidentCategories } = useCategoryContext();

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    occurredAt: "",
    lat: "",
    lng: "",
  });

  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const availableSlots = 3 - photos.length;

    if (availableSlots <= 0) {
      setPhotoError("You can upload a maximum of 3 photos.");
      return;
    }

    const photosToAdd = newPhotos.slice(0, availableSlots);

    if (newPhotos.length > availableSlots) {
      setPhotoError("Only the first 3 photos were added.");
    } else {
      setPhotoError("");
    }

    setPhotos((prev) => [...prev, ...photosToAdd]);
  };

  const removePhoto = (indexToRemove) => {
    URL.revokeObjectURL(photos[indexToRemove].preview);

    setPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    return () => {
      photos.forEach((photo) => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, [photos]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category.";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Please enter a title.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please provide a description.";
    }

    if (!formData.occurredAt) {
      newErrors.occurredAt = "Please select the date and time.";
    }

    if (!formData.lat) {
      newErrors.lat = "Latitude is required.";
    }

    if (!formData.lng) {
      newErrors.lng = "Longitude is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }
    setSubmitting(true);

    try {
      const incidentData = {
        ...formData,
        occurredAt:
          formData.occurredAt.length === 16
            ? formData.occurredAt + ":00"
            : formData.occurredAt,
      };

      console.log(incidentData);
      const incidentResponse = await api.post("/api/incidents", incidentData);

      const incident = incidentResponse.data;
      const incidentId = incident.incidentId;

      if (photos.length > 0) {
        const photoData = new FormData();

        photos.forEach((photo) => {
          photoData.append("files", photo.file);
        });

        try {
          await api.post(`/api/incidents/${incidentId}/photos`, photoData);
        } catch (photoError) {
          console.log(photoError);

          toast.warning("Incident reported but photo upload failed.");

          navigate("/");

          return;
        }
      }
      toast.success("Incident reported successfully.");

      navigate("/");
    } catch (error) {
      console.error(error);

      toast.error("Unable to submit incident.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setFormData((prev) => ({
          ...prev,
          lat: location.lat,
          lng: location.lng,
        }));
      },
      (error) => {
        toast.error("Unable to get your current location.");
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Title</label>

        <input
          type="text"
          name="title"
          placeholder="Enter incident title"
          value={formData.title}
          onChange={handleChange}
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
        />
        <div className="invalid-feedback">{errors.title}</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          placeholder="Describe what happened..."
          value={formData.description}
          onChange={handleChange}
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
        />
        <div className="invalid-feedback">{errors.description}</div>
      </div>

      <div className="mb-3">
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
        >
          <option value="">Choose Category</option>

          {incidentCategories.map((category) => (
            <option value={category.categoryId} key={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">{errors.categoryId}</div>
      </div>
      <div className="mb-3">
        <input
          type="datetime-local"
          name="occurredAt"
          value={formData.occurredAt}
          onChange={handleChange}
          className={`form-control ${errors.occurredAt ? "is-invalid" : ""}`}
        />
        <div className="invalid-feedback">{errors.occurredAt}</div>
      </div>
      <div className="mb-3">
        <label>Latitude</label>
        <input
          type="number"
          name="lat"
          value={formData.lat}
          onChange={handleChange}
          className={`form-control ${errors.lat ? "is-invalid" : ""}`}
        />
        <div className="invalid-feedback">{errors.lat}</div>
      </div>
      <div className="mb-3">
        <label>Longitude</label>
        <input
          type="number"
          name="lng"
          value={formData.lng}
          onChange={handleChange}
          className={`form-control ${errors.lng ? "is-invalid" : ""}`}
        />

        <div className="invalid-feedback">{errors.lng}</div>
      </div>
      <div className="mb-3">
        <button type="button" onClick={handleUseCurrentLocation}>
          Use my current location
        </button>
      </div>
      <div className="mb-3">
        <input
          type="file"
          name="photos"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
        />
        {photoError && <div className="text-danger">{photoError}</div>}

        <div className="preview-grid">
          {photos.map((photo, index) => (
            <div key={photo.preview} className="preview-item">
              <img
                src={photo.preview}
                alt={`Preview ${index + 1}`}
                width="120"
              />

              <button type="button" onClick={() => removePhoto(index)}>
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
