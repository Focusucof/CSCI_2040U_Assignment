package main.java;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Objects;

public class Main {
    public List<Song> filterSongs(List<Song> songs, SongFilter filter, boolean fuzzy_search) {
        if (!fuzzy_search) {
            List<Song> new_songs = new ArrayList();

            for(Song song : songs) {
                if (filter.score(song) == 0) {
                    new_songs.add(song);
                }
            }

            return new_songs;
        } else {
            List<Song> new_songs = new ArrayList();
            new_songs.addAll(songs);
            Objects.requireNonNull(filter);
            new_songs.sort(Comparator.comparingInt(filter::score));
            return new_songs;
        }
    }

    public static void main(String[] args) {
        Song a = new Song();
        a.title = "example_title";
        a.release_date = new Date(2020, 5, 12);
        a.artists = new String[]{"Artist A", "Artist B", "Feat. Artist C"};
        a.album_ids = new int[]{123, 456, 789};
        a.clean = false;
        a.genres = new String[]{"Folk", "Funk", "Future-Punk"};
        a.duration = 200;
        a.uid = 1;

        try {
            a.save_to_file(new File("./test_song.json"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}