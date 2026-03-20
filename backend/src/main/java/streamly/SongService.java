package streamly;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
        List<Song> results = new ArrayList<>();
        
        for (Song song : allSongs) {
            if (matchesSearch(song, lowerQuery)) {
                results.add(song);
            }
        }
        
        return results;
    }

    private boolean matchesSearch(Song song, String query) {
        return containsIgnoreCase(song.getTitle(), query) ||
               containsIgnoreCase(song.getArtist(), query) ||
               containsIgnoreCase(song.getAlbum(), query) ||
               containsIgnoreCase(song.getGenre(), query);
    }

    private boolean containsIgnoreCase(String field, String query) {
        if (field == null) return false;
        return field.toLowerCase().contains(query);
    }
}
