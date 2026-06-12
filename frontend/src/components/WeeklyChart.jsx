import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function WeeklyChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="empty">No weekly data yet.</p>;
  }

  const chartData = data.map(report => ({
    date: report.date.slice(5), // show MM-DD
    productive: Math.round(report.productiveSeconds / 60),
    unproductive: Math.round(report.unproductiveSeconds / 60)
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
        <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'minutes', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
        <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
        <Bar dataKey="productive" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="unproductive" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}