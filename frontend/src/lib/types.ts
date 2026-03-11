export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
  genre: string;
}

export interface Recommendation {
  reason: string;
  tracks: Track[];
}
