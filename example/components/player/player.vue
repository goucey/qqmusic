<template>
  <div class='player-wrap'>
    <div class="player-btn-wrap">
      <div class="player-btn-prev" @click="toggleMusic(false,$event)" title="上一曲"></div>
      <div class="player-btn-play" :class="{pause: isPlay, play: !isPlay}" @click="togglePlayStatus" :title="isPlay?'暂停':'播放'"></div>
      <div class="player-btn-next" @click="toggleMusic(true,$event)" title="下一曲"></div>
    </div>
    <div class="player-music">
      <div class="player-music-info">
        <div class="player-music-text hidden" v-if="isShowView" :title="`${music.playing.songname} - ${music.playing.singer}`">
        <span class="player-music-name">{{music.playing.songname}}</span>
        -
        <span class="player-music-name">{{music.playing.singer}}</span>
        </div>
        <!-- <div v-if="isShowView" class="player-music-time hidden">{{current | intervalTime }} / {{music.playing.interval | intervalTime }}</div> -->
        <div class="player-music-current-time">{{current | intervalTime }}</div>
        <div class="player-music-time">{{music.playing.interval | intervalTime }}</div>
      </div>
     <div class="progress-wrap">
       <playProgress @toggleValue="toggleCurrentTime" :buffer="music.bufferProgress" :isDrag ="false"  :max="music.playing.interval" :current="current"></playProgress>
     </div>
    </div>
    <div class="player-other-btn">
        <div class="player-btn-style" :class="playerStyles[music.options.playerStyle]" @click="togglePlayerStyle" :title="playerStylesTitle[music.options.playerStyle]"></div>
        <div class="player-volume hidden" v-if="isShowView" >
          <div class="player-volume-icon" :class="{'close-volume': volume === 0}" @click="closeVolume" :title="`音量：${showVolume}`"></div>
          <div class="player-volume-progress">
              <playProgress @toggleValue="toggleVolume" :max="1" :current="volume"></playProgress>
          </div>
        </div>
        <div class="player-btn-playing-list" @click="openPlayList" title="播放列表"></div>
    </div>
  </div>
</template>

