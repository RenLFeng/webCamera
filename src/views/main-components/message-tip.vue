<template>
    <div class="message-con">
        <!-- <Tooltip :content="value > 0 ? '有' + value + '条未读消息' : '无未读消息'" placement="bottom">
            <Badge :count="value" dot>
                <Icon type="ios-bell" :size="22" style="color:#fff;"></Icon>
            </Badge>
        </Tooltip> -->
        <Poptip trigger="click" placement="bottom-end" width="320" class="poptip">
            <!-- <Badge :count="value.length" dot> -->
                <Icon type="ios-bell" :size="22" style="color:rgba(255, 255, 255,0.7);line-height:62px;"></Icon>
            <!-- </Badge> -->
            <div slot="content">
                <Tabs value="name1" @on-click="changeTab">
                    <TabPane v-for="(val, key, index) in value" :key="index" :label="key=='bulletin'?'公告('+val.length+')':key=='message'?'消息('+val.length+')':'反馈('+val.length+')'"
                        :name="'name'+(index+1)">
                        <ul>
                            <li v-for="(item,i) in val" @click.stop="goPage(key)">
                                <i class="dot"></i>
                                <span class="notwrap">{{item.title}}</span>
                                <br>
                                <span class="time">{{item.time}}</span>
                            </li>
                        </ul>
                        <div class="clear_msg" v-if="val.length>0" @click="clear(key)">清空{{key=='bulletin'?'公告':key=='message'?'消息':'反馈'}}</div>
                    </TabPane>
                </Tabs>
            </div>
        </Poptip>
    </div>
</template>

<script>
    import util from '@/libs/util.js';
    export default {
        name: 'messageTip',
        props: {
            value: {
                type: Object,
                required: true,
            }
        },
        methods: {
            showMessage() {
                console.log(this.value);
                /* util.openNewPage(this, 'message_index');
                this.$router.push({
                    name: 'message_index'
                }); */
            },
            goPage(key) {
                console.log(key);
                if (key == 'bulletin') {
                    this.$router.push({
                        name: 'backstageNotice'
                    });
                } else if (key == 'message') {
                    this.$router.push({
                        name: 'noticeMessage'
                    });
                } else {
                    this.$router.push({
                        name: 'userFeedback'
                    });
                }
            },
            changeTab(e) {
                console.log(event);
                event.stopPropagation();
            },
            clear(key) {
                event.stopPropagation();
                this.$emit('childClear', key);
            },
        }
    };
</script>
<style lang="less">
    .message-con {
        .poptip {
            .ivu-poptip-popper {
                margin-right: -12px;
                margin-top: -20px;
                ul {
                    max-height: 287px;
                    overflow-y: auto;
                    li {
                        padding-bottom: 15px;
                        border-bottom: 1px solid rgba(23, 35, 61, 0.10);
                        text-align-last: left;
                        font-size: 14px;
                        color: rgba(23, 35, 61, 0.80);
                        .notwrap {
                            display: inline-block;
                            width: 250px;
                            vertical-align: middle;
                            text-align:left;
                        }
                        .dot {
                            display: inline-block;
                            width: 10px;
                            height: 10px;
                            border-radius: 50%;
                            margin-right: 5px;
                            background: #38BA4C;
                            vertical-align: middle;
                        }
                        .time {
                            padding-left: 15px;
                            font-size: 12px;
                            color: rgba(23, 35, 61, 0.55);
                            text-align:left;
                        }
                    }
                }
                .clear_msg {
                    padding: 17px 0;
                    text-align: center;
                    font-size: 14px;
                    color: rgba(23, 35, 61, 0.55);
                    cursor: pointer;
                }
            }
        }
    }
</style>