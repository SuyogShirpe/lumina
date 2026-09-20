import "../stylesheets/radiusSlider.css";

export default function RadiusSlider({ value, onChange }) {
  return (
    <div className="radius-section">
      <div className="radius-header">
        <span>Search radius</span>
        <strong>{value} km</strong>
      </div>

      <input
        id="radiusSlider"
        type="range"
        className="radius-slider"
        min="1"
        max="20"
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}