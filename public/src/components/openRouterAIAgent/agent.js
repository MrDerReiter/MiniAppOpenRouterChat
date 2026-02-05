export async function getAIModels({ url, token }, predicate) {
  const httpRequest = {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  };

  return fetch(url, httpRequest)
    .then(response => {
      if (response.ok) return response.json();
      else throw new Error(`запрос отклонён с кодом ${response.status}`);
    }).then(body => {
      const models = body.data;
      if (predicate) return models.filter(predicate);
      else return models;
    }).catch(error => Promise.reject(error));
}

export async function singleCompletion({ model, prompt, url, token }) {
  const httpRequest = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ model, prompt })
  };

  return fetch(url, httpRequest)
    .then(response => {
      if (response.ok) return response.json();
      else throw new Error(`Запрос отклонён с кодом ${response.status}.`);
    }).then(body => {
      const answer = body?.choices?.[0].text;
      if (answer) return answer;
      else throw new Error("сервер прислал невалидный ответ");
    }).catch(error => Promise.reject(error));
}

export async function chatCompletion({ messages, model, url, token }) {
  const httpRequest = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages, model })
  };

  return fetch(url, httpRequest)
    .then(response => {
      if (response.ok) return response.json();
      else throw new Error(`запрос отклонён с кодом ${response.status}`);
    }).then(body => {
      const answer = body?.choices?.[0].message.content;
      if (answer) return answer;
      else throw new Error("сервер прислал невалидный ответ");
    }).catch(error => Promise.reject(error));
}