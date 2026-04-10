test("UT-03-CB: getUserByUsername() returns correct user object", () => {
  const result = getUserByUsername("dev");
  expect(result).not.toBeNull();
  expect(result.username).toBe("dev");
  expect(result.isAdmin).toBe(true);
});