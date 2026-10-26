document.addEventListener('DOMContentLoaded', function () {
  // Code tab switching
  document.querySelectorAll('.code-card').forEach(function (card) {
    var tabs = card.querySelectorAll('.code-tab');
    var panels = card.querySelectorAll('.code-panel');
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        panels[i].classList.add('active');
      });
    });
  });

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.code-panel');
      var text = panel ? panel.innerText.replace(/^Copy\n?/, '') : '';
      navigator.clipboard.writeText(text).then(function () {
        var original = btn.textContent;
        btn.textContent = 'copied';
        setTimeout(function () { btn.textContent = original; }, 1400);
      });
    });
  });

  // Mobile sidebar toggle
  var toggle = document.querySelector('[data-sidebar-toggle]');
  var sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
});
