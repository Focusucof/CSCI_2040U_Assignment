import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.Arrays;
import java.util.List;

public class PlaylistTest {
    @Test
    void UT_17_CB_setAndGetSongIds() {
        Playlist playlist = new Playlist("Test Playlist");
        List<Integer> songIds = Arrays.asList(1, 2, 3);
        playlist.setSongIds(songIds);
        List<Integer> result = playlist.getSongIds();
        assertEquals(songIds, result);
    }
}