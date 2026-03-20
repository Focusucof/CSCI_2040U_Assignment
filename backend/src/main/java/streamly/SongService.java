package streamly;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Service
public class SongService {

    private static final String DATA_FILE = "../data/songs.json";

    public SongService() {
        File dir = new File("data");
        if (!dir.exists()) {
            dir.mkdirs();
        }
        File file = new File(DATA_FILE);
        if (!file.exists()) {
            try {
                Files.writeString(file.toPath(), "[]");
            } catch (IOException e) {
                throw new RuntimeException("Failed to initialize songs.json", e);
            }
        }
    }

    private Song jsonToSong(JSONObject obj) {
        Song song = new Song();
        song.setId(obj.optString("id", null));
        song.setTitle(obj.optString("title", null));
        song.setArtist(obj.optString("artist", null));
        song.setAlbum(obj.optString("album", null));
        song.setCoverUrl(obj.optString("coverUrl", null));
        song.setDuration(obj.optString("duration", null));
        song.setGenre(obj.optString("genre", null));
        return song;
    }

    private JSONObject songToJson(Song song) {
        JSONObject obj = new JSONObject();
        obj.put("id", song.getId());
        obj.put("title", song.getTitle());
        obj.put("artist", song.getArtist());
        obj.put("album", song.getAlbum());
        obj.put("coverUrl", song.getCoverUrl());
        obj.put("duration", song.getDuration());
        obj.put("genre", song.getGenre());
        return obj;
    }

    public List<Song> readSongs() {
        try {
            String content = Files.readString(Path.of(DATA_FILE));
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
            Files.writeString(Path.of(DATA_FILE), arr.toString(2));
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
        HashMap<Song, Float> results = new LinkedHashMap<>();

        allSongs.sort((o1, o2) -> (int) (10000 * (matchesSearch(o1, lowerQuery) - matchesSearch(o2, lowerQuery))));
        allSongs = allSongs.subList(0, 25);

        return allSongs;
    }

    private float matchesSearch(Song song, String query) {
        HashMap<String, Object> filter_map = new HashMap<>();
        filter_map.put("title", query);
        filter_map.put("artists", new String[]{query});
        filter_map.put("genres", new String[]{query});
        filter_map.put("albums", query);

        SongFilter filter = new SongFilter(filter_map, new HashMap<>());

        return filter.scoreAny(song);
    }

    private boolean containsIgnoreCase(String field, String query) {
        if (field == null) return false;
        return field.toLowerCase().contains(query);
    }
}
