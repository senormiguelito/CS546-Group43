let message = document.getElementById("message");
let m = document.getElementById("m");
let desc = document.getElementById("desc");
message.addEventListener("click", () => {
    console.log("message clicked");
    m.innerHTML = desc.innerHTML;
});
