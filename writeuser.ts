test("UT-05-CB: writeUser() appends new user", () => {
  const newUser = {
    id: "temp-id",
    username: "tempUser",
    password: "temp_pw",
    likedSongs: [],
    playlists: [],
    isAdmin: false
  };
  writeUser(newUser);
  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
  expect(users.some((u: any) => u.username === "tempUser")).toBe(true);
});