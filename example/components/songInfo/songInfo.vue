<template>
<div class="song-info-wrap">
  <div class="song-cover-wrap">
    <div class="song-cover-content" :class="{playing: playingStatus }">
      <img class="song-cover-img" :src="photoUrl" alt="">
    </div>
    <div ref="coverNeedle" class="song-cover-needle" :style="{transform: `rotate(${needleDeg}deg)`}"></div>
  </div>
  <div class="song-info-content">
    <h2 class="song-info-name">歌曲名：{{music.playing.songname}}</h2>
    <div class="song-info-author">歌手名：{{music.playing.singer}}</div>
    <div class="song-info-special">专辑名：{{music.playing.albumname}}</div>
  </div>
</div>
</template>

<script>
const PAUSE_DEFAULT_DEG = -55
const PLAY_DEFAULT_DEG = -40
export default {
  name: 'songInfo',
  data () {
    return {
      // 播放开始位置：-40 播放结束位置：-25  默认位置：-55
      needleDeg: PAUSE_DEFAULT_DEG,
      playingStatus: false
    }
  },
  props: {
    music: {
      type: Object
    }
  },
  computed: {
    // 设置音乐封面图片
    photoUrl () {
      return this.music.getPhotoUrl()
    }
  },
  methods: {
    // 设置播放状态 - 父组件调用
    play (status) {
      this.needleDeg = -40
      this.playingStatus = status
      // this.playMusic = music
    },
    // 设置指针进度 - 父组件调用
    playStartDeg (current) {
      let step = 15 / this.music.playing.interval * current
      this.needleDeg = PLAY_DEFAULT_DEG + step
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/less/mixin.less';
.song-info-wrap {
  flex: 0 0 500px;
  width: 500px;
  margin-top: 30px;
  .song-cover-wrap {
    position: relative;
    margin: 0 auto;
    width: 200px;
    height: 300px;
    .song-cover-content {
      position: relative;
      top: 50px;
      height: 200px;
      border-radius: 50%;
      background: url('../../assets/disc_default.png') no-repeat 0 0/cover;
      &.playing {
        animation: circling 20s linear infinite;
      }
      &::before {
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        background: url('../../assets/disc-ip6.png') no-repeat 0 0/cover;
        content: '';

      }
      .song-cover-img {
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 130px;
        height: 130px;
        border-radius: 50%;

      }
    }
    .song-cover-needle {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 38px;
      height: 130px;
      transform-origin: center 10px;
      transform: rotate(-55deg);
      background: url('../../assets/needle-ip6@1x.png') no-repeat 0 0/cover;
    }
  }
  .song-info-content {
    line-height: 30px;
    font-size: 14px;
    text-align: center;
    .song-info-name,
    .song-info-author {
      margin-bottom: 10px;
    }
  }
}
@media (max-width:1200px) {
  .song-info-wrap {
    flex: 0 0 280px;
    width: 280px;
  }
}
@media (max-width: 768px) {
  .song-info-wrap {
    margin: 0 auto;
  .song-cover-wrap {
    height: 280px;
  }
  .song-info-content {
    line-height: 18px;
    font-size: 12px;
  }
}
}
</style>
