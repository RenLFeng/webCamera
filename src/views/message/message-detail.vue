<!-- 消息中心-消息详情 -->
<template>
    <div class="message-detail">
        <div class="box">
            <div class="box-hd">消息详情哟</div>
            <div class="box-bd">嘿嘿~~~</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "messageDetail",
    data() {
        return {

        }
    },
    beforeCreate() {
        // 传值给父级message.vue（不显示菜单）
        this.$emit("no-menu", true);
    },
    created() {

    },
    methods: {

    }
};
</script>
<style lang="less">
</style>