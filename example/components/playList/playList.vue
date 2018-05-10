<template>
  <transition name="play-list">
    <div id='play-list-wrap' v-show="isShowPlayList">
      <div class="play-list-main">
        <ul class="play-list-header hidden">
        <li class="play-list-header-name">歌名</li>
        <li class="play-list-header-author">歌手</li>
        <li class="play-list-header-time">时长</li>
      </ul>
      <i class="border-line"></i>
      <ul class="play-list-content">
        <li class="play-list-item " :class="{playing: playIndex === index}" v-for="(item,index) in playList" :key="index">
          <div class="song-index">{{index+1}}</div>
          <div class="song-name" :data-singer="`- ${item.singer}`">
            <span :title="item.songname">{{item.songname}}</span>
            <div class="song-menu">
                <span class="song-menu-status" :title="playIndex === index ? '暂停': '播放'" @click="togglePlayStatus(item,index,$event)"></span>
                <span class="song-menu-remove" @click="removeMusic(item)" title="删除"></span>
            </div>
          </div>
          <div class="song-singer hidden" :title="item.singer">{{item.singer}}</div>
          <div class="song-interval hidden">{{item.interval | intervalTime }}</div>
          <i class="border-line"></i>
        </li>
      </ul>
      </div>
      <div  class="close-btn">
        <button v-if="isShowCloseBtn" @click="closePlayList(false)" class="close-btn">关闭</button>
      </div>
    </div>
  </transition>
</template>

<script>
import { formatTime } from '../../common/js/util'
export default {
  name: 'playList',
  data () {
    return {
      playList: [],
      playIndex: -1,
      playMusic: {},
      isShowPlayList: false,
      isShowCloseBtn: false
    }
  },
  props: {
    music: {
      type: Object
    }
  },
  computed: {
    // 计算正在播放歌曲在列表中的索引
    playingIndex () {
      let index = this.music.playList.indexOf(this.music.playing)
      index = index < 0 ? 0 : index
      return index
    },
    // 设置在不同视口下播放列表是显示还是隐藏
    showPlayList () {
      let width = document.body.clientWidth
      if (width > 768) {
        this.closePlayList(true)
      }
      if (width <= 768 && this.isShowPlayList) {
        this.closePlayList(false)
      }
      return this.isShowPlayList
    }
  },
  created () {
    // 事件 窗口改变大小事件
    window.onresize = this._resize
  },
  mounted () {
    // 首次打开式判断视口大小
    this._resize()
  },
  methods: {
    // 事件 切换播放列表中歌曲的播放状态
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
    // 无用方法
    // playStatus (index) {
    //   console.log('触发播放', this.playIndex)
    //   // this.playIndex = index
    //   if (this.playIndex < 0) {
    //     this.playIndex = index
    //   }
    // },
    // 设置播放列表音乐的播放状态 - 父组件调用
    play (status) {
      let index = this.music.playList.indexOf(this.music.playing)
      if (index >= 0) {
        this.playIndex = status ? this.playingIndex : -2
      } else {
        this.playIndex = -2
      }
    },
    // 设置播放列表 - 父组件调用
    songList (list) {
      this.playList = list
    },
    // 事件 在播放列表中移除音乐
    removeMusic (music) {
      let index = this.music.playList.indexOf(music)
      if (index >= 0) {
        this.music.playList.splice(index, 1)
        this.$emit('remove-item', music)
      }
    },
    // 事件 关闭播放列表
    closePlayList (status) {
      this.isShowPlayList = status
    },
    // 事件 视口改变事件
    _resize (event) {
      let width = document.body.clientWidth
      if (width > 768) {
        this.isShowPlayList = true
        this.isShowCloseBtn = false
      } else {
        this.isShowCloseBtn = true
      }
      if (width <= 768 && this.isShowPlayList) {
        this.isShowPlayList = false
      }
    }
  },
  filters: {
    // 音乐时间格式化
    intervalTime (v) {
      return `${formatTime(Math.floor(v / 60))}:${formatTime(Math.floor(v % 60))}`
    }
  }

}
</script>

<style lang="less" scoped>
@import '../../common/less/mixin.less';
#play-list-wrap {
  position: relative;
  flex: 1;
  height: 100%;
  .play-list-main {
    overflow-y: scroll;
    height: 100%;
    .play-list-header {
      font-size: 0;
      .play-list-header-name,
      .play-list-header-author,
      .play-list-header-time {
        display: inline-block;
        font-size: 14px;
        height: 50px;
        line-height: 50px;
        cursor: default;
      }
      .play-list-header-name {
        width: 50%;
        padding-left: 40px;
      }
      .play-list-header-author {
        width: 25%;
      }
      .play-list-header-time {
        margin-left: 20px;
        width: 50px;
      }
    }
    .play-list-content {
      font-size: 0;
      .play-list-item {
        position: relative;
        // color: @base-fColor;
        &:hover {
          .song-name {
            .song-menu {
              display: block;
            }
          }
        }
        &.playing {
          .song-index {
            // position: relative;
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
          width: 35px;
          text-align: right;
        }
        .song-name {
          position: relative;
          padding: 0 0 0 40px;
          width: 50%;
          .song-menu {
            position: absolute;
            display: none;
            top: 0;
            right: 30px;
            font-size: 0;
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
            .song-menu-remove {
              display: inline-block;
              width: 40px;
              height: 40px;
              margin-top: 5px;
              transition: .3s;
              cursor: pointer;
              .icon-image('icon_list_menu.png',-78px,-158px);
              &:hover {
                .icon-image('icon_list_menu.png',-118px,-158px);

              }
            }
          }
        }
        .song-singer {

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

@media (max-width:768px) {
/* #region 动画 */
  .play-list-enter-active,
  .play-list-leave-active {
    transition: 1S;
  }
  .play-list-enter,
  .play-list-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translate3d(0, 120%, 0);
  }
/* #endregion */

#play-list-wrap {
  position: fixed;
  left: -6.75%;
  bottom: 0;
  width: 113.64%;
  height: 50%;
  z-index: 999;
  background: @playList-bgColor;
  .play-list-main {
    height: 88%;
    .play-list-content {
      padding: 0 10px;
      .play-list-item {
        .song-index,
        .song-name,
        .song-singer,
        .song-interval {
          line-height: 50px;
          font-size: 12px;
        }
        .song-index {
          width: 30px;
        }
        .song-name {
          padding: 0 100px 0 40px;
          width: 100%;
          &::after {
            margin-left: 1px;
            font-size: 10px;
            color: @songInfo-fColor;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            content: attr(data-singer);
          }
          .song-menu {
            display: block;
            right: 4%;
          }
        }
      }
    }
  }
  .close-btn {
    position: absolute;
    left: -6.75%;
    bottom: 0;
    width: 113.64%;
    height: 40px;
    outline: none;
    font-size: 12px;
    background: @playListBtn-bgColor;
    border: none;
    color: @current-color;
    z-index: 999;
  }
}
}
</style>
