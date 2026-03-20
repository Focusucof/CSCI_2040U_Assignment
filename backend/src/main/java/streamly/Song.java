package streamly;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Song {
    private String id;
    private String title;
    private String artist;
    private String album;
    private String coverUrl;
    @JsonProperty("audioUrl")
    private String audioURL;
    private String duration;
    private String genre;

    public Song() {}

    public Song(String id, String title, String artist, String album, String coverUrl, String audioURL, String duration, String genre) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.coverUrl = coverUrl;
        this.audioURL = audioURL;
        this.duration = duration;
        this.genre = genre;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }

    public String getAlbum() { return album; }
    public void setAlbum(String album) { this.album = album; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    @JsonProperty("audioUrl")
    public String getAudioURL() { return audioURL; }
    public void setAudioURL(String audioURL) { this.audioURL = audioURL; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
}
