// Задание 5
// Написать код приложения, интерфейс которого состоит из двух input и кнопки. В input можно ввести любое число. Заголовок первого input — «номер страницы». Заголовок второго input — «лимит». Заголовок кнопки — «запрос».

// При клике на кнопку происходит следующее:

// Если число в первом input не попадает в диапазон от 1 до 10 или не является числом — выводить ниже текст «Номер страницы вне диапазона от 1 до 10». Если число во втором input не попадает в диапазон от 1 до 10 или не является числом — выводить ниже текст «Лимит вне диапазона от 1 до 10». Если и первый, и второй input не в диапазонах или не являются числами — выводить ниже текст «Номер страницы и лимит вне диапазона от 1 до 10».
// Если числа попадают в диапазон от 1 до 10 — сделать запрос по URL https://picsum.photos/v2/list?page=1&limit=10, где GET-параметр page — это число из первого input, а GET-параметр limit — это введённое число второго input.
// Пример: если пользователь ввёл 5 и 7, то запрос будет вида https://picsum.photos/v2/list?page=5&limit=7.

// После получения данных вывести список картинок на экран.

// Если пользователь перезагрузил страницу, то ему должны показываться картинки из последнего успешно выполненного запроса (использовать localStorage).

const btn = document.querySelector("button");
const input1 = document.querySelector(".page");
const input2 = document.querySelector(".limit");
const resultNode = document.querySelector(".result");

document.addEventListener("DOMContentLoaded", () => {
  storageItem = localStorage.getItem("lastResponse");
  if (storageItem) {
    showResult(JSON.parse(storageItem));
  }
});

function showError(msg) {
  elem = document.createElement("p");
  elem.textContent = msg;
  resultNode.append(elem);
  resultNode.style.display = "block";
}

const useRequest = (page, limit) => {
  const url = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
  return fetch(url)
    .then((response) => {
      return response;
    })
    .then((data) => {
      result = data.json();
      return result;
    })
    .catch(() => {
      console.log("error");
    });
};

function showResult(apiData) {
  let cards = "";
  apiData.forEach((item) => {
    const cardBlock = `
            <div class="card">
                <img class="card-image" src="${item.download_url}">
                <p>${item.author}</p>
            </div>
        `;
    cards += cardBlock;
  });

  resultNode.innerHTML = cards;
  resultNode.style.display = "flex";
}

btn.addEventListener("click", async () => {
  const page = Number(input1.value);
  const limit = Number(input2.value);
  const pageError = isNaN(page) || page < 1 || page > 10;
  const limitError = isNaN(limit) || limit < 1 || limit > 10;

  if (pageError) {
    showError("Номер страницы вне диапазона от 1 до 10");
  }
  if (limitError) {
    showError("Лимит вне диапазона от 1 до 10");
  }
  if (pageError && limitError) {
    showError("Номер страницы и лимит вне диапазона от 1 до 10");
  }
  if (!pageError && !limitError) {
    const requestResult = await useRequest(page, limit);
    localStorage.setItem("lastResponse", JSON.stringify(requestResult));
    showResult(requestResult);
  }
});
