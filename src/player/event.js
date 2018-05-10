import { isFunction } from '../util/lang'
import { warn } from '../util/debug'

/* eslint no-unused-vars: off */
const DEFAULT_EVENTS = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'readystatechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting']

export function eventMixin (Player) {
  Player.prototype._handleEvents = function () {
    let player = this
    for (let i = 0; i < DEFAULT_EVENTS.length; i++) {
      try {
        this._player['on' + DEFAULT_EVENTS[i]] = function (event) {
          if (DEFAULT_EVENTS[i] === 'ended') {
            player._autoToggleMusic()
          }
          if (isFunction(player.events[DEFAULT_EVENTS[i]])) {
            player.events[DEFAULT_EVENTS[i]](event)
          }
        }
      } catch (error) {
        warn(error)
      }
    }
    this._handleMusicSourceEvents()
  }
  Player.prototype._handleMusicSourceEvents = function () {
    let __player = this
    this.musicSourceEvent = {
      musicListLoaded: function (songList, type) {
        if (type === 'songSheet') {
          __player.playList = songList
        }
        if (type === 'hotTop') {
          __player.hotTop = songList
        }
        if (isFunction(__player.events.musicListLoaded)) {
          __player.events.musicListLoaded({
            songList: songList,
            type: type
          })
        }
      }
    }
  }
}
