import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { AIAgent, AIRouter } from "./AIAgentJSBundle.js";
import { token } from "./token.js";


async function handleQuery() {
    //#region Локальные функции
    /**
     * @param {Error} error 
     * @param {string} lastPrompt
     */
    function handleError(error, lastPrompt) {
        localStorage.setItem("lastPrompt", lastPrompt);

        const errorMessage = document.createElement("p");
        errorMessage.innerHTML =
            `Что-то пошло не так: <span class="error-message">${error.message}</span>.</br>` +
            "Попробуйте отправить новый запрос, или выберите другую модель.";

        messagesContainer.append(errorMessage);
    }

    function denyQuery() {
        promptPanel.style.borderColor = "red";
        promptPanel.placeholder = "Вы не написали запрос!";

        promptPanel.onfocus = () => {
            promptPanel.style.borderColor = "";
            promptPanel.placeholder = "";
            promptPanel.onfocus = null;
        };
    }
    //#endregion

    toggleWaitingMode();
    const prompt = String(promptPanel.value);

    if (!prompt) {
        denyQuery();
        toggleWaitingMode();
        return;
    }

    try {
        const answer = await agent.chatCompletion(prompt);

        const userMessage = document.createElement("p");
        const answerMessage = document.createElement("div");

        userMessage.textContent = prompt;
        answerMessage.innerHTML = marked.parse(answer);
        answerMessage.querySelectorAll("table").forEach(table => table.remove());

        promptPanel.value = "";
        messagesContainer.append(userMessage, answerMessage);

        new Promise(resolve => {
            localStorage.setItem("context", JSON.stringify(agent.context));
            resolve();
        });
    }
    catch (error) { handleError(error, prompt); }
    finally { toggleWaitingMode(); }
}
/**
 * @param {Object[]} context 
 */
function loadContext(context) {
    function appendMessage(message) {
        if (message.role == "user") {
            const messageBlock = document.createElement("p");
            messageBlock.textContent = message.content;
            messagesContainer.append(messageBlock);
            return;
        }

        const messageBlock = document.createElement("div");
        messageBlock.innerHTML = marked.parse(message.content);
        messageBlock.querySelectorAll("table").forEach(table => table.remove());
        messagesContainer.append(messageBlock);
    }

    agent.context = context;
    agent.context.forEach(appendMessage);
}

function clearContext() {
    toggleWaitingMode();

    agent.clearContext();
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


const params = new URLSearchParams(location.search);
const agent = new AIAgent(token, AIRouter.openRouter);
const lastPrompt = localStorage.getItem("lastPrompt");
const savedContext = localStorage.getItem("context");

const spinner = document.getElementById("spinner");
const submitButton = document.getElementById("submit-button");
const clearButton = document.getElementById("clear-button");
const promptPanel = document.querySelector(".prompt");
const messagesContainer = document.querySelector(".messages-container");

agent.modelID = params.get("model");

if (lastPrompt) promptPanel.value = lastPrompt;
if (savedContext) loadContext(JSON.parse(savedContext));

submitButton.onclick = handleQuery;
clearButton.onclick = clearContext;