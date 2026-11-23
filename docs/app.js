import { config } from "./config.js";
import {
  deleteNotice, isConfigured, isDemo, isTeacher, listNotices,
  restoreSession, saveNotice, signIn, signOut,
} from "./store.js";

const categories = {
  notice: "공지", supplies: "준비물", homework: "숙제", schedule: "일정",
};
const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", year: "numeric", month: "numeric", day: "numeric",
});

const byId = (id) => document.getElementById(id);
const board = byId("notices");
const count = byId("count");
const search = byId("search");
const filters = byId("filters");
const teacher = byId("teacher");
const compose = byId("compose");
const toast = byId("toast");
const loginDialog = byId("login-dialog");
const editorDialog = byId("editor-dialog");
const noticeDialog = byId("notice-dialog");
const deleteDialog = byId("delete-dialog");
const loginForm = byId("login-form");
const editorForm = byId("editor-form");
const editorFields = editorForm.elements;
let notices = [];
let activeFilter = "all";
let selectedId = null;
let editingId = null;
let loaded = false;
let loadFailed = false;
let toastTimer;

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function noticeDate(notice) {
  const date = element("time", "", dateFormat.format(new Date(notice.created_at)));
  date.dateTime = notice.created_at;
  return date;
}

function noticeMeta(notice) {
  const meta = element("span", "notice-meta");
  meta.append(element("span", "badge " + notice.category, categories[notice.category]));
  if (notice.pinned) meta.append(element("span", "badge pin-label", "상단 고정"));
  return meta;
}

function listing(notice) {
  const article = element("article", notice.pinned ? "notice pinned" : "notice");
  const button = element("button");
  button.type = "button";
  const info = element("span");
  const title = element("span", "notice-title", notice.title);
  info.append(noticeMeta(notice), title, element("span", "notice-preview", notice.body));
  const side = element("span", "notice-side");
  const chevron = element("i", "icon icon-chevron");
  chevron.setAttribute("aria-hidden", "true");
  side.append(noticeDate(notice), chevron);
  button.append(info, side);
  button.addEventListener("click", () => openNotice(notice));
  article.append(button);
  return article;
}

function renderBoard() {
  if (!loaded || loadFailed) return;
  const query = search.value.trim().normalize().toLocaleLowerCase("ko");
  const matching = notices.filter((notice) => {
    const categoryMatches = activeFilter === "all" || notice.category === activeFilter;
    const text = [notice.title, notice.body, categories[notice.category]].join(" ");
    return categoryMatches && text.normalize().toLocaleLowerCase("ko").includes(query);
  });

  matching.sort((a, b) => Number(b.pinned) - Number(a.pinned) ||
    Date.parse(b.created_at) - Date.parse(a.created_at) || b.id.localeCompare(a.id));
  count.textContent = matching.length + "개의 알림";
  const emptyText = query ? "검색 결과가 없습니다." : "등록된 알림이 없습니다.";
  board.replaceChildren(...(matching.length ? matching.map(listing) : [element("p", "empty", emptyText)]));
}

async function loadBoard() {
  board.setAttribute("aria-busy", "true");
  count.textContent = "알림을 불러오는 중입니다.";
  try {
    notices = await listNotices();
    loaded = true;
    loadFailed = false;
    renderBoard();
  } catch {
    loadFailed = true;
    count.textContent = "알림을 불러오지 못했습니다.";
    const empty = element("div", "empty", isConfigured ? "잠시 후 다시 시도해 주세요." : "알림장 연결 설정을 확인해 주세요.");
    const retry = element("button", "button outline", "다시 불러오기");
    retry.type = "button";
    retry.addEventListener("click", async () => {
      retry.disabled = true;
      await loadBoard();
    });
    if (isConfigured) empty.append(retry);
    board.replaceChildren(empty);
  } finally {
    board.setAttribute("aria-busy", "false");
  }
}

function updateTeacherControls() {
  const signedIn = isTeacher();
  teacher.replaceChildren();
  if (!signedIn) {
    const lock = element("i", "icon icon-lock");
    lock.setAttribute("aria-hidden", "true");
    teacher.append(lock);
  }
  teacher.append(signedIn ? "로그아웃" : "교사 로그인");
  teacher.disabled = !isConfigured;
  compose.hidden = !signedIn;
  byId("notice-actions").hidden = !signedIn;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.hidden = false;
  toast.textContent = message;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3600);
}

function setError(target, message = "") {
  target.textContent = message;
  target.hidden = !message;
}

