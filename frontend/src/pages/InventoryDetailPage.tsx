import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Tag, Package, ChevronRightIcon, Loader2, Plus, Pencil, Trash2, X } from 'lucide-react';
import { getInventory, getCategories, createCategory, updateCategory, deleteCategory } from '../api';
import type { Inventory, Category } from '../types';

// ─── Modals ───────────────────────────────────────────────────────────────────

interface FormModalProps {
  title: string;
  initialName?: string;
  initialDescription?: string;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
}

function FormModal({ title, initialName = '', initialDescription = '', onClose, onSubmit }: FormModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required.'); return; }
    setLoading(true);
    try {
      await onSubmit(name.trim(), description.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        {error && <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Electronics"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description <span className="text-slate-500">(optional)</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
            />
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
        <h3 className="text-white font-semibold text-lg mb-2">Delete Category</h3>
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

export default function InventoryDetailPage() {
  const { invId } = useParams<{ invId: string }>();
  const navigate = useNavigate();

  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const fetchData = useCallback(() => {
    if (!invId) return;
    setLoading(true);
    Promise.all([getInventory(invId), getCategories(invId)])
      .then(([inv, cats]) => {
        setInventory(inv);
        setCategories(cats);
      })
      .catch(err => {
        const msg = err instanceof Error ? err.message : 'Failed to load data.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [invId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    );
  }

  if (error || !inventory) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/inventories')} className="text-slate-400 hover:text-blue-400 transition-colors text-sm">← Back to Inventories</button>
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error || 'Inventory not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showCreate && (
        <FormModal
          title="New Category"
          onClose={() => setShowCreate(false)}
          onSubmit={async (name, description) => {
            await createCategory(invId!, name, description || undefined);
            fetchData();
          }}
        />
      )}
      {editTarget && (
        <FormModal
          title="Edit Category"
          initialName={editTarget.name}
          initialDescription={editTarget.description ?? ''}
          onClose={() => setEditTarget(null)}
          onSubmit={async (name, description) => {
            await updateCategory(invId!, editTarget.id, name, description || undefined);
            fetchData();
          }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteCategory(invId!, deleteTarget.id);
            fetchData();
          }}
        />
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Link to="/inventories" className="text-slate-400 hover:text-blue-400 transition-colors">Inventories</Link>
        <ChevronRight size={14} className="text-slate-600" />
        <span className="text-white font-medium">{inventory.name}</span>
      </nav>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{inventory.name}</h2>
          <p className="text-slate-400 text-sm mt-1">{inventory.description}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors duration-150"
        >
          <Plus size={16} />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="group bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-200 relative"
          >
            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={e => { e.preventDefault(); setEditTarget(cat); }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={e => { e.preventDefault(); setDeleteTarget(cat); }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <Link to={`/inventories/${invId}/${cat.id}`} className="block">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                  <Tag size={20} className="text-cyan-400" />
                </div>
                <ChevronRightIcon size={18} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>

              <h3 className="text-white font-semibold text-base mb-1">{cat.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{cat.description}</p>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                <Package size={14} className="text-slate-500" />
                <span className="text-sm text-slate-300">{cat.item_count} <span className="text-slate-500">items</span></span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
