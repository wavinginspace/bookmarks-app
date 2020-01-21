import store from './store.js';
import api from './api.js';
import generators from './generators.js';

'use strict';

// removes header animation after page load
setTimeout(function() {
  store.initialLoad = false;
}, 300);

// RENDER/HANDLE ERRORS

const renderError = function (message) {
  if (store.error) {
    const el = generators.generateError(message);
    $('body').html(el);
  }
};

const handleCloseError = function () {
  $('.container').on('click', '.error-return', () => {
    store.setError(null);
    renderError();
  });
};

// RENDER FUNCTION

const render = function () {

  renderError();

  if (store.adding === false) {
    let initialView = generators.generateInitialView();
    $('body').html(initialView);
  } else {
    let addBookmarkView = generators.generateAddBookmarkView();
    $('body').html('');
    $('body').html(addBookmarkView);
  }
};

// LIST VIEW HANDLERS

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.bookmark')
    .data('item-id');
};

const handleAddNewBookmark = function() {
  $('body').on('click', '.add-new-button', function() {
    store.adding = true;
    store.filter = 0;
    render();
  });
};

const handleRatingsSelection = function () {
  $('body').on('change', '#filter-dropdown', function (event) {
    event.preventDefault();
    const filterValue = parseInt($('#filter-dropdown').val());
    store.filter = filterValue;
    store.bookmarkList.forEach(item => item.expanded = false);
    render();
  });  
};

const handleDeleteBookmark = function() {
  $('body').on('click', '.delete-bookmark', function(event) {
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

    // if delete button is clicked, don't toggle expanded, to avoid flicker before it's removed. also allow inputs to be selected.

    if (event.target.name === 'delete-button' || 
        event.target.name === 'description-edit' || 
        event.target.name === 'rating-input') {
      return;
    }

    const itemId = getItemIdFromElement(event.target);
    store.bookmarkList.forEach(item => {
      if (item.id === itemId) {
        item.expanded = !item.expanded;
        render();
      }
    });
  });
};

const handleEditDescription = function() {
  $('body').on('change', '.bookmark', function(event) {
    event.preventDefault();
    const id = getItemIdFromElement(event.currentTarget);
    const newDescription = $(event.currentTarget).find('.description-edit').val();

    api.updateBookmark(id, { desc: newDescription })
      .then(() => {
        store.findAndUpdate(id, { desc: newDescription });
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError(store.error);
      });
  });
};

const handleEditRating = function() {
  $('body').on('change', '.bookmark', function(event) {
    event.preventDefault();
    const id = getItemIdFromElement(event.currentTarget);
    const newRating = $(event.currentTarget).find('.rating-input').val();

    api.updateBookmark(id, { rating: newRating })
      .then(() => {
        store.findAndUpdate(id, { rating: newRating });
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError(store.error);
      });
  });
};

// ADDING VIEW HANDLERS

const handleUrlInput = function(url) {
  let string = url;
  // if user enters www.google.com or just google.com, will fix input to full address.
  if (string) {
    if (!~string.indexOf('http') && ~string.indexOf('www')) {
      string = 'https://' + string;
    } else if (!~string.indexOf('http') && !~string.indexOf('www')) {
      string = 'https://www.' + string;
    }
  }
  return string;
};

const handleSubmitNewBookmark = function () {
  $('body').on('submit', '#add-new-bookmark-form', function(event){
    event.preventDefault(); 
    let newBookmarkTitle = $('#new-bookmark-title').val();
    let newBookmarkUrl = $('#new-bookmark-url').val();
    let newBookmarkRating = $('#new-bookmark-rating').val();
    let newBookmarkDescription = $('#new-bookmark-description').val();

    let validatedUrl = handleUrlInput(newBookmarkUrl);

    let newBookmark = {
      title: newBookmarkTitle,
      url: validatedUrl, 
      desc: newBookmarkDescription,
      rating: newBookmarkRating
    };

    $('.new-bookmark-input').val('');

    api.createBookmark(newBookmark)
      .then((newItem) => {
        store.addItem(newItem);
        store.adding = false;
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError(store.error);
      });
  });
};

const handleReturnToList = function () {
  $('body').on('click', '.return-button', function() {
    store.adding = false;
    store.filter = 0;
    render();
  });
};

const handleHeaderReturn = function() {
  $('body').on('click', 'h1', function() {
    store.adding = false;
    store.filter = 0;
    render();
  });
};

// ERROR VIEW HANDLER

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
  handleUrlInput();
  handleHeaderReturn();
  handleEditDescription();
  handleEditRating();
};

export default {
  render,
  bindEventListeners 
};






