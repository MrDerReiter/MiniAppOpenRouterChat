export function isFreeModel(model) {
	return model.pricing.prompt == "0" &&
		model.pricing.completion == "0"
}

export function createErrorMessage(error) {
	const errorMessage = document.createElement("p");
	errorMessage.classList.add("error-response");

	const template = document.getElementById("error-message-template");
	errorMessage.append(template.content.cloneNode(true));
	errorMessage.querySelector("span").textContent = error.message;

	return errorMessage;
}