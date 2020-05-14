export const getStyle = function (elem, rule) {
  var result = '';
  if (document.defaultView && document.defaultView.getComputedStyle) {
    result = document.defaultView
      .getComputedStyle(elem, '')
      .getPropertyValue(rule);
  } else if (elem.currentStyle) {
    rule = rule.replace(/\-(\w)/g, function (strMatch, p1) {
      return p1.toUpperCase();
    });
    result = elem.currentStyle[rule];
  }
  return result;
};
