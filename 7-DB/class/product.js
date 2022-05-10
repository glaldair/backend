class Product {
    constructor( id, name, price, image, description, details, code, stock, category, subcategory, status ) {
        this.id = parseInt(id);
        this.name = name;
        this.timestamp = new Promise((resolve, reject) => resolve(this.gettimestamp())).then(timestamp => this.timestamp = timestamp );
        this.price = parseFloat(price);
        this.image = image;
        this.description = description;
        this.details = details;
        this.code = code;
        this.stock = parseFloat(stock);
        this.category = category;
        this.subcategory = subcategory;
        this.status = status;
    }
    async gettimestamp() {
        let date = new Date();
        let dateDay = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        let hour = `${date.getHours()}:${date.getMinutes()}`;
        let finalDate = `${dateDay} ${hour}`;
        return finalDate;
    }
}

module.exports = { Product };