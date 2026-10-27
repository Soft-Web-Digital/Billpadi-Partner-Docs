// Immediately execute theme to avoid Flash of Unstyled Content (FOUC)
(function initTheme() {
  var saved = localStorage.getItem('billpadi-docs-theme') || 'auto';
  var isDark = saved === 'dark' || (saved === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (saved === 'auto') {
    document.documentElement.removeAttribute('data-theme');
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } else {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  // ---------- Clean, Centered SVG Icons ----------
  var SUN_SVG = '<svg class="icon-sun" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';
  var MOON_SVG = '<svg class="icon-moon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
  var SUN_MINI = '<svg class="icon-sun" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-2px;"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';
  var MOON_MINI = '<svg class="icon-moon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-2px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
  var AUTO_MINI = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-2px;"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>';

  // ---------- Code tab switching ----------
  document.querySelectorAll('.code-card').forEach(function (card) {
    var tabs = card.querySelectorAll('.code-tab');
    var panels = card.querySelectorAll('.code-panel');
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });
  });

  // ---------- Copy buttons ----------
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.code-panel') || btn.closest('.code-card');
      var pre = panel ? panel.querySelector('pre') : null;
      var text = pre ? pre.innerText : (panel ? panel.innerText.replace(/^Copy\n?/, '') : '');
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        var original = btn.textContent;
        btn.textContent = 'copied';
        setTimeout(function () { btn.textContent = original; }, 1400);
      });
    });
  });

  // ---------- Mobile sidebar toggle ----------
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

  // ---------- Dynamic Theme Switcher System ----------
  var currentTheme = localStorage.getItem('billpadi-docs-theme') || 'auto';

  function applyTheme(theme) {
    localStorage.setItem('billpadi-docs-theme', theme);
    currentTheme = theme;
    if (theme === 'auto') {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    updateThemeUI();
  }

  function updateThemeUI() {
    var isDarkNow = document.documentElement.getAttribute('data-theme') === 'dark';
    var iconSvg = isDarkNow ? SUN_SVG : MOON_SVG;
    var tooltip = isDarkNow ? 'Switch to Light mode' : 'Switch to Dark mode';

    var statusText = document.getElementById('theme-status-text');
    if (statusText) {
      statusText.textContent = currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);
    }

    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      if (btn.getAttribute('data-theme-val') === currentTheme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    var brandToggle = document.querySelector('.brand-theme-toggle');
    if (brandToggle) {
      brandToggle.innerHTML = iconSvg;
      brandToggle.title = tooltip;
    }

    var fab = document.getElementById('floating-theme-btn');
    if (fab) {
      var fabIcon = fab.querySelector('.fab-icon');
      if (fabIcon) fabIcon.innerHTML = iconSvg;
      fab.title = tooltip;
    }

    var mobileBtn = document.querySelector('.theme-quick-btn');
    if (mobileBtn) {
      mobileBtn.innerHTML = iconSvg;
      mobileBtn.title = tooltip;
    }
  }

  // 1. Inject into desktop .brand (Top Left)
  var brand = document.querySelector('.brand');
  var logoCard = brand ? brand.querySelector('.brand-logo-card') : null;
  if (brand && logoCard && !brand.querySelector('.brand-theme-toggle')) {
    var headerRow = document.createElement('div');
    headerRow.className = 'brand-header-row';
    logoCard.parentNode.insertBefore(headerRow, logoCard);
    headerRow.appendChild(logoCard);

    var brandToggle = document.createElement('button');
    brandToggle.type = 'button';
    brandToggle.className = 'brand-theme-toggle';
    brandToggle.title = 'Quick toggle theme';
    brandToggle.innerHTML = MOON_SVG;
    brandToggle.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
    headerRow.appendChild(brandToggle);
  }

  // 2. Inject floating chat-widget style FAB (Bottom Right)
  if (!document.getElementById('floating-theme-btn')) {
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.id = 'floating-theme-btn';
    fab.className = 'floating-theme-fab';
    fab.title = 'Quick toggle theme';
    fab.setAttribute('aria-label', 'Toggle theme');
    fab.innerHTML = '<span class="fab-icon">' + MOON_SVG + '</span>';
    fab.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
    document.body.appendChild(fab);
  }

  // 3. Inject full segmented controller into sidebar .nav-foot
  var navFoot = document.querySelector('.nav-foot');
  if (navFoot && !document.querySelector('.theme-switch-wrap')) {
    var switchWrap = document.createElement('div');
    switchWrap.className = 'theme-switch-wrap';
    switchWrap.innerHTML = [
      '<div class="theme-switch-label">',
      '  <span>Appearance</span>',
      '  <span id="theme-status-text" style="color:#A79AC2;font-size:9.5px;">Auto</span>',
      '</div>',
      '<div class="theme-switch">',
      '  <button type="button" class="theme-btn" data-theme-val="light" title="Light theme">' + SUN_MINI + ' Light</button>',
      '  <button type="button" class="theme-btn" data-theme-val="dark" title="Dark theme">' + MOON_MINI + ' Dark</button>',
      '  <button type="button" class="theme-btn" data-theme-val="auto" title="System preference">' + AUTO_MINI + ' Auto</button>',
      '</div>'
    ].join('\n');
    navFoot.appendChild(switchWrap);

    switchWrap.querySelectorAll('.theme-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var chosen = btn.getAttribute('data-theme-val');
        applyTheme(chosen);
      });
    });
  }

  // 4. Inject quick toggle into mobile .topbar
  var topbar = document.querySelector('.topbar');
  if (topbar && !document.querySelector('.theme-quick-btn')) {
    var topbarBtn = document.createElement('button');
    topbarBtn.type = 'button';
    topbarBtn.className = 'theme-quick-btn';
    topbarBtn.title = 'Toggle theme';
    topbarBtn.innerHTML = MOON_SVG;
    topbarBtn.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
    var menuBtn = topbar.querySelector('[data-sidebar-toggle]');
    if (menuBtn) {
      topbar.insertBefore(topbarBtn, menuBtn);
    } else {
      topbar.appendChild(topbarBtn);
    }
  }

  // 5. Listen for OS scheme change in auto mode
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if ((localStorage.getItem('billpadi-docs-theme') || 'auto') === 'auto') {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        updateThemeUI();
      }
    });
  }

  // Initial UI sync
  updateThemeUI();
});
