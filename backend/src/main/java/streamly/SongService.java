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
    private final AlbumService albumService;
    private final ArtistService artistService;

    public SongService() {
        this("../data/songs.json", new AlbumService(), new ArtistService());
    }

    public SongService(String dataFile) {
        this(dataFile, new AlbumService(), new ArtistService());
    }

    public SongService(String dataFile, AlbumService albumService, ArtistService artistService) {
        this.dataFile = dataFile;
        this.albumService = albumService;
        this.artistService = artistService;
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
        song.setPlayCount(obj.optInt("playCount", 0));
        
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
        obj.put("playCount", song.getPlayCount());
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
        if (song.getAlbum() != null && !song.getAlbum().isEmpty()) {
            findOrCreateAlbumByTitle(song.getAlbum(), song.getArtists() != null && !song.getArtists().isEmpty() ? song.getArtists().get(0) : null);
        }
        if (song.getArtists() != null) {
            for (String artistName : song.getArtists()) {
                if (artistName != null && !artistName.isEmpty()) {
                    findOrCreateArtistByName(artistName);
                }
            }
        }

        List<Song> songs = readSongs();
        song.setId(UUID.randomUUID().toString());
        songs.add(song);
        writeSongs(songs);
        return song;
    }

    private Album findOrCreateAlbumByTitle(String title, String artist) {
        List<Album> albums = albumService.readAlbums();
        for (Album album : albums) {
            if (album.getTitle() != null && album.getTitle().equalsIgnoreCase(title)) {
                return album;
            }
        }
        Album newAlbum = new Album();
        newAlbum.setTitle(title);
        newAlbum.setArtist(artist);
        return albumService.createAlbum(newAlbum);
    }

    private Artist findOrCreateArtistByName(String name) {
        List<Artist> artists = artistService.readArtists();
        for (Artist artist : artists) {
            if (artist.getName() != null && artist.getName().equalsIgnoreCase(name)) {
                return artist;
            }
        }
        Artist newArtist = new Artist();
        newArtist.setName(name);
        return artistService.createArtist(newArtist);
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

    public Song incrementPlayCount(String id) {
        List<Song> songs = readSongs();
        for (int i = 0; i < songs.size(); i++) {
            if (songs.get(i).getId().equals(id)) {
                Song song = songs.get(i);
                Integer current = song.getPlayCount();
                song.setPlayCount((current != null ? current : 0) + 1);
                writeSongs(songs);
                return song;
            }
        }
        return null;
    }

    public Song getSong(String id) {
        List<Song> songs = readSongs();
        for (Song song : songs) {
            if (song.getId().equals(id)) {
                return song;
            }
        }
        return null;
    }

    public List<Song> searchSongs(String query) {
        if (query == null || query.trim().isEmpty()) {
            return readSongs();
        }

        String lowerQuery = query.toLowerCase().trim();
        List<Song> allSongs = readSongs();

        allSongs.sort((o1, o2) -> {
            float score1 = matchesSearch(o1, lowerQuery) + 0.1f * (float) Math.log10((o1.getPlayCount() != null ? o1.getPlayCount() : 0) + 1);
            float score2 = matchesSearch(o2, lowerQuery) + 0.1f * (float) Math.log10((o2.getPlayCount() != null ? o2.getPlayCount() : 0) + 1);
            return (int) (10000 * (score2 - score1));
        });
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
