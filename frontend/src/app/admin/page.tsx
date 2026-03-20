'use client';

import React, { useState, useEffect } from 'react';
import { Music2, Plus, Pencil, Trash2, X, Music, Disc3, Mic2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';

const API = 'http://localhost:8080';

type Tab = 'songs' | 'albums' | 'artists';

const tabConfig: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'songs', label: 'Songs', icon: Music },
  { key: 'albums', label: 'Albums', icon: Disc3 },
  { key: 'artists', label: 'Artists', icon: Mic2 },
];

const fieldsByTab: Record<Tab, { key: string; label: string; type: string; isFile?: boolean }[]> = {
  songs: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'artist', label: 'Artist', type: 'text' },
    { key: 'album', label: 'Album', type: 'text' },
    { key: 'coverUrl', label: 'Cover Image', type: 'file', isFile: true },
    { key: 'duration', label: 'Duration', type: 'text' },
    { key: 'genre', label: 'Genre', type: 'text' },
  ],
  albums: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'artist', label: 'Artist', type: 'text' },
    { key: 'coverUrl', label: 'Cover Image', type: 'file', isFile: true },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'trackCount', label: 'Track Count', type: 'number' },
  ],
  artists: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'imageUrl', label: 'Image', type: 'file', isFile: true },
    { key: 'genre', label: 'Genre', type: 'text' },
  ],
};

function getDisplayName(tab: Tab, item: any): string {
  return item.title || item.name || 'Untitled';
}

function getSubtext(tab: Tab, item: any): string {
  if (tab === 'songs') return `${item.artist} - ${item.album}`;
  if (tab === 'albums') return `${item.artist} - ${item.year}`;
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
  const [formFiles, setFormFiles] = useState<Record<string, File>>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

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
    setFormFiles({});
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
    setFormFiles({});
    setShowForm(true);
    setError('');
  }

  function handleFileChange(key: string, file: File | null) {
    if (file) {
      setFormFiles({ ...formFiles, [key]: file });
    } else {
      const { [key]: _, ...rest } = formFiles;
      setFormFiles(rest);
    }
  }

  async function uploadFile(file: File): Promise<string> {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    
    const res = await fetch(`${API}/admin/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formDataUpload,
    });
    
    const text = await res.text();
    if (!res.ok) {
      console.error('Upload failed:', text);
      throw new Error(text || 'Failed to upload file');
    }
    
    return text;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setUploading(true);

    const body: Record<string, any> = { ...formData };
    fieldsByTab[activeTab].forEach((f) => {
      if (f.type === 'number') body[f.key] = Number(body[f.key]);
    });

    const fileFields = fieldsByTab[activeTab].filter(f => f.isFile);
    for (const field of fileFields) {
      if (formFiles[field.key]) {
        try {
          const uploadedUrl = await uploadFile(formFiles[field.key]);
          body[field.key] = uploadedUrl;
        } catch {
          setError('Failed to upload file. Please try again.');
          setUploading(false);
          return;
        }
      }
    }

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
    setUploading(false);
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

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <p className="text-zinc-400">Checking permissions...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-lg font-semibold">Access denied. Admin privileges required.</p>
        <Link href="/" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Music2 className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
        </div>
        <Link href="/" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to app
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#181818] rounded-none p-1 w-fit">
          {tabConfig.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setShowForm(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-none text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold capitalize text-white">{activeTab}</h2>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white text-sm font-medium px-4 py-2.5 rounded-none transition-all shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab.slice(0, -1)}
          </button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="mb-8 bg-[#181818] border border-white/5 rounded-none p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-md font-semibold text-white">
                {editingId ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fieldsByTab[activeTab].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm text-zinc-400 mb-2">{field.label}</label>
                  {field.isFile ? (
                    <div>
                      {(formData[field.key] || formFiles[field.key]) && (
                        <div className="mb-3">
                          {formFiles[field.key] ? (
                            <img
                              src={URL.createObjectURL(formFiles[field.key])}
                              alt="Preview"
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          ) : (
                            <img
                              src={`http://localhost:8080${formData[field.key]}`}
                              alt="Current"
                              className="w-24 h-24 object-cover rounded-none"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = formData[field.key] || '';
                              }}
                            />
                          )}
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(field.key, e.target.files?.[0] || null)}
                        className="w-full bg-[#252525] border border-white/10 rounded-none px-3 py-2.5 text-sm text-white file:mr-4 file:py-1.5 file:px-3 file:rounded-none file:border-0 file:bg-gradient-to-r file:from-purple-500 file:to-cyan-500 file:text-white file:cursor-pointer"
                      />
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full bg-[#252525] border border-white/10 rounded-none px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-colors"
                    />
                  )}
                </div>
              ))}
              <div className="sm:col-span-2">
                {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 disabled:from-purple-800 disabled:to-cyan-800 text-white text-sm font-medium px-6 py-2.5 rounded-none transition-all shadow-lg shadow-purple-500/20"
                >
                  {uploading ? 'Uploading...' : editingId ? 'Save Changes' : 'Create'}
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
                className="flex items-center justify-between bg-[#181818] hover:bg-[#252525] border border-white/5 rounded-none px-4 py-3 transition-all hover:border-purple-500/20"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{getDisplayName(activeTab, item)}</p>
                  <p className="text-xs text-zinc-400 truncate">{getSubtext(activeTab, item)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => openEditForm(item)}
                    className="p-2.5 text-zinc-400 hover:text-purple-400 hover:bg-white/5 rounded-none transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 text-zinc-400 hover:text-red-400 hover:bg-white/5 rounded-none transition-colors"
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
