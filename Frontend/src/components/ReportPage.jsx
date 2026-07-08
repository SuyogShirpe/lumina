export default function ReportPage() {
  const { categories } = useCategories();

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    occurredAt: "",
    latitude: "",
    longitude: "",
  });

  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState("");

  const [userLocation, setUserLocation] = useState(null);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";
    
    if (photos.length + files.length > 3) {
      setPhotoError("You can upload a maximum of 3 photos.");
      return;
    }

    setPhotoError("");

    setPhotos((prev) => [
      ...prev,
      ...files,
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userLocation);
        setFormData((prev) => ({
          ...prev,
          latitude: location.lat,
          longitude: location.lng,
        }));
      },
      (error) => {
        console.error("Error getting user location:", error);
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={formData.title}
        onChange={handlechange}
      ></input>

      <textarea
        name="description"
        value={formData.description}
        onChange={handlechange}
      ></textarea>

      <select
        disabled={categories.length === 0}
        name="categoryId"
        value={formData.categoryId}
        onChange={handlechange}
      ></select>

      <input
        name="occurredAt"
        value={formData.occurredAt}
        onChange={handlechange}
      />
      <input
        name="latitude"
        value={formData.latitude}
        onChange={handlechange}
      />
      <input
        name="longitude"
        value={formData.longitude}
        onChange={handlechange}
      />

      <button onClick={handleUseCurrentLocation}>
        Use my current location
      </button>

      <input
        type="file"
        name="photos"
        accept="image/*"
        multiple
        value={photos.photos}
        onChange={handlePhotoChange}
      />
      {photoError && <div className="text-danger">{photoError}</div>}

      <button type="submit">Submit</button>
    </form>
  );
}
