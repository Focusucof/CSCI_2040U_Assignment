//Backend logic for Genre filtering

import java.util.ArrayList;

public class FilterbyGenre {
    public static List<Song> filterbyGenre(List<Song> songs, String genre){
        List<Song> filtered = new ArrayList<>();
        for (Song song : songs){
            String[] songGenres = song.getGenres();
            for (String g : songGenres){
                if (g.equalsIgnoreCases(genre)){
                    filtered.add(song);
                    break;
                }
            }
        }
        return filtered;
    }
    //TODO: genres aren't set in Song.java
}