package streamly;

import java.util.*;
import org.apache.commons.text.similarity.LevenshteinDistance;

class SongFilter {
    private final String title;
    private final String[] artists;
    private final String[] genres;
    private final String album;
    private final Integer min_duration;
    private final Integer max_duration;
    private final Boolean explicit;
    private final List<String> categories = new ArrayList();
    private HashMap<String, Integer> weights;

    public SongFilter(Map<String, Object> filters, HashMap<String, Integer> weights) {
        this.title = (String)filters.getOrDefault("title", (Object)null);
        this.artists = (String[])filters.getOrDefault("artists", (Object)null);
        this.genres = (String[])filters.getOrDefault("genres", (Object)null);
        this.min_duration = (Integer)filters.getOrDefault("min_duration", (Object)null);
        this.max_duration = (Integer)filters.getOrDefault("max_duration", (Object)null);
        this.explicit = (Boolean)filters.getOrDefault("explicit", (Object)null);
        this.album = (String)filters.getOrDefault("album", (Object)null);
        this.weights = weights;

        if (this.title != null) {
            this.categories.add("title");
        }

        if (this.album != null) {
            this.categories.add("album");
        }

        if (this.artists != null) {
            this.categories.add("artists");
        }

        if (this.genres != null) {
            this.categories.add("genres");
        }

        if (this.min_duration != null || this.max_duration != null) {
            this.categories.add("duration");
        }
        
        if (this.explicit != null) {
            this.categories.add("explicit");
        }
    }

    private float sigmoid(float x) {
        return -1 / (x + 1) + 1;
    }

    private int parseDuration(String duration) {
        if (duration == null || duration.isEmpty()) return 0;
        try {
            String[] parts = duration.split(":");
            if (parts.length == 2) {
                return Integer.parseInt(parts[0]) * 60 + Integer.parseInt(parts[1]);
            } else if (parts.length == 1) {
                return Integer.parseInt(parts[0]);
            }
        } catch (NumberFormatException e) {
            // ignore
        }
        return 0;
    }

    private String[] safeGetArtists(Song song) {
        if (song.getArtists() == null) return new String[0];
        return song.getArtists().toArray(new String[0]);
    }

    private String[] safeGetGenres(Song song) {
        if (song.getGenres() == null) return new String[0];
        return song.getGenres().toArray(new String[0]);
    }

    public float scoreAny(Song song) {
        float score = 1;

        LevenshteinDistance ld = LevenshteinDistance.getDefaultInstance();
        if (this.categories.contains("title")) {
            String songTitle = song.getTitle();
            if (songTitle != null) {
                score *= sigmoid(ld.apply(this.title.toLowerCase(), songTitle.toLowerCase().substring(0, Math.min(this.title.length(), songTitle.length())))) * weights.getOrDefault("title", 1);
            }
        }

        if (this.categories.contains("album")) {
            System.out.println(song.getAlbum());
            String songAlbum = song.getAlbum();
            if (songAlbum != null) {
                score *= sigmoid(ld.apply(this.album.toLowerCase(), songAlbum.toLowerCase().substring(0, Math.min(this.album.length(), songAlbum.length())))) * weights.getOrDefault("album", 1);
            }
        }


        if (this.categories.contains("artists")) {
            String[] songArtists = safeGetArtists(song);
            for(String filter_artist : this.artists) {
                int closest = Integer.MAX_VALUE;

                for(String song_artist : songArtists) {
                    String lowerArtist = song_artist.toLowerCase();
                    int minLength = Math.min(filter_artist.length(), lowerArtist.length());
                    closest = Math.min(ld.apply(filter_artist, lowerArtist.substring(0, minLength)), closest);
                }

                score *= sigmoid(closest) * weights.getOrDefault("artists", 1);
            }
        }

        if (this.categories.contains("genres")) {
            String[] songGenres = safeGetGenres(song);
            for(String filter_genre : this.genres) {
                int closest = Integer.MAX_VALUE;

                for(String song_genre : songGenres) {
                    closest = Math.min(ld.apply(filter_genre, song_genre.substring(0, Math.min(filter_genre.length(), song_genre.length()))), closest);
                }

                score *= sigmoid(closest) * weights.getOrDefault("genres", 1);
            }
        }

        if (this.categories.contains("duration")) {
            int songDuration = parseDuration(song.getDuration());
            int after_max = 0;
            int before_min = 0;
            if (this.max_duration != null) {
                after_max = (int)Math.log10(Math.max(songDuration - this.max_duration, 1));
            }

            if (this.min_duration != null) {
                before_min = (int)Math.log10(Math.max(this.min_duration - songDuration, 1));
            }

            if (before_min >= 0 || after_max >= 0) {
                score *= sigmoid(Math.max(after_max, before_min)) * weights.getOrDefault("duration", 1);
            }
        }
        
        if (this.categories.contains("explicit")) {
            score *= (this.explicit == song.isExplicit() ? 0 : 1) * weights.getOrDefault("explicit", 1);
        }

        return score;
    }
}
