import store from './store.js';
import api from './api.js';


const generateBookmarkItem = function (item, rating) {
  if (item.rating < rating ) {
    return '';
  }

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
  const items = bookmarks.map((item) => generateBookmarkItem(item, item.rating));

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
    <option value="5">5</option>
    <option value="4">4</option>
    <option value="3">3</option>
    <option value="2">2</option>
    <option value="1">1</option>
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
  if (store.error === true) {
    const el = generateError(message);
    $('body').html(el);
  }
};

const handleCloseError = function () {
  $('.container').on('click', '.error-return', () => {
    console.log('I was clicked');
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

// TODO -- LIST VIEW HANDLERS

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.bookmark')
    .data('item-id');
};

const handleAddNewBookmark = function() {
  $('body').on('click', '.add-new-button', function() {
    store.adding = true;
    render();
  });
};

const handleRatingsSelection = function () {
  $('body').on('change', '#filter-dropdown', function (event) {
    event.preventDefault();
    const filterValue = parseInt($('#filter-dropdown').val());
    store.filter = filterValue;
    store.bookmarkList.forEach(item => item.expanded = false);
    render(filterValue);
  });  
};

const handleDeleteBookmark = function() {
  $('body').on('click', '.delete-bookmark', function(event) {
    console.log('I was clicked');
    console.log(event.currentTarget);
    const id = getItemIdFromElement(event.currentTarget);
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  });
};

const handleToggleExpandedView = function() {
  $('body').on('click', '.bookmark', function(event) {
    // console.log(event);
    const itemId = getItemIdFromElement(event.target);
    store.bookmarkList.forEach(item => {
      if (item.id === itemId) {
        item.expanded = !item.expanded;
        render();
      }
    });
  });
};

//TODO -- ADDING VIEW HANDLERS

const handleSubmitNewBookmark = function () {
  $('body').on('submit', '#add-new-bookmark-form', function(event){
    console.log('I was clicked');
    event.preventDefault();
    let newBookmarkTitle = $('#new-bookmark-title').val();
    let newBookmarkUrl = $('#new-bookmark-url').val();
    let newBookmarkRating = $('#new-bookmark-rating').val();
    let newBookmarkDescription = $('#new-bookmark-description').val();

    let newBookmark = {
      title: newBookmarkTitle,
      url: newBookmarkUrl,
      desc: newBookmarkDescription,
      rating: newBookmarkRating
    };

    console.log(newBookmark);
    $('.new-bookmark-input').val('');

    api.createBookmark(newBookmark)
      .then((newItem) => {
        store.addItem(newItem);
        store.adding = false;
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  });
};

const handleReturnToList = function () {
  $('body').on('click', '.return-button', function() {
    console.log('I was clicked');
    store.adding = false;
    render();
  });
};

// TODO -- ERROR VIEW HANDLER

const errorReturnToList = function() {
  $('body').on('click', '.error-return', function() {
    store.error = null;
    render();
  } );
};

const bindEventListeners = function() {
  handleCloseError();
  handleSubmitNewBookmark();
  handleAddNewBookmark();
  handleDeleteBookmark();
  handleReturnToList();
  handleToggleExpandedView();
  getItemIdFromElement();
  errorReturnToList();
  handleRatingsSelection();
};

export default {
  render,
  bindEventListeners
};






