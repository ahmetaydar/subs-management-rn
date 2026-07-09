import fs from "fs";
import path from "path";

describe(".prettierrc", () => {
  const filePath = path.join(__dirname, "..", ".prettierrc");
  const raw = fs.readFileSync(filePath, "utf-8");

  it("exists and is valid JSON", () => {
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  it("defines exactly the expected formatting options", () => {
    const config = JSON.parse(raw);
    expect(config).toEqual({
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: "es5",
    });
  });

  it("keeps semicolons enabled", () => {
    const config = JSON.parse(raw);
    expect(config.semi).toBe(true);
  });

  it("prefers double quotes over single quotes", () => {
    const config = JSON.parse(raw);
    expect(config.singleQuote).toBe(false);
  });

  it("uses a 2-space tab width", () => {
    const config = JSON.parse(raw);
    expect(config.tabWidth).toBe(2);
  });

  it("uses an es5-compatible trailing comma style", () => {
    const config = JSON.parse(raw);
    expect(["none", "es5", "all"]).toContain(config.trailingComma);
    expect(config.trailingComma).toBe("es5");
  });
});