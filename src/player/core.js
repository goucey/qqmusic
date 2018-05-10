export function coreMixin (Player) {
  Player.prototype._handleCore = function () {
    /**
     * 重新加载音频元素
     */

    this.load = function () {
      if (this.playing && this.playing.vkey) {
        let url = this.getPlayUrl(this.playing)
        this._player.setAttribute('src', url)
        this._player.innerHTML = `<source src=${url} />`
        this._player.currentTime = 0
        // this._player.load()
        this._player.play()
      }
    }
    this.play = function (music) {
      if ((!music || !music.songmid) && this.playList.length > 0) {
        music = this.playList[0]
      }
      if (music !== null && music.vkey === undefined) {
        this.qqMusic.play(music)
        return
      }
      if (music !== this.playing) {
        this.playing = music
        this.load()
        return
      }
      this._player.play()
    }
    this.pause = function () {
      this._player.pause()
    }
  }
  Player.prototype.Use = function (name, Music) {
    Player.prototype[name] = Music
    this.getSongSheet = function () {
      this[name].getSongSheet()
    }
    this.search = function (musicName) {
      this[name].searchMusic(musicName)
    }
    this.getHotTopList = function () {
      this[name].getHotTopList()
    }
    this.getPlayUrl = function (music) {
      return this[name].getPlayUrl(music)
    }
    this.getPhotoUrl = function () {
      return this[name].getPhotoUrl(this.playing)
    }
  }
  /**
   *  循环播放
   * @param {Boolean} isNext 是否下一曲
   */

  Player.prototype.listPlayer = function (isNext) {
    let index = this.playList.indexOf(this.playing)
    index = isNext ? index + 1 : index - 1
    if (index >= this.playList.length) {
      index = 0
    }
    if (index < 0) {
      index = this.playList.length - 1
    }
    // this.playing = this.playList[index]
    this.play(this.playList[index])
  }
  /**
   * 顺序播放
   * @param {Boolean} isNext 是否下一曲
   */

  Player.prototype.orderPlayer = function (isNext) {
    let index = this.playList.indexOf(this.playing)
    let tempIndex = isNext ? index + 1 : index - 1
    if (tempIndex >= this.playList.length) {
      tempIndex = this.playList.length - 1
    }
    if (tempIndex < 0) {
      tempIndex = 0
    }
    console.log('顺序播放', index, tempIndex)
    if (index !== tempIndex) {
      // this.playing = this.playList[index]
      this.play(this.playList[tempIndex])
    } else {
      this.options.currentTime = 0
      this.pause()
    }
  }
  /**
   *  随机播放
   * @param {Boolean} isNext 是否下一曲
   */

  Player.prototype.randomPlayer = function (isNext) {
    let index = this.playList.indexOf(this.playing)
    let randomIndex = Number.parseInt(Math.random() * this.playList.length)
    if (randomIndex === index) {
      index = Math.random() > 0.5 ? randomIndex + 1 : randomIndex - 1
    } else {
      index = randomIndex
    }
    if (index >= this.playList.length) {
      index = 0
    }
    if (index < 0) {
      index = this.playList.length - 1
    }
    // this.playing = this.playList[index]
    this.play(this.playList[index])
  }
  /**
   * 单曲循环
   * @param {Boolean} isNext 是否下一曲
   */

  Player.prototype.singlePlayer = function () {
    this.play(this.playing)
  }
  Player.prototype._autoToggleMusic = function () {
    switch (this.options.playerStyle) {
      case 0:
        this.listPlayer(true)
        break
      // 顺序播放
      case 1:
        this.orderPlayer(true)
        break
      case 2:
        this.randomPlayer(true)
        break
      case 3:
        this.singlePlayer()
        break
    }
  }
  Player.prototype.toggleMusic = function (isNext) {
    this.pause()
    // this.options.currentTime = 0
    switch (this.options.playerStyle) {
      case 0:
      case 1:
      case 3:
        this.listPlayer(isNext)
        break
      case 2:
        this.randomPlayer(isNext)
        break
    }
  }
}
