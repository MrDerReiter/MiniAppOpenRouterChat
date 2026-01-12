import { createErrorMessage } from "../components/helpers.js";


const selector = document.getElementById("modelSelector");
const spinner = document.getElementById("spinner");

/** @param {() => Promise<Object[]>} getAIModels */
export async function init(getAIModels) {
  try {
    const models = await getAIModels();
    models.forEach(model => selector.append(createModelButton(model)));
  }
  catch (error) { showErrorMessage(error); }
  finally {
    spinner.hidden = true;
    selector.hidden = false;
  }
}
/** @param {Error} error */
function showErrorMessage(error) { document.body.append(createErrorMessage(error)) };
/** @param {{id: string, name: string}} model */
function createModelButton(model) {
  const button = document.createElement("li");
  button.textContent = model.name.replace(" (free)", "");
  button.onclick = () => location.assign(`chat.html?model=${model.id}`);

  return button;
}