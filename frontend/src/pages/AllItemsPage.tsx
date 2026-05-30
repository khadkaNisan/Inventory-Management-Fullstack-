import { useState, useEffect, useMemo } from 'react';
import { Search, SearchX, Loader2 } from 'lucide-react';
import { getItems } from '../api';
import type { Item } from '../types';

type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

function StatusBadge({ status }: { status: StockStatus }) {
  const map: Record<StockStatus, string> = {
    'in-stock': 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30',
    'low-stock': 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30',
    'out-of-stock': 'bg-red-500/10 text-red-400 ring-1 ring-red-500/30',
  };
  const labels: Record<StockStatus, string> = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock',
    'out-of-stock': 'Out of Stock',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function AllItemsPage() {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    getItems()
      .then(setAllItems)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load items.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
    );
  }, [query, allItems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">All Items</h2>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} of {allItems.length} items</p>
        </div>
        <div className="relative sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <SearchX size={28} className="text-slate-500" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">No results found</h3>
            <p className="text-slate-400 text-sm text-center max-w-xs">
              No items match "<span className="text-slate-300 font-medium">{query}</span>". Try a different name or SKU.
            </p>
            <button
              onClick={() => setQuery('')}
              className="mt-4 px-4 py-2 text-sm text-blue-400 hover:text-blue-300 border border-blue-600/30 hover:border-blue-500/50 rounded-lg transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">SKU</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Qty</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Min</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Supplier</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Unit</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{item.name}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{item.sku}</td>
                    <td className="px-4 py-3 text-slate-200 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-slate-400 text-right">{item.min_stock}</td>
                    <td className="px-4 py-3 text-slate-200 text-right">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-400 text-right">${item.cost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{item.supplier}</td>
                    <td className="px-4 py-3 text-slate-400">{item.unit}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{new Date(item.last_updated).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
