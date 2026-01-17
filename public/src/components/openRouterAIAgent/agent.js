export async function getAIModels(options, predicate = null) {
  const httpRequest = {
    method: "GET",
    headers: { Authorization: `Bearer ${options.token}` }
  }

  return fetch(options.url, httpRequest)
    .then(response => {
      if (response.ok) return response.json()
      else throw new Error(`запрос отклонён с кодом ${response.status}`);
    }).then(body => {
      const models = body.data;
      if (predicate) return models.filter(predicate);
      else return models;
    }).catch(error => Promise.reject(error));
}

export async function singleCompletion(prompt, options) {
  const httpRequest = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${options.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ model: options.modelID, prompt: prompt })
  }

  return fetch(options.url, httpRequest)
    .then(response => {
      if (response.ok) return response.json();
      else throw new Error(`Запрос отклонён с кодом ${response.status}.`)
    })
    .then(body => body.choices[0].text)
    .catch(error => Promise.reject(error));
}

export async function chatCompletion(context, options) {
  const httpRequest = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${options.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages: context, model: options.modelID })
  }

  return fetch(options.url, httpRequest)
    .then(response => {
      if (response.ok) return response.json();
      else throw new Error(`запрос отклонён с кодом ${response.status}`);
    })
    .then(body => body.choices[0].message.content)
    .catch(error => Promise.reject(error));
}