<template>
  <div id="app">
    <transition name="header">
      <v-header @hot-top="hotTop" v-show="!isShowSearchList" @search-music="searchMusic" :music="music"></v-header>
    </transition>
    <transition name="content">
      <div class="content-wrap" v-show="!isShowSearchList" >
        <i class="line"></i>
        <div class="player-list-wrap">
          <playList ref="playList" @remove-item="removeItem" :music="music"></playList>
          <songInfo ref="songInfo" :music="music"></songInfo>
        </div>
        <player @playing-list="openPlayList" ref="player" :music="music"></player>
      </div>
    </transition>
    <transition name="searchList">
      <div class="search-list"  v-show="isShowSearchList" >
        <search-list @close-search-list="hotTop" ref="searchList" :music="music"></search-list>
      </div>
    </transition>
    <div class="bg-mark"></div>
    <div class="bg" :style="{backgroundImage: `url(${photoUrl})`}"></div>
  </div>
</template>

<script>

import Music from '../src/index'
import header from './components/header/header'
import playList from './components/playList/playList'
import songInfo from './components/songInfo/songInfo'
import player from './components/player/player'
import searchList from './components/searchList/searchList'

export default {
  name: 'App',
  data () {
    return {
      playList: [],
      searchList: [],
      hotTopList: [],
      isShowSearchList: false,
      music: {}
    }
  },
  created () {
    let app = document.querySelector('#app')
    // /* eslint no-unused-vars: off */
    this.music = new Music(app, {})
    this.music.getSongSheet()
    this.music.events = {
      timeupdate: res => {
        let current = this.music.options.currentTime // res.timeStamp / 1000
        this.$refs.player.timeUpdate(current)
        this.$refs.songInfo.playStartDeg(current)
      }
    }
  },
  computed: {
    // 获取音乐播放背景封面图地址
    photoUrl () {
      let url = this.music.getPhotoUrl()
      if (!url) {
        url = 'http://webapi.yuzhers.com/api/image/?n=avatar.jpeg'
      }
      return url
    },
    // 判断是否是手机端访问，主要用于显示视图
    isShowView () {
      let width = document.body.clientWidth
      console.log(width)
      return width > 768
    }
  },
  mounted () {
    // 播放器的部分事件
    this.music.events.play = this.play
    this.music.events.pause = this.pause
    this.music.events.musicListLoaded = this.musicListLoaded
  },
  methods: {
    // 事件 - 当播放器开始播放时
    play (music) {
      this.$refs.searchList.play(true)
      this.$refs.playList.play(true)
      this.$refs.player.play(true)
      this.$refs.songInfo.play(true)
    },
    // 事件 - 当播放器暂停播放时
    pause () {
      this.$refs.searchList.play(false)
      this.$refs.playList.play(false)
      this.$refs.player.play(false)
      this.$refs.songInfo.play(false)
    },
    // 事件 - 加载数据（歌单、巅峰榜、搜索）
    musicListLoaded (event) {
      setTimeout(() => {
        switch (event.type) {
          case 'songSheet':
            this.playList = event.songList
            this.$refs.playList.songList(event.songList)
            break
          case 'hotTop':
            this.hotTopList = event.songList
            this.$refs.searchList.songList(event.songList, '巅峰·热歌榜')
            break
          case 'search':
            this.searchList = event.songList
            this.$refs.searchList.songList(event.songList)
            break
        }
      }, 1000)
    },
    // 巅峰热歌榜切换显示列表按钮 - 子组件事件
    hotTop (isShow) {
      this.isShowSearchList = isShow
      if (isShow) {
        this.$refs.searchList.songList(this.hotTopList, '巅峰·热歌榜')
      }
    },
    // 搜索歌曲切换显示列表 - 子组件事件
    searchMusic (isShow, name) {
      this.isShowSearchList = true
      this.$refs.searchList.songList(this.searchList, `搜索《${name}》如下`)
    },
    // 删除播放列表歌曲（用于处理搜索列表的状态） - 子组件事件
    removeItem (music) {
      this.$refs.searchList.removePlayList(music)
    },
    // 打开播放列表事件（手机访问时）- 子组件事件
    openPlayList () {
      this.$refs.playList.closePlayList(true)
    }
  },
  components: {
    'v-header': header,
    playList,
    songInfo,
    player,
    searchList
  }
}
</script>

<style lang="less">
@import "./common/less/mixin.less";
#app {
  position: relative;
  width: 100%;
  height: 100%;
  background: @base-bgColor;
  .header-enter-active,
  .header-leave-active {
    transition: 1S;
  }
  .header-enter,
  .header-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translate3d(0, -70px, 0);
  }
  .content-wrap {
    position: relative;
    top: -70px;
    height: 100%;
    width: 88%;
    padding: 70px 0 100px 0;
    margin: 0 auto;
    z-index: 2;
    transform: translate3d(0, 0, 0);
    .line {
      display: block;
      width: 100%;
      height: 1px;
      background: @base-bgColor;
      opacity: 0.02;
    }
    .player-list-wrap {
      display: flex;
      height: 100%;
    }

  }
  .content-enter-active,
  .content-leave-active {
    transition: 1S;
  }
  .content-enter,
  .content-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translate3d(0, -100%, 0);
  }
  .search-list {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9990;
      transform: translate3d(0, 0, 0);
    }
    .searchList-enter-active,
    .searchList-leave-active {
      transition: 1S;
    }
    .searchList-enter,
    .searchList-leave-to /* .fade-leave-active below version 2.1.8 */ {
      transform: translate3d(0, 100%, 0);
    }
  .bg-mark {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: @bg-markColor;
    z-index: 1;
  }
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-image: url("./assets/T002R300x300M000002TCudF3sqMGh.jpg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    filter: blur(65px);
    transition: .5s ;
  }
}
@media (max-width: 768px) {
  .content-wrap {
    padding-bottom: 120px !important;
  }
}
</style>
