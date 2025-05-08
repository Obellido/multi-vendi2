const view = function(doc) {
    if (doc.tipo === "Usuario" && doc.perfil_id) {
      emit(doc.perfil_id, null);
    }
  }
  
  export default view.toString()
   