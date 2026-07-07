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

  const handlechange = (e) => {
    const { name, value } = e.target;
     setFormData(prev => ({
        ...prev,
        [name]: value
     }));
  }


  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
  }

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

      <input
        type="file"
        name="photos"
        multiple
        value={photos.photos}
        onChange={handlePhotoChange}
        />
        <button type="submit"  >Submit</button>
    </form>
  );
}
