import {
  initMixin
} from './player/init'
import {
  coreMixin
} from './player/core'
import {
  eventMixin
} from './player/event'

import {
  warn
} from './util/debug'

import QQMusic from './qqmusic/qqmusic'

/**
 *
 * @param {*} el
 * @param {*} options
 * @param {*} events
 */

function Music (el, options) {
  this.wrapper = typeof el === 'string' ? document.querySelector(el) : el
  if (!this.wrapper) {
    warn('无法解析顶层DOM')
  }
  this._init(options)
  let _qqmusic = new QQMusic(this)
  this.Use('qqMusic', _qqmusic)
}

initMixin(Music)
eventMixin(Music)
coreMixin(Music)
Music.Version = '1.0.0.0'

export default Music
