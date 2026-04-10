package streamly;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class UtilsTest {

    @Test
    public void testMinutesAndSeconds() {
        Assertions.assertEquals(300, Utils.durationToSeconds("5:00"));
        Assertions.assertEquals(195, Utils.durationToSeconds("3:15"));
        Assertions.assertEquals(61, Utils.durationToSeconds("1:01"));
    }

    @Test
    public void testHoursMinutesAndSeconds() {
        Assertions.assertEquals(3661, Utils.durationToSeconds("1:01:01"));
        Assertions.assertEquals(7200, Utils.durationToSeconds("2:00:00"));
    }

    @Test
    public void testSecondsOnly() {
        Assertions.assertEquals(120, Utils.durationToSeconds("120"));
        Assertions.assertEquals(0, Utils.durationToSeconds("0"));
    }

    @Test
    public void testNullAndEmpty() {
        Assertions.assertEquals(0, Utils.durationToSeconds(null));
        Assertions.assertEquals(0, Utils.durationToSeconds(""));
    }

    @Test
    public void testInvalidFormat() {
        Assertions.assertEquals(0, Utils.durationToSeconds("abc"));
        Assertions.assertEquals(0, Utils.durationToSeconds("a:b"));
        Assertions.assertEquals(0, Utils.durationToSeconds("1:2:3:4"));
    }
}
