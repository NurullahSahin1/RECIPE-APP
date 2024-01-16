export default class Search {
    constructor() {
        // sonuçlar. Class içinde bir değişken tanımlarken const yerine this kullanılır
        this.results = [];

        // API'den arama sonuçlarını alan bir method
    }
    async fetchResults(query) {
        try {
            const res = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${query}`);

            // gelen cevabı işle
            const data = await res.json();

            //    sınıf içerisindeki değişkene API'den gelen veriyi aktar
            this.results = data;
        } catch (err) {
            console.log(err);
        }
    }


}