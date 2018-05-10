/**
 * QQ音乐播放器事件
 * @Author: Goucey（高希）
 * @Email: gaoxi0004@163.com
 * @Date: 2018-04-16 12:45:31
 * @Last Modified by: Goucey（高希）
 * @Last Modified time: 2018-05-09 19:29:20
 */

import { isFunction } from '../util/lang'
import { warn } from '../util/debug'
const ERR_OK = 200
const ERR_OK_DEFAULT = 0
export function eventMixin (QQMusic) {
  /**
   * 搜索歌曲完成时
   * @param {Object} res - 搜索完成后的数据
   */

  QQMusic.prototype.onSearchFinish = function (res) {
    if (isFunction(this.player.musicSourceEvent.musicListLoaded)) {
      if (res.code === ERR_OK_DEFAULT) {
        let temp = []
        for (let i = 0; i < res.data.song.list.length; i++) {
          temp.push({
            albummid: res.data.song.list[i].album.mid,
            albumname: res.data.song.list[i].album.name,
            songid: res.data.song.list[i].id,
            songmid: res.data.song.list[i].mid,
            songname: res.data.song.list[i].name,
            singer: res.data.song.list[i].singer[0].name,
            interval: res.data.song.list[i].interval
          })
        }
        this.player.musicSourceEvent.musicListLoaded(temp, 'search')
      } else {
        this.onError(res.message)
      }
    }
  }
  /**
   * 获取歌单完成时 - 默认添加到播放列表
   * @param {Object} res - 获取歌单完成时的返回数据
   */

  QQMusic.prototype.onGetSongSheet = function (res) {
    if (isFunction(this.player.musicSourceEvent.musicListLoaded)) {
      if (res.code === ERR_OK) {
        this.player.musicSourceEvent.musicListLoaded(res.data.songlist, 'songSheet')
      } else {
        this.onError(res.msg)
      }
    }
  }
  /**
   * 获取音乐播放秘钥成功时
   * @param {Object} res - 成功时返回的数据
   * @param {Object} music - 当前播放歌曲
   */

  QQMusic.prototype.onGetPlayKey = function (res, music) {
    if (res.code === ERR_OK_DEFAULT) {
      if (res.data.items.length > 0) {
        music.vkey = res.data.items[0].vkey
        this.play(music)
      }
    } else {
      this.onError('获取音乐播放秘钥时失败')
    }
  }
  /**
   * 获取巅峰热歌榜成功时
   * @param {*} res -获取成功时返回的数据
   */

  QQMusic.prototype.onGetHotTopList = function (res) {
    if (isFunction(this.player.musicSourceEvent.musicListLoaded)) {
      if (res.code === ERR_OK_DEFAULT) {
        let temp = []
        for (let i = 0; i < res.songlist.length; i++) {
          temp.push({
            albummid: res.songlist[i].data.albummid,
            albumname: res.songlist[i].data.albumname,
            songid: res.songlist[i].data.songid,
            songmid: res.songlist[i].data.songmid,
            songname: res.songlist[i].data.songname,
            singer: res.songlist[i].data.singer[0].name,
            interval: res.songlist[i].data.interval
          })
        }
        this.player.musicSourceEvent.musicListLoaded(temp, 'hotTop')
      } else {
        this.onError('获取巅峰热歌榜失败')
      }
    }
  }
  /**
   * 错误时
   * @param {String} msg - 获取数据失败时提示的信息
   */

  QQMusic.prototype.onError = function (msg) {
    warn(msg)
    if (isFunction(this.events.error)) {
      this.events.error(msg)
    }
  }
}
