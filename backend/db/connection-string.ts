const LEGACY_SSL_MODES = new Set(["prefer", "require", "verify-ca"]);

export function normalizePostgresConnectionString(connectionString: string) {
  try {
    const url = new URL(connectionString);
    const protocol = url.protocol.toLowerCase();

    if (protocol !== "postgres:" && protocol !== "postgresql:") {
      return connectionString;
    }

    const libpqCompatEnabled = url.searchParams.get("uselibpqcompat") === "true";
    const sslMode = url.searchParams.get("sslmode");

    if (!libpqCompatEnabled && sslMode && LEGACY_SSL_MODES.has(sslMode.toLowerCase())) {
      url.searchParams.set("sslmode", "verify-full");
    }

    return url.toString();
  } catch {
    return connectionString;
  }
}
