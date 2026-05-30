import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Warehouse,
  PackageSearch,
  LogOut,
  Menu,
  X,
  Box,
} from 'lucide-react';
import { logout } from '../utils/auth';
import { getMe } from '../api';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/inventories': 'Inventories',
  '/items': 'All Items',
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.match(/^\/inventories\/[^/]+\/[^/]+/)) return 'Category Items';
  if (pathname.match(/^\/inventories\/[^/]+/)) return 'Inventory Categories';
  return 'InvenTrack';
}

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    getMe()
      .then(user => setUserEmail(user.email))
      .catch(() => setUserEmail(''));
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/inventories', label: 'Inventories', icon: Warehouse, exact: false },
    { to: '/items', label: 'All Items', icon: PackageSearch, exact: true },
  ];

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Box size={18} className="text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">InvenTrack</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 ring-1 ring-blue-600/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-2">
        <div className="px-3 py-2 rounded-lg bg-slate-800/60">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Signed in as</p>
          <p className="text-sm text-slate-300 truncate">{userEmail || '—'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>
        {sidebar}
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex-shrink-0 h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-slate-100 font-semibold text-base flex-1">{getPageTitle(pathname)}</h1>
          <span className="hidden sm:block text-sm text-slate-500 truncate max-w-xs">{userEmail}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
