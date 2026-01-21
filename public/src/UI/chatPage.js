import { createErrorMessage } from "../components/helpers.js";
import { marked as markupParser } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";


const spinner = document.getElementById("spinner");
const promptPanel = document.getElementById("prompt");
const messagesContainer = document.getElementById("messages-container");
const submitButton = document.getElementById("submit-button");
const clearButton = document.getElementById("clear-button");


export function init(aiAnswerSource) {
  toggleWaitingMode();

  const lastPrompt = localStorage.getItem("lastPrompt");
  const savedContext = localStorage.getItem("context");
  const context = savedContext ? JSON.parse(savedContext) : null;

  if (lastPrompt) promptPanel.value = lastPrompt;
  if (context) context.forEach(renderMessage);

  submitButton.onclick = () => renderQuery(aiAnswerSource);
  clearButton.onclick = clearContextView;

  toggleWaitingMode();
}

async function renderQuery(getAnswer) {
  const prompt = promptPanel.value;
  if (!prompt) {
    renderQueryDenied();
    return;
  }

  toggleWaitingMode();
  try {
    const savedContext = localStorage.getItem("context");
    const context = savedContext ? JSON.parse(savedContext) : null;
    const answer = await getAnswer(prompt, context);
    promptPanel.value = "";
    clearErrorMessages();
    renderNextDialog(prompt, answer);

    const promptMessage = { role: "user", content: prompt };
    const answerMessage = { role: "assistant", content: answer };
    queueMicrotask(() => {
      localStorage.removeItem("lastPrompt");
      localStorage.setItem("context", JSON.stringify(context ?
        [...context, promptMessage, answerMessage] :
        [promptMessage, answerMessage]));
    });

  } catch (error) {
    localStorage.setItem("lastPrompt", promptPanel.value);
    clearErrorMessages();
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

  localStorage.clear();
  promptPanel.value = "";
  messagesContainer.innerHTML = "";

  toggleWaitingMode();
}

function toggleWaitingMode() {
  spinner.hidden = !spinner.hidden;
  submitButton.disabled = !submitButton.disabled;
  clearButton.disabled = !clearButton.disabled;
}