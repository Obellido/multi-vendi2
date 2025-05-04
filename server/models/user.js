// models/user.js

export class User {
  constructor({ id, username, password, perfil_id }) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.perfil_id = perfil_id;
  }
}