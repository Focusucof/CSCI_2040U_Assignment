public class User {
    private String id;
    private String username;
    private String password;
    private Playlist likedSongs;
    private Playlist[] playlists;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Playlist getLikedSongs() {
        return likedSongs;
    }

    public void setLikedSongs(Playlist likedSongs) {
        this.likedSongs = likedSongs;
    }

    public Playlist[] getPlaylists() {
        return playlists;
    }

    public void setPlaylists(Playlist[] playlists) {
        this.playlists = playlists;
    }

    public User(String id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }
}
