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

function getJwtRole(value: string) {
  if (!value.startsWith("eyJ")) {
    return null;
  }

  try {
    const payload = value.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized)) as { role?: string };
    return decoded.role ?? null;
  } catch {
    return null;
  }
}

function isPrivilegedSupabaseKey(value: string | undefined): value is string {
  if (!value) {
    return false;
  }

  if (value.startsWith("sb_secret_")) {
    return true;
  }

  if (value.startsWith("sb_publishable_")) {
    return false;
  }

  return getJwtRole(value) === "service_role";
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const missing = requiredSupabaseKeys.filter((key) => !process.env[key]);
  const invalid = [
    ...(process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !isHttpUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
      ? ["NEXT_PUBLIC_SUPABASE_URL"]
      : []),
    ...(process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !isPrivilegedSupabaseKey(process.env.SUPABASE_SERVICE_ROLE_KEY)
      ? ["SUPABASE_SERVICE_ROLE_KEY"]
      : [])
  ];

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

  if (!isHttpUrl(url) || !isPrivilegedSupabaseKey(serviceRoleKey)) {
    return null;
  }

  return { serviceRoleKey, url };
}
