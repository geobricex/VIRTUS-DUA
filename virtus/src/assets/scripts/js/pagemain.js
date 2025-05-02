
HarmonyLanding = {
  addClass: function(element, className) {
    if (element.classList)
      element.classList.add(className);
    else
      element.className += ' ' + className;
  },

  removeClass: function(element, className) {
    if (element.classList)
      element.classList.remove(className);
    else
      element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  },

  hasClass: function(element, className) {
    if (element.classList)
      return element.classList.contains(className);
    else
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
  },

  hideMenu: function() {
    this.removeClass(document.getElementById('landing-menu'), 'landing-menu-active');
  },

  showMenu: function() {
    this.addClass(document.getElementById('landing-menu'), 'landing-menu-active');
  }
};

document.getElementById('menu-btn').addEventListener('click', function(e) {
  var menu = document.getElementById('landing-menu');

  if(HarmonyLanding.hasClass(menu, 'landing-menu-active'))
    HarmonyLanding.hideMenu();
  else
    HarmonyLanding.showMenu();

  e.preventDefault();
});

var menuLinks = document.querySelectorAll('#landing-menu a');
for (i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener('click', function(e) {
    HarmonyLanding.hideMenu();
  });
}
