class User {
    constructor(name, message) {
        this.name = name;
        this.timestamp = this.getDate();
        this.message = message;
    }

    getDate() {
        let date = new Date();
        let day = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return `${day} ${time}`;
    }
}

module.exports = { User };