var input = document.querySelector(".footer input");
var button = document.querySelector(".footer button");
var messages = document.querySelector(".messages");
if (button && input && messages) {
    button.addEventListener("click", function () {
        var text = input.value.trim();
        if (text) {
            var message = document.createElement("div");
            message.className = "message";
            message.innerHTML = "<span class=\"user\">You:</span> ".concat(text);
            messages.appendChild(message);
            input.value = "";
            messages.scrollTop = messages.scrollHeight;
        }
    });
}
