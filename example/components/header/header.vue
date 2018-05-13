<template>
  <div class='header-wrap'>
    <ul class="content">
      <li class="logo">
        <a href="javascript:;">
          <img src="http://webapi.yuzhers.com/api/image/?n=player_logo.png" alt="QQ音乐播放器">
        </a>
      </li>
      <li class="search">
        <div class="content">
          <input v-model="searchMusicName" type="text" name="name" placeholder="歌名、歌手、专辑">
          <button class="search-btn" @click="searchMusic" >
            <i class="icon"></i>
          </button>
        </div>
      </li>
      <li class="hot-top-btns hidden" v-if="isShowView">
        <button class="hot-top-btn" @click="hotTotList">巅峰热歌榜</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'header-wrap',
  data () {
    return {
      isShow: false,
      searchMusicName: ''
    }
  },
  props: {
    music: {
      type: Object
    }
  },
  computed: {
    // 判断是否是手机端访问，主要用于显示视图
    isShowView () {
      let width = document.body.clientWidth
      return width > 768
    }
  },
  methods: {
    // 事件 巅峰热歌榜按钮 （触发hot-top）
    hotTotList () {
      if (!this.isShow) {
        this.isShow = true
        if (!this.music.hotTop) {
          this.music.getHotTopList()
        }
      } else {
        this.isShow = false
      }
      this.$emit('hot-top', true)
    },
    // 事件 搜索歌曲事件 （触发search-music）
    searchMusic () {
      if (this.searchMusicName) {
        this.music.search(this.searchMusicName)
        this.$emit('search-music', this.isShow, this.searchMusicName)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/less/mixin.less';
.header-wrap {
  padding: 20px 0;
  width: 88%;
  margin: 0 auto;
  z-index: 4;
  .content {
    display: flex;
    .logo {
      flex: 0 0 100px;
      width: 100px;
      opacity: 0.3;
      z-index: 10;
      &:hover {
         opacity: 1;
      }
    }
    .search {
      z-index: 3;
      flex: 1;
      text-align: center;
      .content {
        position: relative;
        margin: 0 auto;
        max-width: 300px;
        input {
          height: 30px;
          width: 100%;
          padding: 0 35px 0 15px;
          border-radius: 15px;
          font-size: 14px;
          outline: none;
          background: @input-bgColor;
          border: 1px solid @base-borderColor;
          color: @base-fColor;
          transition: .8s;
          &::placeholder {
            color: @base-fColor;
          }
          &:focus,
          &:hover {
            border: 1px solid @current-color;
          }

        }
        .search-btn {
          position: absolute;
          top: 1px;
          right: 5px;
          width: 30px;
          height: 28px;
          border: none;
          outline: none;
          border-radius: 14px;
          background: @input-bgColor;
          cursor: pointer;
          &:hover {
            .icon {
              opacity: 1;
            }
          }
          .icon {
            display: block;
            width: 100%;
            height: 100%;
            .icon-image('icon_sprite.png',1px,-34px);
            opacity: 0.3;
          }

        }
      }
    }
    .hot-top-btns {
      z-index: 3;
      flex: 0 0 100px;
      text-align: center;
      .hot-top-btn{
        width: 90px;
        height: 30px;
        border-radius: 15px;
        font-size: 12px;
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
  }
}
</style>
