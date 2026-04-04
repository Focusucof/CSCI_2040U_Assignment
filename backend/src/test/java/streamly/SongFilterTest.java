package streamly;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SongFilterTest {

    private Song makeSong(String title, List<String> artists, List<String> genres, String duration, boolean explicit) {
        Song song = new Song();
        song.setTitle(title);
        song.setArtists(artists);
        song.setGenres(genres);
        song.setDuration(duration);
        song.setExplicit(explicit);
        return song;
    }

    @Test
    public void testExactTitleMatchScoresBetterThanMismatch() {
        Map<String, Object> filters = new HashMap<>();
        filters.put("title", "Headlines");
        SongFilter filter = new SongFilter(filters, new HashMap<>());

        Song exact = makeSong("Headlines", List.of("Drake"), List.of("Hip Hop"), "3:30", false);
        Song different = makeSong("Something Else Entirely", List.of("Drake"), List.of("Hip Hop"), "3:30", false);

        float exactScore = filter.scoreAll(exact);
        float differentScore = filter.scoreAll(different);

        // Exact match should have a higher (less negative) score
        Assertions.assertTrue(exactScore > differentScore,
                "Exact title match should score higher. exact=" + exactScore + " different=" + differentScore);
    }

    @Test
    public void testArtistFilterScoring() {
        Map<String, Object> filters = new HashMap<>();
        filters.put("artists", new String[]{"Drake"});
        SongFilter filter = new SongFilter(filters, new HashMap<>());

        Song drakesSong = makeSong("Headlines", List.of("Drake"), List.of("Hip Hop"), "3:30", false);
        Song otherSong = makeSong("Headlines", List.of("Taylor Swift"), List.of("Pop"), "3:30", false);

        float drakeScore = filter.scoreAll(drakesSong);
        float otherScore = filter.scoreAll(otherSong);

        Assertions.assertTrue(drakeScore > otherScore,
                "Matching artist should score higher. drake=" + drakeScore + " other=" + otherScore);
    }

    @Test
    public void testGenreFilterScoring() {
        Map<String, Object> filters = new HashMap<>();
        filters.put("genres", new String[]{"Hip Hop"});
        SongFilter filter = new SongFilter(filters, new HashMap<>());

        Song hipHopSong = makeSong("Track", List.of("Artist"), List.of("Hip Hop"), "3:00", false);
        Song popSong = makeSong("Track", List.of("Artist"), List.of("Classical"), "3:00", false);

        float hipHopScore = filter.scoreAll(hipHopSong);
        float popScore = filter.scoreAll(popSong);

        Assertions.assertTrue(hipHopScore > popScore,
                "Matching genre should score higher. hipHop=" + hipHopScore + " pop=" + popScore);
    }

    @Test
    public void testScoreAnyExactTitleMatch() {
        Map<String, Object> filters = new HashMap<>();
        filters.put("title", "headlines");
        SongFilter filter = new SongFilter(filters, new HashMap<>());

        Song exact = makeSong("Headlines", List.of("Drake"), List.of("Hip Hop"), "3:30", false);
        Song different = makeSong("Completely Different Title", List.of("Drake"), List.of("Hip Hop"), "3:30", false);

        float exactScore = filter.scoreAny(exact);
        float differentScore = filter.scoreAny(different);

        // Lower scoreAny = better match (closer to 0 due to multiplication of small values)
        Assertions.assertTrue(exactScore < differentScore,
                "Exact title should have lower scoreAny. exact=" + exactScore + " different=" + differentScore);
    }

    @Test
    public void testEmptyFilters() {
        Map<String, Object> filters = new HashMap<>();
        SongFilter filter = new SongFilter(filters, new HashMap<>());

        Song song = makeSong("Test", List.of("Artist"), List.of("Genre"), "3:00", false);

        // With no filters, scoreAll should return 0 (no penalty)
        Assertions.assertEquals(0.0f, filter.scoreAll(song), 0.001f);
    }

    @Test
    public void testNullSongFields() {
        Map<String, Object> filters = new HashMap<>();
        filters.put("title", "Test");
        filters.put("artists", new String[]{"Artist"});
        filters.put("genres", new String[]{"Genre"});
        SongFilter filter = new SongFilter(filters, new HashMap<>());

        Song song = new Song();
        // Should not throw any exception
        float score = filter.scoreAll(song);
        Assertions.assertFalse(Float.isNaN(score));
    }

    @Test
    public void testWeightsAffectScoring() {
        Map<String, Object> filters = new HashMap<>();
        filters.put("title", "Test");

        HashMap<String, Integer> defaultWeights = new HashMap<>();
        HashMap<String, Integer> heavyWeights = new HashMap<>();
        heavyWeights.put("title", 5);

        SongFilter defaultFilter = new SongFilter(filters, defaultWeights);
        SongFilter heavyFilter = new SongFilter(filters, heavyWeights);

        Song song = makeSong("Something Different", List.of("Artist"), List.of("Genre"), "3:00", false);

        float defaultScore = defaultFilter.scoreAll(song);
        float heavyScore = heavyFilter.scoreAll(song);

        // Heavier weight means more penalty for mismatch
        Assertions.assertTrue(heavyScore < defaultScore,
                "Heavier weight should produce lower score for mismatch. heavy=" + heavyScore + " default=" + defaultScore);
    }
}