async function perform(dialog, button, errorNode, action) {
  if (dialog.dataset.busy) return;
  dialog.dataset.busy = "true";
  button.disabled = true;
  setError(errorNode);
  try {
    await action();
  } catch (error) {
    updateTeacherControls();
    const message = error.name === "TypeError" || error.name === "TimeoutError"
      ? "연결 상태를 확인하고 다시 시도해 주세요."
      : error.message;
    setError(errorNode, message);
  } finally {
    button.disabled = false;
    delete dialog.dataset.busy;
  }
}

function openNotice(notice) {
  selectedId = notice.id;
  const meta = noticeMeta(notice);
  meta.append(noticeDate(notice));
  byId("notice-meta").replaceChildren(meta);
  byId("notice-title").textContent = notice.title;
  byId("notice-body").textContent = notice.body;
  updateTeacherControls();
  noticeDialog.showModal();
}

function openEditor(notice) {
  if (!isTeacher()) {
    updateTeacherControls();
    showToast("교사 계정으로 다시 로그인해 주세요.");
    return;
  }
  editingId = notice?.id ?? null;
  editorForm.reset();
  if (notice) {
    editorFields.namedItem("category").value = notice.category;
    editorFields.namedItem("title").value = notice.title;
    editorFields.namedItem("body").value = notice.body;
    editorFields.namedItem("pinned").checked = notice.pinned;
  }
  byId("editor-title").textContent = editingId ? "알림 수정" : "새 알림 쓰기";
  byId("editor-submit").textContent = editingId ? "저장하기" : "게시하기";
  setError(byId("editor-error"));
  editorDialog.showModal();
  editorFields.namedItem("title").focus();
}

search.addEventListener("input", renderBoard);
filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  for (const item of filters.querySelectorAll("button")) {
    item.setAttribute("aria-pressed", String(item === button));
  }
  renderBoard();
});

for (const dialog of document.querySelectorAll("dialog")) {
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-close]") && !dialog.dataset.busy) dialog.close();
  });
  dialog.addEventListener("cancel", (event) => {
    if (dialog.dataset.busy) event.preventDefault();
  });
}

teacher.addEventListener("click", () => {
  if (isTeacher()) {
    signOut();
    updateTeacherControls();
    showToast("로그아웃했습니다.");
    return;
  }
  loginForm.reset();
  setError(byId("login-error"));
  loginDialog.showModal();
  if (!isDemo) loginForm.elements.namedItem("email").focus();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  perform(loginDialog, byId("login-submit"), byId("login-error"), async () => {
    await signIn(data.get("email")?.trim(), data.get("password"));
    loginForm.reset();
    loginDialog.close();
    updateTeacherControls();
  });
});

compose.addEventListener("click", () => openEditor());
byId("edit").addEventListener("click", () => {
  const notice = notices.find((item) => item.id === selectedId);
  if (!notice) return;
  noticeDialog.close();
  openEditor(notice);
});

editorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(editorForm);
  const values = {
    category: data.get("category"), title: data.get("title").trim(),
    body: data.get("body").trim(), pinned: data.has("pinned"),
  };
  perform(editorDialog, byId("editor-submit"), byId("editor-error"), async () => {
    if (!values.title || !values.body) throw new Error("제목과 내용을 입력해 주세요.");
    const saved = await saveNotice(values, editingId);
    editorDialog.close();
    if (!editingId) {
      search.value = "";
      filters.querySelector('[data-filter="all"]').click();
    }
    if (!loaded || loadFailed) {
      await loadBoard();
    } else {
      notices = [...notices.filter((notice) => notice.id !== saved.id), saved];
      renderBoard();
    }
    compose.focus();
    showToast(editingId ? "알림을 수정했습니다." : "알림을 게시했습니다.");
  });
});

byId("delete").addEventListener("click", () => {
  noticeDialog.close();
  setError(byId("delete-error"));
  deleteDialog.showModal();
});
byId("confirm-delete").addEventListener("click", () => {
  perform(deleteDialog, byId("confirm-delete"), byId("delete-error"), async () => {
    await deleteNotice(selectedId);
    notices = notices.filter((notice) => notice.id !== selectedId);
    deleteDialog.close();
    renderBoard();
    compose.focus();
    showToast("알림을 삭제했습니다.");
  });
});

byId("class-name").textContent = config.className;
byId("footer-class").textContent = config.className + " 알림장";
byId("demo-label").hidden = !isDemo;
byId("login-hint").hidden = !isDemo;
byId("credentials").hidden = isDemo;
if (isDemo) {
  for (const input of byId("credentials").querySelectorAll("input")) input.disabled = true;
  byId("login-title").textContent = "교사 모드 체험";
  byId("login-submit").textContent = "체험 시작";
}
restoreSession().then(updateTeacherControls);
loadBoard();
