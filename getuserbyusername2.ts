test("UT-04-CB: getUserByUsername() returns null for invalid username", () => {
  const result = getUserByUsername("unknownUser");
  expect(result).toBeNull();
});