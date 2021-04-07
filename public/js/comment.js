const commentsHandler = async (event) => {
    event.preventDefault();
    const id = event.target.getAttribute('data-id');

    // Trim and get the value on the comment.
    const user_comment = document.querySelector('.commentBtn').value.trim();
    var comment = {
        user_comment: user_comment, 
        blog_id: id,
    }
    console.log(user_comment)
    // If comment exists, go to post.
    if (user_comment) {
        const response = await fetch(`/blog/${id}`,
        {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: { 'Content-Type': 'application/json' },
        });

        // If everything is ok, refresh page.
        if (response.ok) {
            alert("New comment created");
            window.location.reload();
        }
        else {
            sweetAlert.fire( {
                title: "New comment not created",
                // text: response.statusText,
                icon: "warning"
              })
        }
    }
};

document.querySelectorAll(".commentBtn").forEach(function (element) {
    element.addEventListener("click", commentsHandler);
  });