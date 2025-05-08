const mapFn = function (doc) {
    if (doc._id.startsWith("tenant:") && doc.estado === "activo") emit(doc._id, { basedb: doc.basedb });
  };
  export default mapFn.toString();