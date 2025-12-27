import { token } from "./../token.js"
import { AIAgent, AIRouter } from "./../components/aiAgent.js";
import { isFreeModel, createErrorMessage } from "./../components/helpers.js"


async function renderModelList() {
	try {
		const agent = new AIAgent(token, AIRouter.openRouter);
		const models = await agent.getAIModels(isFreeModel);

		models.forEach(model =>
			page.selector.append(createModelButton(model)));
	}
	catch (error) { document.body.append(createErrorMessage(error)); }
	finally {
		page.spinner.hidden = true;
		page.selector.hidden = false;
	}
}

function createModelButton(model) {
	const button = document.createElement("li");
	button.textContent = model.name.replace(" (free)", "");
	button.onclick = () => location.assign(`chat.html?model=${model.id}`);

	return button;
}


const page = {
	spinner: document.getElementById("spinner"),
	selector: document.getElementById("modelSelector")
};

renderModelList();