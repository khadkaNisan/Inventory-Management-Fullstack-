import { useState, useEffect } from 'react';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  DollarSign,
  TrendingDown,
  Warehouse,
  Tag,
  Loader2,
} from 'lucide-react';
import { getDashboardStats } from '../api';
import type { DashboardStats } from '../types';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
  iconBg: string;
  sub?: string;
}

function StatCard({ label, value, icon: Icon, accent, iconBg, sub }: StatCardProps) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4 hover:shadow-lg hover:shadow-black/30 transition-shadow duration-200 group`}>
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={20} className={accent} />
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className={`text-2xl font-bold ${accent}`}>{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load stats.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  const s = stats!;

  const cards: StatCardProps[] = [
    {
      label: 'Total Items',
      value: s.total_items,
      icon: Package,
      accent: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      sub: 'Across all inventories',
    },
    {
      label: 'In Stock',
      value: s.in_stock,
      icon: CheckCircle2,
      accent: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      sub: s.total_items > 0
        ? `${Math.round((s.in_stock / s.total_items) * 100)}% of total items`
        : '0% of total items',
    },
    {
      label: 'Low Stock',
      value: s.low_stock,
      icon: AlertTriangle,
      accent: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
      sub: 'Below minimum threshold',
    },
    {
      label: 'Out of Stock',
      value: s.out_of_stock,
      icon: XCircle,
      accent: 'text-red-400',
      iconBg: 'bg-red-500/10',
      sub: 'Needs immediate restocking',
    },
    {
      label: 'Total Value',
      value: `$${s.total_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      accent: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      sub: 'Retail price × quantity',
    },
    {
      label: 'Total Cost',
      value: `$${s.total_cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingDown,
      accent: 'text-slate-300',
      iconBg: 'bg-slate-700/60',
      sub: 'Cost price × quantity',
    },
    {
      label: 'Inventories',
      value: s.inventory_count,
      icon: Warehouse,
      accent: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10',
      sub: 'Active warehouses',
    },
    {
      label: 'Categories',
      value: s.category_count,
      icon: Tag,
      accent: 'text-violet-400',
      iconBg: 'bg-violet-500/10',
      sub: 'Across all inventories',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Overview</h2>
        <p className="text-slate-400 text-sm mt-1">Real-time snapshot of your inventory health.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Quick health bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p className="text-sm font-medium text-slate-300 mb-3">Stock Health Distribution</p>
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          <div
            className="bg-emerald-500 transition-all"
            style={{ width: s.total_items > 0 ? `${(s.in_stock / s.total_items) * 100}%` : '0%' }}
          />
          <div
            className="bg-amber-500 transition-all"
            style={{ width: s.total_items > 0 ? `${(s.low_stock / s.total_items) * 100}%` : '0%' }}
          />
          <div
            className="bg-red-500 transition-all"
            style={{ width: s.total_items > 0 ? `${(s.out_of_stock / s.total_items) * 100}%` : '0%' }}
          />
        </div>
        <div className="flex gap-5 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> In Stock ({s.in_stock})</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Low Stock ({s.low_stock})</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Out of Stock ({s.out_of_stock})</span>
        </div>
      </div>
    </div>
  );
}
