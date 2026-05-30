import { API_URL } from './config';
import type { User, Inventory, Category, Item, DashboardStats, ItemCreate, ItemUpdate } from './types';

const TOKEN_KEY = 'inventrack_token';

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body?.detail ?? detail;
    } catch {
      // ignore parse error
    }
    throw new Error(detail);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function register(
  email: string,
  password: string,
  name?: string,
): Promise<{ access_token: string; token_type: string }> {
  return request<{ access_token: string; token_type: string }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    },
    false,
  );
}

export async function login(
  email: string,
  password: string,
): Promise<{ access_token: string; token_type: string }> {
  // OAuth2 password flow expects form data
  const form = new URLSearchParams();
  form.append('username', email);
  form.append('password', password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });

  if (res.status === 401) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body?.detail ?? detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function getMe(): Promise<User> {
  return request<User>('/auth/me');
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>('/dashboard/stats');
}

// ─── Inventories ──────────────────────────────────────────────────────────────

export async function getInventories(): Promise<Inventory[]> {
  return request<Inventory[]>('/inventories');
}

export async function getInventory(id: string): Promise<Inventory> {
  return request<Inventory>(`/inventories/${id}`);
}

export async function createInventory(
  name: string,
  description?: string,
): Promise<Inventory> {
  return request<Inventory>('/inventories', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
}

export async function updateInventory(
  id: string,
  name: string,
  description?: string,
): Promise<Inventory> {
  return request<Inventory>(`/inventories/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, description }),
  });
}

export async function deleteInventory(id: string): Promise<void> {
  return request<void>(`/inventories/${id}`, { method: 'DELETE' });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(invId: string): Promise<Category[]> {
  return request<Category[]>(`/inventories/${invId}/categories`);
}

export async function createCategory(
  invId: string,
  name: string,
  description?: string,
): Promise<Category> {
  return request<Category>(`/inventories/${invId}/categories`, {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
}

export async function updateCategory(
  invId: string,
  catId: string,
  name: string,
  description?: string,
): Promise<Category> {
  return request<Category>(`/inventories/${invId}/categories/${catId}`, {
    method: 'PUT',
    body: JSON.stringify({ name, description }),
  });
}

export async function deleteCategory(
  invId: string,
  catId: string,
): Promise<void> {
  return request<void>(`/inventories/${invId}/categories/${catId}`, {
    method: 'DELETE',
  });
}

// ─── Items ────────────────────────────────────────────────────────────────────

export async function getItems(params?: {
  cat_id?: string;
  inv_id?: string;
}): Promise<Item[]> {
  const qs = new URLSearchParams();
  if (params?.cat_id) qs.set('cat_id', params.cat_id);
  if (params?.inv_id) qs.set('inv_id', params.inv_id);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<Item[]>(`/items${query}`);
}

export async function createItem(data: ItemCreate): Promise<Item> {
  return request<Item>('/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateItem(id: string, data: ItemUpdate): Promise<Item> {
  return request<Item>(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteItem(id: string): Promise<void> {
  return request<void>(`/items/${id}`, { method: 'DELETE' });
}
