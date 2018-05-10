import { ajax } from '../util/ajax'

export function coreMixin (QQMusic) {
  /**
   * 获取歌单列表
   */

  QQMusic.prototype.getSongSheet = function () {
    ajax({
      url: 'http://webapi.yuzhers.com//api/music/default.ashx',
      method: 'get',
      dataType: 'jsonp',
      callback: 'playlistinfoCallback',
      success: res => this.onGetSongSheet(res)
    })
  }
  /**
   * 搜索歌曲
   * @param {String} name 歌曲名或关键字
   */

  QQMusic.prototype.searchMusic = function (name) {
    ajax({
      url: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
      type: 'get',
      dataType: 'jsonp',
      data: {
        ct: 24,
        qqmusic_ver: 1298,
        new_json: 1,
        remoteplace: 'txt.yqq.center',
        searchid: '43421191653182934',
        t: 0,
        aggr: 1,
        cr: 1,
        catZhida: 1,
        lossless: 0,
        flag_qc: 0,
        p: 1,
        n: 100,
        w: name,
        g_tk: 5381,
        jsonpCallback: 'MusicJsonCallback04841230001495744',
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0
      },
      callback: 'MusicJsonCallback04841230001495744',
      success: res => this.onSearchFinish(res)
    })
  }
  /**
   * 获取音乐播放秘钥
   * @param {Object} music
   */

  QQMusic.prototype.getPlayKey = function (music) {
    let filename = `C400${music.songmid}.m4a`
    if (music.vkey === undefined) {
      ajax({
        url: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
        type: 'get',
        dataType: 'jsonp',
        data: {
          jsonpCallback: 'MusicJsonCallback7644963634977697',
          loginUin: 0,
          hostUin: 0,
          format: 'json',
          inCharset: 'utf8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'yqq',
          needNewCode: 0,
          cid: 205361747,
          callback: 'MusicJsonCallback7644963634977697',
          uin: 0,
          songmid: music.songmid,
          filename: filename,
          guid: '527838939'
        },
        callback: 'MusicJsonCallback7644963634977697',
        success: res => this.onGetPlayKey(res, music, this.play)
      })
    } else {
      return music.vkey
    }
  }
  /**
   * 获取巅峰热歌榜
   */

  QQMusic.prototype.getHotTopList = function () {
    ajax({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
      type: 'get',
      dataType: 'jsonp',
      data: {
        tpl: 3,
        page: 'detail',
        date: `${new Date().getFullYear()}_13`,
        topid: 26,
        type: 'top',
        song_begin: 0,
        song_num: 100,
        jsonpCallback: 'MusicJsonCallbacktoplist',
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0
      },
      callback: 'MusicJsonCallbacktoplist',
      success: res => this.onGetHotTopList(res)
    })
  }

  QQMusic.prototype.play = function (music) {
    if (music.vkey === undefined) {
      this.getPlayKey(music)
    } else {
      this.player.playing = music
      this.player.load()
    }
  }
  QQMusic.prototype.getPlayUrl = function (music) {
    if (music) {
      let url = `http://dl.stream.qqmusic.qq.com/C400${music.songmid}.m4a?vkey=${music.vkey}&guid=527838939&uin=0&fromtag=66`
      return url
    }
  }
  QQMusic.prototype.getPhotoUrl = function (music) {
    if (music && music.albummid) {
      let url = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${music.albummid}.jpg?max_age=2592000`
      return url
    }
  }
}
