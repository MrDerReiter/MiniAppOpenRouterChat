import { createErrorMessage } from "../components/helpers.js";
import { marked as markupParser } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import * as storage from "./../components/storage.js";


const spinner = document.getElementById("spinner");
const promptPanel = document.getElementById("prompt");
const messagesContainer = document.getElementById("messages-container");
const submitButton = document.getElementById("submit-button");
const clearButton = document.getElementById("clear-button");


export function init(aiAnswerSource) {
  toggleWaitingMode();

  const lastPrompt = storage.loadBackupPrompt();
  const context = storage.loadContext();

  if (lastPrompt) promptPanel.value = lastPrompt;
  if (context) context.forEach(renderMessage);

  submitButton.onclick = () => renderQuery(aiAnswerSource);
  clearButton.onclick = clearContextView;

  toggleWaitingMode();
}

async function renderQuery(getAnswer) {
  let prompt = promptPanel.value;
  if (!prompt) {
    renderQueryDenied();
    return;
  }

  toggleWaitingMode();
  try {
    let context = storage.loadContext();
    let answer = await getAnswer(prompt, context);
    promptPanel.value = "";
    clearErrorMessages();
    renderNextDialog(prompt, answer);

    prompt = { role: "user", content: prompt };
    answer = { role: "assistant", content: answer };
    storage.saveContext(context ? [...context, prompt, answer] : [prompt, answer]);
  } catch (error) {
    storage.saveBackupPrompt(promptPanel.value);
    messagesContainer.querySelectorAll(".error-response")
      .forEach(errorMessage => errorMessage.remove());

    messagesContainer.append(createErrorMessage(error));
  } finally { toggleWaitingMode(); }
}

function renderQueryDenied() {
  promptPanel.style.borderColor = "red";
  promptPanel.placeholder = "Вы не написали запрос!";

  promptPanel.onfocus = function () {
    this.style.borderColor = "";
    this.placeholder = "";
    this.onfocus = null;
  };
}

function renderNextDialog(prompt, answer) {
  const userMessage = document.createElement("p");
  const answerMessage = document.createElement("div");

  userMessage.textContent = prompt;
  answerMessage.innerHTML = markupParser.parse(answer);
  answerMessage.querySelectorAll("table").forEach(table => table.remove());

  messagesContainer.append(userMessage, answerMessage);
}

function renderMessage(message) {
  if (message.role == "user") {
    const messageBlock = document.createElement("p");
    messageBlock.textContent = message.content;

    messagesContainer.append(messageBlock);
    return;
  }

  const messageBlock = document.createElement("div");
  messageBlock.innerHTML = markupParser.parse(message.content);
  messageBlock.querySelectorAll("table").forEach(table => table.remove());
  messagesContainer.append(messageBlock);
}

function clearErrorMessages() {
  messagesContainer.querySelectorAll(".error-response")
    .forEach(errorMessage => errorMessage.remove());
}

function clearContextView() {
  toggleWaitingMode();

  storage.clear();
  promptPanel.value = "";
  messagesContainer.innerHTML = "";

  toggleWaitingMode();
}

function toggleWaitingMode() {
  spinner.hidden = !spinner.hidden;
  submitButton.disabled = !submitButton.disabled;
  clearButton.disabled = !clearButton.disabled;
}