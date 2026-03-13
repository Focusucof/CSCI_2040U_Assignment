package streamly;

import java.util.Date;

public class Playlist {
    private int id;
    private String name;
    private String ownerId;
    private int[] songIds;
    private Date createdAt;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public int[] getSongIds() {
        return songIds;
    }

    public void setSongIds(int[] songIds) {
        this.songIds = songIds;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Playlist(int id, String name, String ownerId, int[] songIds, Date createdAt) {
        this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this.songIds = songIds;
        this.createdAt = createdAt;
    }
}
