<template>
  <div class='search-List-wrap'>
    <div class="search-header">
      <div class="logo">
         <a href="javascript:;">
          <img src="../../../static/assets/player_logo.png" alt="QQ音乐播放器">
        </a>
      </div>
      <div class="title">{{title}}</div>
      <button class="close-btn" @click="closeBtn">关闭</button>
    </div>
    <div class="music-list-main">
      <ul class="music-list-header  hidden">
        <li class="music-list-header-name">歌名</li>
        <li class="music-list-header-author hidden ">歌手</li>
        <li class="music-list-header-album hidden">专辑</li>
        <li class="music-list-header-time hidden">时长</li>
      </ul>
      <i class="border-line"></i>
      <ul class="music-list-content">
        <li class="music-list-item " :class="{playing: playIndex === index}" v-for="(item,index) in playList" :key="index">
          <div class="song-index">{{index+1}}</div>
          <div class="song-name" :data-songInfo="`歌手：${item.singer}`" >
            <span :title="`歌名：${item.songname}`">{{item.songname}}</span>
            <div class="song-menu">
                <span class="song-menu-status" :title="playIndex === index ? '暂停': '播放'" @click="togglePlayStatus(item,index,$event)"></span>
                <span class="song-menu-add" v-show="!item.isPlayList" @click="pushPlayList(item)" title="添加到播放列表"></span>
            </div>
          </div>
          <div class="song-singer hidden" :title="`歌手：${item.singer}`" >{{item.singer}}</div>
          <div class="song-album hidden" :title="`专辑：${item.albumname}`">{{item.albumname}}</div>
          <div class="song-interval hidden">{{item.interval | intervalTime }}</div>
          <i class="border-line"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { formatTime } from '../../common/js/util'
