Date.prototype.formatting = function (format) {
  var yyyy = this.getFullYear().toString();
  format = format.replace(/yyyy/g, yyyy);
  var mm = (this.getMonth() + 1).toString();
  format = format.replace(/mm/g, mm[1] ? mm : '0' + mm[0]);
  var dd = this.getDate().toString();
  format = format.replace(/dd/g, dd[1] ? dd : '0' + dd[0]);
  var hh = this.getHours().toString();
  format = format.replace(/hh/g, hh[1] ? hh : '0' + hh[0]);
  var ii = this.getMinutes().toString();
  format = format.replace(/ii/g, ii[1] ? ii : '0' + ii[0]);
  var ss = this.getSeconds().toString();
  format = format.replace(/ss/g, ss[1] ? ss : '0' + ss[0]);
  return format;
};

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

export const deepMerge = (obj1, obj2) => {
  for (var p in obj2) {
    try {
      if (obj2[p].constructor == Object) {
        obj1[p] = deepMerge(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch (e) {
      obj1[p] = obj2[p];
    }
  }
  return obj1;
};
