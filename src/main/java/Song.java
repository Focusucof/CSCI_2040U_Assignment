import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Date;
import org.json.*;

public class Song {
    // Title, artists, albums, genres, release date, uid, filepath, clean/explicit, duration
    private String title;
    private String[] artists;
    private int[] album_ids;
    private Date release_date;
    private String[] genres;
    private int uid;
    private File filepath;
    private boolean clean;
    private int duration; // In seconds

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
    public Date getRelease_date() {return release_date;}
    public boolean isClean() {return clean;}
    public File getFilepath() {return filepath;}
    public String getTitle() {return title;}
    public int getDuration() {return duration;}
    public int getUid() {return uid;}
    public int[] getAlbumIDs() {return album_ids;}
    public String[] getArtists() {return artists;}
    public String[] getGenres() {return genres;}
}
