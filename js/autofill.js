(function () {
  Array.prototype.forEach.call(
    document.querySelectorAll("form input[type=password]"),
    function (pass) {
      var form = pass.closest("form");

      var users = Array.prototype.filter.call(
        form.querySelectorAll("input"),
        function (input) {
          return input.type == "text" || input.type == "email";
        }
      );
      var passes = Array.prototype.filter.call(
        form.querySelectorAll("input"),
        function (input) {
          return input.type == "password";
        }
      );

      console.log("[DEBUG] Users length: " + users.length);
      console.log("[DEBUG] Passes length: " + passes.length);
      if (users.length >= 1 && passes.length >= 1) {
        var user = users[0];
        var pass = passes[0];
        console.log("[DEBUG] Sending message to background.js");

        chrome.runtime.onMessage.addListener(function (
          message,
          sender,
          respond
        ) {
          if (message.from == "secpass_background") {
            if (message.action == "secpass_do_fill") {
              console.log("[DEBUG] User data filled!")
              user.value = message.user;
              pass.value = message.pass;
              user.style.backgroundColor = "#edffe3";
              pass.style.backgroundColor = "#edffe3";
            }
          }
        });
        chrome.runtime.sendMessage("", {
          from: "secpass_content_script",
          action: "secpass_fill_available"
        });
      }
    }
  );
})();
