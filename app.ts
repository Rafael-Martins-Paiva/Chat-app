const input = document.querySelector<HTMLInputElement>(".footer input");
const button = document.querySelector<HTMLButtonElement>(".footer button");
const messages = document.querySelector<HTMLElement>(".messages");

if (button && input && messages) {
  button.addEventListener("click", () => {
    const text = input.value.trim();
    if (text) {
      const message = document.createElement("div");
      message.className = "message";
      message.innerHTML = `<span class="user">You:</span> ${text}`;
      messages.appendChild(message);
      input.value = "";
      messages.scrollTop = messages.scrollHeight;
    }
  });
}
