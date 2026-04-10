package streamly;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class AlbumTest {

    @Test
    public void testDefaultConstructor() {
        Album album = new Album();
        Assertions.assertNull(album.getId());
        Assertions.assertNull(album.getTitle());
        Assertions.assertNull(album.getArtist());
        Assertions.assertNull(album.getCoverUrl());
        Assertions.assertEquals(0, album.getYear());
        Assertions.assertEquals(0, album.getTrackCount());
    }

    @Test
    public void testSettersAndGetters() {
        Album album = new Album();
        album.setId("alb1");
        album.setTitle("Take Care");
        album.setArtist("Drake");
        album.setCoverUrl("http://example.com/takecare.jpg");
        album.setYear(2011);
        album.setTrackCount(20);

        Assertions.assertEquals("alb1", album.getId());
        Assertions.assertEquals("Take Care", album.getTitle());
        Assertions.assertEquals("Drake", album.getArtist());
        Assertions.assertEquals("http://example.com/takecare.jpg", album.getCoverUrl());
        Assertions.assertEquals(2011, album.getYear());
        Assertions.assertEquals(20, album.getTrackCount());
    }

    @Test
    public void testYearAndTrackCountDefaults() {
        Album album = new Album();
        // int fields default to 0
        Assertions.assertEquals(0, album.getYear());
        Assertions.assertEquals(0, album.getTrackCount());
    }
}
