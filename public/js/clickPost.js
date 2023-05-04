const postListBoxes = document.querySelectorAll('.post-list-box');
postListBoxes.forEach(postListBox => {
  postListBox.addEventListener('click', () => {
    const postId = postListBox.getAttribute('data-id');
    window.location.href = `/post/${postId}`;
  });
});