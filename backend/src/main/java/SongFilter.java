package main.java;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.apache.commons.text.similarity.LevenshteinDistance;

class SongFilter {
    private final String title;
    private final String[] artists;
    private final Date min_release_date;
    private final Date max_release_date;
    private final String[] genres;
    private final Boolean clean;
    private final Integer min_duration;
    private final Integer max_duration;
    private final List<String> categories = new ArrayList();
    private final String[] VALUE_NAMES = new String[]{"title", "artists", "min_release_date", "max_release_date", "genres", "clean", "min_duration", "max_duration", "categories"};
    private final String[] CATEGORY_NAMES = new String[]{"title", "artists", "date", "genres", "clean", "duration"};

    public SongFilter(Map<String, Object> filters) {
        this.title = (String)filters.getOrDefault("title", (Object)null);
        this.artists = (String[])filters.getOrDefault("artists", (Object)null);
        this.min_release_date = (Date)filters.getOrDefault("min_release_date", (Object)null);
        this.max_release_date = (Date)filters.getOrDefault("max_release_date", (Object)null);
        this.genres = (String[])filters.getOrDefault("genres", (Object)null);
        this.clean = (Boolean)filters.getOrDefault("clean", (Object)null);
        this.min_duration = (Integer)filters.getOrDefault("min_duration", (Object)null);
        this.max_duration = (Integer)filters.getOrDefault("max_duration", (Object)null);
        if (this.title != null) {
            this.categories.add("title");
        }

        if (this.artists != null) {
            this.categories.add("artists");
        }

        if (this.min_release_date != null || this.max_release_date != null) {
            this.categories.add("date");
        }

        if (this.genres != null) {
            this.categories.add("genres");
        }

        if (this.clean != null) {
            this.categories.add("clean");
        }

        if (this.min_duration != null || this.max_duration != null) {
            this.categories.add("duration");
        }

    }

    public int score(Song song) {
        int score = 0;
        LevenshteinDistance ld = LevenshteinDistance.getDefaultInstance();
        if (this.categories.contains("title")) {
            score -= ld.apply(this.title, song.title.substring(0, this.title.length()));
        }

        if (this.categories.contains("artists")) {
            for(String filter_artist : this.artists) {
                int closest = Integer.MAX_VALUE;

                for(String song_artist : song.artists) {
                    closest = Math.min(ld.apply(filter_artist, song_artist), closest);
                }

                score -= closest;
            }
        }

        if (this.categories.contains("date")) {
            int after_max = 0;
            int before_min = 0;
            if (this.max_release_date != null) {
                after_max = (int)Math.log10((double)Math.max(song.release_date.compareTo(this.max_release_date), 1));
            }

            if (this.min_release_date != null) {
                before_min = (int)Math.log10((double)Math.max(-song.release_date.compareTo(this.min_release_date), 1));
            }

            if (before_min >= 0 || after_max >= 0) {
                score -= Math.max(after_max, before_min);
            }
        }

        if (this.categories.contains("genres")) {
            for(String filter_genre : this.genres) {
                int closest = Integer.MAX_VALUE;

                for(String song_genre : song.genres) {
                    closest = Math.min(ld.apply(filter_genre, song_genre), closest);
                }

                score -= closest;
            }
        }

        if (this.categories.contains("clean")) {
            score -= this.clean == song.clean ? 0 : 1;
        }

        if (this.categories.contains("duration")) {
            int after_max = 0;
            int before_min = 0;
            if (this.max_duration != null) {
                after_max = (int)Math.log10((double)Math.max(song.duration - this.max_duration, 1));
            }

            if (this.min_duration != null) {
                before_min = (int)Math.log10((double)Math.max(this.min_duration - song.duration, 1));
            }

            if (before_min >= 0 || after_max >= 0) {
                score -= Math.max(after_max, before_min);
            }
        }

        return score;
    }
}
