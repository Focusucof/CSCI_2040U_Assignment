package streamly;

public class Utils {
    public static int durationToSeconds(String duration) {
        if (duration == null || duration.isEmpty()) {
            return 0;
        }
        String[] parts = duration.split(":");
        try {
            if (parts.length == 2) {
                int minutes = Integer.parseInt(parts[0]);
                int seconds = Integer.parseInt(parts[1]);
                return minutes * 60 + seconds;
            } else if (parts.length == 3) {
                int hours = Integer.parseInt(parts[0]);
                int minutes = Integer.parseInt(parts[1]);
                int seconds = Integer.parseInt(parts[2]);
                return hours * 3600 + minutes * 60 + seconds;
            } else {
                return Integer.parseInt(duration);
            }
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
