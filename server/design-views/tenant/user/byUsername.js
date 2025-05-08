const view = function(doc) {
  if (doc.tipo === "Usuario") {
    emit(doc.username.toLowerCase(), null);
  }
}

export default view.toString()
 