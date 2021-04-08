const commentsHandler = async (event) => {
  console.log(event);
  event.preventDefault();
  const id = document.querySelector("#comment-content").getAttribute("data-id");

  // Trim and get the value on the comment.
  const user_comment = document.querySelector("#comment-content").value.trim();
  var comment = {
    content: user_comment,
    blog_id: id,
  };
  console.log(user_comment);
  // If comment exists, go to post.
  if (user_comment) {
    const response = await fetch(`/api/comment/${id}`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: { "Content-Type": "application/json" },
    });

    // If everything is ok, refresh page.
    if (response.ok) {
      window.location.replace(`/blog/${id}`);
    } else {
      sweetAlert.fire({
        title: "New comment not created",
        // text: response.statusText,
        icon: "warning",
      });
    }
  }
};

document.querySelectorAll(".new-comment-form").forEach(function (element) {
  element.addEventListener("submit", commentsHandler);
});
