export function jsonp (options) {
  let [callback, script, resultData] = [options.callback || 'callback' + Math.random().toString(36).substr(2), null, null]
  window[callback] = result => {
    resultData = result
  }

  let handle = function () {
    document.head.removeChild(script)
    if (resultData !== null && options.success) {
      options.success(resultData)
    } else if (options.error) {
      options.error()
    }
  }
  script = document.createElement('script')
  script.src = getUrl(options)
  script.type = 'text/javascript'
  script.onload = handle
  script.onerror = handle
  document.head.appendChild(script)

  function getUrl (options) {
    let url = options.url
    if (!options.data && typeof options.data !== 'object') {
      url = `${options.url}?callback=${options.callback}`
    } else {
      let arr = []
      for (const key in options.data) {
        arr.push(`${key}=${options.data[key]}`)
      }
      if (options.url.indexOf('?') >= 0) {
        url = `${options.url}&${arr.join('&')}`
      } else {
        url = `${options.url}?${arr.join('&')}`
      }
    }
    if (url.indexOf('callback') < 0) {
      url = `${url}?callback=${options.callback}`
    }
    return url
  }
}
