/*
 * @Author: Goucey（高希）
 * @Email: gaoxi0004@163.com
 * @Date: 2018-04-16 10:30:20
 * @Last Modified by: Goucey（高希）
 * @Last Modified time: 2018-04-16 13:05:09
 */

import {
  jsonp
} from './jsonp'
export function ajax (options) {
  let xmlhttp = new XMLHttpRequest()
  xmlhttp.onreadystatechange = resource => {
    if (resource.readyState === 4 && resource.status === 200 && options.success) {
      options.success()
    }
  }
  switch (options.dataType) {
    default:
    case 'post':
    case 'get':
      if (options.method === 'post') {
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      }
      xmlhttp.open(options.method, options.url, true)
      xmlhttp.send(options.data)
      break
    case 'jsonp':
      jsonp(options)
      break
  }
}
