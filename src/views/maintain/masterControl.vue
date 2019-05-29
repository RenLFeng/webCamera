<!-- 运维管理-产品库管理 -->
<template>
    <div class="manage-right masterControl">
        <div class="top-bar">
            主控面板
        </div>
        <div class="manage-content">
            <ul class="masterControlUl clearfix">
                <li>
                    <b class="iconfont icon-fenhongjilu"></b>
                    <div>
                        <span>系统运行天数</span>
                        <b class="num">{{sysStatus.run_days}}</b>
                    </div>
                </li>
                <li>
                    <b class="iconfont icon-fenhongjilu"></b>
                    <div>
                        <span>客流总数</span>
                        <b class="num">{{sysStatus.all_img_total}}</b>
                    </div>
                </li>
                <li>
                    <b class="iconfont icon-fenhongjilu"></b>
                    <div>
                        <span>设备总数</span>
                        <b class="num">{{sysStatus.device_total}}</b>
                    </div>
                </li>
                <li>
                    <b class="iconfont icon-fenhongjilu"></b>
                    <div>
                        <span>当日客流数</span>
                        <b class="num">{{sysStatus.today_img_total}}</b>
                    </div>
                </li>
                <li>
                    <b class="iconfont icon-fenhongjilu"></b>
                    <div>
                        <span>未处理异常</span>
                        <b class="num red">{{sysStatus.warn_total}}</b>
                    </div>
                </li>
            </ul>
            <div class="chart_container">
                <div class="condition">
                    设备选择：
                    <Select v-model="device_id" style="width:160px" placeholder="请选择" @on-change="toggleDevice">
                        <Option value="">全部</Option>
                        <Option v-for="(item,index) in agentList" :value="item.device_id" :key="index">{{ item.device_addr}}</Option>
                    </Select>
                    <ButtonGroup shape="circle" class="feedbackSelect" slot="extra">
                        <template v-for="(item,index) in rangeTypes">
                            <span @click="toggleSelect(item)" :key="item.value" v-if="index==3" :class="item.selected?'selected':''">
                                <DatePicker type="datetimerange" format="yyyy/MM/dd HH:mm:ss" placement="bottom-end" placeholder="选择时间范围" style="width: 280px"
                                    :value="fromTo" @on-change="isDaterange($event)"></DatePicker>
                            </span>
                            <Button @click="toggleSelect(item)" :key="item.value" type="ghost" :class="item.selected?'selected':''" v-else>{{item.text}}</Button>
                        </template>
                    </ButtonGroup>
                </div>
                <div class="flex">
                    <div class="chart_left">
                        <div class="chart" id="appTime" :class="{hide:!appTimeShow}"></div>
                        <p class="empty_m" :class="{hide:appTimeShow}">
                            暂无数据
                        </p>
                    </div>
                    <div class="chart_right">
                        <div class="chart" id="customerType" :class="{hide:!customerTypeShow}"></div>
                        <p class="empty_m" :class="{hide:customerTypeShow}">
                            暂无数据
                        </p>
                    </div>
                </div>
                <div class="flex">
                    <div class="chart_left">
                        <div class="chart" id="customerCount" :class="{hide:!customerCountShow}"></div>
                        <p class="empty_m" :class="{hide:customerCountShow}">
                            暂无数据
                        </p>
                    </div>
                    <div class="chart_right">
                        <div class="chart" id="customerAge" :class="{hide:!customerAgeShow}"></div>
                        <p class="empty_m" :class="{hide:customerAgeShow}">
                            暂无数据
                        </p>
                    </div>
                </div>
            </div>
            <div class="img_list_container">
                <div class="img_list" id="imgList" :class="{hide:!imgListShow}">
                    <ul class="flex">
                        <li v-for="(item,i) in imgList">
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
                deviceStat: {},
                rangeTypes: [{
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
                legendNameArr:[['本周','上周'],['本月','上月'],['本年','上年']]
            };
        },
        beforeCreate() {
            // 传值给父级main.vue（第二个导航）
            this.$emit("set-manage-menu", "masterControl");
        },
        created() {
            // 初次加载获取默认数据
            this.getAgentList();
            this.getSysStatus();
            this.getPageData(this.selectData);
        },
        mounted() {
            this.appTime = echarts.init(document.getElementById('appTime'));
            this.customerType = echarts.init(document.getElementById('customerType'));
            this.customerCount = echarts.init(document.getElementById('customerCount'));
            this.customerAge = echarts.init(document.getElementById('customerAge'));
        },
        computed: {
            selectData: {
                get: function () {
                    let that = this,
                        data = {};
                    if (that.type !== '4') {
                        if (that.type) {
                            data = {
                                timetype: that.type,
                            }
                        }
                    } else if (that.fromTo[0]) {
                        data = {
                            timetype: that.type,
                            begintime: that.fromTo[0],
                            endtime: that.fromTo[1],
                        }
                    } else {
                        data = {}
                    }
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
            getAgentList() {
                const that = this;
                //获取客户选择下拉框列表
                this.axios.post(this.api.getDeviceNameList, {
                    data: {
                        agent_id:that.agent_id,
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
                    data:that.selectData
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
            //设备选择下拉框动作
            toggleDevice(){
                this.getSysStatus();
                this.getPageData(this.selectData);
            },
            getPageData(data) {
                console.log(data);
                //不分顺序获取各个图表数据
                this.getDeviceStat(data);
                this.getDeviceStat2(data);
                this.getDeviceStat3(data);
                this.getDeviceStat4(data);
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
                this.getSysStatus();
                this.getPageData(this.selectData);
            },
            isDaterange(e) {
                this.fromTo = e;
                this.getSysStatus();
                this.getPageData(this.selectData);
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
                        that.deviceStat = resData || [];
                        that.appTimeShow = true;
                        that.generateBars(that.deviceStat, this.appTime, '客流量分析曲线', '时间', '人/次');
                    } else {
                        that.appTimeShow = false;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            generateBars(data, id, name, xname, yname) {
                let label = [], value = [], oldValue = [];
                let legendNum=this.type>0?+this.type-1:0,legendName=[];
                legendName=this.legendNameArr[legendNum];
                /* const data = [
                { "name": "00~03", "value": 10 },
                { "name": "04~06", "value": 52 },
                { "name": "07~09", "value": 200 },
                { "name": "10~12", "value": 334 },
                { "name": "13~15", "value": 390 },
                { "name": "16~18", "value": 330 },
                { "name": "16~18", "value": 220 },
                { "name": "22~24", "value": 100 }
                ]; */
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
                        data: legendName
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
                        left: '25px',
                        right: '56px',
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
                            name: legendName[0]
                        },
                        {
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: "#aaa"
                                }
                            },
                            name: legendName[1]
                        }
                    ],
                    series: [
                        {
                            name: legendName[0],
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
                            name: legendName[1],
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
                }, true);
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
                        left: '45px',
                        right: '56px',
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
                        that.deviceStat = resData;
                        that.customerTypeShow = true;
                        that.generatePie(that.deviceStat, 'usergroup', that.customerType, '客户类型分析', '人/次');
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
                        that.deviceStat = resData;
                        that.customerCountShow = true;
                        that.generateColumns(that.deviceStat, that.customerCount, '分时客流量分析', '时间', '人/次');
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
                        that.deviceStat = resData;
                        that.customerAgeShow = true;
                        that.generatePie(that.deviceStat, 'agegroup', that.customerAge, '客户年龄分布', '人');
                    } else {
                        that.customerAgeShow = false;
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
                    color: ['#2D8CF0', '#FF6633', '#FFFF00', '#7AFFAF', '#2DEDF0', '#66ABF4', '#A0CBF8', '#F02D8C', '#2DF092', '#F8CDA0', '#F4B066', '#F0302D', '#2DF030', '#8CF02D', '#EDF02D', '#F0922D'],
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
            showLargeImage(url) {
                console.log('showLargeImage取消');
                /* if (!url) {
                    this.$Message('未获取到图片！');
                    return;
                }
                this.$Modal.confirm({
                    render: (h) => {
                        return h('img', {
                            props: {
                                src: url,
                            },
                        })
                    }
                }) */
            },
        }
    };
</script>
<style lang="less" scoped>
    .masterControl {
        .masterControlUl {
            margin-right: -14px;
            list-style-type: none;
            li {
                float: left;
                width: calc(~"20% - 7.5px");
                margin: 0px 7px 22px 0;
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
        .chart_container {
            padding: 0 0 5px;
            background: #fff;
            box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
            border-radius: 2px;
            box-sizing: border-box;
            .condition {
                padding: 10px 20px 10px 22px;
                .feedbackSelect {
                    margin-left: 10px;
                }
                .ivu-btn.selected {
                    color: #2d8cf0;
                }
            }
            .chart_left {
                width: 70%;
                padding-left: 18px;
            }
            .chart_right {
                width: 30%;
            }
            .chart {
                height: 357px;
                width: 100%;
                margin-bottom: 24px;
            }
        }
        .img_list_container {
            margin-top: 20px;
            .img_list {
                background: #fff;
                padding: 5px 10px;
                ul {
                    li {
                        width: 12.5%;
                        padding: 4px;
                        .img_container {
                            height: 160px;
                            margin-bottom: 10px;
                            line-height: 160px;
                            vertical-align: middle;
                            img {
                                display: inline-block;
                                width: 100%;
                                vertical-align: middle;
                            }
                        }
                        p {
                            padding-bottom: 10px;
                            font-size: 14px;
                            line-height: 1.5;
                            text-align: center;
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