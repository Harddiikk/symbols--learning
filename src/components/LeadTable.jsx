import { useState, useMemo } from 'react';
import { ArrowUpDown, Mail, Building2, UserCircle2, CheckCircle2, Clock, XCircle } from 'lucide-react';

const mockData = [
  { id: 1, name: 'Alice Cooper', email: 'alice@datacorp.io', company: 'DataCorp', icebreaker: 'Saw your recent post on data lakes.', icebreaker_status: 'Generated', campaign_status: 'Contacted', date_added: '2023-11-01' },
  { id: 2, name: 'Bob Smith', email: 'bsmith@logistics.net', company: 'Logistics Net', icebreaker: '', icebreaker_status: 'Failed', campaign_status: 'Pending', date_added: '2023-11-02' },
  { id: 3, name: 'Charlie Davis', email: 'cdavis@aiworks.ai', company: 'AI Works', icebreaker: 'Congrats on the Series A funding!', icebreaker_status: 'Generated', campaign_status: 'Replied', date_added: '2023-11-05' },
  { id: 4, name: 'Diana Prince', email: 'diana@heroics.co', company: 'Heroics Co', icebreaker: 'Loved your talk at the summit.', icebreaker_status: 'Pending', campaign_status: 'Pending', date_added: '2023-11-08' },
];

export default function LeadTable({ searchQuery = '' }) {
  const [data, setData] = useState(mockData);
  const [sortConfig, setSortConfig] = useState({ key: 'date_added', direction: 'desc' });

  // Sorting
  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  // Filtering based on search query
  const filteredData = useMemo(() => {
    return sortedData.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedData, searchQuery]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const StatusBadge = ({ type, status }) => {
    let badgeClass = "badge-neutral";
    if (status === 'Replied' || status === 'Generated') badgeClass = "badge-success";
    if (status === 'Pending') badgeClass = "badge-warning";
    if (status === 'Failed') badgeClass = "bg-red-100 text-red-700 border-red-200";

    const Icon = 
      status === 'Replied' || status === 'Generated' ? CheckCircle2 :
      status === 'Failed' ? XCircle : Clock;

    return (
      <span className={`badge ${badgeClass}`}>
        <Icon className="w-3 h-3" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="w-full h-full rounded-[18px] bg-white/40 border border-white/20 flex flex-col overflow-hidden">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-liquid-bg/50 backdrop-blur-md sticky top-0 z-10 border-b border-liquid-border/80">
            <tr>
              {[
                { label: 'Name', key: 'name' },
                { label: 'Company', key: 'company' },
                { label: 'Icebreaker', key: 'icebreaker' },
                { label: 'Campaign Status', key: 'campaign_status' },
                { label: 'Date Added', key: 'date_added' },
              ].map((col) => (
                <th 
                  key={col.key}
                  className="px-6 py-4 text-xs font-semibold text-liquid-textMuted uppercase tracking-wider cursor-pointer hover:bg-white/30 transition-colors"
                  onClick={() => requestSort(col.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-xs font-semibold text-liquid-textMuted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-liquid-border/50 bg-white/20">
            {filteredData.map((row) => (
              <tr key={row.id} className="hover:bg-white/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-liquid-primary/20 flex items-center justify-center text-liquid-primary text-sm font-medium">
                      {row.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-liquid-text">{row.name}</p>
                      <p className="text-xs text-liquid-textMuted flex items-center mt-0.5">
                        <Mail className="w-3 h-3 mr-1" />
                        {row.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm font-medium text-liquid-text">
                    <Building2 className="w-4 h-4 mr-2 text-liquid-textMuted opacity-50" />
                    {row.company}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-[200px]">
                    <p className="text-sm text-liquid-text truncate" title={row.icebreaker}>
                      {row.icebreaker || <span className="text-liquid-textMuted italic">No icebreaker</span>}
                    </p>
                    <div className="mt-1">
                      <StatusBadge type="icebreaker" status={row.icebreaker_status} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge type="campaign" status={row.campaign_status} />
                </td>
                <td className="px-6 py-4 text-sm text-liquid-textMuted">
                  {new Date(row.date_added).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-liquid-primary hover:text-liquid-primaryHover text-sm font-medium">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-liquid-textMuted">
                  No leads found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
