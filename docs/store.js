import { config } from "./config.js";
import { demoKey, demoNotices } from "./demo.js";

const { supabaseUrl, supabasePublishableKey } = config;
export const isDemo = !supabaseUrl && !supabasePublishableKey;
export const isConfigured = isDemo || (
  /^https:\/\/[^/]+\/?$/.test(supabaseUrl) &&
  /^sb_publishable_[\w-]+$/.test(supabasePublishableKey)
);
const apiUrl = supabaseUrl.replace(/\/$/, "");
const sessionKey = "class-notice-session:" + apiUrl;
let session = null;

export function isTeacher() {
  return isDemo ? Boolean(session) : Boolean(session && session.expiresAt > Date.now());
}

export async function restoreSession() {
  if (isDemo || !isConfigured) return;
  try {
    const cached = JSON.parse(sessionStorage.getItem(sessionKey));
    if (cached?.token && cached.expiresAt > Date.now()) {
      await verifyTeacher(cached.token);
      session = cached;
    }
  } catch {
    session = null;
  }
}

async function request(path, { method = "GET", payload, token, prefer } = {}) {
  if (!isConfigured) throw new Error("알림장 연결 설정을 확인해 주세요.");
  const headers = { apikey: supabasePublishableKey };
  if (token) headers.Authorization = "Bearer " + token;
  if (payload) headers["Content-Type"] = "application/json";
  if (prefer) headers.Prefer = prefer;

  const response = await fetch(apiUrl + path, {
    method, headers,
    body: payload ? JSON.stringify(payload) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    const error = new Error("알림장 서버 요청에 실패했습니다.");
    error.status = response.status;
    throw error;
  }
  if (response.status !== 204) return response.json();
}

async function verifyTeacher(token) {
  const teachers = await request("/rest/v1/class_teachers?select=user_id&limit=1", { token });
  if (teachers.length === 0) throw new Error("알림장에 등록된 교사 계정만 로그인할 수 있습니다.");
}

export async function signIn(email, password) {
  if (isDemo) {
    session = {};
    return;
  }
  let result;
  try {
    result = await request("/auth/v1/token?grant_type=password", {
      method: "POST", payload: { email, password },
    });
  } catch (error) {
    if (error.status === 400 || error.status === 401) {
      throw new Error("이메일과 비밀번호를 확인해 주세요.");
    }
    throw error;
  }

  await verifyTeacher(result.access_token);
  session = {
    token: result.access_token,
    expiresAt: result.expires_at ? result.expires_at * 1000 : Date.now() + result.expires_in * 1000,
  };
  try {
    sessionStorage.setItem(sessionKey, JSON.stringify(session));
  } catch {
    // The current tab can still use the in-memory session.
  }
}

export function signOut() {
  session = null;
  try {
    sessionStorage.removeItem(sessionKey);
  } catch {
    // Storage may be disabled in this browser.
  }
}

export async function listNotices() {
  if (isDemo) return demoNotices();

  const notices = [];
  const pageSize = 100;
  for (let offset = 0; ; offset += pageSize) {
    const page = await request(
      "/rest/v1/class_notices?select=id,category,title,body,pinned,created_at" +
      "&order=pinned.desc,created_at.desc,id.desc&limit=" + pageSize + "&offset=" + offset,
    );
    notices.push(...page);
    if (page.length < pageSize) return notices;
  }
}

async function changeNotice(id, method, payload) {
  if (!isTeacher()) {
    signOut();
    throw new Error("로그인 시간이 끝났습니다. 다시 로그인해 주세요.");
  }
  const filter = id ? "?id=eq." + encodeURIComponent(id) : "";
  let rows;
  try {
    rows = await request("/rest/v1/class_notices" + filter, {
      method, payload, token: session.token, prefer: "return=representation",
    });
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      signOut();
      throw new Error("교사 권한을 확인할 수 없습니다. 다시 로그인해 주세요.");
    }
    throw error;
  }
  if (!rows.length) throw new Error("알림을 찾을 수 없습니다. 페이지를 새로고침해 주세요.");
  return rows[0];
}

export async function saveNotice(values, id) {
  if (!isDemo) return changeNotice(id, id ? "PATCH" : "POST", values);
  const notices = demoNotices();
  const previous = id ? notices.find((notice) => notice.id === id) : null;
  if (id && !previous) throw new Error("알림을 찾을 수 없습니다. 페이지를 새로고침해 주세요.");
  const saved = {
    ...values,
    id: id ?? crypto.randomUUID(),
    created_at: previous?.created_at ?? new Date().toISOString(),
  };
  const remaining = notices.filter((notice) => notice.id !== saved.id);
  localStorage.setItem(demoKey, JSON.stringify([...remaining, saved]));
  return saved;
}

export async function deleteNotice(id) {
  if (!isDemo) return changeNotice(id, "DELETE");
  const notices = demoNotices().filter((notice) => notice.id !== id);
  localStorage.setItem(demoKey, JSON.stringify(notices));
}
