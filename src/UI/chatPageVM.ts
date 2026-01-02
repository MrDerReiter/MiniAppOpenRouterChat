import { createErrorMessage } from "../components/helpers.js";
import { marked as parser } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";


export class ChatPageVM {
	public spinner = document.getElementById("spinner") as HTMLDivElement;
	public promptPanel = document.getElementById("prompt") as HTMLTextAreaElement;
	public messagesContainer = document.getElementById("messages-container") as HTMLDivElement;
	public submitButton = document.getElementById("submit-button") as HTMLButtonElement;
	public clearButton = document.getElementById("clear-button") as HTMLButtonElement;


	toggleWaitingMode() {
		this.spinner.hidden = !this.spinner.hidden;
		this.submitButton.disabled = !this.submitButton.disabled;
		this.clearButton.disabled = !this.clearButton.disabled;
	}

	renderQueryDenied() {
		this.promptPanel.style.borderColor = "red";
		this.promptPanel.placeholder = "Вы не написали запрос!";

		this.promptPanel.onfocus = () => {
			this.promptPanel.style.borderColor = "";
			this.promptPanel.placeholder = "";
			this.promptPanel.onfocus = null;
		};
	}

	renderMessages(messages: Array<Message>) {
		messages.forEach(message => {
			if (message.role == "user") {
				const messageBlock = document.createElement("p");
				messageBlock.textContent = message.content;

				this.messagesContainer.append(messageBlock);
				return;
			}

			const messageBlock = document.createElement("div");
			messageBlock.innerHTML = parser.parse(message.content);
			messageBlock.querySelectorAll("table").forEach(table => table.remove());
			this.messagesContainer.append(messageBlock);
		});
	}

	renderNextDialog(prompt: string, answer: string) {
		const userMessage = document.createElement("p");
		const answerMessage = document.createElement("div");

		userMessage.textContent = prompt;
		answerMessage.innerHTML = parser.parse(answer);
		answerMessage.querySelectorAll("table").forEach(table => table.remove());

		this.messagesContainer.append(userMessage, answerMessage);
	}

	renderErrorMessage(error: Error) {
		this.messagesContainer.append(createErrorMessage(error));
	}

	clearErrorMessages() {
		this.messagesContainer.querySelectorAll(".error-response")
			.forEach(errorMessage => errorMessage.remove());
	}

	clearAllMessages() { this.messagesContainer.innerHTML = ""; }

	clearPrompt() { this.promptPanel.value = ""; }
}