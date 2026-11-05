export type Profile = { name: string; age: string };
const cookieName = 'unaiuto_profile';
const cookiePath = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/`;
const lifetime = 60 * 60 * 24 * 180;

export function readProfile(): Profile | null {
  try {
    const entry = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`));
    if (!entry) return null;
    const value: unknown = JSON.parse(decodeURIComponent(entry.slice(cookieName.length + 1)));
    if (!value || typeof value !== 'object' || !('name' in value) || !('age' in value)) return null;
    const { name, age } = value;
    if (typeof name !== 'string' || !name.trim() || name.length > 50 || typeof age !== 'string') return null;
    const years = Number(age);
    if (!Number.isInteger(years) || years < 1 || years > 120) return null;
    return { name: name.trim(), age: String(years) };
  } catch {
    return null;
  }
}

function setCookie(value: string, maxAge: number) {
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${cookieName}=${value}; Max-Age=${maxAge}; Path=${cookiePath}; SameSite=Lax${secure}`;
  } catch {
    // The experience still works when the browser blocks cookie storage.
  }
}

export function saveProfile(profile: Profile) {
  setCookie(encodeURIComponent(JSON.stringify(profile)), lifetime);
}

export function clearProfile() {
  setCookie('', 0);
}
