package streamly;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class Song {
    private String id;
    private String title;
    private List<String> artists;
    private String album;
    private String coverUrl;
    @JsonProperty("audioUrl")
    private String audioURL;
    private String duration;
    private List<String> genres;

    public Song() {}

    public Song(String id, String title, List<String> artists, String album, String coverUrl, String audioURL, String duration, List<String> genres) {
        this.id = id;
        this.title = title;
        this.artists = artists;
        this.album = album;
        this.coverUrl = coverUrl;
        this.audioURL = audioURL;
        this.duration = duration;
        this.genres = genres;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public List<String> getArtists() { return artists; }
    public void setArtists(List<String> artists) { this.artists = artists; }

    public String getAlbum() { return album; }
    public void setAlbum(String album) { this.album = album; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    @JsonProperty("audioUrl")
    public String getAudioURL() { return audioURL; }
    public void setAudioURL(String audioURL) { this.audioURL = audioURL; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public List<String> getGenres() { return genres; }
    public void setGenres(List<String> genres) { this.genres = genres; }
}
