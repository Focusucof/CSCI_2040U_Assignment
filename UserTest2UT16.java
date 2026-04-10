import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class UserTest2UT16 {
    @Test
    void setAndGetUsername(){
        User user = new User();
        user.setUsername("user");
        String result = user.getUsername();
        assertEquals("user", result);
    }
}
