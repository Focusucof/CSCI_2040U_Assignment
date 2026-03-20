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
public class ArtistService {

    private static final String DATA_FILE = "../data/artists.json";

    public ArtistService() {
        try {
            Files.createDirectories(Path.of(DATA_FILE).getParent());
            if (!Files.exists(Path.of(DATA_FILE))) {
                Files.writeString(Path.of(DATA_FILE), "[]");
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize artists.json", e);
        }
    }

    private Artist jsonToArtist(JSONObject obj) {
        Artist artist = new Artist();
        artist.setId(obj.optString("id", null));
        artist.setName(obj.optString("name", null));
        artist.setImageUrl(obj.optString("imageUrl", null));
        artist.setGenre(obj.optString("genre", null));
        return artist;
    }

    private JSONObject artistToJson(Artist artist) {
        JSONObject obj = new JSONObject();
        obj.put("id", artist.getId());
        obj.put("name", artist.getName());
        obj.put("imageUrl", artist.getImageUrl());
        obj.put("genre", artist.getGenre());
        return obj;
    }

    public List<Artist> readArtists() {
        try {
            String content = Files.readString(Path.of(DATA_FILE));
            JSONArray arr = new JSONArray(content);
            List<Artist> artists = new ArrayList<>();
            for (int i = 0; i < arr.length(); i++) {
                artists.add(jsonToArtist(arr.getJSONObject(i)));
            }
            return artists;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read artists.json", e);
        }
    }

    private void writeArtists(List<Artist> artists) {
        try {
            JSONArray arr = new JSONArray();
            for (Artist artist : artists) {
                arr.put(artistToJson(artist));
            }
            Files.writeString(Path.of(DATA_FILE), arr.toString(2));
        } catch (IOException e) {
            throw new RuntimeException("Failed to write artists.json", e);
        }
    }

    public Artist createArtist(Artist artist) {
        List<Artist> artists = readArtists();
        artist.setId(UUID.randomUUID().toString());
        artists.add(artist);
        writeArtists(artists);
        return artist;
    }

    public Artist updateArtist(String id, Artist updated) {
        List<Artist> artists = readArtists();
        for (int i = 0; i < artists.size(); i++) {
            if (artists.get(i).getId().equals(id)) {
                updated.setId(id);
                artists.set(i, updated);
                writeArtists(artists);
                return updated;
            }
        }
        return null;
    }

    public boolean deleteArtist(String id) {
        List<Artist> artists = readArtists();
        boolean removed = artists.removeIf(a -> a.getId().equals(id));
        if (removed) {
            writeArtists(artists);
        }
        return removed;
    }

    public List<Artist> searchArtists(String query) {
        if (query == null || query.trim().isEmpty()) {
            return readArtists();
        }
        
        String lowerQuery = query.toLowerCase().trim();
        List<Artist> allArtists = readArtists();
        List<Artist> results = new ArrayList<>();
        
        for (Artist artist : allArtists) {
            if (matchesSearch(artist, lowerQuery)) {
                results.add(artist);
            }
        }
        
        return results;
    }

    private boolean matchesSearch(Artist artist, String query) {
        return containsIgnoreCase(artist.getName(), query) ||
               containsIgnoreCase(artist.getGenre(), query);
    }

    private boolean containsIgnoreCase(String field, String query) {
        if (field == null) return false;
        return field.toLowerCase().contains(query);
    }
}
