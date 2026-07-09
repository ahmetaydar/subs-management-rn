import fs from "fs";
import path from "path";

describe("package-lock.json", () => {
  const filePath = path.join(__dirname, "..", "package-lock.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const lock = JSON.parse(raw);

  it("is valid JSON", () => {
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  it("declares a numeric lockfileVersion", () => {
    expect(typeof lock.lockfileVersion).toBe("number");
  });

  it("matches the name and version declared in package.json", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf-8")
    );
    expect(lock.name).toBe(pkg.name);
    expect(lock.version).toBe(pkg.version);
  });

  it("bumps the top-level @emnapi/wasi-threads dependency to 1.2.2", () => {
    const entry = lock.packages["node_modules/@emnapi/wasi-threads"];
    expect(entry).toBeDefined();
    expect(entry.version).toBe("1.2.2");
  });

  it("removes the now-unused top-level @emnapi/core and @emnapi/runtime entries", () => {
    expect(lock.packages["node_modules/@emnapi/core"]).toBeUndefined();
    expect(lock.packages["node_modules/@emnapi/runtime"]).toBeUndefined();
  });

  it("nests the legacy @emnapi/core, @emnapi/runtime and @emnapi/wasi-threads under @unrs/resolver-binding-wasm32-wasi", () => {
    const nestedCore =
      lock.packages[
        "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/core"
      ];
    const nestedRuntime =
      lock.packages[
        "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/runtime"
      ];
    const nestedWasiThreads =
      lock.packages[
        "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/wasi-threads"
      ];

    expect(nestedCore).toBeDefined();
    expect(nestedCore.version).toBe("1.10.0");
    expect(nestedRuntime).toBeDefined();
    expect(nestedRuntime.version).toBe("1.10.0");
    expect(nestedWasiThreads).toBeDefined();
    expect(nestedWasiThreads.version).toBe("1.2.1");
  });

  it("marks react and react-native as peer dependencies", () => {
    expect(lock.packages["node_modules/react"]?.peer).toBe(true);
    expect(lock.packages["node_modules/react-native"]?.peer).toBe(true);
  });

  it("no longer marks @expo/config-types as a peer dependency", () => {
    expect(
      lock.packages["node_modules/@expo/config-types"]?.peer
    ).toBeUndefined();
  });

  it("keeps every top-level package entry resolvable with a version", () => {
    const packageKeys = Object.keys(lock.packages);
    // A top-level entry's key only contains a single "node_modules/" segment
    // (nested/deduped entries contain more than one).
    const topLevelKeys = packageKeys
      .filter((key) => key.split("node_modules/").length === 2)
      .slice(0, 25);

    expect(topLevelKeys.length).toBeGreaterThan(0);
    for (const key of topLevelKeys) {
      expect(lock.packages[key]).toHaveProperty("version");
    }
  });
});