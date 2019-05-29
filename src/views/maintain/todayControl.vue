<!-- 运维管理-产品库管理 -->
<template>
    <div class="manage-right masterControl">
        <div class="top-bar">
            今日看板
            <div class="condition">
                设备选择：
                <Select v-model="device_id" style="width:160px" placeholder="请选择" @on-change="toggleDevice">
                    <Option value="">全部</Option>
                    <Option v-for="(item,index) in agentList" :value="item.device_id" :key="index">{{ item.device_addr}}</Option>
                </Select>
            </div>
            <Button @click="handleFullScreen" type="primary" class="fr">{{!fullscreen?'全屏':'退出全屏'}}</Button>
        </div>
        <div class="manage-content flex">
            <div class="content_left">
                <ul class="masterControlUl clearfix">
                    <li>
                        <b class="iconfont icon-fenhongjilu"></b>
                        <div>
                            <span>当日客流数</span>
                            <b class="num">{{sysStatus.today_img_total}}</b>
                        </div>
                    </li>
                </ul>
                <div class="img_list_container">
                    <div class="img_list" id="imgList" :class="{hide:!imgListShow}">
                        <ul class="flex">
                            <li v-for="(item,i) in imgList" @click="showLargeImage(item)">
                                <div class="img_container" :style="backgorundStyle(item.img_url)">
                                    <!-- <img :src="!item.img_url?url:api.baseURL+item.img_url" alt=""> -->
                                </div>
                                <p>{{item.img_sex}}<b class="spe"></b>{{item.img_age}}<br>{{item.img_datetime}}</p>
                            </li>
                        </ul>
                    </div>
                    <p class="empty_m" :class="{hide:imgListShow}">
                        暂无数据
                    </p>
                </div>
            </div>
            <div class="chart_container">
                <div class="flex">
                    <div class="chart_left" style="width:33.3%;border:1px solid #eee;">
                        <div class="chart" id="customerGender" :class="{hide:!customerGenderShow}"></div>
                        <p class="empty_m" :class="{hide:customerGenderShow}">
                            暂无数据
                        </p>
                    </div>
                    <div class="chart_right" style="width:33.3%;width:33%;border:1px solid #eee;border-left:none;">
                        <div class="chart" id="customerType" :class="{hide:!customerTypeShow}"></div>
                        <p class="empty_m" :class="{hide:customerTypeShow}">
                            暂无数据
                        </p>
                    </div>
                    <div class="chart_right" style="width:33.4%;border:1px solid #eee;border-left:none;border-right:none;">
                        <div class="chart" id="customerAge" :class="{hide:!customerAgeShow}"></div>
                        <p class="empty_m" :class="{hide:customerAgeShow}">
                            暂无数据
                        </p>
                    </div>
                </div>
                <div class="flex">
                    <div class="chart_left" style="border:1px solid #eee;border-top:none;">
                        <div class="chart" id="appTime" :class="{hide:!appTimeShow}"></div>
                        <p class="empty_m" :class="{hide:appTimeShow}">
                            暂无数据
                        </p>
                    </div>
                    <div class="chart_right" style="border:1px solid #eee;border-top:none;border-left:none;">
                        <div class="chart" id="customerCount" :class="{hide:!customerCountShow}"></div>
                        <p class="empty_m" :class="{hide:customerCountShow}">
                            暂无数据
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "masterControl",
        data() {
            return {
                agent_id: window.localStorage.getItem('agent_id'),
                statistics: {},
                sysStatus: {},
                feedbackTypes: [
                    { text: "全部", selected: false, value: 1 },
                    { text: "未读", selected: false, value: 2 },
                    { text: "标记", selected: false, value: 3 },
                ],
                // 把所有参数都默认设置一下（这里的字段，可以跟参数一样，然后直接把pageData扔进axios里，也可以不一样，然后一个一个取。我偏向于一个一个取，因为我不喜欢下划线）
                pageObj1: {
                    total: 0,
                    current: 1,
                    size: 10
                },
                feedBackData: [],
                modalDetail: false,
                detailItem: {},
                appTime: null,
                appTimeShow: true,
                customerType: null,
                customerTypeShow: true,
                customerCount: null,
                customerCountShow: true,
                customerAge: null,
                customerAgeShow: true,
                customerGender: null,
                customerGenderShow: true,
                rangeTypes: [{
                    text: "今日",
                    selected: true,
                    value: '0'
                }, {
                    text: "本周",
                    selected: false,
                    value: '1'
                }, {
                    text: "本月",
                    selected: false,
                    value: '2'
                }, {
                    text: "全年",
                    selected: false,
                    value: '3'
                }, {
                    text: "",
                    selected: false,
                    value: '4'
                }],
                type: '',
                fromTo: ['', ''],
                device_id: '',
                agentList: [],
                imgList: [],
                imgListShow: true,
                url: require("../../images/product.png"),
                getDataInterval: null,
                fullscreen: false,
            };
        },
        beforeCreate() {
            // 传值给父级main.vue（第二个导航）
            this.$emit("set-manage-menu", "todayControl", true);
        },
        created() {
            // 初次加载获取默认数据
            this.getAgentList();
            this.getSysStatus();
            let that = this;
            async function initGetPageData() {
                await that.getPageData(that.selectData);
                window.dispatchEvent(new Event('resize'));
            }
            initGetPageData();
        },
        mounted() {
            this.appTime = echarts.init(document.getElementById('appTime'));
            this.customerType = echarts.init(document.getElementById('customerType'));
            this.customerCount = echarts.init(document.getElementById('customerCount'));
            this.customerAge = echarts.init(document.getElementById('customerAge'));
            this.customerGender = echarts.init(document.getElementById('customerGender'));
            let that = this;
            setTimeout(function () {
                /* if (!that.getDataInterval) {
                    that.getDataInterval = window.setInterval(function () {
                        that.getPageData(that.selectData)
                    }, 6000);
                } else {
                    window.clearInterval(this.getDataInterval);
                    this.getDataInterval = null;
                    that.getDataInterval = window.setInterval(function () {
                        that.getPageData(that.selectData)
                    }, 6000);
                } */
                //停止刷新
                that.getPageData(that.selectData)
            }, 1000)
            window.addEventListener('resize', () => {
                this.appTime.resize();
                this.customerType.resize();
                this.customerCount.resize();
                this.customerAge.resize();
                this.customerGender.resize();
            });
        },
        destroyed() {
            window.clearInterval(this.getDataInterval);
            this.getDataInterval = null;
        },
        computed: {
            selectData: {
                get: function () {
                    let that = this,
                        data = {
                            timetype: '0',
                        };
                    if (that.device_id) {
                        data.device_id = that.device_id
                    }
                    if (that.agent_id) {
                        data.agent_id = that.agent_id
                    }
                    return data;
                }
            }
        },
        methods: {
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    document.querySelector('.top-header').style.display = 'block';
                    document.querySelector('.mid-content').style.top = '64px';
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                    document.querySelector('.top-header').style.display = 'none';
                    document.querySelector('.mid-content').style.top = '0';
                }
                this.fullscreen = !this.fullscreen;
            },
            //设备选择下拉框动作
            toggleDevice() {
                this.getSysStatus();
                this.getPageData(this.selectData);
            },
            getAgentList() {
                const that = this;
                //获取客户选择下拉框列表
                this.axios.post(this.api.getDeviceNameList, {
                    data: {
                        agent_id: that.agent_id,
                        pageno: 1,
                        pagesize: 100,
                    }
                }).then(res => {
                    console.log(res);
                    if (res.result == "true") {
                        const resData = res.content;
                        that.agentList = resData || [];
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //获取系统状态
            getSysStatus() {
                const that = this;
                that.axios.post(that.api.getSysStatus, {
                    data: that.selectData
                }).then(res => {
                    console.log(res.result);
                    if (res.result === 'true') {
                        const resData = res.content;
                        that.sysStatus = resData;
                    } else {
                        console.log(res.message);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            getPageData(data) {
                console.log(data);
                //不分顺序获取各个图表数据
                this.getDeviceStat(data);
                this.getDeviceStat2(data);
                this.getDeviceStat3(data);
                this.getDeviceStat4(data);
                this.getDeviceStat5(data);
                this.newImglist(data);
            },
            // 点击切换类型并更新数据
            toggleSelect(data) {
                console.log(data);
                // 已经选中了就啥都别做（很多时候都要这么判断一下，免得重复加载，多余动作）
                if (data.selected) {
                    return;
                }
                // 变换样式
                this.rangeTypes.forEach(obj => {
                    obj.selected = false;
                });
                data.selected = true;
                this.type = data.value;
                this.getDeviceStat(this.selectData);
            },
            isDaterange(e) {
                this.fromTo = e;
                this.getDeviceStat(this.selectData);
            },
            newImglist(data) {
                const that = this;
                //获取APP使用时长
                this.axios.post(this.api.newImglist, {
                    data
                }).then(res => {
                    console.log(res);
                    if (res.result == "true" && Object.keys(res.content).length != 0) {
                        const resData = res.content;
                        that.imgList = resData || [];
                        that.imgListShow = true;
                    } else {
                        that.imgListShow = false;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            getDeviceStat(data) {
                const that = this;
                //获取APP使用时长
                this.axios.post(this.api.getDeviceStat, {
                    data
                }).then(res => {
                    console.log(res);
                    if (res.result == "true" && Object.keys(res.content).length != 0) {
                        const resData = res.content;
                        that.appTimeShow = true;
                        that.generateBars(resData, this.appTime, '客流量分析曲线', '时间', '人/次');
                    } else {
                        that.appTimeShow = false;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            generateBars(data, id, name, xname, yname) {
                let label = [], value = [], oldValue = [];
                for (var i in data) {
                    label.push(data[i].date);
                    value.push(data[i].new_img_num);
                    oldValue.push(data[i].old_img_num);
                };
                id.setOption({
                    title: {
                        text: name,
                        textStyle: {
                            fontWeight: 500,
                        },
                    },
                    color: ['#2D8CF0', 'rgba(255,102,51,.7)'],
                    legend: {
                        data: ['本周', '上周']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'cross'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        // formatter: '{b}:{c}' + yname
                        formatter: function (params) {  //数据单位格式化  
                            let relVal = '';

                            for (var i = 0, l = params.length; i < l; i++) {
                                relVal += params[i].seriesName + ' : ' + params[i].value + '<br/>';
                            }
                            return relVal;
                        }
                    },
                    grid: {
                        left: '10px',
                        right: '18px',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            name: xname,
                            nameGap: 2,
                            nameRotate: 0,
                            data: label,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                lineStyle: {
                                    color: "#aaa"
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: "#aaa"
                                }
                            },
                            name: '本周'
                        },
                        {
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: "#aaa"
                                }
                            },
                            name: '上周'
                        }
                    ],
                    series: [
                        {
                            name: '本周',
                            type: 'line',
                            smooth: true,
                            barMaxWidth: '20',
                            label: {
                                normal: {
                                    /* show: true,
                                    position: 'top',
                                    formatter: '{c}%' */
                                }
                            },
                            data: value
                        },
                        {
                            name: '上周',
                            type: 'line',
                            smooth: true,
                            barMaxWidth: '20',
                            label: {
                                normal: {
                                    /* show: true,
                                    position: 'top',
                                    formatter: '{c}%' */
                                }
                            },
                            data: oldValue,
                        }
                    ]
                });
            },
            generateColumns(data, id, name, xname, yname) {
                let label = [], value = [], oldValue = [];
                for (var i in data) {
                    label.push(data[i].hour);
                    value.push(data[i].img_sum);
                    oldValue.push(data[i].old_img_sum);
                };
                id.setOption({
                    title: {
                        text: name,
                        textStyle: {
                            fontWeight: 500,
                        },
                    },
                    color: ['#2D8CF0', 'rgba(255,102,51,.7)'],
                    legend: {
                        data: ['今日', '昨日']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'cross'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        // formatter: '{b}:{c}' + yname
                        formatter: function (params) {  //数据单位格式化  
                            let relVal = '';
                            for (var i = 0, l = params.length; i < l; i++) {
                                relVal += params[i].seriesName + ' : ' + params[i].value + '<br/>';
                            }
                            return relVal;
                        }
                    },
                    grid: {
                        left: '10px',
                        right: '18px',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            name: xname,
                            nameGap: 2,
                            nameRotate: 0,
                            data: label,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                lineStyle: {
                                    color: "#aaa"
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: "#aaa"
                                }
                            },
                            name: '今日'
                        },
                        {
                            type: 'value',
                            name: '昨日',
                            axisLabel: {
                                formatter: '{value}'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: "#aaa"
                                }
                            },
                        }
                    ],
                    series: [
                        {
                            name: '今日',
                            type: 'bar',
                            barMaxWidth: '20',
                            label: {
                                normal: {
                                    /* show: true,
                                    position: 'top',
                                    formatter: '{c}%' */
                                }
                            },
                            data: value
                        },
                        {
                            name: '昨日',
                            type: 'line',
                            data: oldValue,
                            smooth: true,
                        }
                    ]
                });
            },
            getDeviceStat2(data) {
                const that = this;
                //获取APP使用时长
                this.axios.post(this.api.usergroupStat, {
                    data
                }).then(res => {
                    console.log(res);
                    if (res.result === "true" && Object.keys(res.content).length !== 0) {
                        const resData = res.content;
                        that.customerTypeShow = true;
                        that.generatePie(resData, 'usergroup', that.customerType, '客户类型分析', '人/次');
                    } else {
                        that.customerTypeShow = false;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            getDeviceStat3(data) {
                const that = this;
                //获取APP使用时长
                this.axios.post(this.api.imgstatPerhour, {
                    data
                }).then(res => {
                    console.log(res);
                    if (res.result === "true" && Object.keys(res.content).length !== 0) {
                        const resData = res.content;
                        that.customerCountShow = true;
                        that.generateColumns(resData, that.customerCount, '分时客流量分析', '时间', '人/次');
                    } else {
                        that.customerCountShow = false;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            getDeviceStat4(data) {
                const that = this;
                //获取APP使用时长
                this.axios.post(this.api.ageStat, {
                    data
                }).then(res => {
                    console.log(res);
                    if (res.result === "true" && Object.keys(res.content).length !== 0) {
                        const resData = res.content;
                        that.customerAgeShow = true;
                        that.generatePie(resData, 'agegroup', that.customerAge, '客户年龄分布', '人');
                    } else {
                        that.customerAgeShow = false;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            getDeviceStat5(data) {
                const that = this;
                //获取性别统计
                this.axios.post(this.api.sexStat, {
                    data
                }).then(res => {
                    console.log(res);
                    if (res.result === "true" && Object.keys(res.content).length !== 0) {
                        const resData = res.content;
                        that.customerGenderShow = true;
                        that.generatePie(resData, 'sex', that.customerGender, '客户性别分布', '人');
                    } else {
                        that.customerGenderShow = false;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //环形图      
            generatePie(data, labelName, id, name) {
                let doughnutData = [], legend = [];
                for (var i in data) {
                    doughnutData[i] = {
                        value: data[i].img_sum,
                        name: data[i][labelName]
                    }
                    legend.push(doughnutData[i].name);
                };
                console.log(legend);
                id.setOption({
                    grid: {
                        left: '45px',
                        right: '56px',
                        bottom: '3%',
                        containLabel: true
                    },
                    color: ['#2D8CF0', '#7AFFAF', '#FFFF00', '#FF6633', '#2DEDF0', '#66ABF4', '#A0CBF8', '#F02D8C', '#2DF092', '#F8CDA0', '#F4B066', '#F0302D', '#2DF030', '#8CF02D', '#EDF02D', '#F0922D'],
                    title: {
                        text: name,
                        subtext: '',
                        x: 'left',
                        y: 0,
                        textStyle: {
                            fontWeight: 500,
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}{b} : {d}%"
                    },
                    legend: {
                        show: true,
                        orient: 'horizontal',
                        left: 'left',
                        top: '10%',
                        data: legend
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '60%',
                            center: ['50%', '60%'],
                            avoidLabelOverlap: false,
                            data: doughnutData,
                            label: {
                                normal: {
                                    position: 'left',
                                    show: false,
                                    distantce: 0,
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '14',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                        }
                    ]
                }, true);
            },
            backgorundStyle(url) {
                return {
                    'background-image': 'url("' + url + '")',
                    'background-repeat': 'no-repeat',
                    'background-size': 'cover',
                }
            },
            showLargeImage(item) {
                console.log('showLargeImage取消');
                /* if (!item.img_url) {
                    this.$Message('未获取到图片！');
                    return;
                }
                this.$Modal.confirm({
                    width: 444,
                    render: (h) => {
                        return h('img', {
                            'class': 'render_img',
                            attrs: {
                                src: item.img_url,
                                width: 400,
                            },
                        })
                    }
                }) */
            },
        }
    };
</script>
<style lang="less" scoped>
    .router-manage .manage-right {
        margin-left: 0;
        .manage-content {
            .content_left {
                height: calc(~'100vh - 105px');
                width: 250px;
                margin-right: 15px;
                background: #fff;
            }
        }
    }

    .masterControl {
        .masterControlUl {
            list-style-type: none;
            li {
                width: 100%;
                margin: 0px 0px 12px 0;
                padding: 22px 15px 22px 85px;
                background: #fff;
                box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
                box-sizing: border-box;
                .iconfont {
                    float: left;
                    width: 60px;
                    height: 60px;
                    margin-left: -70px;
                    margin-top: -3px;
                    background: #2d8cf0;
                    border-radius: 50%;
                    color: #fff;
                    font-size: 35px;
                    line-height: 60px;
                    text-align: center;
                }
                &:last-child {
                    margin-right: 0;
                }
                span {
                    font-size: 14px;
                    color: #80848f;
                }
                .num {
                    display: block;
                    font-size: 24px;
                    color: #1c2438;
                    font-weight: normal;
                    &.red {
                        color: #f00;
                    }
                }
            }
        }
        .condition {
            display: inline-block;
            padding: 0 20px 10px 22px;
            .feedbackSelect {
                margin-left: 10px;
            }
            .ivu-btn.selected {
                color: #2d8cf0;
            }
        }
        .chart_container {
            height: calc(~'100vh - 109px');
            width: calc(~'100% - 270px');
            background: #fff;
            box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
            border-radius: 2px;
            box-sizing: border-box;
            .chart_left,
            .chart_right {
                height: calc(~'50vh - 53px');
                padding-top: 10px;
                background: #fff;
                &:first-child {
                    border-left: none;
                }
                &:last-child {
                    border-right: none;
                }
            }
            .chart_left {
                width: 50%;
                padding-left: 18px;
            }
            .chart_right {
                width: 50%;
                padding-left: 18px;
            }
            .chart {
                width: 100%;
                height: calc(~'50vh - 68px');
            }
        }
        .img_list_container {
            .img_list {
                background: #fff;
                padding: 5px 10px 0px;
                ul {
                    li {
                        position: relative;
                        width: 50%;
                        padding: 4px 4px;
                        .img_container {
                            height: calc(~'25vh - 67px');
                            line-height: 160px;
                            vertical-align: middle;
                            background-position: center center;
                            img {
                                display: inline-block;
                                width: 100%;
                                vertical-align: middle;
                            }
                        }
                        p {
                            position: absolute;
                            width: 100%;
                            padding-bottom: 10px;
                            left: 0;
                            bottom: 0%;
                            font-size: 14px;
                            line-height: 1.5;
                            text-align: center;
                            color: #fff;
                            opacity: 0.5;
                            .spe {
                                display: inline-block;
                                width: 15px;
                            }
                        }
                    }
                }
            }
        }
    }

    .modal {
        .label {
            padding-left: 10px;
            color: #17233D;
        }
    }
</style>