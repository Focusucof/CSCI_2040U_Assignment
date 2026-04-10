import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.beans.Transient;

public class UserTest1UT15{
    @Test
    void isAdmin(){
        User user = new User("testUser", false);
        boolean result = user.isAdmin();
        assertFalse(result);
    } 
}
