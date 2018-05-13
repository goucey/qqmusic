<template>
   <div ref="inner" class="progress-inner" @click.self="changeVolume">
      <div class="buffer-progress" @click.self="changeVolume" :style="{width: `${buffer}%`}">
      </div>
      <div class="progress-play" @click.self="changeVolume" :style="{width: `${(100 / max) * current}%`}" >
          <span class="progress-ball" @mousedown="slideVolume"></span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'playProgress',
  data () {
    return {
    }
  },
  props: {
    max: {
      trpe: Number,
      default: 100
    },
    current: {
      trpe: Number,
      default: 0
    },
    isDrag: {
      type: Boolean,
      default: true
    },
    buffer: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    // 事件 鼠标按键弹起
    document.onmouseup = () => {
      document.onmousemove = null
    }
    // 事件 禁止拖动
    document.ondragstart = () => {
      return false
    }
  },
  methods: {
    // 事件 点击设置音量大小 （触发toggleValue）
    changeVolume (event) {
      let [offsetX, parentWidth] = [event.offsetX, this.$refs.inner.offsetWidth]
      let width = 100 / parentWidth * offsetX / 100 * this.max
      this.$emit('toggleValue', width)
    },
    // 事件 点击滑竿设置音量大小 （触发toggleValue）
    slideVolume (event) {
      if (!this.isDrag) {
        return
      }
      let [prevX, clientX, step, prentWidth, tempVolume] = [-99999, 0, 0, this.$refs.inner.offsetWidth, this.current]
      document.onmousemove = event => {
        clientX = event.clientX
        if (prevX === -99999) {
          prevX = event.clientX
        }
        step = ((100 / prentWidth) / 100) * Math.abs(clientX - prevX)
        if (clientX > prevX) {
          tempVolume += step
        } else if (clientX < prevX) {
          tempVolume -= step
        }
        if (tempVolume > this.max) {
          tempVolume = this.max
        } else if (tempVolume <= 0) {
          tempVolume = 0
        }
        this.$emit('toggleValue', tempVolume)
        prevX = clientX
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/less/mixin.less';
 .progress-inner {
   position: relative;
    height: 2px;
    background: @progress-baseColor;
    cursor: pointer;
    .progress-play {
      position: absolute;
      top: 0;
      left: 0;
      height: 2px;
      background: @progress-playColor;
      transition: .3s ease-out;
      .progress-ball {
        position: absolute;
        display: inline-block;
        top: -4px;
        right: -4px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: @progress-ballColor;
      }
    }
    .buffer-progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 2px;
      background: @progress-loadColor;
      transition: .3s ease-out;
    }
  }
</style>
