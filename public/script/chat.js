import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { AIAgent, AIRouter } from "./AIAgentJSBundle.js";
import { token } from "./token.js";


async function handleQuery() {
    function handleError(error) {
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
            promptPanel.style.borderColor = "#eee";
            promptPanel.placeholder = "";
            promptPanel.onfocus = null;
        }

        spinner.hidden = true;
        submitButton.disabled = false;
        clearButton.disabled = false;
    }

    spinner.hidden = false;
    submitButton.disabled = true;
    clearButton.disabled = true;

    const prompt = promptPanel.value;
    if (!prompt) {
        denyQuery();
        return;
    }

    try {
        const answer = await agent.chatCompletion(prompt);
        localStorage.setItem("context", JSON.stringify(agent.context));

        const userMessage = document.createElement("p");
        const answerMessage = document.createElement("div");

        userMessage.textContent = prompt;
        answerMessage.innerHTML = marked.parse(answer);
        answerMessage.querySelectorAll("table").forEach(table => table.remove());

        promptPanel.value = "";
        messagesContainer.append(userMessage, answerMessage);
    }
    catch (error) { handleError(error); }
    finally {
        spinner.hidden = true;
        submitButton.disabled = false;
        clearButton.disabled = false;
    }
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
    submitButton.disabled = true;
    clearButton.disabled = true;

    agent.clearContext();
    localStorage.setItem("context", "");
    messagesContainer.innerHTML = "";

    submitButton.disabled = false;
    clearButton.disabled = false;
}


const params = new URLSearchParams(location.search);
const agent = new AIAgent(token, AIRouter.openRouter);
const savedContext = localStorage.getItem("context");

const spinner = document.getElementById("spinner");
const submitButton = document.getElementById("submit-button");
const clearButton = document.getElementById("clear-button");
const promptPanel = document.querySelector(".prompt");
const messagesContainer = document.querySelector(".messages-container");

agent.modelID = params.get("model");
if (savedContext) loadContext(JSON.parse(savedContext));

submitButton.onclick = handleQuery;
clearButton.onclick = clearContext;