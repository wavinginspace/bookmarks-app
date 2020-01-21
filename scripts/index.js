import api from './api.js';
import store from './store.js';
import bookmarks from './bookmarks.js';
import generators from './generators.js';

'use strict';

const main = function () {
  api.getItems()
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      bookmarks.render();
    });

  bookmarks.bindEventListeners();
  bookmarks.render();
};

$(main);






