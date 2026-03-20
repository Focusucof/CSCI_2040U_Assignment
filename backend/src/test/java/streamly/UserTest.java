package streamly;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class UserTest {
    @Test
    public void test() {
        User user = new User("1", "test", "test");
        String expectedID = "1";
        String expectedUsername = "test";
        String expectedPassword = "test";

        String actualID = user.getId();
        String actualUsername = user.getUsername();
        String actualPassword = user.getPassword();

        Assertions.assertEquals(expectedID, actualID);
        Assertions.assertEquals(expectedUsername, actualUsername);
        Assertions.assertEquals(expectedPassword, actualPassword);



    }
}
