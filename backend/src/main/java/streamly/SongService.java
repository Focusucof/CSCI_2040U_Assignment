package streamly;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.*;

@Service
public class SongService {

    private final String dataFile;

    public SongService() {
        this("../data/songs.json");
    }

    public SongService(String dataFile) {
        this.dataFile = dataFile;
        File file = new File(dataFile);
        File parentDir = file.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
        }
        if (!file.exists()) {
            try {
                Files.writeString(file.toPath(), "[]");
            } catch (IOException e) {
                throw new RuntimeException("Failed to initialize songs.json", e);
            }
        }
    }

    protected String getDataFile() {
        return dataFile;
    }

    private Song jsonToSong(JSONObject obj) {
        Song song = new Song();
        song.setId(obj.optString("id", null));
        song.setTitle(obj.optString("title", null));
        
        if (obj.has("artists")) {
            JSONArray artistsArr = obj.getJSONArray("artists");
            List<String> artists = new ArrayList<>();
            for (int i = 0; i < artistsArr.length(); i++) {
                artists.add(artistsArr.getString(i));
            }
            song.setArtists(artists);
        } else if (obj.has("artist")) {
            String artist = obj.optString("artist", null);
            if (artist != null && !artist.isEmpty()) {
                song.setArtists(List.of(artist));
            }
        }
        
        song.setAlbum(obj.optString("album", null));
        song.setCoverUrl(obj.optString("coverUrl", null));
        song.setAudioURL(obj.optString("audioUrl", obj.optString("audioURL", null)));
        song.setDuration(obj.optString("duration", null));
        
        if (obj.has("genres")) {
            JSONArray genresArr = obj.getJSONArray("genres");
            List<String> genres = new ArrayList<>();
            for (int i = 0; i < genresArr.length(); i++) {
                genres.add(genresArr.getString(i));
            }
            song.setGenres(genres);
        } else if (obj.has("genre")) {
            String genre = obj.optString("genre", null);
            if (genre != null && !genre.isEmpty()) {
                song.setGenres(List.of(genre));
            }
        }
        
        song.setReleaseDate(obj.optString("releaseDate", null));
        song.setExplicit(obj.optBoolean("explicit", false));
        
        return song;
    }

    private JSONObject songToJson(Song song) {
        JSONObject obj = new JSONObject();
        obj.put("id", song.getId());
        obj.put("title", song.getTitle());
        obj.put("artists", song.getArtists());
        obj.put("album", song.getAlbum());
        obj.put("coverUrl", song.getCoverUrl());
        obj.put("audioUrl", song.getAudioURL());
        obj.put("duration", song.getDuration());
        obj.put("genres", song.getGenres());
        obj.put("releaseDate", song.getReleaseDate());
        obj.put("explicit", song.isExplicit());
        return obj;
    }

    public List<Song> readSongs() {
        try {
            String content = Files.readString(Path.of(dataFile));
            JSONArray arr = new JSONArray(content);
            List<Song> songs = new ArrayList<>();
            for (int i = 0; i < arr.length(); i++) {
                songs.add(jsonToSong(arr.getJSONObject(i)));
            }
            return songs;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read songs.json", e);
        }
    }

    private void writeSongs(List<Song> songs) {
        try {
            JSONArray arr = new JSONArray();
            for (Song song : songs) {
                arr.put(songToJson(song));
            }
            Files.writeString(Path.of(dataFile), arr.toString(2));
        } catch (IOException e) {
            throw new RuntimeException("Failed to write songs.json", e);
        }
    }

    public Song createSong(Song song) {
        List<Song> songs = readSongs();
        song.setId(UUID.randomUUID().toString());
        songs.add(song);
        writeSongs(songs);
        return song;
    }

    public Song updateSong(String id, Song updated) {
        List<Song> songs = readSongs();
        for (int i = 0; i < songs.size(); i++) {
            if (songs.get(i).getId().equals(id)) {
                updated.setId(id);
                songs.set(i, updated);
                writeSongs(songs);
                return updated;
            }
        }
        return null;
    }

    public boolean deleteSong(String id) {
        List<Song> songs = readSongs();
        boolean removed = songs.removeIf(s -> s.getId().equals(id));
        if (removed) {
            writeSongs(songs);
        }
        return removed;
    }

    public List<Song> searchSongs(String query) {
        if (query == null || query.trim().isEmpty()) {
            return readSongs();
        }

        String lowerQuery = query.toLowerCase().trim();
        List<Song> allSongs = readSongs();
//        List<Song> results = new ArrayList<>();
//
//        for (Song song : allSongs) {
//            if (matchesSearch(song, lowerQuery)) {
//                results.add(song);
//            }
//        }
//
//        return results;
        HashMap<Song, Float> results = new LinkedHashMap<>();

        allSongs.sort((o1, o2) -> (int) (10000 * (matchesSearch(o1, lowerQuery) - matchesSearch(o2, lowerQuery))));
        allSongs = allSongs.subList(0, Math.min(25, allSongs.size()));

        return allSongs;
    }

//    private boolean matchesSearch(Song song, String query) {
//        if (containsIgnoreCase(song.getTitle(), query) ||
//            containsIgnoreCase(song.getAlbum(), query)) {
//            return true;
//        }
//
//        if (song.getArtists() != null) {
//            for (String artist : song.getArtists()) {
//                if (containsIgnoreCase(artist, query)) {
//                    return true;
//                }
//            }
//        }
//
//        if (song.getGenres() != null) {
//            for (String genre : song.getGenres()) {
//                if (containsIgnoreCase(genre, query)) {
//                    return true;
//                }
//            }
//        }
//
//        return false;
//    }
    private float matchesSearch(Song song, String query) {
        HashMap<String, Object> filter_map = new HashMap<>();
        filter_map.put("title", query);
        filter_map.put("artists", new String[]{query});
        filter_map.put("genres", new String[]{query});
        filter_map.put("album", query);

        SongFilter filter = new SongFilter(filter_map, new HashMap<>());

        return filter.scoreAny(song);
    }

    private boolean containsIgnoreCase(String field, String query) {
        if (field == null) return false;
        return field.toLowerCase().contains(query);
    }
}
