let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and render toys on page load
  fetch("http://localhost:3000/toys")
    .then(resp => resp.json())
    .then(toys => {
      toys.forEach(toy => renderToyCard(toy));
    });

  // Handle form submission
  toyForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = event.target.name.value;
    const image = event.target.image.value;

    const newToy = {
      name,
      image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(resp => resp.json())
      .then(toy => {
        renderToyCard(toy);
        toyForm.reset();
      });
  });

  // Render toy card to DOM
  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    toyCollection.appendChild(card);

    // Handle like button
    const likeBtn = card.querySelector("button");
    likeBtn.addEventListener("click", () => {
      const newLikes = toy.likes + 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
        .then(resp => resp.json())
        .then(updatedToy => {
          toy.likes = updatedToy.likes;
          card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
        });
    });
  }
});
