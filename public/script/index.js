import { AIAgent, AIRouter } from "./AIAgentJSBundle.js";
import { token } from "./token.js";


const spinner = document.getElementById("spinner");
const selector = document.getElementById("modelSelector");

try {
    const agent = new AIAgent(token, AIRouter.openRouter);
    const models = await agent.getAIModels
        (model => model.pricing.prompt == "0" && model.pricing.completion == "0");

    models.forEach(model => {
        const button = document.createElement("li");
        button.textContent = model.name.replace(" (free)", "");
        button.onclick = () => location.assign(`chat.html?model=${model.id}`);

        selector.append(button);
    });
} catch (error) {
    const errorMessage = document.createElement("li");
    errorMessage.innerHTML =
        `Что-то пошло не так: <span class="error-message">${error.message}</span>.</br>` +
        "Проверьте соединение с интернетом и/или попробуйте обновить страницу.";
    selector.append(errorMessage);
} finally {
    spinner.hidden = true;
    selector.hidden = false;
}