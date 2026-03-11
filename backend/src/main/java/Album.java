import java.util.Date;

public class Album {
    // Artists, songs, release date, uid, name
    private String[] artists;
    private int[] song_ids;
    private Date release_date;
    private int uid;
    private String name;

    public Album(){
    }

    public Date getRelease_date() {return release_date;}
    public int getUid() {return uid;}
    public String[] getArtists() {return artists;}
    public int[] getSongIDs() {return song_ids;}
    public String getName() {return name;}
}
