import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
public class PlaylistTest {
    @Test
    void PlaylistgetName(){
        Playlist playlist = new Playlist("My Playlist");
        String result = playlist.getName();
        assertEquals("My Playlist", result);
    }
}