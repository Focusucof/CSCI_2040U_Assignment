'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import ContextMenu, { MenuItem, MenuDivider } from './ContextMenu';
import RenamePlaylistModal from './RenamePlaylistModal';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ToastProvider';
import { UserPlaylist } from '@/lib/types';

interface PlaylistContextMenuProps {
  playlist: UserPlaylist;
  x: number;
  y: number;
  onClose: () => void;
}

export default function PlaylistContextMenu({ playlist, x, y, onClose }: PlaylistContextMenuProps) {
  const { deletePlaylist } = useUser();
  const { addToast } = useToast();
  const [showRenameModal, setShowRenameModal] = useState(false);

  const handleRename = () => {
    setShowRenameModal(true);
  };

  const handleDelete = async () => {
    await deletePlaylist(playlist.id);
    addToast(`Playlist "${playlist.name}" deleted`, 'success');
    onClose();
  };

  return (
    <>
      <ContextMenu x={x} y={y} onClose={onClose}>
        <MenuItem
          icon={<Pencil className="w-4 h-4" />}
          label="Rename Playlist"
          onClick={handleRename}
        />
        <MenuDivider />
        <MenuItem
          icon={<Trash2 className="w-4 h-4 text-red-400" />}
          label="Delete Playlist"
          onClick={handleDelete}
        />
      </ContextMenu>
      {showRenameModal && (
        <RenamePlaylistModal
          playlistId={playlist.id}
          currentName={playlist.name}
          onClose={() => {
            setShowRenameModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}