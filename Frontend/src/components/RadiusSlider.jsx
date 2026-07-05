export default function RadiusSlider({ value, onChange }) {


  return (
    <div className="mb-3">
      <label htmlFor="radiusSlider" className="form-label fw-semibold">
        Radius: {value} km
      </label>

      <input
        id="radiusSlider"
        type="range"
        className="form-range"
        min="1"
        max="20"
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
