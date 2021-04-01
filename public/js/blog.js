const newFormHandler = async (event) => {
  event.preventDefault();
  const name = document.querySelector("#blog-name").value.trim();
  const content = document.querySelector("#blog-content").value.trim();

  if (name && content) {
    const response = await fetch(`/api/blog`, {
      method: "POST",
      body: JSON.stringify({ name, content }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      alert("new post created!");
      document.location.replace("/dashboard");
      window.location.reload();
    } else {
      alert("Failed to create project");
    }
  }
};

const delButtonHandler = async (event) => {
  event.preventDefault();
  const id = event.target.getAttribute("data-id");

  const response = await fetch(`/api/blog/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("post deleted");
    document.location.replace("/dashboard");
  } else {
    alert("Failed to delete project");
  }
};

document
  .querySelector(".new-blog-form")
  .addEventListener("click", newFormHandler);

document.querySelectorAll(".blogs-list").forEach(function (element) {
  element.addEventListener("click", delButtonHandler);
});
// document
//   .querySelectorAll('.blogs-list').addEventListener('click', delButtonHandler);
