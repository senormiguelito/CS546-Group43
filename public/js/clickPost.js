const postListBoxes = document.querySelectorAll('.post-list-box');
postListBoxes.forEach(postListBox => {
  postListBox.addEventListener('click', () => {
    const postId = postListBox.getAttribute('data-id');
    if(postId){
      window.location.href = `/post/${postId}`;
    }
  });
});

const projectListBoxes = document.querySelectorAll('.project-list-box');
projectListBoxes.forEach(projectListBox => {
  projectListBox.addEventListener('click', () => {
    const projectId = projectListBox.getAttribute('data-id');
    if(projectId){
      window.location.href = `/projects/${projectId}`;
    }
  });
});

const mmodal = document.getElementById("mmodal");
const closeBtn = document.getElementsByClassName("close")[0];
if (mmodal) {
  document
    .querySelector("a[href='#mmodal']")
    .addEventListener("click", function () {
      console.log("clicked");
      mmodal.style.display = "block";
    });

  closeBtn.addEventListener("click", function () {
    mmodal.style.display = "none";
  });

  document.getElementById("send-btn").addEventListener("click", function () {
    mmodal.style.display = "none";
  });
}

const dropdownContent = document.querySelector(".dropdown-content");

if (dropdownContent) {
  // Add click event listener to close the dropdown content when the send button is clicked
  document.getElementById("send-btn").addEventListener("click", function () {
    dropdownContent.style.display = "none";
  });
}
