// What Students Pay Pro unlock (same method as Stackr Plan).
// No secret page: the 18 locked schools come from the server only after Stripe confirms payment.
(function () {
  var API = "https://wsp-api.netlify.app/.netlify/functions/"; // change if the Netlify site gets another name
  var KEY = "wsp.pro.v1";

  function call(name, body) {
    return fetch(API + name, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._status = r.status; return j; }); })
      .catch(function () { return { _status: 0 }; });
  }
  function save(j) { try { localStorage.setItem(KEY, JSON.stringify({ token: j.token, email: j.email, expiresAt: j.expiresAt })); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  function unlock(j) {
    save(j);
    document.querySelectorAll("details.u").forEach(function (d) {
      var name = d.querySelector("summary b"); var lock = d.querySelector("p.lock");
      if (!name || !lock) return;
      var html = j.schools && j.schools[name.textContent.trim()];
      if (!html) return;
      var box = document.createElement("div"); box.innerHTML = html;
      lock.replaceWith(box);
    });
    var pro = document.getElementById("pro");
    if (pro) {
      var note = document.getElementById("wsp-pro-on");
      if (!note) { note = document.createElement("p"); note.id = "wsp-pro-on"; note.className = "s"; pro.parentNode.insertBefore(note, pro.nextSibling); }
      note.textContent = "✅ Pro is on" + (j.email ? " for " + j.email : "") + ". All 20 schools are unlocked.";
    }
  }
  function say(msg) { var m = document.getElementById("wsp-msg"); if (m) m.textContent = msg; }

  function start() {
    var q = new URLSearchParams(location.search), sid = q.get("session_id");
    if (sid && /^cs_[A-Za-z0-9_]+$/.test(sid)) {
      call("verify-session", { session_id: sid }).then(function (j) {
        history.replaceState(null, "", location.pathname + location.hash);
        if (j.pro) unlock(j);
        else say("We could not confirm that payment yet. Wait a minute and refresh, or use your email below.");
      });
      return;
    }
    var s = load();
    if (s && s.token) {
      call("check", { token: s.token }).then(function (j) {
        if (j.pro) unlock(j);
        else if (j._status === 401 || j._status === 402) clear(); // cancelled or bad token: lock again
      });
    }
    var f = document.getElementById("wsp-restore");
    if (f) f.addEventListener("submit", function (e) {
      e.preventDefault();
      say("Checking…");
      call("restore", { email: f.email.value }).then(function (j) {
        if (j.pro) { unlock(j); say(""); }
        else if (j._status === 404) say("No active Pro found for that email. Use the email you paid with.");
        else say("Something went wrong. Please try again.");
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
