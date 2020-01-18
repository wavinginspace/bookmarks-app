import store from './store.js';
import api from './api.js';


const generateBookmarkItem = function (item) {
  if (item.expanded) {
    return `<li class="bookmark expanded" data-item-id="${item.id}" tabindex="0">
  <div class="title-rating-expanded">
  <span class="bookmark-title-expanded">${item.title}</span>
  <span class="bookmark-rating-expanded">Rated ${item.rating}/5</span>
  </div>
  <p>Description: ${item.description}</p>
  <a href = "${item.url}" target = "_blank">${item.url}</a>
  <button class="delete-bookmark">Delete Bookmark</button>
</li>`;
  }
  return `<li class="bookmark" data-item-id="${item.id}" tabindex="0">
      <span class="bookmark-title">${item.title}</span>
      <span class="bookmark-rating">rating ${item.rating}/5</span>
    </li>`;
};

const generateBookmarkListString = function (bookmarks) {
  const items = bookmarks.map((item) => generateBookmarkItem(item));
  
  return items.join('');
};

const generateError = function (message) {
  return `
  <div class="container">

  <header>
    <h1>My Bookmarks</h1>
  </header>

  <section class="error-view">

    <p class="error-message">There's been an error: ${message}</p>
    <button class="error-return">Return to bookmarks list</button>

  </section>

  </div>`;
};

const generateInitialView = function() {
  const bookmarkListString = generateBookmarkListString(store.bookmarkList);

  return `<div class="container">

  <header>
    <h1>My Bookmarks</h1>
  </header>

  <section class="initial-view-buttons">
    <button class="add-new-button">Add New Bookmark</button>
    <form id="bookmarks-form"></form>
    <label for="filter-dropdown"></label>
      <select name="ratings" id="filter-dropdown">
        <option value="0">Filter By Rating</option>
        <option value="5">&#9733; &#9733; &#9733; &#9733; &#9733;</option>
        <option value="4">&#9733; &#9733; &#9733; &#9733; or more</option>
        <option value="3">&#9733; &#9733; &#9733; or more</option>
        <option value="2">&#9733; &#9733; or more</option>
        <option value="1">&#9733; or more</option>
      </select>
    </form>
  </section>

  <section class="bookmarks-list-section">
    <ul class="bookmarks-list">
    ${bookmarkListString}
    </ul>
  </section>

</div>
`;
};

const generateAddBookmarkView = function() {
  return `<div class="container">

<header>
  <h1>My Bookmarks</h1>
</header>

<section class="add-bookmark-view">

  <form id="add-new-bookmark-form" autocomplete="off">

    <label class="new-bookmark-label" for="new-bookmark-title">Add new bookmark title:</label>
    <input class="new-bookmark-input" type="text" name="title" placeholder="New bookmark" id="new-bookmark-title" required>

    <label class="new-bookmark-label" for="new-bookmark-url"> Enter bookmark url: </label>
    <input class="new-bookmark-input" type="text" name="url" placeholder="https://www.newbookmark.com" id="new-bookmark-url">

    <label class="new-bookmark-label" for="new-bookmark-rating">Add bookmark rating:</label>
    <span>
    <select class="new-bookmark-rating" name="add-rating" id="new-bookmark-rating">
    <option value="5">&#9733; &#9733; &#9733; &#9733; &#9733;</option>
    <option value="4">&#9733; &#9733; &#9733; &#9733;</option>
    <option value="3">&#9733; &#9733; &#9733;</option>
    <option value="2">&#9733; &#9733;</option>
    <option value="1">&#9733;</option>
    </select>
  </span>

    <label class="new-bookmark-label" for="new-bookmark-description"> Add description:</label>
    <textarea cols="20" rows="5" class="new-bookmark-input" type="text" name="description" id="new-bookmark-description"></textarea>

    <input class="add-new-bookmark-button form-button" type="submit">

    <button class="return-button form-button" type="reset">Return to bookmarks list</button>

  </form>

</section>`;
}; 

//TODO check this against shopping list renderError if it's not working as is. might need to set error-container div in html so that it can be cleared with handleCloseError.
// ? maybe okay now ?  

const renderError = function (message) {
  if (store.error) {
    const el = generateError(message);
    $('body').html(el);
  }
};

const handleCloseError = function () {
  $('.container').on('click', '.error-return', () => {
    store.setError(null);
    renderError();
  });
};

// * RENDER FUNCTION

const render = function () {
  renderError();

  if (store.adding === false) {
    let initialView = generateInitialView();
    $('body').html(initialView);
  } else {
    let addBookmarkView = generateAddBookmarkView();
    $('body').html(addBookmarkView);
  }
};


// const handleNewItemSubmit = function () {
//   $('#add-new-bookmark-form').submit(function (event) {
//     event.preventDefault();
//     const newBookmarkTitle = $('.new-bookmark-input').val();
//     $('.new-bookmark-input').val('');
//     api.createItem(newBookmarkTitle)
//       .then((newItem) => {
//         store.addItem(newItem);
//         render();
//       })
//       .catch((error) => {
//         store.setError(error.message);
//         renderError();
//       });
//   });
// };


const bindEventListeners = function() {
  handleCloseError();
};


export default {
  render,
  bindEventListeners
};






