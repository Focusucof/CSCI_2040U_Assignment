'use client';

import { useState, useEffect } from 'react';
import { Music2, Plus, Pencil, Trash2, X, Music, Disc3, Mic2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import * as mm from 'music-metadata';

const API = 'http://localhost:8080';

function getImageUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const path = url.startsWith('/') ? url : '/' + url;
  return API + path;
}

type Tab = 'songs' | 'albums' | 'artists';

const tabConfig: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'songs', label: 'Songs', icon: Music },
  { key: 'albums', label: 'Albums', icon: Disc3 },
  { key: 'artists', label: 'Artists', icon: Mic2 },
];

const fieldsByTab: Record<Tab, { key: string; label: string; type: string; isFile?: boolean }[]> = {
  songs: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'artists', label: 'Artists (comma separated)', type: 'text' },
    { key: 'album', label: 'Album', type: 'text' },
    { key: 'duration', label: 'Duration', type: 'text' },
    { key: 'genres', label: 'Genres (comma separated)', type: 'text' },
    { key: 'releaseDate', label: 'Release Date (YYYY-MM-DD)', type: 'text' },
    { key: 'explicit', label: 'Explicit', type: 'boolean' },
    { key: 'coverUrl', label: 'Cover Image', type: 'file', isFile: true },
    { key : 'audioUrl', label: 'Audio File', type: 'file', isFile: true },
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

function getDisplayName(tab: Tab, item: Record<string, string>): string {
  return item.title || item.name || 'Untitled';
}

function getSubtext(tab: Tab, item: Record<string, string | string[]>): string {
  if (tab === 'songs') {
    const artists = Array.isArray(item.artists) ? item.artists.join(', ') : item.artist;
    return `${artists} - ${item.album}`;
  }
  if (tab === 'albums') return `${item.artist} - ${item.year}`;
  if (tab === 'artists') return Array.isArray(item.genre) ? item.genre.join(', ') : item.genre || '';
  return '';
}

export default function AdminPage() {
  const { addToast } = useToast();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('songs');
  const [items, setItems] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formFiles, setFormFiles] = useState<Record<string, File>>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

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
    let cancelled = false;
    async function fetchItems() {
      setLoading(true);
      try {
        const res = await fetch(`${API}/admin/${activeTab}`, { credentials: 'include' });
        if (cancelled) return;
        if (res.ok) {
          setItems(await res.json());
        } else {
          setItems([]);
          addToast(`Failed to load ${activeTab}.`, 'error');
        }
      } catch {
        if (cancelled) return;
        setItems([]);
        addToast(`Could not connect to server.`, 'error');
      }
      if (!cancelled) setLoading(false);
    }
    fetchItems();
    return () => { cancelled = true; };
  }, [activeTab, authorized, addToast, refreshKey]);

  function openCreateForm() {
    setEditingId(null);
    setFormData({});
    setFormFiles({});
    setShowForm(true);
    setError('');
  }

  function openEditForm(item: Record<string, string | string[]>) {
    setEditingId(Array.isArray(item.id) ? item.id[0] : item.id);
    const data: Record<string, string> = {};
    fieldsByTab[activeTab].forEach((f) => {
      const value = item[f.key];
      if (Array.isArray(value)) {
        data[f.key] = value.join(', ');
      } else {
        data[f.key] = String(value ?? '');
      }
    });
    setFormData(data);
    setFormFiles({});
    setShowForm(true);
    setError('');
  }

  function handleFileChange(key: string, file: File | null) {
    if (file) {
      setFormFiles((prev) => ({ ...prev, [key]: file }));
      if (key === 'audioUrl') {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        audio.addEventListener('loadedmetadata', () => {
          const duration = audio.duration;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          setFormData((prev) => {
            if (!('title' in prev) || !prev.title) prev.title = '';
            if (!('artists' in prev) || !prev.artists) prev.artists = '';
            if (!('album' in prev) || !prev.album) prev.album = '';
            if (!('genres' in prev) || !prev.genres) prev.genres = '';
            if (!('releaseDate' in prev) || !prev.releaseDate) prev.releaseDate = '';
            return { ...prev, duration: durationStr };
          });
          URL.revokeObjectURL(audio.src);
        });

        file.arrayBuffer().then((buffer) => {
          const uint8Array = new Uint8Array(buffer);
          const mimeType = file.type || 'audio/mpeg';
          mm.parseBuffer(uint8Array, { mimeType }).then((metadata) => {
            const common = metadata.common;
            console.log('Parsed metadata:', common);
            setFormData((prev) => {
              const updated = { ...prev };
              if (common.title) updated.title = common.title;
              if (common.artist) updated.artists = common.artist;
              if (common.album) updated.album = common.album;
              if (common.genre && common.genre.length > 0) updated.genres = common.genre.join(', ');
              if (common.year) updated.releaseDate = String(common.year);
              return updated;
            });
          }).catch((err) => {
            console.warn('Failed to parse audio metadata:', err);
          });
        });
      }
    } else {
      setFormFiles((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
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

    const body: Record<string, string | number | string[] | boolean> = { ...formData };
    fieldsByTab[activeTab].forEach((f) => {
      if (f.type === 'number') body[f.key] = Number(body[f.key]);
      if (f.type === 'boolean') body[f.key] = body[f.key] === 'true';
    });

    if (activeTab === 'songs') {
      if (body.artists && typeof body.artists === 'string') {
        body.artists = (body.artists as string).split(',').map(s => s.trim()).filter(s => s);
      }
      if (body.genres && typeof body.genres === 'string') {
        body.genres = (body.genres as string).split(',').map(s => s.trim()).filter(s => s);
      }
    }

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
        setRefreshKey((k) => k + 1);
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
        setRefreshKey((k) => k + 1);
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
                      <input
                        type="file"
                        accept={field.key === 'audioUrl' ? 'audio/*' : 'image/*'}
                        onChange={(e) => handleFileChange(field.key, e.target.files?.[0] || null)}
                        className="w-full bg-[#252525] border border-white/10 rounded-none px-3 py-2.5 text-sm text-white file:mr-4 file:py-1.5 file:px-3 file:rounded-none file:border-0 file:bg-gradient-to-r file:from-purple-500 file:to-cyan-500 file:text-white file:cursor-pointer"
                      />
                      {formFiles[field.key] ? (
                        <div className="mt-3">
                          {field.key === 'audioUrl' ? (
                            <div className="w-24 h-24 bg-[#252525] rounded-lg flex items-center justify-center text-zinc-400">
                              <span className="text-xs text-center">Audio file selected</span>
                            </div>
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={URL.createObjectURL(formFiles[field.key])}
                              alt="Preview"
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      ) : formData[field.key] && field.key !== 'audioUrl' ? (
                        <div className="mt-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getImageUrl(formData[field.key])}
                            alt="Current cover"
                            className="w-24 h-24 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : field.type === 'boolean' ? (
                    <select
                      value={formData[field.key] === 'true' ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full bg-[#252525] border border-white/10 rounded-none px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-colors"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  ) : (
                    <input
                      type={field.type === 'boolean' ? 'text' : field.type}
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
                {activeTab === 'songs' && item.coverUrl && (
                  <div className="flex-shrink-0 mr-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(item.coverUrl as string)}
                      alt="Cover"
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {activeTab === 'albums' && item.coverUrl && (
                  <div className="flex-shrink-0 mr-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(item.coverUrl as string)}
                      alt="Cover"
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {activeTab === 'artists' && item.imageUrl && (
                  <div className="flex-shrink-0 mr-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(item.imageUrl as string)}
                      alt="Image"
                      className="w-12 h-12 object-cover rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
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
