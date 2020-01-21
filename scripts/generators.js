import api from './api.js';
import bookmarks from './bookmarks.js';
import store from './store.js';

'use strict';

const generateBookmarkItem = function (item, filterValue) {

  if (item.rating < filterValue ) {
    return '';
  }

  let title = item.title;
  let expandedTitle = '';
  let length = 23;
  let expandedLength = 16;
  // if url title longer than 23 characters, cut off and affix ellipses to save space
  const trimString = function(item) {
    if (title.length > length) {
      title = title.substring(0, length) + '...';
    }
    if (title.length > expandedLength) {
      expandedTitle = title.substring(0, expandedLength) + '...';
    } else {
      expandedTitle = title;
    }
  };
  //
  trimString(item);

  if (item.expanded) {
    return `<li class="bookmark expanded" data-item-id="${item.id}" tabindex="0">
  <div class="title-rating-expanded">
  <span class="bookmark-title-expanded">${expandedTitle}</span>
  <div class="bookmark-rating-expanded"><span class="rated">Rated</span> 
  <form aria-label="edit rating" class="rating-input-form"><input class="rating-input" id="rating-input" type="text" value="${item.rating}" name="rating-input" size="1" maxlength="1"</form>/5
  </div>
  </div>
  <form class="description-form">
  <input aria-label="edit description" class="description-edit" id="description-edit" type="text" value="${item.desc}" name="description-edit">
  </form>
  <a href = "${item.url}" target = "_blank">${item.url}</a>
  <button class="delete-bookmark" name="delete-button" >Delete</button>
</li>`;
  } else {
    return `<li class="bookmark" data-item-id="${item.id}" tabindex="0">
      <span class="bookmark-title">${title}</span>
      <span class="bookmark-rating">${item.rating}/5</span>
    </li>`;
  }
};

const generateBookmarkListString = function (bookmarks) {
  const items = bookmarks.map((item) => generateBookmarkItem(item, store.filter));
  return items.join('');
};


const generateError = function (message) {
  return `
  <main class="container">

  <header>
    <h1>My Bookmarks</h1>
  </header>

  <section class="error-view">

    <p class="error-message">There's been an error: ${message}</p>
    <button class="error-return">Return to bookmarks list</button>

  </section>

  </main>`;
};

const generateInitialView = function() {
  const bookmarkListString = generateBookmarkListString(store.bookmarkList);

  let filterMessage = '';

  if (store.filter > 0 && store.bookmarkList.length > 0) {
    filterMessage = `<p class="filter-message">Bookmarks ranked ${store.filter} or higher: </p>`;
  } else {
    filterMessage = '';
  }

  let initialBody = `<section class="initial-view-buttons">
  <button class="add-new-button">Add New Bookmark</button>
  <form id="bookmarks-form"></form>
  <label aria-label="filter by rating" for="filter-dropdown"></label>
  <select name="ratings" id="filter-dropdown">
  <option class="filtertop" name="select0" value="0">Filter By Rating</option>
  <option name="select1" value="5">&#9733; &#9733; &#9733; &#9733; &#9733; or more</option>
  <option name="select2" value="4">&#9733; &#9733; &#9733; &#9733; or more</option>
  <option name="select3" value="3">&#9733; &#9733; &#9733; or more</option>
  <option name="select4" value="2">&#9733; &#9733; or more</option>
  <option name="select5" value="1">&#9733; or more</option>
  </select>
</form>
</section>

<section class="bookmarks-list-section">
${filterMessage}
  <ul class="bookmarks-list">
  ${bookmarkListString}
  </ul>
</section>

</main>
`;

  if (store.initialLoad) {
    return `<main class="container">

  <header>
    <h1 class="animated bounceInDown delay-.5s" id="my-bookmarks-header">My Bookmarks</h1>
  </header>

  ${initialBody}`;
  } else {
    return `<main class="container">

  <header>
    <h1 id="my-bookmarks-header">My Bookmarks</h1>
  </header>

  ${initialBody}`;
  }
};

const generateAddBookmarkView = function() {
  return `<main class="container">

<header>
  <h1>My Bookmarks</h1>
</header>

<section class="add-bookmark-view">

  <form id="add-new-bookmark-form" autocomplete="off">

    <label aria-label="new bookmark title" class="new-bookmark-label" for="new-bookmark-title">Add new bookmark title:</label>
    <input class="new-bookmark-input" type="text" name="title" placeholder="New bookmark" id="new-bookmark-title" required>

    <label aria-label="new bookmark url" class="new-bookmark-label" for="new-bookmark-url"> Enter bookmark url: </label>
    <input class="new-bookmark-input" type="text" name="url" placeholder="https://www.newbookmark.com" id="new-bookmark-url" required>

    <label aria-label="new-bookmark-rating" class="new-bookmark-label" for="new-bookmark-rating">Add bookmark rating:</label>
    <span>
    <select class="new-bookmark-rating" name="add-rating" id="new-bookmark-rating" multiple required>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    </select>
  </span>

    <label aria-label="new bookmark description" class="new-bookmark-label" for="new-bookmark-description"> Add description:</label>
    <textarea cols="20" rows="5" class="new-bookmark-input" type="text" name="description" id="new-bookmark-description" required></textarea>

    <input class="add-new-bookmark-button form-button" type="submit" value="Submit">

    <button class="return-button form-button" type="reset">Return to bookmarks list</button>

  </form>

</section>
</main>`;
}; 


export default {
  generateError,
  generateBookmarkItem,
  generateBookmarkListString,
  generateInitialView,
  generateAddBookmarkView
};