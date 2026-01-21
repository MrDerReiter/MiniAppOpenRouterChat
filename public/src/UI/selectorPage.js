import { createErrorMessage } from "../components/helpers.js";


const selector = document.getElementById("modelSelector");
const spinner = document.getElementById("spinner");


export async function init(AIModelsSource) {
  try {
    const models = await AIModelsSource();
    models.forEach(model => selector.append(ModelButton(model)));
  } catch (error) {
    document.body.append(createErrorMessage(error));
  } finally {
    spinner.hidden = true;
    selector.hidden = false;
  }
}

function ModelButton(model) {
  const button = document.createElement("li");
  button.textContent = model.name.replace(" (free)", "");
  button.onclick = () => location.assign(`chat.html?model=${model.id}`);

  return button;
}