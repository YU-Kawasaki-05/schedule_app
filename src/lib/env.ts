const requiredSupabaseKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
] as const;

export type SupabaseConfigStatus = {
  invalid: string[];
  ready: boolean;
  missing: string[];
};

function isHttpUrl(value: string | undefined): value is string {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const missing = requiredSupabaseKeys.filter((key) => !process.env[key]);
  const invalid =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !isHttpUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
      ? ["NEXT_PUBLIC_SUPABASE_URL"]
      : [];

  return {
    invalid,
    ready: missing.length === 0 && invalid.length === 0,
    missing
  };
}

export function getPublicAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isHttpUrl(url) || !anonKey) {
    return null;
  }

  return { anonKey, url };
}

export function getSupabaseAdminConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isHttpUrl(url) || !serviceRoleKey) {
    return null;
  }

  return { serviceRoleKey, url };
}
