<template>
  <div class='header-wrap'>
    <ul class="content">
      <li v-if="isShowView" class="logo hidden">
        <a href="javascript:;">
          <img src="http://webapi.yuzhers.com/api/image/?n=player_logo.png" alt="QQ音乐播放器">
        </a>
      </li>
      <li class="search">
        <div class="content">
          <input v-model="searchMusicName" type="search" name="name" @keypress="searchMusic" title="按[Enter]搜索歌曲" placeholder="歌名、歌手、专辑">
          <!-- <button class="search-btn" @click="searchMusic" title="[回车]或者点击[我]搜索歌曲" >
            <i class="icon"></i>
          </button> -->
        </div>
      </li>
      <li class="hot-top-btns">
        <button class="hot-top-btn" @click="hotTotList" title="巅峰热歌榜">
          <span class="hidden">巅峰热歌榜</span>
          <span v-if="!isShowView" class="btn-line"></span>
          <span v-if="!isShowView" class="btn-line"></span>
          <span v-if="!isShowView" class="btn-line"></span>
        </button>
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
    searchMusic (event) {
      if ((event.charCode && event.charCode === 13) || !event.charCode) {
        if (this.searchMusicName) {
          this.music.search(this.searchMusicName)
          this.$emit('search-music', this.isShow, this.searchMusicName)
        }
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
      overflow: hidden;
      .content {
        position: relative;
        margin: 0 auto;
        max-width: 300px;
        input {
          -webkit-appearance: textfield;
          -webkit-box-sizing: content-box;
          height: 30px;
          width: 100%;
          padding: 0 35px 0 15px;
          border-radius: 15px;
          font-size: 14px;
          outline: none;
          background: @input-bgColor;
         .icon-image('search-ico.png',96%, center);
          background-size: 18px;
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
        height: 32px;
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
@media (max-width: 768px) {
  .header-wrap {
    .content {
      .search {
        .content {
          input {
            border-radius: 15px 0 0 15px ;
          }
        }
    }
      .hot-top-btns {
        flex: 0 0 50px;
        width: 50px;
        .hot-top-btn{
          width: 45px;
          border-radius: 0 15px 15px 0;
          padding: 0 12px 0 6px;
          &:hover {
            .btn-line {
              background: @current-color;
            }
          }
          .btn-line {
            display: block;
            margin: 5px 0;
            height: 1px;
            line-height: 2px;
            background: @songInfo-fColor;
            transition: .5s;
            &:nth-child(3) {
              width: 30px;
            }
          }
        }
      }
    }
  }
}
</style>
