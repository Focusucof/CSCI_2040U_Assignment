test("UT-02-CB: userExists() returns false for non-existing username", () => {
  const result = userExists("nonexistent");
  expect(result).toBe(false);
});