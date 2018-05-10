import { extend } from '../util/lang'

const DEFAULT_OPTIONS = {
  musicList: [],
  playing: {},
  playList: []
}
// QQMusic 默认属性
const DEFAULT_PROPERTY = {
  musicList: [],
  playing: {},
  playList: []
}
// 播放器对外公开事件
/* eslint no-unused-vars: off */
const DEFAULT_EVENT = {
  // 搜索音乐完成
  onSearchMusicFinish: null,
  // 当音乐要开始播放时
  onPlay: null,
  // 当音乐已开始播放时
  onPlaying: null,
  // 播放结束后
  onPlayed: null,
  // 暂停播放
  onPausePlay: null,
  // 停止播放
  onStopPlaying: null,
  // 切换歌曲,包含上一曲、下一曲、点播
  onSwitchSong: null,
  // 资源元素突然为空时（网络错误、加载错误等）
  onEmptied: null,
  // 音乐已抵达结尾时
  onEnded: null

}

export function initMixin (QQMusic) {
  /**
   * 初始化QQ音乐播放器
   * @param {Object} el
   * @param {Object} options
   */

  QQMusic.prototype._init = function (options) {
    this._handleOptions(options)
  }
  /**
   * 初始化播放器配置数据
   * @param {Object} options - 播放器的配置数据
   */

  QQMusic.prototype._handleOptions = function (options) {
    this.options = extend({}, DEFAULT_OPTIONS, options)
  }
}
