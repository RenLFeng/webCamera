<template>
  <div>
    <Row class="expand-row" v-show="row.length>0">
      <table class="table">
        <tr v-for="(item,index) in row" :key="item.setId">
          <td class="expand-value">{{ item.setId }}</td>
          <td class="expand-value">{{ item.setType }}</td>
          <td class="expand-value">{{ item.setName }}</td>
          <td class="expand-value">{{ item.data }}</td>
          <td class="expand-value">{{ item.dataType }}</td>
          <td class="expand-value">{{ item.readWrite }}</td>
          <td class="expand-value">{{ item.maxMin }}</td>
          <td class="expand-value">{{ item.decimal }}</td>
          <td class="expand-value">{{ item.ifDecimal }}</td>
          <td class="expand-value">{{ item.note }}</td>
          <td class="expand-value">
            <a href="javascript:void(0)" @click="editFunDotItem(item,index)" style="marign-right:5px;">编辑</a>
            <a href="javascript:void(0)" @click="delFunDotItem(item,index)" style="marign-right:5px;">删除</a>
          </td>
        </tr>
      </table>
    </Row>
    <!-- 编辑功能点弹窗 -->
    <Modal v-model="customFunction" class="modal" title="自定义功能点" @on-ok="okCustomFunIn">
      <Row class="mtb15">
        <Col class="label" span="5">功能点名称</Col>
        <Col span="19">
        <Input v-model="tempCustomFunData.funName" placeholder="请输入功能点名称..." size="large"></Input>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">数据点名称</Col>
        <Col span="19">
        <Input v-model="tempCustomFunData.dataName" placeholder="请输入数据点名称..." size="large"></Input>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">数据类型</Col>
        <Col span="19">
        <RadioGroup v-model="tempCustomFunData.dataValue">
          <Radio class="check_a" v-for="(item,index) in tempCustomFunData.dataList" :label="item.label" :key="index">
            <span>{{item.label}}</span>
          </Radio>
        </RadioGroup>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">读写类型</Col>
        <Col span="19">
        <RadioGroup v-model="tempCustomFunData.readValue">
          <Radio class="check_a" v-for="(item,index) in tempCustomFunData.readList" :label="item.label" :key="index">
            <span>{{item.label}}</span>
          </Radio>
        </RadioGroup>
        </Col>
      </Row>
      <Row class="mtb15" v-show="tempCustomFunData.dataValue==='整数'||tempCustomFunData.dataValue==='浮点数'">
        <Col class="label" span="5">上下限</Col>
        <Col span="19">
        <InputNumber :max="10" :step="0.1" v-model="tempCustomFunData.min" placeholder="请输入..."></InputNumber>　至
        <InputNumber :min="tempCustomFunData.min" :step="0.1" v-model="tempCustomFunData.max" placeholder="请输入..."></InputNumber>
        </Col>
      </Row>
      <Row class="mtb15" v-show="tempCustomFunData.dataValue==='浮点数'">
        <Col class="label" span="5">小数位数</Col>
        <Col span="19">
        <Select v-model="tempCustomFunData.decimal" style="width:200px">
          <Option v-for="(item,index) in tempCustomFunData.decimalList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        </Col>
      </Row>
      <Row class="mtb15" v-show="tempCustomFunData.dataValue==='浮点数'">
        <Col class="label" span="5">小数点传输</Col>
        <Col span="19">
        <RadioGroup v-model="tempCustomFunData.transValue">
          <Radio class="check_a" v-for="(item,index) in tempCustomFunData.transList" :label="item.label" :key="index">
            <span>{{item.label}}</span>
          </Radio>
        </RadioGroup>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">备注</Col>
        <Col span="19">
        <Input v-model="tempCustomFunData.remark" placeholder="请输入备注..." size="large"></Input>
        </Col>
      </Row>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      customFunction: false,
      tempCustomFunData: {
        funName: "",
        dataName: "",
        dataValue: "",
        dataList: [
          { label: "布尔数", value: "布尔数", checked: false },
          { label: "整数", value: "整数", checked: false },
          { label: "浮点数", value: "浮点数", checked: false }
        ],
        readValue: "",
        readList: [
          { label: "可读", value: "可读", checked: false },
          { label: "可写", value: "可写", checked: false }
        ],
        max: null,
        min: null,
        decimalValue: "",
        decimalList: [
          { label: "一位小数", value: "一位小数" },
          { label: "二位小数", value: "二位小数" },
          { label: "三位小数", value: "三位小数" },
          { label: "四位小数", value: "四位小数" }
        ],
        transValue: "",
        transList: [
          { label: "传输", value: "传输", checked: false },
          { label: "不传输", value: "不传输", checked: false }
        ],
        remark: ""
      }
    };
  },
  props: {
    row: Array
  },
  methods: {
    // 编辑时把真实数据替换上去
    editFunDotItem(item, index) {
      Object.assign(this.tempCustomFunData, {
        funName: "gps功能点",
        dataName: "暂无",
        dataValue: "浮点数",
        dataList: [
          { label: "布尔数", value: "布尔数", checked: false },
          { label: "整数", value: "整数", checked: false },
          { label: "浮点数", value: "浮点数", checked: true }
        ],
        readValue: "可写",
        readList: [
          { label: "可读", value: "可读", checked: false },
          { label: "可写", value: "可写", checked: true }
        ],
        remark: "还没想好"
      });
      this.customFunction = true;
    },
    delFunDotItem(item, index) {
      this.$Modal.confirm({
        title: "删除提示",
        content: "确定要删除这个功能点吗？",
        onOk: res => {
          // 这里要调接口，删除这个产品（通过id删除）
          this.row.splice(index, 1);
        }
      });
    },
    okCustomFunIn() {
      this.$Message.info("保存成功");
      this.customFunction = false;
    }
  }
};
</script>
<style lang="less" scoped>
.expand-row {
  margin: 20px 0px 20px 50px;
  .ivu-table-expanded-cell {
    box-sizing: border-box;
    padding-left: 0;
    padding-right: 0;
  }
  .expand-value {
    width: 9.09%;
    box-sizing: border-box;
    padding-left: 18px;
    padding-right: 18px;
  }
}
.table {
  width: 100%;
}
.modal {
  .label {
    line-height: 34px;
    font-size: 14px;
    color: rgba(29, 36, 54, 0.8);
    font-weight: bold;
    text-align: center;
  }
  .collapse .label {
    font-weight: normal;
  }
  .check_a {
    display: inline-block;
    height: 34px;
    line-height: 34px;
    padding: 0 5px;
    border-radius: 3px;
    border: 1px solid #dddee1;
    margin-right: 6px;
    margin-bottom: 5px;
    font-size: 14px;
    text-align: center;
    color: rgba(23, 35, 61, 0.8);
    vertical-align: middle;
    cursor: pointer;
    &.checked {
      border-color: #008cf8;
      color: #008cf8;
    }
    &_icon {
      padding-right: 6px;
      font-size: 20px;
    }
  }
  .check_a_icon {
    vertical-align: middle;
    color: #ddd;
  }
}
</style>