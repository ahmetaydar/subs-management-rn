import fs from "fs";
import path from "path";

describe(".vscode/settings.json", () => {
  const filePath = path.join(__dirname, "..", ".vscode", "settings.json");
  const raw = fs.readFileSync(filePath, "utf-8");

  it("exists and is valid JSON", () => {
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  it("sets prettier as the global default formatter", () => {
    const settings = JSON.parse(raw);
    expect(settings["editor.defaultFormatter"]).toBe("esbenp.prettier-vscode");
  });

  it.each([
    "typescript",
    "typescriptreact",
    "javascript",
    "javascriptreact",
    "json",
  ])(
    "configures prettier as the default formatter for the [%s] language",
    (language) => {
      const settings = JSON.parse(raw);
      expect(settings[`[${language}]`]).toEqual({
        "editor.defaultFormatter": "esbenp.prettier-vscode",
      });
    }
  );

  it("points prettier.prettierPath at the local node_modules installation", () => {
    const settings = JSON.parse(raw);
    expect(settings["prettier.prettierPath"]).toBe(
      "${workspaceFolder}/node_modules/prettier"
    );
  });

  it("does not require an explicit prettier config file to be present", () => {
    const settings = JSON.parse(raw);
    expect(settings["prettier.requireConfig"]).toBe(false);
  });

  it("still enables format on save", () => {
    const settings = JSON.parse(raw);
    expect(settings["editor.formatOnSave"]).toBe(true);
  });
});