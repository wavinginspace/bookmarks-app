import api from './api.js';
import bookmarks from './bookmarks.js';

const bookmarkList = [];
let adding = false;
let error = null;
let filter = 0;

const findById = function (id) {
  return this.bookmarkList.find(currentItem => currentItem.id === id);
};

const addItem = function (item) {
  this.bookmarkList.push(item);
};

const findAndDelete = function (id) {
  this.bookmarkList = this.bookmarkList.filter(currentItem => currentItem.id !== id);
};

// * not sure if need this function yet - might be only for extend goal

const findAndUpdate = function (id, newData) {
  const currentItem = this.findById(id);
  Object.assign(currentItem, newData);
};

const setError = function(error) {
  this.error = error;
};

console.log(bookmarkList);

export default {
  bookmarkList,
  adding,
  error,
  filter,
  findById,
  addItem,
  findAndDelete,
  findAndUpdate,
  setError
};