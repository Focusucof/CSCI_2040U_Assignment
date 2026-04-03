test("UT-01-CB: userExists() returns true for existing username", () => {
  const result = userExists("testuser");
  expect(result).toBe(true);
});