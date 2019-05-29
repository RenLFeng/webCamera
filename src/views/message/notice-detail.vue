<!-- 消息中心-通知消息 -->
<template>
    <div class="notice-detail">
        <div class="box">
            <div class="box-bd">
                <div class="article">
                    <div class="text-center" style="margin-bottom: 20px;">
                        <h2 class="text-center">{{notice.title}}</h2>
                        <span class="gray">{{notice.createdate}}</span>
                    </div>
                    <div class="content" v-html="notice.detail">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "noticeDetail",
        data() {
            return {
                id: this.$route.query.id,
                developerID: window.localStorage.getItem('developerID'),
                notice: {}
            }
        },
        beforeCreate() {
            // 传值给父级message.vue（选中后台公告）
            this.$emit("set-message-menu", "backstage-notice");
        },
        created() {
            this.detail();
        },
        methods: {
            //查看详情并把未读设为已读
            detail() {
                console.log(this.id);
                const that = this;
                this.axios.get(this.api.noticedetail, {
                    data: {
                        noticeID: that.id,
                        devID: that.developerID,
                    }
                }).then(res => {
                    if (res.result == '1') {
                        console.log(res);
                        this.notice = res.data;
                    }
                }).catch(res => {
                    console.log(res);
                });
            },
        }
    };
</script>
<style lang="less" scoped>
    .notice-detail {
        .article{
            padding: 30px;
        }
        .text-center {
            text-align: center;
        }
        .h2,
        h2 {
            font-size: 30px;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .gray {
            color: #999;
        }
        .content {
            width: auto;
            padding: 30px 30px;
            P {
                margin: 0 0 10px;
            }
        }
    }
</style>