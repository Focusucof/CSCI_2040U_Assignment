'use client';

import { useState } from 'react';
import { Heart, ListPlus, Disc3, Mic2, Info } from 'lucide-react';
import ContextMenu, { MenuItem, MenuDivider } from './ContextMenu';
import AddToPlaylistDropdown from './AddToPlaylistDropdown';
import SongInfoModal from './SongInfoModal';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ToastProvider';
import { Track } from '@/lib/types';

interface SongContextMenuProps {
  track: Track;
  x: number;
  y: number;
  onClose: () => void;
}

export default function SongContextMenu({ track, x, y, onClose }: SongContextMenuProps) {
  const { likedSongs, toggleLike } = useUser();
  const { addToast } = useToast();
  const isLiked = likedSongs.has(track.id);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleGoToAlbum = () => {
    addToast('Album page coming soon', 'success');
    onClose();
  };

  const handleGoToArtist = () => {
    addToast('Artist page coming soon', 'success');
    onClose();
  };

  const handleLike = () => {
    toggleLike(track.id);
    addToast(isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs', 'success');
    onClose();
  };

  return (
    <ContextMenu x={x} y={y} onClose={onClose}>
      <MenuItem
        icon={<Disc3 className="w-4 h-4" />}
        label="Go to Album"
        onClick={handleGoToAlbum}
      />
      <MenuItem
        icon={<Mic2 className="w-4 h-4" />}
        label="Go to Artist"
        onClick={handleGoToArtist}
      />
      <MenuDivider />
      <div className="relative">
        <MenuItem
          icon={<ListPlus className="w-4 h-4" />}
          label="Add to Playlist"
          onClick={() => setShowPlaylistDropdown(!showPlaylistDropdown)}
        />
        {showPlaylistDropdown && (
          <div className="absolute left-full top-0 ml-1">
            <AddToPlaylistDropdown songId={track.id} />
          </div>
        )}
      </div>
      <MenuItem
        icon={<Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />}
        label={isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
        onClick={handleLike}
      />
      <MenuDivider />
      <MenuItem
        icon={<Info className="w-4 h-4" />}
        label="Get Info"
        onClick={() => setShowInfoModal(true)}
      />
      {showInfoModal && (
        <SongInfoModal trackId={track.id} onClose={() => setShowInfoModal(false)} />
      )}
    </ContextMenu>
  );
}
