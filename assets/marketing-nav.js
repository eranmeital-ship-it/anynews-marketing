document.addEventListener('DOMContentLoaded', function () {
  var cookies = document.cookie;
  var loggedIn = cookies.split(';').some(function (c) {
    return c.trim().indexOf('anynews_presence=') === 0;
  });
  if (!loggedIn) return;
  var navs = document.querySelectorAll('.nav-right');
  if (!navs.length) return;
  navs.forEach(function (nav) {
    nav.innerHTML = '<a href="/app" class="btn-pill">Go to dashboard →</a>';
  });
});
