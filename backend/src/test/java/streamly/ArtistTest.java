package streamly;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class ArtistTest {

    @Test
    public void testDefaultConstructor() {
        Artist artist = new Artist();
        Assertions.assertNull(artist.getId());
        Assertions.assertNull(artist.getName());
        Assertions.assertNull(artist.getImageUrl());
        Assertions.assertNull(artist.getGenre());
    }

    @Test
    public void testSettersAndGetters() {
        Artist artist = new Artist();
        artist.setId("a1");
        artist.setName("Drake");
        artist.setImageUrl("http://example.com/drake.jpg");
        artist.setGenre("Hip Hop");

        Assertions.assertEquals("a1", artist.getId());
        Assertions.assertEquals("Drake", artist.getName());
        Assertions.assertEquals("http://example.com/drake.jpg", artist.getImageUrl());
        Assertions.assertEquals("Hip Hop", artist.getGenre());
    }

    @Test
    public void testSettersOverwriteValues() {
        Artist artist = new Artist();
        artist.setName("Drake");
        Assertions.assertEquals("Drake", artist.getName());

        artist.setName("The Weeknd");
        Assertions.assertEquals("The Weeknd", artist.getName());
    }
}
