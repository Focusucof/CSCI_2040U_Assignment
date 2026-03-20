package streamly;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Date;
import org.json.*;

public class Song {
    // Title, artists, albums, genres, release date, uid, filepath, clean/explicit, duration
    protected String id;
    protected String title;
    protected String[] artists;
    protected String[] album_ids;
    protected Date release_date;
    protected String[] genres;
    protected File filepath;
    protected boolean clean;
    protected int duration; // In seconds
    protected String coverUrl;

    public Song(){
    }

    public static Song from_file(File source){
        JSONObject json = new JSONObject(source);
        // TODO Parse JSON and return the built song
        return null;
    }

    public void save_to_file(File destination) throws IOException {
        JSONWriter json = new JSONWriter(new FileWriter(destination));
        // TODO take song and write it to file
    }


    // Getters
    public String getId() {return id;}
    public Date getRelease_date() {return release_date;}
    public boolean isClean() {return clean;}
    public File getFilepath() {return filepath;}
    public String getCoverUrl() {return coverUrl;}
    public String getTitle() {return title;}
    public int getDurationInt() {return duration;}
    public String getDuration() {return String.valueOf(duration);}
    public String[] getAlbumIDs() {return album_ids;}
    public String getAlbum() {return album_ids[0];}
    public String[] getArtists() {return artists;}
    public String getArtist() {return artists[0];}
    public String[] getGenres() {return genres;}
    public String getGenre() {return genres[0];}

    // Setters
    public void setId(String id) {this.id = id;}
    public void setRelease_date(Date release_date) {this.release_date = release_date;}
    public void setClean(boolean clean) {this.clean = clean;}
    public void setFilepath(File filepath) {this.filepath = filepath;}
    public void setCoverUrl(String coverUrl) {this.coverUrl = coverUrl;}
    public void setTitle(String title) {this.title = title;}
    public void setDuration(int duration) {this.duration = duration;}
    public void setDuration(String duration) {this.duration = Integer.parseInt(duration);}
    public void setAlbumIDs(String[] album_ids) {this.album_ids = album_ids;}
    public void setAlbum(String album_id) {this.album_ids = new String[]{album_id};}
    public void setArtists(String[] artists) {this.artists = artists;}
    public void setArtist(String artist) {this.artists = new String[]{artist};}
    public void setGenres(String[] genres) {this.genres = genres;}
    public void setGenre(String genres) {this.genres = new String[]{genres};}
}