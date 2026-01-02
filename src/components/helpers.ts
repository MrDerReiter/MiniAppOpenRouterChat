export function isFreeModel(model: AIModelInfo) {
	return model.pricing.prompt == "0" &&
		model.pricing.completion == "0";
}

export function createErrorMessage(error: Error) {
	const errorMessage = document.createElement("p");
	const template = document.getElementById("error-message-template") as HTMLTemplateElement;

	errorMessage.classList.add("error-response");
	errorMessage.innerHTML = template.innerHTML.replace("ErrorText", error.message);
	return errorMessage;
}
