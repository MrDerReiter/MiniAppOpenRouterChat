/** @param {{role: string, content: string}[]} context */
export async function saveContext(context) {
  localStorage.setItem("context", JSON.stringify(context));
}
/** @returns {{role: string, content: string}[] | null}*/
export function loadContext() {
  const savedContext = localStorage.getItem("context");
  return savedContext ? JSON.parse(savedContext) : null;
}
/** @param {string} prompt */
export function saveBackupPrompt(prompt) {
  localStorage.setItem("lastPrompt", prompt);
}
/** @returns {string | null}*/
export function loadBackupPrompt() {
  return localStorage.getItem("lastPrompt");
}

export function clear() {
  localStorage.clear();
}