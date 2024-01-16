export const ele = {
  form: document.querySelector('form'),
  result_list: document.querySelector('#results'),
  recipe_area: document.querySelector("#recipe"),
  like_list: document.querySelector('.dropdown'),
  basket_list: document.querySelector('#basket'),
  clear_btn: document.querySelector('#clear')
};

// bildirim gönderir

export const notify = (text) => {
  Toastify({
    text,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
}

// loader fonksiyonu

export const renderLoader = (outlet) => {
  outlet.innerHTML = `<div class="wrapper"><div class="honeycomb">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div></div>`;
};
export const renderResults = (results) => {
  // tarif dizisindeki her bir tarif için bir link oluştur ve result list içerisine bu html'leri gönder
  ele.result_list.innerHTML = results.map((recipe) =>
    ` <a href="#${recipe.recipe_id}">
        <div class="img-wrapper">
          <img
            src="${recipe.image_url}"
          />
        </div>
        <div class="info">
          <h4>${recipe.title}</h4>
          <p>${recipe.publisher}</p>
        </div>
      </a>  `
  ).join(' ');
}