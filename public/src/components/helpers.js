/** @param {{id: string, name: string, pricing: {prompt: string, completion: string}}} model */
export function isFreeModel(model) {
	return model.pricing.prompt == "0" &&
		model.pricing.completion == "0"
}
/** @param {Error} error */
export function createErrorMessage(error) {
	const errorMessage = document.createElement("p");
	const template = document.getElementById("error-message-template");

	errorMessage.classList.add("error-response");
	errorMessage.innerHTML = template.innerHTML.replace("ErrorText", error.message);
	return errorMessage;
}