const comments = async (event) => {
    event.preventDefault();
    const id = event.target.getAttribute('data-id');

    // Trim and get the value on the comment.
    const user_comment = document.querySelector('.userComment').value.trim();
    var postBody = {
        user_comment: user_comment, 
        post_id: id,
    }
    console.log(user_comment)
    // If comment exists, go to post.
    if (user_comment) {
        const response = await fetch(`/home/${id}`,
        {
            method: 'POST',
            body: JSON.stringify(postBody),
            headers: { 'Content-Type': 'application/json' },
        });

        // If everything is ok, refresh page.
        if (response.ok) {
            console.log('New Comment Created')
            window.location.reload();
        }
        else {
            console.log('Comment failed.')
        }
    }
};

document.querySelector('#commentBtn').addEventListener('click', comments);