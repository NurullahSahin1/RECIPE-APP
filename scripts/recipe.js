import { ele } from "./ui.js";


export default class Recipe {

    constructor() {
        // tarif hakkındaki bilgiler
        this.info = {};
        // like'lanan tarifler
        this.likes = JSON.parse(localStorage.getItem('likes')) || [];

        this.renderLikeList();
    }

    // api'den tarif bilgilerini alan method
    async getRecipe(id) {
        // id'sine göre tarif detayı alır
        const res = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${id}`)

        // verileri işle
        const data = await res.json();

        // bilgileri class'a tanımlamaya yarar
        this.info = data.recipe

    }

    // tarif bilgilerini ekrana basan method
    renderRecipe(r) {
        ele.recipe_area.innerHTML = `<figure>
    <img src="${r.image_url}">
    <h1>${r.title}</h1>
    <div class="like-area"><i id=like-btn class="bi ${this.isRecipeLiked() ? "bi-heart-fill" : "bi-heart"}"></i></div>
    </figure>

    <div class="ingredients">
    <ul>
   ${this.createIngredients()}   
    </ul>
    <button id="add-to-cart" class="CartBtn">
    <span class="IconContainer">
        <i class="bi bi-cart-check"></i>
    </span>
    <p class="text">Add to Cart</p>
    </button>
    </div>

    <div class="directions">
    <h2> How to cook?</h2>
    <p><span>${r.publisher}</span> prepared this recipe. Harum obcaecati quae totam alias cupiditate
    magnam modi. Sit vero rem aliquam assumenda, rerum praesentium eligendi doloremque cum facilis
    voluptates, sunt totam?</p>
    <a href="${r.publisher_url}" target="_blank">Yönerge</a>

    </div>`;

        // gerekli olay izleyicilerini ekle
        document.querySelector('#like-btn')
            .addEventListener('click', () => this.controlLike());
    }

    // herbir tarif bilgisi için liste elemanı oluşturur
    createIngredients() {
        return this.info.ingredients.map((i) => ` <li>
        <i class="bi bi-check-circle"></i>
        <p>${i}</p>
    </li>`).join("");
    }

    controlLike() {
        const newItem = {
            id: this.info.recipe_id,
            img: this.info.image_url,
            title: this.info.title,
        };

        if (this.isRecipeLiked()) {
            console.log('dizide var');
            this.likes = this.likes.filter((i) => i.id !== newItem.id)
        } else {
            // diziye ekle
            console.log('dizide yok');
            this.likes.push(newItem);

        }

        //  likes dizisini local storage'a aktar

        localStorage.setItem("likes", JSON.stringify(this.likes));

        // Detay arayüzünü güncelleme
        this.renderRecipe(this.info);
        // like listesini güncelle
        this.renderLikeList();
    }

    // ekranda detayı görüntülenen eleman like'lanmış mı
    isRecipeLiked() {

        // eğer ki elemanı bulursa bulduğu elemanı döndürecek bulamazsa undefined döndürecek
        return this.likes.find((i) => i.id === this.info.recipe_id)
    }

    // ekrana like listesini basar

    renderLikeList() {
        ele.like_list.innerHTML = this.likes.map((i) => ` <a href="#${i.id}">
        <img src="${i.img}">
        <span>${i.title}</span>
    </a>`).join(' ');
    }
}