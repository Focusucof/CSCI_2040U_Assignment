import java.util.Calendar;
import java.util.*;

//Backend logic for Year filtering
public class FilterbyYear {
    public static List<Song> filterByYear (List<Song> songs, int year){
        for (Song song : songs){
            if (song.getRelease_date() == null){
                continue;
            }
            Calendar cal = Calendar.getInstance();
            cal.setTime(song.getRelease_date());
            int songYear = cal.get(Calendar.YEAR);
            if (songYear == year){
                filtered.add(song);
            }
        }
        return filtered;
    }

}
