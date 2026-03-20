//Backend logic for Genre filtering

import java.util.*;
public class SongFilter {
    public static List<Song> filterByGenre(List<Song> songs, String genre) {
        List<Song> filtered = new ArrayList<>();
        for (Song song : songs) {
            if (song.getGenres() == null){
                continue;
            }
            for (String g : song.getGenres()) {
                if (g.equalsIgnoreCase(genre)) {
                    filtered.add(song);
                    break;
                }
            }
        }
        return filtered;
    }
}