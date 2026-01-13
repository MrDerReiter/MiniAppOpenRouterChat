/** @param {Message[]} context */
export async function saveContext(context) {
  localStorage.setItem("context", JSON.stringify(context));
}
/** @returns {?Message[]}*/
export function loadContext() {
  const savedContext = localStorage.getItem("context");
  return savedContext ? JSON.parse(savedContext) : null;
}
/** @param {string} prompt */
export function saveBackupPrompt(prompt) {
  localStorage.setItem("lastPrompt", prompt);
}
/** @returns {?string}*/
export function loadBackupPrompt() {
  return localStorage.getItem("lastPrompt");
}

export function clear() {
  localStorage.clear();
}