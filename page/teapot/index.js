module.exports = {
    url: "/teapot",
    controller: function *() {
        this.status = 418;
    }
};
