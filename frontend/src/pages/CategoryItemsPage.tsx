import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2, Plus, Pencil, Trash2, X } from 'lucide-react';
import { getItems, getCategories, createItem, updateItem, deleteItem } from '../api';
import type { Item, Category, ItemCreate, ItemUpdate } from '../types';

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

// ─── Item Form Modal ──────────────────────────────────────────────────────────

interface ItemFormModalProps {
  title: string;
  categoryId: string;
  initialData?: Partial<ItemCreate>;
  onClose: () => void;
  onSubmit: (data: ItemCreate) => Promise<void>;
}

function ItemFormModal({ title, categoryId, initialData = {}, onClose, onSubmit }: ItemFormModalProps) {
  const [name, setName] = useState(initialData.name ?? '');
  const [sku, setSku] = useState(initialData.sku ?? '');
  const [quantity, setQuantity] = useState(String(initialData.quantity ?? 0));
  const [minStock, setMinStock] = useState(String(initialData.min_stock ?? 0));
  const [price, setPrice] = useState(String(initialData.price ?? 0));
  const [cost, setCost] = useState(String(initialData.cost ?? 0));
  const [supplier, setSupplier] = useState(initialData.supplier ?? '');
  const [unit, setUnit] = useState(initialData.unit ?? 'pcs');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) { setError('Name and SKU are required.'); return; }
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        sku: sku.trim(),
        category_id: categoryId,
        quantity: Number(quantity),
        min_stock: Number(minStock),
        price: Number(price),
        cost: Number(cost),
        supplier: supplier.trim() || undefined,
        unit: unit.trim() || 'pcs',
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 overflow-y-auto py-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        {error && <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Item name" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">SKU</label>
              <input type="text" value={sku} onChange={e => setSku(e.target.value)} placeholder="e.g. EL-001" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Quantity</label>
              <input type="number" min="0" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Min Stock</label>
              <input type="number" min="0" value={minStock} onChange={e => setMinStock(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Price ($)</label>
              <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Cost ($)</label>
              <input type="number" min="0" step="0.01" value={cost} onChange={e => setCost(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Supplier <span className="text-slate-500">(optional)</span></label>
              <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Supplier name" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Unit</label>
              <input type="text" value={unit} onChange={e => setUnit(e.target.value)} placeholder="pcs / kg / set..." className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm hover:border-slate-600 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteModalProps {
  name: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function DeleteModal({ name, onClose, onConfirm }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-white font-semibold text-lg mb-2">Delete Item</h3>
        <p className="text-slate-400 text-sm mb-4">Are you sure you want to delete <span className="text-white font-medium">"{name}"</span>? This action cannot be undone.</p>
        {error && <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm hover:border-slate-600 hover:text-white transition-colors">Cancel</button>
          <button onClick={handleConfirm} disabled={loading} className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={15} className="animate-spin" /> Deleting...</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CategoryItemsPage() {
  const { invId, catId } = useParams<{ invId: string; catId: string }>();
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [inventoryName, setInventoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Item | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);

  const fetchData = useCallback(() => {
    if (!invId || !catId) return;
    setLoading(true);
    Promise.all([
      getItems({ cat_id: catId }),
      getCategories(invId),
    ])
      .then(([fetchedItems, cats]) => {
        setItems(fetchedItems);
        const cat = cats.find(c => c.id === catId) ?? null;
        setCategory(cat);
        // derive inventory name from breadcrumb — use invId as fallback
        setInventoryName(invId);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load data.');
      })
      .finally(() => setLoading(false));
  }, [invId, catId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/inventories')} className="text-slate-400 hover:text-blue-400 transition-colors text-sm">← Back to Inventories</button>
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error || 'Category not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showCreate && catId && (
        <ItemFormModal
          title="New Item"
          categoryId={catId}
          onClose={() => setShowCreate(false)}
          onSubmit={async (data: ItemCreate) => {
            await createItem(data);
            fetchData();
          }}
        />
      )}
      {editTarget && catId && (
        <ItemFormModal
          title="Edit Item"
          categoryId={catId}
          initialData={{
            name: editTarget.name,
            sku: editTarget.sku,
            quantity: editTarget.quantity,
            min_stock: editTarget.min_stock,
            price: editTarget.price,
            cost: editTarget.cost,
            supplier: editTarget.supplier,
            unit: editTarget.unit,
          }}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data: ItemCreate) => {
            const updateData: ItemUpdate = { ...data };
            await updateItem(editTarget.id, updateData);
            fetchData();
          }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteItem(deleteTarget.id);
            fetchData();
          }}
        />
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm flex-wrap">
        <Link to="/inventories" className="text-slate-400 hover:text-blue-400 transition-colors">Inventories</Link>
        <ChevronRight size={14} className="text-slate-600" />
        <Link to={`/inventories/${invId}`} className="text-slate-400 hover:text-blue-400 transition-colors">{inventoryName}</Link>
        <ChevronRight size={14} className="text-slate-600" />
        <span className="text-white font-medium">{category.name}</span>
      </nav>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{category.name}</h2>
          <p className="text-slate-400 text-sm mt-1">{category.description}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors duration-150"
        >
          <Plus size={16} />
          New Item
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">SKU</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Qty</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Min Stock</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Supplier</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Last Updated</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{item.sku}</td>
                  <td className="px-4 py-3 text-slate-200 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-slate-400 text-right">{item.min_stock}</td>
                  <td className="px-4 py-3 text-slate-200 text-right">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-400 text-right">${item.cost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-300">{item.supplier}</td>
                  <td className="px-4 py-3 text-slate-400">{item.unit}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{new Date(item.last_updated).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditTarget(item)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