<script>
import playProgress from '../../components/playProgress/playProgress'
import { formatTime } from '../../common/js/util'
export default {
  name: 'player-wrap',
  data () {
    return {
      volume: this.music.options.volume,
      playerStylesIndex: 0,
      isPlay: false,
      current: 0
    }
  },
  props: {
    music: {
      type: Object
    }
  },
  created () {
    this.playerStyles = ['list', 'order', 'random', 'single']
    this.playerStylesTitle = ['列表循环', '顺序播放', '随机播放', '单曲循环']
  },
  computed: {
    // 处理音量数据格式
    showVolume () {
      return Math.floor(this.volume * 100)
    },
    // 手机访问时 控制是否显示某些视图
    isShowView () {
      let width = document.body.clientWidth
      return width > 768
    }
  },
  components: {
    playProgress
  },
  methods: {
    // 事件 关闭音量或静音
    closeVolume (event) {
      if (this.volume > 0) {
        this.music.options.muted = true
        this.volume = 0
      } else {
        this.music.options.muted = false
        this.volume = this.music.options.volume
      }
    },
    // 事件 切换播放模式 - 循环播放、顺序播放、随机播放、单曲循环
    togglePlayerStyle (event) {
      let index = this.music.options.playerStyle
      index++
      this.music.options.playerStyle = index >= this.playerStyles.length ? 0 : index
    },
    // 事件 切换播放按钮 - 开始、暂停
    togglePlayStatus () {
      if (this.music.playList.length > 0) {
        this.isPlay = !this.isPlay
        if (!this.isPlay) {
          this.music.pause()
        } else {
          this.music.play(this.music.playing, true)
        }
      }
    },
    // （滑动）调整音量大小 - 子组件事件
    toggleVolume (val) {
      this.volume = val
      this.music.options.volume = val
      this.music.options.muted = false
    },
    // 设置播放状态 - 父组件调用
    play (music) {
      this.isPlay = music
    },
    // 设置播放进度 - 父组件调用
    timeUpdate (t) {
      this.current = t
    },
    // 事件 手动切换歌曲 - 上一曲、下一曲
    toggleMusic (status, event) {
      this.music.toggleMusic(status)
    },
    // 事件 打开播放列表 （触发playing-list）
    openPlayList () {
      this.$emit('playing-list')
    },
    // 设置播放进度
    toggleCurrentTime (val) {
      this.current = this.music.options.currentTime = val
    }
  },
  filters: {
    // 歌曲时间格式处理
    intervalTime (v) {
      return `${formatTime(Math.floor(v / 60))}:${formatTime(Math.floor(v % 60))}`
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/less/mixin.less';
.player-wrap {
  position: relative;
  margin: 20px 0 0 0;
  .player-btn-wrap {
    position: absolute;
    top: 6px;
    left: 0;
    bottom: 0;
    margin: auto;
    font-size: 0;
    .player-btn-prev,
    .player-btn-play,
    .player-btn-next {
      display: inline-block;
      width: 20px;
      height: 20px;
      vertical-align: middle;
      opacity: .8;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
    .player-btn-prev {
      .icon-image('prev-song');
    }
    .player-btn-play {
      margin: 0 50px;
      height: 30px;
      transition: .3s ease-out;
      &.play {
        .icon-image('play');
      }
      &.pause {
        .icon-image('pause');
      }
    }
    .player-btn-next {
      .icon-image('next-song');
    }
  }
  .player-music {
    margin: 0 220px 0 200px;
    height: 42px;
    font-size: 14px;
    .player-music-info {
      position: relative;
      padding-right: 100px;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      .player-music-text {
        overflow: hidden;
        white-space:  nowrap;
        text-overflow: ellipsis;
      }
      .player-music-current-time {
        position: absolute;
        top: 0;
        right: 46px;
        &::after {
          margin-left: 10px;
          content: '/'
        }
      }
      .player-music-time {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .progress-wrap {
      padding: 10px 0;
    }
  }
  .player-other-btn {
    position: absolute;
    top: 8px;
    right: 0;
    bottom: 0;
    margin: auto;
    font-size: 0;
    .player-btn-style,
    .player-volume {
      display: inline-block;
      vertical-align: middle;
    }
    .player-btn-style {
      width: 26px;
      height: 26px;
      opacity: .8;
      cursor: pointer;
      transition: .3s ease-out;
      &.list {
        .icon-image('loop-list');
      }
      &.order {
        .icon-image('play-list');
      }
      &.random {
        .icon-image('random-play');
      }
      &.single {
        .icon-image('loop-one');
      }
      &:hover {
        opacity: 1;
      }
    }
    .player-volume {
      // width: 100px;
      .player-volume-icon,
      .player-volume-progress {
        display: inline-block;
        vertical-align: middle;
      }
      .player-volume-icon {
        margin: 0 10px 0 20px;
        width: 26px;
        height: 26px;
        opacity: .8;
        cursor: pointer;
        transition: .5s ease-in-out;
        .icon-image('volume');
        &.close-volume {
          .icon-image('close-volume');
        }
        &:hover {
          opacity: 1;
        }
      }
      .player-volume-progress {
        width: 100px;
      }
    }
  }
}
@media (max-width: 768px) {
  .player-wrap {
    width: 100%;
    .player-btn-wrap {
      top: 45px;
      width: 100%;
      margin: 0;
      padding: 0 50px;
      text-align: center;
      .player-btn-play {
        margin: 0 30%;
      }
    }
    .player-music {
      position: relative;
      margin: 0 50px;
      .player-music-info {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        .player-music-current-time {
          left: -50px;
           &::after {
            margin-left: 0;
            content: ''
          }
        }
        .player-music-time {
          right: -50px;
        }
      }
    }
    .player-other-btn {
      top: 45px;
      width: 100%;
      .player-btn-playing-list {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 30px;
        opacity: .8;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
        transition: .3s ease-out;
        .icon-image('playing-list');
        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>
