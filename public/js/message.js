let message = document.getElementById("message");
let m = document.getElementById("m");
let desc = document.getElementById("desc");
if (message) {
  message.addEventListener("click", () => {
    if (desc) {
      m.innerHTML = desc.innerHTML;
    }
  });
}
