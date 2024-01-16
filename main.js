import { categories } from "./scripts/constant.js";
import Search from "./scripts/search.js";
import { ele, notify, renderLoader, renderResults } from "./scripts/ui.js";
import Recipe from "./scripts/recipe.js";
// uuid kütüphanesinden id oluşturma ve import elme
import { v4 } from "https://jspm.dev/uuid";

// class'taki bir veriyi kullanabilmek için class'ın bir örneği alınır

const search = new Search();
const recipe = new Recipe();

// olay izleyecileri

// sayfa yükleme olayını izler
document.addEventListener("DOMContentLoaded", () => {
    const index = Math.floor(Math.random() * categories.length);
    getResults(categories[index]);
});

ele.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = e.target[0].value;
    getResults(query);
});

// sayfa yüklenme ve url'deki ıd nin değişme olayını izle
window.addEventListener("DOMContentLoaded", () => {
    controlUrl();
    renderBasketItems();
});

window.addEventListener("hashchange", controlUrl);

// tarif alnındaki tıklanmma olaylarını izle
ele.recipe_area.addEventListener("click", handleClick);


// FONKSİYONLAR

// Arama sonuçlarını (forma girilen query'yi) alıp ekrana basar

async function getResults(query) {
    if (!query.trim()) {
        return notify("Please add a search term!");
    }

    // arama terimi varsa loaderı(ui.js'de oluşturduğumuz fonksiyon) bas
    renderLoader(ele.result_list);

    try {
        // API'den verileri al
        await search.fetchResults(query.trim());

        if (search.results.error) {
            notify("No items found");
            // loadeı kaldır
            ele.result_list.innerHTML = "";
        } else {
            // gelen sonuçları ekrana bas
            renderResults(search.results.recipes);
        }

        // hata olursa bilgi ver
    } catch (err) {
        notify("Couldn't find recipe with that name.");
        // loadeı kaldır
        ele.result_list.innerHTML = "";
    }
}

// detaylı tarifi alıp ekrana basan fonksiyon

async function controlUrl() {
    // detayı gösterilecek ürünün id'sine erişir
    const id = location.hash.slice(1);

    if (id) {
        // loaderi ekrana bas
        renderLoader(ele.recipe_area);

        // tarif bilgilerini al
        await recipe.getRecipe(id);

        // tarif bilgilerini ekrana bas
        recipe.renderRecipe(recipe.info);
    }
}

let basket = JSON.parse(localStorage.getItem("basket")) || [];
console.log(basket);
function handleClick(e) {
    if (e.target.id === "add-to-cart") {
        // bütün malzemeleri sepete ekle
        recipe.info.ingredients.forEach((title) => {
            // her bir tarif için yeni bir obje oluştur ve id ekle
            const newItem = {
                id: v4(),
                title,
            };
            // id eklenmiş tarifi sepete ekleyecek
            basket.push(newItem);
        });

        // lokal'i güncelle
        localStorage.setItem("basket", JSON.stringify(basket));

        // sepet arayüzünü güncelle
        renderBasketItems();
    }
}

// Basket elemanlarını ekrana basar

function renderBasketItems() {
    ele.basket_list.innerHTML = basket
        .map(
            (i) => `<li data-id=${i.id}>
    <i id="delete-item" class="bi bi-x"></i>
    <span>${i.title}</span>
    </li>`
        )
        .join(" ");
}

ele.clear_btn.addEventListener("click", () => {
    const res = confirm('Sepeti temizlemek istediğinizden emin misiniz?')
    if (res) {
        // sepet dizisini sıfırla
        basket = [];

        // lokali temizle
        localStorage.removeItem('basket');
        // arayüzü temizle
        ele.basket_list.innerHTML = '';
    }
});

// tek tek silme
ele.basket_list.addEventListener("click", (e) => {
    if (e.target.id == "delete-item") {

        // tıklanan elemanın id'sine erişme
        const parent = e.target.parentElement;
        const id = parent.dataset.id;


        // id'sine göre diziyi dön
        basket = basket.filter((i) => i.id !== id)

        // lokale güncel diziyi aktar
        localStorage.setItem('basket', JSON.stringify(basket));

        // arayüzden ilgili elemanı kaldır
        parent.remove();

    }
})
