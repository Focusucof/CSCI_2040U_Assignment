package streamly;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Date;

public class PlaylistTest {

    @Test
    public void testConstructorAndGetters() {
        Date now = new Date();
        int[] songIds = {1, 2, 3};
        Playlist playlist = new Playlist(1, "My Playlist", "user1", songIds, now);

        Assertions.assertEquals(1, playlist.getId());
        Assertions.assertEquals("My Playlist", playlist.getName());
        Assertions.assertEquals("user1", playlist.getOwnerId());
        Assertions.assertArrayEquals(new int[]{1, 2, 3}, playlist.getSongIds());
        Assertions.assertEquals(now, playlist.getCreatedAt());
    }

    @Test
    public void testSetters() {
        Date date1 = new Date(1000000);
        Playlist playlist = new Playlist(1, "Old Name", "user1", new int[]{1}, date1);

        playlist.setId(2);
        playlist.setName("New Name");
        playlist.setOwnerId("user2");
        playlist.setSongIds(new int[]{4, 5, 6});
        Date date2 = new Date(2000000);
        playlist.setCreatedAt(date2);

        Assertions.assertEquals(2, playlist.getId());
        Assertions.assertEquals("New Name", playlist.getName());
        Assertions.assertEquals("user2", playlist.getOwnerId());
        Assertions.assertArrayEquals(new int[]{4, 5, 6}, playlist.getSongIds());
        Assertions.assertEquals(date2, playlist.getCreatedAt());
    }

    @Test
    public void testEmptySongIds() {
        Playlist playlist = new Playlist(1, "Empty", "user1", new int[]{}, new Date());
        Assertions.assertEquals(0, playlist.getSongIds().length);
    }
}
