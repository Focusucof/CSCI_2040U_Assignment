package streamly;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FilterTest {
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
    public void testEmptyFilters() {
        Map<String, Object> filters = new HashMap<>();
        SongFilter filter = new SongFilter(filters, new HashMap<>());

        Song song = makeSong("Test", List.of("Artist"), List.of("Genre"), "3:00", false);

        // With no filters, scoreAny should return 1 (no matches)
        Assertions.assertEquals(1.0f, filter.scoreAny(song), 0.001f);
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
        float score = filter.scoreAny(song);
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

        float defaultScore = defaultFilter.scoreAny(song);
        float heavyScore = heavyFilter.scoreAny(song);

        // Heavier weight means more penalty for mismatch
        Assertions.assertTrue(heavyScore > defaultScore,
                "Heavier weight should produce lower score for mismatch. heavy=" + heavyScore + " default=" + defaultScore);
    }

    @Test
    public void testExactTitleMatchScoresBetterThanMismatch() {
        Map<String, Object> filters = new HashMap<>();
        filters.put("title", "Headlines");
        SongFilter filter = new SongFilter(filters, new HashMap<>());

        Song exact = makeSong("Headlines", List.of("Drake"), List.of("Hip Hop"), "3:30", false);
        Song different = makeSong("Something Else Entirely", List.of("Drake"), List.of("Hip Hop"), "3:30", false);

        float exactScore = filter.scoreAny(exact);
        float differentScore = filter.scoreAny(different);

        // Exact match should have a lower (closer to zero) score
        Assertions.assertTrue(exactScore < differentScore,
                "Exact title match should score higher. exact=" + exactScore + " different=" + differentScore);
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
}
