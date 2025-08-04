// Dieses Skript wird in der index.html ausgeführt und sorgt dafür, dass
// nach einer Weiterleitung von der 404.html wieder der richtige Pfad angezeigt wird
(function() {
  // Hole die Weiterleitungsinformationen aus dem SessionStorage
  const redirect = sessionStorage.redirect;
  // Entferne die Weiterleitungsinformationen
  delete sessionStorage.redirect;
  
  // Wenn ein Redirect existiert, ersetze die aktuelle Seite durch die ursprüngliche Anfrage
  if (redirect && redirect !== location.pathname) {
    history.replaceState(null, null, redirect);
  }
})();
