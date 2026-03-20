package streamly;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class SongTest {
    @Test
    public void test() {
        Song song = new Song("1", "Headlines", "Drake", "Take Care", "http://0.0.0.0", "5:00", "Hip Hop");

        String expectedID = "1";
        String expectedTitle = "Headlines";
        String expectedArtist = "Drake";
        String expectedAlbum = "Take Care";
        String expectedCoverURL = "http://0.0.0.0";
        String expectedDuration = "5:00";
        String expectedGenre = "Hip Hop";

        String actualID = song.getId();
        String actualTitle = song.getTitle();
        String actualArtist = song.getArtist();
        String actualAlbum = song.getAlbum();
        String actualCoverURL = song.getCoverUrl();
        String actualDuration = song.getDuration();
        String actualGenre = song.getGenre();

        Assertions.assertEquals(expectedID, actualID);
        Assertions.assertEquals(expectedTitle, actualTitle);
        Assertions.assertEquals(expectedArtist, actualArtist);
        Assertions.assertEquals(expectedAlbum, actualAlbum);
        Assertions.assertEquals(expectedCoverURL, actualCoverURL);
        Assertions.assertEquals(expectedDuration, actualDuration);
        Assertions.assertEquals(expectedGenre, actualGenre);



    }
}
