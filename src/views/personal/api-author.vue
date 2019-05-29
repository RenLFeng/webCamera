<!-- 个人中心-云API授权 -->
<template>
  <div class="api-author">
    <div class="box">
      <div class="box-hd">云API授权</div>
      <div class="box-bd">云API授权内容</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "apiAuthor",
  data() {
    return {

    }
  },
  beforeCreate() {
    // 传值给父级personal.vue（选中云API授权）
    this.$emit("set-personal-menu", "api-author");
  },
  created() {

  },
  methods: {

  }
};
</script>
<style lang="less" scoped>
.api-author {
}
</style>