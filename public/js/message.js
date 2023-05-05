let message = document.getElementById("message");
let m = document.getElementById("m");
let desc = document.getElementById("desc");
if(message){
    message.addEventListener("click", () => {
        console.log("message clicked");
        m.innerHTML = desc.innerHTML;
    });
}

function ClickMessage(element) {
    // remove highlight from previously selected message
    let prevSelected = document.querySelector(".selected");
    if (prevSelected) {
      prevSelected.classList.remove("selected");
    }
    element.classList.add("selected");
  }