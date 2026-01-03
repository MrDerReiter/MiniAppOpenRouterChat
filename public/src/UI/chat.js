import { token } from "./../token.js";
import { ChatPageVM } from "./chatPageVM.js";
import { AIAgent, AIRouter } from "./../components/openRouterAIAgent/index.js";


async function handleQuery() {
	page.toggleWaitingMode();
	const prompt = page.promptPanel.value;

	if (!prompt) {
		page.renderQueryDenied();
		page.toggleWaitingMode();
		return;
	}

	try {
		const answer = await agent.chatCompletion(prompt);

		page.clearPrompt();
		page.clearErrorMessages();
		page.renderNextDialog(prompt, answer);

		new Promise(resolve => {
			localStorage.removeItem("lastPrompt");
			localStorage.setItem("context", JSON.stringify(agent.context));
			resolve();
		});
	}
	catch (error) { handleError(error, prompt); }
	finally { page.toggleWaitingMode(); }
}
/**
 * @param {Error} error
 * @param {String} lastPrompt
 */
function handleError(error, lastPrompt) {
	localStorage.setItem("lastPrompt", lastPrompt);
	page.clearErrorMessages();
	page.renderErrorMessage(error);
}
/** @param {Object[]} context */
function loadContext(context) {
	agent.loadContext(context);
	page.renderMessages(context);
}

function clearContext() {
	page.toggleWaitingMode();

	localStorage.clear();
	agent.clearContext();

	page.clearPrompt();
	page.clearAllMessages();

	page.toggleWaitingMode();
}


const page = new ChatPageVM();
const params = new URLSearchParams(location.search);
const lastPrompt = localStorage.getItem("lastPrompt");
const savedContext = localStorage.getItem("context");

const agent = new AIAgent(token, AIRouter.openRouter);
agent.modelID = params.get("model");

if (lastPrompt) page.promptPanel.value = lastPrompt;
if (savedContext) loadContext(JSON.parse(savedContext));

page.submitButton.onclick = handleQuery;
page.clearButton.onclick = clearContext;