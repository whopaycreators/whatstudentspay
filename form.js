// Where form entries are delivered. The address is assembled here so it
// doesn't appear as plain text in the page for spam bots to collect.
// TODO: replace with the private FormSubmit code from the activation email,
// e.g. var FORM_ENDPOINT = "https://formsubmit.co/abc123yourcode";
(function () {
  var p = ["yim1976", "msn.com"];
  var FORM_ENDPOINT = "https://formsubmit.co/" + p.join("@");
  var forms = document.querySelectorAll("form.fs");
  for (var i = 0; i < forms.length; i++) forms[i].action = FORM_ENDPOINT;
})();
