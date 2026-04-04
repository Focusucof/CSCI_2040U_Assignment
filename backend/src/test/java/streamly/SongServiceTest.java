package streamly;

import org.junit.jupiter.api.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class SongServiceTest {

    private SongService service;
    private Path tempFile;

    @BeforeEach
    public void setUp() throws IOException {
        tempFile = Files.createTempFile("songs_test_", ".json");
        Files.writeString(tempFile, "[]");
        service = new SongService(tempFile.toString());
    }

    @AfterEach
    public void tearDown() throws IOException {
        Files.deleteIfExists(tempFile);
    }

    private Song makeSong(String title, List<String> artists, String album) {
        Song song = new Song();
        song.setTitle(title);
        song.setArtists(artists);
        song.setAlbum(album);
        song.setCoverUrl("http://example.com/cover.jpg");
        song.setAudioURL("http://example.com/audio.mp3");
        song.setDuration("3:30");
        song.setGenres(List.of("Pop"));
        song.setReleaseDate("2023-01-01");
        song.setExplicit(false);
        return song;
    }

    @Test
    public void testReadSongsEmpty() {
        List<Song> songs = service.readSongs();
        Assertions.assertTrue(songs.isEmpty());
    }

    @Test
    public void testCreateSong() {
        Song song = makeSong("Test Song", List.of("Artist1"), "Test Album");
        Song created = service.createSong(song);

        Assertions.assertNotNull(created.getId());
        Assertions.assertEquals("Test Song", created.getTitle());

        List<Song> songs = service.readSongs();
        Assertions.assertEquals(1, songs.size());
        Assertions.assertEquals("Test Song", songs.get(0).getTitle());
    }

    @Test
    public void testCreateMultipleSongs() {
        service.createSong(makeSong("Song 1", List.of("A"), "Album"));
        service.createSong(makeSong("Song 2", List.of("B"), "Album"));
        service.createSong(makeSong("Song 3", List.of("C"), "Album"));

        List<Song> songs = service.readSongs();
        Assertions.assertEquals(3, songs.size());
    }

    @Test
    public void testCreateSongAssignsUniqueIds() {
        Song s1 = service.createSong(makeSong("Song 1", List.of("A"), "Album"));
        Song s2 = service.createSong(makeSong("Song 2", List.of("B"), "Album"));

        Assertions.assertNotEquals(s1.getId(), s2.getId());
    }

    @Test
    public void testUpdateSong() {
        Song created = service.createSong(makeSong("Original", List.of("Artist"), "Album"));
        String id = created.getId();

        Song updated = makeSong("Updated Title", List.of("New Artist"), "New Album");
        Song result = service.updateSong(id, updated);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(id, result.getId());
        Assertions.assertEquals("Updated Title", result.getTitle());

        List<Song> songs = service.readSongs();
        Assertions.assertEquals(1, songs.size());
        Assertions.assertEquals("Updated Title", songs.get(0).getTitle());
    }

    @Test
    public void testUpdateNonExistentSong() {
        Song updated = makeSong("Test", List.of("A"), "Album");
        Song result = service.updateSong("nonexistent-id", updated);
        Assertions.assertNull(result);
    }

    @Test
    public void testDeleteSong() {
        Song created = service.createSong(makeSong("To Delete", List.of("A"), "Album"));
        String id = created.getId();

        boolean deleted = service.deleteSong(id);
        Assertions.assertTrue(deleted);

        List<Song> songs = service.readSongs();
        Assertions.assertTrue(songs.isEmpty());
    }

    @Test
    public void testDeleteNonExistentSong() {
        boolean deleted = service.deleteSong("nonexistent-id");
        Assertions.assertFalse(deleted);
    }

    @Test
    public void testDeletePreservesOtherSongs() {
        Song s1 = service.createSong(makeSong("Keep", List.of("A"), "Album"));
        Song s2 = service.createSong(makeSong("Delete", List.of("B"), "Album"));

        service.deleteSong(s2.getId());

        List<Song> songs = service.readSongs();
        Assertions.assertEquals(1, songs.size());
        Assertions.assertEquals("Keep", songs.get(0).getTitle());
    }

    @Test
    public void testSearchWithEmptyQuery() {
        service.createSong(makeSong("Song A", List.of("Artist"), "Album"));
        service.createSong(makeSong("Song B", List.of("Artist"), "Album"));

        List<Song> results = service.searchSongs("");
        Assertions.assertEquals(2, results.size());
    }

    @Test
    public void testSearchWithNullQuery() {
        service.createSong(makeSong("Song A", List.of("Artist"), "Album"));

        List<Song> results = service.searchSongs(null);
        Assertions.assertEquals(1, results.size());
    }

    @Test
    public void testSongDataPersistsThroughJson() {
        Song original = new Song("temp", "Headlines", List.of("Drake", "Lil Wayne"),
                "Take Care", "http://cover.jpg", "http://audio.mp3",
                "5:00", List.of("Hip Hop", "R&B"), "2011-10-24", true);
        service.createSong(original);

        List<Song> songs = service.readSongs();
        Song loaded = songs.get(0);

        Assertions.assertEquals("Headlines", loaded.getTitle());
        Assertions.assertEquals(List.of("Drake", "Lil Wayne"), loaded.getArtists());
        Assertions.assertEquals("Take Care", loaded.getAlbum());
        Assertions.assertEquals("http://cover.jpg", loaded.getCoverUrl());
        Assertions.assertEquals("http://audio.mp3", loaded.getAudioURL());
        Assertions.assertEquals("5:00", loaded.getDuration());
        Assertions.assertEquals(List.of("Hip Hop", "R&B"), loaded.getGenres());
        Assertions.assertEquals("2011-10-24", loaded.getReleaseDate());
        Assertions.assertTrue(loaded.isExplicit());
    }

    @Test
    public void testServiceInitializesFileIfMissing() throws IOException {
        Path newFile = tempFile.getParent().resolve("new_songs_test.json");
        Files.deleteIfExists(newFile);

        SongService newService = new SongService(newFile.toString());
        List<Song> songs = newService.readSongs();
        Assertions.assertTrue(songs.isEmpty());

        Files.deleteIfExists(newFile);
    }
}
