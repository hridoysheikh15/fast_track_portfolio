/* =========================================================
   Fast Track International — main.js (jQuery)
   ========================================================= */
(function ($) {
  "use strict";

  $(function () {
    var $win = $(window);
    var $nav = $("#mainNav");
    var $toTop = $("#toTop");
    var $reveals = $(".reveal");
    var $navLinks = $nav.find(".nav-link");
    var $sections = $("#home, #about, #programs, #contact");
    var navH = $nav.outerHeight() || 76;
    var ticking = false;

    /* ---- Footer year ---- */
    $("#year").text(new Date().getFullYear());

    /* ---- Scroll reveal (lightweight, no library) ---- */
    function revealOnScroll() {
      var trigger = $win.scrollTop() + $win.height() * 0.9;
      $reveals = $reveals.filter(function () {
        var $el = $(this);
        if ($el.offset().top < trigger) {
          var delay = parseInt($el.data("delay"), 10) || 0;
          setTimeout(function () { $el.addClass("in"); }, delay);
          return false; // remove from list once revealed
        }
        return true;
      });
    }

    /* ---- Active nav link on scroll ---- */
    function updateActiveLink() {
      var pos = $win.scrollTop() + navH + 40;
      var current = "home";

      $sections.each(function () {
        if ($(this).offset().top <= pos) current = this.id;
      });
      // At the very bottom, highlight Contact
      if ($win.scrollTop() + $win.height() >= $(document).height() - 4) current = "contact";

      $navLinks.removeClass("active").filter('[href="#' + current + '"]').addClass("active");
    }

    /* ---- Combined scroll handler (rAF-throttled) ---- */
    function onScroll() {
      var y = $win.scrollTop();
      $nav.toggleClass("scrolled", y > 20);
      $toTop.toggleClass("show", y > 600);
      revealOnScroll();
      updateActiveLink();
      ticking = false;
    }

    $win.on("scroll resize", function () {
      if (!ticking) {
        ticking = true;
        (window.requestAnimationFrame || setTimeout)(onScroll);
      }
    });
    onScroll();

    /* ---- Smooth scrolling for in-page links ---- */
    $('a[href^="#"]').on("click", function (e) {
      var target = $(this).attr("href");
      if (target.length < 2 || !$(target).length) return;
      e.preventDefault();

      $("html, body").stop().animate(
        { scrollTop: $(target).offset().top - navH + 1 },
        600,
        "swing"
      );

      // Close the mobile menu after selection
      var $menu = $("#navMenu");
      if ($menu.hasClass("show")) {
        bootstrap.Collapse.getOrCreateInstance($menu[0]).hide();
      }
    });

    /* ---- Back to top ---- */
    $toTop.on("click", function () {
      $("html, body").stop().animate({ scrollTop: 0 }, 600, "swing");
    });

    /* ---- Safety: make sure every external platform link opens in a new tab ---- */
    var host = location.hostname;
    $('a[href^="http"]').filter(function () {
      return !host || this.hostname !== host;
    }).attr({
      target: "_blank",
      rel: "noopener noreferrer"
    });
  });
})(jQuery);
