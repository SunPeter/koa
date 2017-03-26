module.exports = {
    url: "/", // TODO: infer from filepath
    controller: controller,
};

function *controller() {
  /*
  var $new = this.datasource;

  var userinfo = yield $new.UserInfo({
    token: TOKEN_HERE
  });
  */

  return {
      name: "Robot",
      greeting: "hello",
    //userinfo: userinfo,
  };
}
