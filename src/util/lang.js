
/**
 * 合并对象
 * @param {Object} target 接收合并后的对象
 * @param {Array} args 需要合并的对象
 */
export function extend (target, ...args) {
  for (let i = 0; i < args.length; i++) {
    if (args[i]) {
      for (const key in args[i]) {
        target[key] = args[i][key]
      }
    }
  }
  return target
}
/**
 * 判断属性值是否存在
 * @param {Object} arg
 */
export function isFunction (arg) {
  return typeof arg === 'function'
}
