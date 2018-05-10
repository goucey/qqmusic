/**
 * 获取对应样式值
 * @param {Object} ele
 * @param {String} attr
 */
export function getStyle (ele, attr) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(ele, null)[attr]
  } else {
    return ele.currentStyle[attr]
  }
}
