<template>
  <div class="v-top-timeline">
    <ul class="top_timeline">
      <li v-for="(item,index) in progress" :class="{active:curStep>=index,current:cur===index}" :key="index">
        <Button class="nostyle" :disabled="curStep<index" @click="pageTo(item.url)">
          <span class="timeline_icon">{{index+1}}</span>
          <br />
          <span class="timeline_text">{{item.text}}</span>
        </Button>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "top-timeline",
    data() {
      return {
        stage: ["功能设置", "设置APP界面", "虚拟设备调试", "发布产品"],
        urls: ['/home/set', '/home/setapp', '/home/debug', '/home/release']
      };
    },
    props: {
      curStep: Number,
      cur: Number,
      id: String
    },
    computed: {
      progress() {
        let data = [];
        if (this.curStep > 3) {
          this.urls = ['/home/set', '/home/setapp', '/home/debug', '/home/releaseSuc'];
        }
        for (let i = 0; i < this.stage.length; i++) {
          console.log(this.curStep);
          data.push({
            text: this.stage[i],
            url: this.urls[i]
          });
        }
        return data;
      }
    },
    methods: {
      pageTo(url) {
        let query = { id: this.id };
        this.$router.push({
          path: url,
          query: query
        });
      },
    },
    mounted() { }
  };
</script>
<style lang="less" scoped>
  .v-top-timeline {
    display: inline-block;
  }

  .top_timeline {
    display: inline-block;
    margin: 0 auto;
    list-style-type: none;
    text-align: center;
    overflow: hidden;
    li {
      position: relative;
      width: 160px;
      height: 59px;
      padding-top: 5px;
      box-sizing:content-box;
      float: left;
      text-align: center;
      &:before {
        content: "";
        position: absolute;
        top: 17px;
        right: 93px;
        width: 158px;
        height: 0;
        border-top: 1px dashed rgba(23, 35, 61, 0.15);
        z-index: 0;
      }
      &:first-child:before {
        display: none;
      }
      &.active {
        & .timeline_icon {
          border-color: #008cf8;
          color: #008cf8;
        }
        &:before {
          border-color: #008cf8;
        }
      }
      &.current {
        border-bottom: 2px solid #008cf8;
        background: rgba(23, 35, 61, 0.03);
        & .timeline_text {
          font-weight: bold;
          color: #008cf8;
        }
      }
      .nostyle {
        background: transparent;
        margin: 0;
        padding: 0;
        border: none;
        outline: none;
        transition: none;
        -webkit-appearance: none;
      }
    }
    .timeline_icon {
      position: relative;
      display: inline-block;
      width: 27px;
      height: 27px;
      background: #fff;
      border: 1px solid rgba(23, 35, 61, 0.25);
      border-radius: 50%;
      line-height: 25px;
      color: rgba(23, 35, 61, 0.25);
      font-family: HelveticaNeue-Medium;
      font-size: 13px;
      font-weight: bold;
      z-index:1;
    }
    .timeline_text {
      display: inline-block;
      margin-top: 3px;
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: rgba(23, 35, 61, 0.80);
      letter-spacing: 0;
      text-align: center;
      line-height: 22px;
    }
  }
</style>