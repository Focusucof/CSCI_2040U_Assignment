'use client';

import React, { useState, useEffect } from 'react';
import { Music2, Plus, Pencil, Trash2, X, Music, Disc3, ListMusic, Mic2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';

const API = 'http://localhost:8080';

type Tab = 'songs' | 'albums' | 'playlists' | 'artists';

const tabConfig: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'songs', label: 'Songs', icon: Music },
  { key: 'albums', label: 'Albums', icon: Disc3 },
  { key: 'playlists', label: 'Playlists', icon: ListMusic },
  { key: 'artists', label: 'Artists', icon: Mic2 },
];

const fieldsByTab: Record<Tab, { key: string; label: string; type: string }[]> = {
  songs: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'artist', label: 'Artist', type: 'text' },
    { key: 'album', label: 'Album', type: 'text' },
    { key: 'coverUrl', label: 'Cover URL', type: 'text' },
    { key: 'duration', label: 'Duration', type: 'text' },
    { key: 'genre', label: 'Genre', type: 'text' },
  ],
  albums: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'artist', label: 'Artist', type: 'text' },
    { key: 'coverUrl', label: 'Cover URL', type: 'text' },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'trackCount', label: 'Track Count', type: 'number' },
  ],
  playlists: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'coverUrl', label: 'Cover URL', type: 'text' },
    { key: 'trackCount', label: 'Track Count', type: 'number' },
  ],
  artists: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'imageUrl', label: 'Image URL', type: 'text' },
    { key: 'genre', label: 'Genre', type: 'text' },
  ],
};

function getDisplayName(tab: Tab, item: any): string {
  return item.title || item.name || 'Untitled';
}

function getSubtext(tab: Tab, item: any): string {
  if (tab === 'songs') return `${item.artist} - ${item.album}`;
  if (tab === 'albums') return `${item.artist} - ${item.year}`;
  if (tab === 'playlists') return item.description || '';
  if (tab === 'artists') return item.genre || '';
  return '';
}

export default function AdminPage() {
  const { addToast } = useToast();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('songs');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  // Auth check
  useEffect(() => {
    fetch('http://localhost:3001/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.isAdmin) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      })
      .catch(() => setAuthorized(false));
  }, []);

  // Fetch items when tab changes
  useEffect(() => {
    if (!authorized) return;
    fetchItems();
  }, [activeTab, authorized]);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/${activeTab}`, { credentials: 'include' });
      if (res.ok) {
        setItems(await res.json());
      } else {
        setItems([]);
        addToast(`Failed to load ${activeTab}.`, 'error');
      }
    } catch {
      setItems([]);
      addToast(`Could not connect to server.`, 'error');
    }
    setLoading(false);
  }

  function openCreateForm() {
    setEditingId(null);
    setFormData({});
    setShowForm(true);
    setError('');
  }

  function openEditForm(item: any) {
    setEditingId(item.id);
    const data: Record<string, string> = {};
    fieldsByTab[activeTab].forEach((f) => {
      data[f.key] = String(item[f.key] ?? '');
    });
    setFormData(data);
    setShowForm(true);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const body: Record<string, any> = { ...formData };
    fieldsByTab[activeTab].forEach((f) => {
      if (f.type === 'number') body[f.key] = Number(body[f.key]);
    });

    const label = activeTab.slice(0, -1);

    try {
      const url = editingId ? `${API}/admin/${activeTab}/${editingId}` : `${API}/admin/${activeTab}`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowForm(false);
        fetchItems();
        addToast(
          editingId ? `${label} updated successfully.` : `${label} created successfully.`,
          'success'
        );
      } else {
        const data = await res.json();
        const msg = data.message || 'Something went wrong.';
        setError(msg);
        addToast(msg, 'error');
      }
    } catch {
      setError('Could not connect to server.');
      addToast('Could not connect to server.', 'error');
    }
  }

  async function handleDelete(id: string) {
    const label = activeTab.slice(0, -1);
    try {
      const res = await fetch(`${API}/admin/${activeTab}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        fetchItems();
        addToast(`${label} deleted successfully.`, 'success');
      } else {
        addToast(`Failed to delete ${label}.`, 'error');
      }
    } catch {
      addToast('Could not connect to server.', 'error');
    }
  }

  // Loading auth
  if (authorized === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-400">Checking permissions...</p>
      </div>
    );
  }

  // Not authorized
  if (!authorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-lg font-semibold">Access denied. Admin privileges required.</p>
        <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Music2 className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
          Back to app
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-zinc-900 rounded-lg p-1 w-fit">
          {tabConfig.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setShowForm(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab.slice(0, -1)}
          </button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold">
                {editingId ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fieldsByTab[activeTab].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm text-zinc-400 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                {error && <p className="text-sm text-red-400 mb-2">{error}</p>}
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Items list */}
        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-zinc-500">No {activeTab} found. Add one to get started.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{getDisplayName(activeTab, item)}</p>
                  <p className="text-xs text-zinc-400 truncate">{getSubtext(activeTab, item)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => openEditForm(item)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
