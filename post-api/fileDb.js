const fs = require('fs').promises;
const {nanoid} = require("nanoid");

const filename = './db.json';
let data = [];

module.exports = {
  async init() {
    try {
      const fileContents = await fs.readFile(filename);
      data = JSON.parse(fileContents.toString());
    } catch (e) {
      data = [];
    }
  },
  getItems() {
    return data;
  },

  addItem(item) {
    item.id = nanoid();
    const date = new Date();
    item.datetime = date.toISOString();
    data.push(item);
    return this.save();
  },
  save() {
    return fs.writeFile(filename, JSON.stringify(data, null, 2));
  }
};