export default {
  name: 'search-List',
  data () {
    return {
      playList: [],
      playIndex: -1,
      playMusic: {},
      title: ''
    }
  },
  props: {
    music: {
      type: Object
    }
  },
  computed: {
    // 计算当前播放的音乐在列表中的位置
    playingIndex () {
      let index = this.playList.indexOf(this.music.playing)
      index = index < 0 ? 0 : index
      return index
    }
  },
  methods: {
    // 事件 点击改变播放状态 - 播放、暂停
    togglePlayStatus (music, index, event) {
      this.playMusic = {index: index, music: music}
      if (this.playIndex === index) {
        this.playIndex = -2
        this.music.pause()
      } else {
        this.playIndex = index
        this.music.play(music)
      }
    },
    // playStatus (index) {
    //   // this.playIndex = index
    //   if (this.playIndex < 0) {
    //     this.playIndex = index
    //   }
    // },
    // 设置列表音乐的播放状态 - 父组件调用
    play (status) {
      let index = this.playList.indexOf(this.music.playing)
      if (index >= 0) {
        this.playIndex = status ? this.playingIndex : -2
      } else {
        this.playIndex = -2
      }
    },
    // 设置播放列表 - 父组件调用
    songList (list, title) {
      this.playList = list
      if (title) {
        this.title = title
      }
      this.play(true)
    },
    // 事件 添加音乐到播放列表中 （触发isPlayList）
    pushPlayList (music) {
      let index = this.music.playList.indexOf(music)
      if (index < 0) {
        this.music.playList.push(music)
      }
      this.$set(music, 'isPlayList', true)
    },
    //
    // isPlayList (music) {
    //   let index = this.music.playList.indexOf(music)
    //   return index < 0
    // },
    // 播放列表移除音乐 - 父组件调用
    removePlayList (music) {
      let index = this.playList.indexOf(music)
      if (index >= 0) {
        music.isPlayList = false
      }
    },
    // 事件 关闭列表 （触发close-search-list）
    closeBtn () {
      this.$emit('close-search-list', false)
    }
  },
  filters: {
    // 格式化音乐时间
    intervalTime (v) {
      return `${formatTime(Math.floor(v / 60))}:${formatTime(Math.floor(v % 60))}`
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/less/mixin.less';
.search-List-wrap {
  position: relative;
  height: 100%;
  min-width: 440px;
  .search-header {
    padding: 30px 8%;
    display: flex;
    // height: 30px;
    .logo {
      flex: 0 0 100px;
      width: 100px;
      opacity: 0.3;
      z-index: 10;
      vertical-align: middle;
      &:hover {
         opacity: 1;
      }
    }
    .title {
      flex: 1;
      font-size: 25px;
      line-height: 30px;
      text-align: center;
      vertical-align: middle;
    }
    .close-btn {
      flex: 0 0 50px;
      width: 50px;
      height: 30px;
      margin-left: 50px;
      border-radius: 15px;
      font-size: 12px;
      vertical-align: middle;
      background: @input-bgColor;
      border: 1px solid @base-borderColor;
      color: @base-fColor;
      outline: none;
      transition: .5s;
      cursor: pointer;
      &:hover {
        border: 1px solid @current-color;
      }
    }
  }
  .music-list-main {
    overflow-y: scroll;
    height: 100%;
    padding: 0 6% 100px;
    .music-list-header {
      font-size: 0;
      .music-list-header-name,
      .music-list-header-author,
      .music-list-header-album,
      .music-list-header-time {
        display: inline-block;
        font-size: 14px;
        height: 50px;
        line-height: 50px;
        cursor: default;
      }
      .music-list-header-name {
        width: 34%;
        padding: 0 0 0 40px;
      }
      .music-list-header-author {
        width: 25%;
      }
      .music-list-header-album {
        width: 25%;
      }
      .music-list-header-time {
        margin-left: 20px;
        width: 50px;
      }
    }
    // overflow-y: scroll;
    // height: 100%;
    // padding: 0 6% 10px;
    .music-list-content {
      font-size: 0;
      .music-list-item {
        position: relative;
        // color: @base-fColor;
        &:hover {
          .song-name {
            padding-right: 100px;
            .song-menu {
              display: block;
            }
          }
        }
        &.playing {
          .song-index {
            position: absolute;
            color: transparent;
            &::before {
              position: absolute;
              top: 50%;
              right: 0;
              width: 10px;
              height: 10px;
              transform: translate3d(0,-50%,0);
              .status-image('wave');
              content: '';
            }
          }
          .song-name {
            span {
              color: @current-color;
            }
            .song-menu {
              .song-menu-status {
                .icon-image('icon_list_menu.png',-78px,-198px);
                &:hover {
                  .icon-image('icon_list_menu.png',-118px,-198px);
                }
              }
            }

          }
          .song-singer {
            color: @current-color;
          }
        }
        .song-index,
        .song-name,
        .song-singer,
        .song-album,
        .song-interval {
          display: inline-block;
          height: 50px;
          line-height: 50px;
          font-size: 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          cursor: default;
        }
        .song-index {
          position: absolute;
          top: 0;
          left: 0;
          width: 25px;
          text-align: right;
        }
        .song-name {
          position: relative;
          padding: 0 10px 0 30px;
          width: 34%;
          .song-menu {
            position: absolute;
            display: none;
            top: 0;
            right: 5%;
            font-size: 0;
            z-index: 1;
            .song-menu-status {
              display: inline-block;
              width: 40px;
              height: 40px;
              margin-top: 5px;
              border-radius: 20px;
              transition: .3s;
              cursor: pointer;
              // border: 1px solid @base-borderColor;
              .icon-image('icon_list_menu.png',-78px,1px);
              &:hover {
                .icon-image('icon_list_menu.png',-118px,1px);
              }

            }
            .song-menu-add {
              display: inline-block;
              width: 40px;
              height: 40px;
              margin-top: 5px;
              transition: .3s;
              cursor: pointer;
              .icon-image('icon_list_menu.png',-78px,-78px);
              &:hover {
                .icon-image('icon_list_menu.png',-118px,-78px);

              }
            }
          }
        }
        .song-singer {

          width: 25%;
        }
        .song-album {
          width: 25%;
        }
        .song-interval {
          margin-left: 20px;
          width: 50px;
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .search-List-wrap {
  min-width: 320px;
  .search-header {
    padding: 30px 5%;
    width: 100%;
    .logo {
      flex: 0 0 78px;
      width: 78px;
      padding-top: 5px;
      img {
        display: block;
      }
    }
    .title {
      display: inline;
      font-size: 14px;
      padding: 0 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .close-btn {
      margin-left: 0;
    }
  }
  .music-list-main {
    padding: 0 2% 100px;
    .music-list-content {
      .music-list-item {
        .song-index,
        .song-name,
        .song-singer,
        .song-album,
        .song-interval {
          line-height: 32px;
          font-size: 12px;
        }
        .song-index {
          line-height: 50px;
        }
        .song-name {
          padding: 0 100px 0 30px;
          width: 100%;
          &::after {
            position: absolute;
            top: 20px;
            left: 30px;
            width: 70%;
            font-size: 10px;
            color: @songInfo-fColor;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            content: attr(data-songInfo);
          }
          .song-menu {
            display: block;
            right: 2%;
          }
        }
      }
    }
  }
}
}
</style>
