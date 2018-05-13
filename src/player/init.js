import { extend } from '../util/lang'

// import { eventMixin } from './event'

import QQMusic from '../qqmusic/qqmusic'
/**
 * 默认的配置
 */
const DEFAULT_OPTIONS = {
  // 设置或返回音频的 src 属性的值
  url: '',
  // 设置或返回是否在就绪（加载完成）后随即播放音频
  autoplay: true,
  // 设置或返回音频是否应该显示控件（比如播放/暂停等）
  controls: false,
  // 当前播放时间
  currentTime: 0,
  // 设置或返回音频默认是否静音
  defaultMuted: false,
  // 设置或返回音频的默认播放速度
  defaultPlaybackRate: 1,
  // 设置或返回音频是否应在结束时再次播放
  loop: false,
  // 设置或返回音频所属媒介组合的名称
  mediaGroup: '',
  // 设置或返回是否关闭声音
  muted: false,
  // 设置或返回音频播放的速度
  playbackRate: 1,
  // 设置或返回音频的 preload 属性的值
  preload: 'auto',
  // 设置或返回音频的音量
  volume: 1,
  // 音乐列表播放模式
  playerStyle: 0
}
/**
 * 返回表示音频已缓冲部分的 TimeRanges 对象
 * 返回表示音频当前媒体控制器的 MediaController 对象
 * 返回当前音频的 URL
 * 返回音频的长度（以秒计
 * 返回音频的播放是否已结束
 * 返回音频的当前网络状态
 * 返回表示音频已播放部分的 TimeRanges 对象
 * 返回音频当前的就绪状态
 * 返回表示音频可寻址部分的 TimeRanges 对象
 * 返回用户当前是否正在音频中进行查找
 * 返回表示可用文本轨道的 TextTrackList 对象?
 */
/* eslint no-unused-vars: off */
const DEFAULT_PROPERTY = ['buffered', 'controller', 'currentSrc', 'duration', 'ended', 'networkState', 'played', 'readyState', 'seekable', 'seeking', 'textTracks']

/**
 * 初始化播放器
 * @param {Object} Player
 */

export function initMixin (Player) {
  Player.prototype._init = function (el, options) {
    this.playing = {
      songname: '歌曲名',
      singer: '歌手',
      interval: 0,
      albumname: '专辑'
    }
    this.bufferProgress = 0
    this.events = {}
    this._createPlayer(el)
    this._handleOptions(options)
    this._handleEvents()
    this._handleCore()
    this._handleProperty()
  }
  /**
   * 创建播放器
   * @param {Object} el
   */

  Player.prototype._createPlayer = function () {
    let audio = document.createElement('audio')
    audio.setAttribute('width', '0')
    audio.setAttribute('height', 0)
    Player.prototype._player = audio
    this.wrapper.appendChild(this._player)
  }
  /**
   * 初始化配置
   * @param {Object} options
   */

  Player.prototype._handleOptions = function (options) {
    this.options = extend({}, DEFAULT_OPTIONS, options)
    let __player = this
    for (const key in this.options) {
      if (key === 'playerStyle') {
        break
      }
      Object.defineProperty(this.options, key, {
        get: function () {
          return __player._player[key]
        },
        set: function (val) {
          __player._player[key] = val
        }
      })
      // this._player[key] = this.options[key]
    }
  }
  Player.prototype._handleProperty = function () {
    let _this = this
    for (let i = 0; i < DEFAULT_PROPERTY.length; i++) {
      Object.defineProperty(this, DEFAULT_PROPERTY[i], {
        get: function () {
          return _this._player[DEFAULT_PROPERTY[i]]
        }
      })
    }
  }
}
