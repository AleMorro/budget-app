const K = "budgetApp_v1_userProfile";

function safeParse(json, fallback) {
   try {
      if (!json) return fallback;
      return JSON.parse(json);
   } catch {
      return fallback;
   }
}

const DEFAULT = { displayName: "", avatarDataUrl: null, theme: "light" };

export function loadUserProfile() {
   return { ...DEFAULT, ...safeParse(localStorage.getItem(K), {}) };
}

export function saveUserProfile(profile) {
   localStorage.setItem(K, JSON.stringify({ ...DEFAULT, ...profile }));
}

export function applyTheme(theme) {
   const t = theme === "dark" ? "dark" : "light";
   document.documentElement.setAttribute("data-theme", t);
   document.documentElement.setAttribute("data-bs-theme", t);
   return t;
}
