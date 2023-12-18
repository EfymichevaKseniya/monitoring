const users = [];

module.exports = class User {
  constructor(count) {
    this.count = count
  }

  save() {
    users.push(this)
  }

  static getAll() {
    return users;
  }
}