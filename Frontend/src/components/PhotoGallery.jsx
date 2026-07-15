import { useEffect } from "react";

export default function PhotoGallery() {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  function photoGallery({ incident, VITE_API_BASE_URL }) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

    const photos = incident.photoUrls || [];

    if (photos.length == 0) {
      return (
        <div className="text-center border rounded p-5 bg-light">
          <div style={{ fontSize: "3rem" }}>📷</div>
          <p className="text-muted mb-0">No photos available</p>
        </div>
      );
    }

    const selectedPhoto = `${VITE_API_BASE_URL}${photos[selectedPhotoIndex]}`;
  }

  return (
    <>
      <img
        src={selectedPhoto}
        alt="Incident"
        className="img-fluid rounded mb-3"
      ></img>

      <div className="d-flex gap-2 overflow-auto">
        {photos.map((photo, index) => (
          <img
            key={photo}
            src={`${VITE_API_BASE_URL}${photo}`}
            alt={`Thumbnail ${index + 1}`}
            width={80}
            height={80}
            className={` rounded ${
              index === selectedPhotoIndex
                ? "border border-3 border-primary"
                : "border"
            }`}
            style={{
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => setSelectedPhotoIndex(index)}
          />
        ))}
      </div>
    </>
  );
}
