export async function saveContext(context) {
  localStorage.setItem("context", JSON.stringify(context));
}

export function loadContext() {
  const savedContext = localStorage.getItem("context");
  return savedContext ? JSON.parse(savedContext) : null;
}

export function saveBackupPrompt(prompt) {
  localStorage.setItem("lastPrompt", prompt);
}

export function loadBackupPrompt() {
  return localStorage.getItem("lastPrompt");
}

export function clear() {
  localStorage.clear();
}