import { createErrorMessage } from "../components/helpers.js";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";


export class ChatPageVM {
	/** @type {HTMLDivElement} */
	spinner = document.getElementById("spinner");
	/** @type {HTMLTextAreaElement} */
	promptPanel = document.getElementById("prompt");
	/** @type {HTMLDivElement} */
	messagesContainer = document.getElementById("messages-container");
	/** @type {HTMLButtonElement} */
	submitButton = document.getElementById("submit-button");
	/** @type {HTMLButtonElement} */
	clearButton = document.getElementById("clear-button");


	toggleWaitingMode() {
		this.spinner.hidden = !this.spinner.hidden;
		this.submitButton.disabled = !this.submitButton.disabled;
		this.clearButton.disabled = !this.clearButton.disabled;
	}

	renderQueryDenied() {
		this.promptPanel.style.borderColor = "red";
		this.promptPanel.placeholder = "Вы не написали запрос!";

		this.promptPanel.onfocus = (event) => {
			event.target.style.borderColor = "";
			event.target.placeholder = "";
			event.target.onfocus = null;
		};
	}
	/** @param {Object[]} messages */
	renderMessages(messages) {
		messages.forEach(message => {
			if (message.role == "user") {
				const messageBlock = document.createElement("p");
				messageBlock.textContent = message.content;

				this.messagesContainer.append(messageBlock);
				return;
			}

			const messageBlock = document.createElement("div");
			messageBlock.innerHTML = marked.parse(message.content);
			messageBlock.querySelectorAll("table").forEach(table => table.remove());
			this.messagesContainer.append(messageBlock);
		});
	}
	/**
	 * @param {String} prompt
	 * @param {String} answer
	 */
	renderNextDialog(prompt, answer) {
		const userMessage = document.createElement("p");
		const answerMessage = document.createElement("div");

		userMessage.textContent = prompt;
		answerMessage.innerHTML = marked.parse(answer);
		answerMessage.querySelectorAll("table").forEach(table => table.remove());

		this.messagesContainer.append(userMessage, answerMessage);
	}
	/** @param {Error} error */
	renderErrorMessage(error) {
		this.messagesContainer.append(createErrorMessage(error));
	}

	clearErrorMessages() {
		this.messagesContainer.querySelectorAll(".error-response")
			.forEach(errorMessage => errorMessage.remove());
	}

	clearAllMessages() { this.messagesContainer.innerHTML = ""; }

	clearPrompt() { this.promptPanel.value = ""; }
}