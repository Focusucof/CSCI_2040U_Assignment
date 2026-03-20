package streamly;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AlbumService {

    private static final String DATA_FILE = "../data/albums.json";

    public AlbumService() {
        try {
            Files.createDirectories(Path.of(DATA_FILE).getParent());
            if (!Files.exists(Path.of(DATA_FILE))) {
                Files.writeString(Path.of(DATA_FILE), "[]");
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize albums.json", e);
        }
    }

    private Album jsonToAlbum(JSONObject obj) {
        Album album = new Album();
        album.setId(obj.optString("id", null));
        album.setTitle(obj.optString("title", null));
        album.setArtist(obj.optString("artist", null));
        album.setCoverUrl(obj.optString("coverUrl", null));
        album.setYear(obj.optInt("year", 0));
        album.setTrackCount(obj.optInt("trackCount", 0));
        return album;
    }

    private JSONObject albumToJson(Album album) {
        JSONObject obj = new JSONObject();
        obj.put("id", album.getId());
        obj.put("title", album.getTitle());
        obj.put("artist", album.getArtist());
        obj.put("coverUrl", album.getCoverUrl());
        obj.put("year", album.getYear());
        obj.put("trackCount", album.getTrackCount());
        return obj;
    }

    public List<Album> readAlbums() {
        try {
            String content = Files.readString(Path.of(DATA_FILE));
            JSONArray arr = new JSONArray(content);
            List<Album> albums = new ArrayList<>();
            for (int i = 0; i < arr.length(); i++) {
                albums.add(jsonToAlbum(arr.getJSONObject(i)));
            }
            return albums;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read albums.json", e);
        }
    }

    private void writeAlbums(List<Album> albums) {
        try {
            JSONArray arr = new JSONArray();
            for (Album album : albums) {
                arr.put(albumToJson(album));
            }
            Files.writeString(Path.of(DATA_FILE), arr.toString(2));
        } catch (IOException e) {
            throw new RuntimeException("Failed to write albums.json", e);
        }
    }

    public Album createAlbum(Album album) {
        List<Album> albums = readAlbums();
        album.setId(UUID.randomUUID().toString());
        albums.add(album);
        writeAlbums(albums);
        return album;
    }

    public Album updateAlbum(String id, Album updated) {
        List<Album> albums = readAlbums();
        for (int i = 0; i < albums.size(); i++) {
            if (albums.get(i).getId().equals(id)) {
                updated.setId(id);
                albums.set(i, updated);
                writeAlbums(albums);
                return updated;
            }
        }
        return null;
    }

    public boolean deleteAlbum(String id) {
        List<Album> albums = readAlbums();
        boolean removed = albums.removeIf(a -> a.getId().equals(id));
        if (removed) {
            writeAlbums(albums);
        }
        return removed;
    }

    public List<Album> searchAlbums(String query) {
        if (query == null || query.trim().isEmpty()) {
            return readAlbums();
        }
        
        String lowerQuery = query.toLowerCase().trim();
        List<Album> allAlbums = readAlbums();
        List<Album> results = new ArrayList<>();
        
        for (Album album : allAlbums) {
            if (matchesSearch(album, lowerQuery)) {
                results.add(album);
            }
        }
        
        return results;
    }

    private boolean matchesSearch(Album album, String query) {
        return containsIgnoreCase(album.getTitle(), query) ||
               containsIgnoreCase(album.getArtist(), query);
    }

    private boolean containsIgnoreCase(String field, String query) {
        if (field == null) return false;
        return field.toLowerCase().contains(query);
    }
}
