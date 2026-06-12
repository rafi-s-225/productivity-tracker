import { useEffect, useState } from 'react';
import API from '../api';

export default function BlocklistManager({ userId }) {
  const [blocklist, setBlocklist] = useState([]);
  const [domain, setDomain] = useState('');

  const fetchBlocklist = async () => {
    try {
      const res = await API.get(`/blocklist/${userId}`);
      setBlocklist(res.data);
    } catch {
      setBlocklist([]);
    }
  };

  useEffect(() => {
    fetchBlocklist();
  }, [userId]);

  const addSite = async () => {
    const cleanDomain = domain.trim().replace('www.', '');
    if (!cleanDomain) return;

    try {
      await API.post('/blocklist', { userId, domain: cleanDomain });
      setDomain('');
      fetchBlocklist();
    } catch {}
  };

  const removeSite = async (d) => {
    try {
      await API.delete(`/blocklist/${userId}/${d}`);
      fetchBlocklist();
    } catch {}
  };

  return (
    <div>
      <div className="add-site-row">
        <input
          type="text"
          placeholder="e.g. instagram.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSite()}
        />
        <button onClick={addSite}>Block</button>
      </div>

      {blocklist.length === 0 ? (
        <p className="empty">No sites blocked yet.</p>
      ) : (
        <ul className="blocklist-items">
          {blocklist.map((entry) => (
            <li key={entry._id}>
              <span>{entry.domain}</span>
              <button onClick={() => removeSite(entry.domain)} className="remove-btn">✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}