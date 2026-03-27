package streamly;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

public class SongTest {
    @Test
    public void test() {
        Song song = new Song("1", "Headlines", List.of("Drake"), "Take Care", "http://0.0.0.0", "http://0.0.0.0", "5:00", List.of("Hip Hop"), "2011-10-24", false);

        String expectedID = "1";
        String expectedTitle = "Headlines";
        List<String> expectedArtists = List.of("Drake");
        String expectedAlbum = "Take Care";
        String expectedCoverURL = "http://0.0.0.0";
        String expectedAudioURL = "http://0.0.0.0";
        String expectedDuration = "5:00";
        List<String> expectedGenres = List.of("Hip Hop");
        String expectedReleaseDate = "2011-10-24";
        boolean expectedExplicit = false;

        String actualID = song.getId();
        String actualTitle = song.getTitle();
        List<String> actualArtists = song.getArtists();
        String actualAlbum = song.getAlbum();
        String actualCoverURL = song.getCoverUrl();
        String actualAudioURL = song.getAudioURL();
        String actualDuration = song.getDuration();
        List<String> actualGenres = song.getGenres();
        String actualReleaseDate = song.getReleaseDate();
        boolean actualExplicit = song.isExplicit();

        Assertions.assertEquals(expectedID, actualID);
        Assertions.assertEquals(expectedTitle, actualTitle);
        Assertions.assertEquals(expectedArtists, actualArtists);
        Assertions.assertEquals(expectedAlbum, actualAlbum);
        Assertions.assertEquals(expectedCoverURL, actualCoverURL);
        Assertions.assertEquals(expectedAudioURL, actualAudioURL);
        Assertions.assertEquals(expectedDuration, actualDuration);
        Assertions.assertEquals(expectedGenres, actualGenres);
        Assertions.assertEquals(expectedReleaseDate, actualReleaseDate);
        Assertions.assertEquals(expectedExplicit, actualExplicit);
    }
}
