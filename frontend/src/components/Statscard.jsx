export default function StatsCard({ label, value, color }) {
  return (
    <div className="stats-card" style={{ borderTop: `4px solid ${color}` }}>
      <p className="stats-label">{label}</p>
      <p className="stats-value" style={{ color }}>{value}</p>
    </div>
  );
}