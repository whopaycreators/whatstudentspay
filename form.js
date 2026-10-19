// Where form entries are delivered. This is FormSubmit's private code for the
// owner's inbox, so no email address appears anywhere on the site.
(function () {
  var FORM_ENDPOINT = "https://formsubmit.co/9123310839583fc9a49ac9b79bab8e62";
  var forms = document.querySelectorAll("form.fs");
  for (var i = 0; i < forms.length; i++) forms[i].action = FORM_ENDPOINT;
})();
