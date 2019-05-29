<template>
  <div class="home-main">
    <!-- 头部导航 -->
    <div class="main-header">
      <div class="breadcrumb">
        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
      </div>
      <top-timeline :cur-step="isNaN(status)?1:status" :cur="0" :id="id" />
      <div class="action">
        <Button type="primary" @click="pageToNext" :disabled="status<1">下一步</Button>
      </div>
    </div>
    <!-- 中间内容 -->
    <div class="main-content" style="min-width:1260px;overflow-x:auto;">
      <!-- 左侧信息 -->
      <left-info :product-id="id" />
      <!-- 右侧具体内容 -->
      <div class="content">
        <div class="home-set-con">
          <div class="set_div">
            <h3>功能设置
              <Button icon="plus" @click="modelAddSet = true" style="margin-left:10px;" v-if="!exhibition">添加</Button>
            </h3>
            <!-- 放弃组件，用原生表格 -->
            <div v-if="featureList.length>0">
              <table class="mytable fsettable">
                <thead>
                  <tr>
                    <template v-if="!exhibition">
                      <th width="7%">DPID</th>
                      <th width="7%">功能类型</th>
                      <th width="11%">名称</th>
                      <th width="10%">标识符</th>
                      <th width="6%">数据类型</th>
                      <th width="8%">读写特性</th>
                      <th width="8%">上下限</th>
                      <th width="7%">小数点数</th>
                      <th width="8%">是否传输小数</th>
                      <th width="8%">备注</th>
                      <th width="10%">操作</th>
                      <th width="10%">触发器</th>
                    </template>
                    <template v-else>
                      <th width="7%">DPID</th>
                      <th width="8%">功能类型</th>
                      <th width="15%">名称</th>
                      <th width="10%">标识符</th>
                      <th width="16%">数据类型</th>
                      <th width="8%">读写特性</th>
                      <th width="8%">上下限</th>
                      <th width="7%">小数点数</th>
                      <th width="13%">是否传输小数</th>
                      <th width="8%">备注</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(items,i) in featureList">
                    <template v-if="items.type==0">
                      <tr class="parent-tr">
                        <td @click="setUnfold(items)">
                          <span style="display:inline-block;width:12px;">
                            <Icon type="chevron-down" v-if="items.unfold"></Icon>
                            <Icon type="chevron-right" v-else></Icon>
                          </span>
                          {{pageObj1.size*(pageObj1.current-1)+i+1}}</td>
                        <td>功能集</td>
                        <td>{{items.featureName}}</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td v-if="!exhibition">
                          <a href="javascript:void(0)" class="txt_btn" @click="editFset(items.featureID)">编辑</a>
                          <a href="javascript:void(0)" class="txt_btn" @click="delFset(items.featureID,i)">删除</a>
                        </td>
                        <td v-if="!exhibition">&nbsp;</td>
                      </tr>
                      <tr class="child-tr" v-for="(item,j) in items.features" :class="{hide:!items.unfold}" v-if="items.features.length>0">
                        <td>
                          {{i+1}}-{{j+1}}</td>
                        <td>功能点</td>
                        <td>{{item.featureName}}</td>
                        <td>{{item.dataName}}</td>
                        <td>{{dataList[item.dataType-1].label}}</td>
                        <template>
                          <td v-text="item.featureRW==1?'可写':'可读'" v-if="item.dataType!==5"></td>
                          <td v-else>&nbsp;</td>
                        </template>
                        <template>
                          <td v-if="item.dataType===2||item.dataType==3">{{item.bottomLimit}}-{{item.topLimit}}</td>
                          <td v-else>&nbsp;</td>
                        </template>
                        <template>
                          <td v-if="item.dataType===3">{{item.featureDotNumber}}</td>
                          <td v-else>&nbsp;</td>
                        </template>
                        <template>
                          <td v-text="item.translateInt?'否':'是'" v-if="item.dataType===3"></td>
                          <td v-else>&nbsp;</td>
                        </template>
                        <td>{{item.remark}}</td>
                        <template v-if="!exhibition">
                          <td>
                            <a href="javascript:void(0)" class="txt_btn" @click="editFunDotItem(item.featureID)">编辑</a>
                            <a href="javascript:void(0)" class="txt_btn" @click="delFeature(item.featureID,j,items)">删除</a>
                          </td>
                          <td v-if="item.triggerID">
                            <Button type="ghost" @click="editTriggerItem(item.featureID,item.triggerID)" class="ghost-gray">修改</Button>
                          </td>
                          <td v-else>
                            <Button type="ghost" @click="addTriggerItem(item.featureID,item.dataType,item.bottomLimit,item.topLimit,item.featureName)"
                              class="ghost-blue" v-if="item.dataType===2||item.dataType===3">添加</Button>
                            <Button type="ghost" @click="addTriggerItem(item.featureID)" class="ghost-blue" v-else>添加</Button>
                          </td>
                        </template>
                      </tr>
                    </template>
                    <template v-else>
                      <tr>
                        <td>{{pageObj1.size*(pageObj1.current-1)+i+1}}</td>
                        <td>功能点</td>
                        <td>{{items.featureName}}</td>
                        <td>{{items.dataName}}</td>
                        <td>{{dataList[items.dataType-1].label}}</td>
                        <template>
                          <td v-if="items.dataType!==5" v-text="items.featureRW==1?'可写':'可读'"></td>
                          <td v-else>&nbsp;</td>
                        </template>
                        <template>
                          <td v-if="items.dataType===2||items.dataType==3">{{items.bottomLimit}}-{{items.topLimit}}</td>
                          <td v-else>&nbsp;</td>
                        </template>
                        <template>
                          <td v-if="items.dataType===3">{{items.featureDotNumber}}</td>
                          <td v-else>&nbsp;</td>
                        </template>
                        <template>
                          <td v-if="items.dataType===3" v-text="items.translateInt?'否':'是'"></td>
                          <td v-else>&nbsp;</td>
                        </template>
                        <td>{{items.remark}}</td>
                        <template v-if="!exhibition">
                          <td>
                            <a href="javascript:void(0)" class="txt_btn" @click="editFunDotItem(items.featureID)">编辑</a>
                            <a href="javascript:void(0)" class="txt_btn" @click="delFeature(items.featureID,i)">删除</a>
                          </td>
                          <td v-if="items.triggerID">
                            <Button type="ghost" @click="editTriggerItem(items.featureID,items.triggerID)" class="ghost-gray">修改</Button>
                          </td>
                          <td v-else>
                            <Button type="ghost" @click="addTriggerItem(items.featureID,items.dataType,items.bottomLimit,items.topLimit,items.featureName)"
                              class="ghost-blue" v-if="items.dataType===2||items.dataType===3">添加</Button>
                            <Button type="ghost" @click="addTriggerItem(items.featureID)" class="ghost-blue" v-else>添加</Button>
                          </td>
                        </template>
                      </tr>
                    </template>
                  </template>
                </tbody>
              </table>
              <div class="page_container">
                <Page :current="pageObj1.current" :total="pageObj1.total" :page-size="pageObj1.size" class="turn_page" @on-change="turnPage1"></Page>
              </div>
            </div>
            <div v-else>
              <div class="empty">
                暂无数据
              </div>
            </div>
          </div>
          <div class="set_div">
            <h3>触发器列表
              <!-- <Button icon="plus" @click="modelAddSet = true" style="margin-left:10px;">添加</Button> -->
            </h3>
            <div v-if="tableTriggerList.length>0">
              <table class="mytable">
                <thead>
                  <tr>
                    <template v-if="!exhibition">
                      <th width="8%">DPID</th>
                      <th width="15%">触发器名称</th>
                      <th width="15%">触发功能点</th>
                      <th width="15%">报警触发</th>
                      <th width="22%">控制触发</th>
                      <th width="15%">备注</th>
                      <th width="10%">操作</th>
                    </template>
                    <template v-else>
                      <th width="8%">DPID</th>
                      <th width="15%">触发器名称</th>
                      <th width="15%">触发功能点</th>
                      <th width="25%">报警触发</th>
                      <th width="22%">控制触发</th>
                      <th width="15%">备注</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item,index) in tableTriggerList">
                    <tr>
                      <td>{{pageObj2.size*(pageObj2.current-1)+index+1}}</td>
                      <td>{{item.name}}</td>
                      <td>{{item.featureName}}</td>
                      <td v-if="item.ptwEntity">{{item.ptwEntity.trigtel?"电话":""}}{{item.ptwEntity.trigtel&&item.ptwEntity.trigsms?"/短信":(item.ptwEntity.trigsms?"短信":"")}}{{(item.ptwEntity.trigtel||item.ptwEntity.trigsms)&&item.ptwEntity.trigemail?"/邮箱":(item.ptwEntity.trigemail?"邮箱":"")}}</td>
                      <td v-else> </td>
                      <td v-if="item.ptcList.length>0">
                        <template v-for="(ptc,k) in item.ptcList">
                          <span>
                            {{ptc.featureName}}／{{ptc.controlStyle?"正向控制":(ptc.controlStyle=="0"?"反向控制":"正向控制")}};
                          </span>
                        </template>
                      </td>
                      <td v-else> </td>
                      <td>{{item.remark}}</td>
                      <td v-if="!exhibition">
                        <a href="javascript:void(0)" @click="editTriggerItem(item.featureID,item.triggerID)" style="marign-right:5px;">编辑</a>
                        <a href="javascript:void(0)" @click="delTriggerItem(item.triggerID, index)" style="marign-right:5px;">删除</a>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <div class="page_container">
                <Page :current="pageObj2.current" :total="pageObj2.total" :page-size="pageObj2.size" class="turn_page" @on-change="turnPage2"></Page>
              </div>
            </div>
            <div v-else>
              <div class="empty">
                暂无数据
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 增加功能点/集/触发器弹窗 -->
    <Modal v-model="modelAddSet" class="modal" title="功能添加" @on-ok="okAddSet" @on-cancel="cancelAddSet" :loading="loading">
      <Tabs value="name1">
        <TabPane label="功能点" name="name1">
          <span v-for="(item,index) in tabOneList" class="check_a" :class="item.checked?'checked':''" @click="item.checked=!item.checked"
            :key="index">
            <Icon :type="item.checked?'android-checkbox':'android-checkbox-outline'" :color="item.checked?'#008CF8':''" class="check_a_icon"></Icon>{{item.label}}</span>
          <div style="margin-top:20px;">
            没有找到合适的功能点，去自定义一个吧。
            <a href="javascript:void(0)" @click="addFunDotItem">自定义功能点</a>
          </div>
        </TabPane>
        <TabPane label="功能集" name="name2">
          <span v-for="(item,index)  in tabTwoList" class="check_a" :class="item.checked?'checked':''" @click="item.checked=!item.checked"
            :key="index">
            <Icon :type="item.checked?'android-checkbox':'android-checkbox-outline'" :color="item.checked?'#008CF8':''" class="check_a_icon"></Icon>{{item.label}}</span>
          <div style="margin-top:20px;">
            没有找到合适的功能集，去自定义一个吧。
            <a href="javascript:void(0)" @click="addFunGroupItem">自定义功能集</a>
          </div>
        </TabPane>
        <!-- <TabPane label="触发器" name="name3">
          <span v-for="(item,index) in tabThreeList" class="check_a" :class="item.checked?'checked':''" @click="item.checked=!item.checked"
            :key="index">
            <Icon :type="item.checked?'android-checkbox':'android-checkbox-outline'" :color="item.checked?'#008CF8':''" class="check_a_icon"></Icon>{{item.label}}</span>
          <div style="margin-top:20px;">
            没有找到合适的触发器，去自定义一个吧。
            <a href="javascript:void(0)" @click="addTriggerItem">自定义触发器</a>
          </div>
        </TabPane> -->
      </Tabs>
    </Modal>
    <!-- 自定义功能点弹窗 -->
    <Modal v-model="modelCustomFunDot" class="modal" title="自定义功能点" @on-ok="okCustomFunDot" :loading="loading">
      <Row class="mtb15">
        <Col class="label" span="5">功能点名称
        </Col>
        <Col span="19">
        <Input v-model="customFunDotData.funName" placeholder="请输入功能点名称..." size="large" :maxlength=16></Input>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">标识符
        </Col>
        <Col span="19">
        <Input v-model="customFunDotData.dataName" placeholder="标识符（1-16位仅含英文字母、数字或下划线）..." size="large" :maxlength=16></Input>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">数据类型
        </Col>
        <Col span="19">
        <RadioGroup v-model="customFunDotData.dataValue">
          <template v-for="(item,index) in dataList">
            <Radio class="check_a" :label="item.value" :key="index" v-if="index!=1">
              <span>{{item.label}}</span>
            </Radio>
            <Radio class="check_a" :label="item.value" :key="index" @click.native="intNum(customFunDotData)" v-else>
              <span>{{item.label}}</span>
            </Radio>
          </template>
        </RadioGroup>
        </Col>
      </Row>
      <Row class="mtb15" v-show="customFunDotData.dataValue!==5">
        <Col class="label" span="5">读写类型
        </Col>
        <Col span="19">
        <RadioGroup v-model="customFunDotData.readValue">
          <Radio class="check_a" v-for="(item,index) in readList" :label="item.value" :key="index">
            <span>{{item.label}}</span>
          </Radio>
        </RadioGroup>
        </Col>
      </Row>
      <Row class="mtb15" v-show="customFunDotData.dataValue===3">
        <Col class="label" span="5">小数位数
        </Col>
        <Col span="19">
        <Select v-model="customFunDotData.decimalValue" style="width:200px">
          <Option v-for="(item,index) in decimalList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        </Col>
      </Row>
      <Row class="mtb15" v-show="customFunDotData.dataValue===2||customFunDotData.dataValue===3">
        <Col class="label" span="5">上下限
        </Col>
        <Col span="19">
        <template>
          <InputNumber :step="1" v-model="customFunDotData.min" placeholder="请输入..." :precision="0" v-if="customFunDotData.dataValue===2"></InputNumber>
          <InputNumber :step="0.1" v-model="customFunDotData.min" placeholder="请输入..." :precision="customFunDotData.decimalValue" v-else></InputNumber>
        </template>　至
        <template>
          <InputNumber :min="customFunDotData.min" :step="1" v-model="customFunDotData.max" placeholder="请输入..." :precision="0" v-if="customFunDotData.dataValue===2"></InputNumber>
          <InputNumber :min="customFunDotData.min" :step="0.1" v-model="customFunDotData.max" placeholder="请输入..." :precision="customFunDotData.decimalValue"
            v-else></InputNumber>
        </template>
        </Col>
      </Row>
      <Row class="mtb15" v-show="customFunDotData.dataValue===3">
        <Col class="label" span="5">小数点传输
        </Col>
        <Col span="19">
        <RadioGroup v-model="customFunDotData.transValue">
          <Radio class="check_a" v-for="(item,index) in transList" :label="item.value" :key="index">
            <span>{{item.label}}</span>
          </Radio>
        </RadioGroup>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">备注
        </Col>
        <Col span="19">
        <Input v-model="customFunDotData.remark" placeholder="请输入备注..." size="large" :maxlength=128></Input>
        </Col>
      </Row>
    </Modal>
    <!-- 自定义功能集弹窗 -->
    <Modal v-model="modelCustomFunGroup" class="modal set_modal" title="自定义功能集" @on-ok="okCustomFunGroup" :loading="loading"
      width="600">
      <Row class="mtb15 trig_name">
        <Col class="label" span="5" style="font-family: PingFangSC-Semibold;color: #17233D;">功能集名称
        </Col>
        <Col span="19">
        <Input v-model="customFunGroupData.groupName" placeholder="请输入功能集名称..." style="width:322px;margin-right:5px;" :maxlength=16></Input>
        <Button class="create" type="success" icon="plus" style="color:#fff;border-color:transparent;" @click="addFunDotToGruup">创建功能点</Button>
        </Col>
      </Row>
      <div v-for="(dotItem, dotIndex) in customFunGroupData.dotList" :key="dotIndex">
        <div class="trig_line" v-if="dotIndex!=0"></div>
        <Row class="mtb15">
          <Col class="label" span="5" style="font-family: PingFangSC-Semibold;color: #17233D;">功能点{{dotIndex+1}}
          </Col>
          <Col span="19">
          <Input v-model="dotItem.funName" placeholder="请输入功能点名称..." style="width:322px;margin-right:5px;" :maxlength=16></Input>
          <Button type="ghost" shape="circle" icon="edit" @click="changeShow(customFunGroupData.dotList,dotItem)" style="margin-right:5px;border-color:#ccc;color:#ccc;"></Button>
          <template>
            <Button type="ghost" shape="circle" icon="ios-trash-outline" @click="delFeaturePrompt(dotItem.id,dotIndex,customFunGroupData.dotList)"
              style="border-color:#ccc;color:#333;" v-if="dotItem.id"></Button>
            <Button type="ghost" shape="circle" icon="ios-trash-outline" @click="customFunGroupData.dotList.splice(dotIndex,1)" style="border-color:#ccc;color:#333;"
              v-else></Button>
          </template>
          </Col>
        </Row>
        <div v-show="dotItem.show" class="collapse">
          <Row class="mtb15">
            <Col class="label" span="5">标识符
            </Col>
            <Col span="19">
            <Input v-model="dotItem.dataName" placeholder="标识符（1-16位仅含英文字母、数字或下划线）..." size="large" style="width:322px;margin-right:5px;"
              :maxlength=16></Input>
            </Col>
          </Row>
          <Row class="mtb15">
            <Col class="label" span="5">数据类型
            </Col>
            <Col span="19">
            <RadioGroup v-model="dotItem.dataValue" on-change="consoletest" style="width:322px;margin-right:5px;">
              <template v-for="(item,index) in dataList">
                <Radio class="check_a" :label="item.value" :key="index" v-if="index!=1">
                  <span>{{item.label}}</span>
                </Radio>
                <Radio class="check_a" :label="item.value" :key="index" @click.native="intNum(dotItem)" v-else>
                  <span>{{item.label}}</span>
                </Radio>
              </template>
            </RadioGroup>
            </Col>
          </Row>
          <Row class="mtb15">
            <Col class="label" span="5">读写类型
            </Col>
            <Col span="19">
            <RadioGroup v-model="dotItem.readValue">
              <Radio class="check_a" v-for="(item,index) in readList" :label="item.value" :key="index">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
            </Col>
          </Row>
          <Row class="mtb15" v-show="dotItem.dataValue===3">
            <Col class="label" span="5">小数位数
            </Col>
            <Col span="19">
            <Select v-model="dotItem.decimalValue" style="width:322px;margin-right:5px;">
              <Option v-for="(item,index) in decimalList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
            </Col>
          </Row>
          <Row class="mtb15" v-show="dotItem.dataValue===2||dotItem.dataValue===3">
            <Col class="label" span="5">上下限
            </Col>
            <Col span="19">
            <template>
              <InputNumber :step="1" v-model="dotItem.min" placeholder="请输入..." :precision="0" v-if="dotItem.dataValue===2"></InputNumber>
              <InputNumber :step="0.1" v-model="dotItem.min" placeholder="请输入..." :precision="dotItem.decimalValue" v-else></InputNumber>
            </template>　至
            <template>
              <InputNumber :min="dotItem.min" :step="1" v-model="dotItem.max" placeholder="请输入..." :precision="0" v-if="dotItem.dataValue===2"></InputNumber>
              <InputNumber :min="dotItem.min" :step="0.1" v-model="dotItem.max" placeholder="请输入..." :precision="dotItem.decimalValue"
                v-else></InputNumber>
            </template>
            </Col>
          </Row>
          <Row class="mtb15" v-show="dotItem.dataValue===3">
            <Col class="label" span="5">小数点传输
            </Col>
            <Col span="19">
            <RadioGroup v-model="dotItem.transValue">
              <Radio class="check_a" v-for="(item,index) in transList" :label="item.value" :key="index">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
            </Col>
          </Row>
          <Row class="mtb15">
            <Col class="label" span="5">备注
            </Col>
            <Col span="19">
            <Input v-model="dotItem.remark" placeholder="请输入备注..." size="large" :maxlength=128 style="width:322px;margin-right:5px;"></Input>
            </Col>
          </Row>
          <Row class="mtb15" style="margin-top:25px;">
            <Col class="label" span="5">&nbsp;
            </Col>
            <Col span="19">
            <span class="btn" @click="saveSingleFundot(customFunGroupData.dotList,dotItem,dotIndex)">保存</span>
            <span class="btn_txt" @click="dotItem.show=false">取消</span>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
    <!-- 自定义触发器弹窗 -->
    <Modal v-model="modelCustomTrigger" class="modal trig_modal" title="自定义触发器" @on-ok="okCustomTrigger" :loading="loading" width="600">
      <Row class="mtb15 trig_name">
        <Col class="label" span="5" style="font-weight: bold;">触发器名称
        </Col>
        <Col span="19">
        <Input v-model="customTriggerData.triggerName" placeholder="请输入触发器名称..." style="width:260px;margin-right:5px;" :maxlength=16></Input>
        </Col>
      </Row>
      <!-- <Row class="mtb15">
        <Col class="label" span="5">触发功能点</Col>
        <Col span="19">
        <Select v-model="customTriggerData.dotValue" style="width:260px">
          <Option v-for="item in customTriggerData.dotList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </Col>
      </Row> -->
      <Row class="mtb15">
        <Col class="label" span="5" style="font-weight: bold;">新增触发方式
        </Col>
        <Col span="19">
        <Button type="primary" :disabled="customTriggerData.alarmList.length>0&&(customTriggerData.alarmList[0].checked||customTriggerData.alarmList[1].checked||customTriggerData.alarmList[2].checked)"
          @click="addTriggerAlarm">报警触发</Button>
        <Button type="primary" :disabled="customTriggerData.controlList.length>0" @click="addTriggerControl" style="margin-left:16px;">控制触发</Button>
        </Col>
      </Row>
      <div class="trig_line"></div>
      <div>
        <Row class="mtb15" v-if="customTriggerData.alarmList.length>0&&(customTriggerData.dataType === 2 || customTriggerData.dataType === 3)">
          <Col class="label" span="5">警报触发值
          </Col>
          <Col span="19">
          <div>
            <Select placeholder="请选择警报触发条件..." v-model="customTriggerData.triggerCondition" style="width:120px;margin-right:5px;">
              <Option v-for="(judgeItem,judgeIndex) in judge" :value="judgeItem.value" :key="judgeIndex">{{judgeItem.label}}</Option>
            </Select>
            <InputNumber :min="customTriggerData.bottomLimit" :max="customTriggerData.topLimit" :step="1" v-model="customTriggerData.triggerValue"
              placeholder="请输入触发值..." style="width:140px;"></InputNumber>
          </div>
          </Col>
        </Row>
        <div v-for="(item, index) in customTriggerData.alarmList" :key="index">
          <Row class="mtb15">
            <Col class="label" span="5">警报方式
            </Col>
            <Col span="19">
            <template>
              <Row>
                <Col span="24">
                <div class="trig_bg">
                  <Col span="5">
                  <!-- <span class="check_a" :class="item.checked?'checked':''" @click="alarmChecked(alarmItem,item,index)" style="border:none;">
                      <Icon :type="item.checked?'android-checkbox':'android-checkbox-outline'" :color="item.checked?'#008CF8':''" class="check_a_icon"></Icon>{{item.label}}</span> -->
                  <span class="check_a" :class="item.checked?'checked':''" @click="item.checked=!item.checked" style="border:none;">
                    <template>
                      <Icon type="android-checkbox" color="#008CF8" class="check_a_icon" v-if="item.checked"></Icon>
                      <b class="check_a_icon_uncheck" v-else></b>
                    </template>{{item.label}}</span>
                  </Col>
                  <Col span="19">
                  <Input v-model="item.number" :placeholder="item.place" style="width:255px;margin-right:5px;" :disabled="item.hasConfirm||!item.checked">
                  <Button type="primary" :disabled="item.hasSend||!item.checked||item.hasConfirm" @click="getCode(item,index)" slot="append"
                    class="trig_append_btn">{{ item.hasSend&&!item.hasConfirm?'剩余 '+item.time+' s':'发送验证码'
                    }}
                  </Button>
                  </Input>
                  <div style="height:10px;"></div>
                  <Input v-model="item.code" placeholder="请输入验证码" style="width:255px;margin-right:5px;" :disabled="item.hasConfirm||!item.checked">
                  <Button type="primary" :disabled="!item.checked" @click="trigChangeStatus(item,index)" slot="append" class="trig_append_btn">{{
                    item.hasConfirm?'修改':'确定' }}</Button>
                  </Input>
                  </Col>
                </div>
                </Col>
              </Row>
            </template>
            </Col>
          </Row>
        </div>
      </div>
      <div class="trig_line" v-if="customTriggerData.controlList"></div>
      <Row class="mtb15" v-if="customTriggerData.controlList.length>0&&(customTriggerData.dataType === 2 || customTriggerData.dataType === 3)">
        <Col class="label" span="5">控制功能点
        </Col>
        <Col span="19">
        <div class="trig_bg">
          {{customTriggerData.featureName}}
        </div>
        </Col>
      </Row>
      <div v-for="(ctrlItem,ctrlIndex) in customTriggerData.controlList" :key="ctrlIndex">
        <Row class="mtb15">
          <Col class="label" span="5">控制{{ ctrlIndex+1 }}
          </Col>
          <Col span="19">
          <div class="trig_bg">
            <div>
              <Select placeholder="请选择功能点..." v-model="ctrlItem.featureID" style="width:240px;margin-right:5px;" @click.native="wPtSelect($event, ctrlIndex)">
                <Option v-for="(item,index) in wPt" :value="item.featureID" :key="index" :disabled="item.checked">{{item.featureName}}</Option>
              </Select>
              <RadioGroup v-model="ctrlItem.directValue" type="button" class="trig_switch">
                <Radio v-for="(item,index) in ctrlItem.directList" :label="item.value" :key="index" class="trig_switch_btn">
                  <span>{{item.label}}</span>
                </Radio>
              </RadioGroup>
            </div>
            <div v-if="customTriggerData.dataType === 2 || customTriggerData.dataType === 3" style="margin-top:15px;">
              <Select placeholder="请选择触发条件..." v-model="ctrlItem.triggerCondition" style="width:120px;margin-right:5px;">
                <Option v-for="(judgeItem,judgeIndex) in judge" :value="judgeItem.value" :key="judgeIndex">{{judgeItem.label}}</Option>
              </Select>
              <InputNumber :min="customTriggerData.bottomLimit" :max="customTriggerData.topLimit" :step="0.1" v-model="ctrlItem.triggerValue"
                placeholder="请输入触发值..." style="width:140px;"></InputNumber>
            </div>
            <div v-if="customTriggerData.dataType === 2 || customTriggerData.dataType === 3" style="margin-top:15px;">
              <InputNumber :min="customTriggerData.bottomLimit" :max="customTriggerData.topLimit" :step="1" v-model="ctrlItem.destValue"
                placeholder="请输入目标值..." style="width:140px;"></InputNumber>
            </div>
          </div>
          <Button type="ghost" shape="circle" icon="ios-plus-empty" @click="addTriggerControl" style="border-color:#008CF8;color:#008CF8;vertical-align: top;"
            v-if="(customTriggerData.controlList.length<5)&&(customTriggerData.controlList.length<ctrlItem.wPt.length)&&(ctrlIndex==customTriggerData.controlList.length-1)"></Button>
          <Button type="ghost" shape="circle" icon="ios-trash-outline" @click="deltrigContrl(ctrlItem.id,ctrlIndex)" style="border-color:#ccc;color:#ccc;vertical-align: top;"></Button>
          </Col>
        </Row>
      </div>
      <Row class="mtb15">
        <Col class="label" span="5">备注
        </Col>
        <Col span="19">
        <Input v-model="customTriggerData.remark" type="textarea" :rows="4" placeholder="请输入备注..." :maxlength=128 style="width:360px;"></Input>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import expandRow from "./set_table.vue";
  import breadcrumbNav from "../main-components/breadcrumb-nav.vue";
  import topTimeline from "../my-components/top-timeline";
  import leftInfo from "../my-components/left-info";
  export default {
    name: "home_set",
    components: {
      expandRow,
      breadcrumbNav,
      "top-timeline": topTimeline,
      "left-info": leftInfo
    },
    data() {
      return {
        loading: true,
        id: this.$route.query.id,
        judge: [
          { label: "=", value: "=" },
          { label: ">=", value: ">=" },
          { label: ">", value: ">" },
          { label: "<=", value: "<=" },
          { label: "<", value: "<" },
          { label: "!=", value: "!=" }
        ],
        status: null,
        keywords: [],
        featureList: [],
        tableFunctionList: [],
        tableTriggerList: [],
        modelAddSet: false,
        tabOneList: [],
        tabTwoList: [],
        tabThreeList: [],
        modelCustomFunDot: false,
        modelCustomFunGroup: false,
        modelCustomTrigger: false,
        customFunDotData: {},
        customFunGroupData: {
          groupName: '',
          dotList: []
        },
        customTriggerData: {},
        wPt: [],
        wptChose: [],
        selectedItem: [],
        pos: [],
        pageObj1: {
          total: 0,
          current: 1,
          size: 10
        },
        pageObj2: {
          total: 0,
          current: 1,
          size: 10
        },
        dataList: [
          { label: "布尔数", value: 1 },
          { label: "整数", value: 2 },
          { label: "浮点数", value: 3 },
          { label: "时间", value: 4 },
          { label: "块数据", value: 5 }
        ],
        readList: [
          { label: "可读", value: 0 },
          { label: "可写", value: 1 }
        ],
        decimalList: [
          { label: "一位小数", value: 1 },
          { label: "二位小数", value: 2 },
          { label: "三位小数", value: 3 },
          { label: "四位小数", value: 4 }
        ],
        transList: [
          { label: "传输", value: 0 },
          { label: "不传输", value: 1 }
        ],
        exhibition:0,
      };
    },
    computed: {
      currentPath() {
        return this.$store.state.app.currentPath; // 当前面包屑数组
      }
    },
    watch: {
    },
    created() {
      //获取标识符数据
      this.getKeyWords(this.id);
      // 获取功能设置表格列表数据
      this.getTableFunctionList();
      // 获取触发器设置表格列表数据
      // this.getTableTriggerList();
      //接口获取所有触发器
      this.getAlltrig(this.id);
      /* // 获取功能点的选项列表
      this.getTabOneList();
      // 获取功能集的选项列表
      this.getTabTwoList();
      // 获取触发器的选项列表
      this.getTabThreeList(); */
      //从接口一步获取功能点功能集模板
      this.getTabList();
      // 获取原始自定义功能点数据
      this.getCustomFunDotData();
      // 获取原始自定义触发器数据
      this.getCustomTriggerData();
      //接口获取所有功能点功能集
      this.getFeatureList(this.id);
    },
    mounted() {
      this.$Message.config({
        top: 24,
        duration: 1.5
      });
    },
    methods: {
      //切换为整数
      intNum(obj) {
        if (obj.min > 0) {
          obj.min = Math.floor(obj.min);
        } else {
          obj.min = Math.ceil(obj.min);
        }
        if (obj.max > 0) {
          obj.max = Math.floor(obj.max);
        } else {
          obj.max = Math.ceil(obj.max);
        }
      },
      getKeyWords(id) {
        const that = this;
        this.axios.get(this.api.getInfo + id)
          .then(res => {
            console.log(res, 'keywords and status');
            that.keywords = res.data.keywords;
            that.status = isNaN(parseInt(res.data.status)) ? 0 : res.data.status;
            that.exhibition=res.data.exhibition||0;
            if (res.data.status < 1) {
              that.changeStatus();
            }
          }).catch(err => {
            console.log(res);
          });
      },
      changeStatus() {
        console.log('changeStatus', this.featureList);
        if (this.featureList.length > 0) {
          this.axios.post(this.api.addProductType, {
            data: {
              productTypeID: this.id,
              status: 1
            }
          }).then(res => {
            console.log(res);
            this.status = 1;
          }).catch(err => {
          });
        }
      },
      getWpt(id, featureID) {
        const that = this;
        this.axios.get(this.api.getWpt + id, { data: { rw: 1 } })
          .then(res => {
            console.log("可写功能点", res);
            that.wPt = [];
            res.data.forEach(val => {
              if (val.featureID != featureID) {
                val.checked = false;
                that.wptChose.push('');
                that.wPt.push(val);
              }
            });
            console.log(that.wPt, '排除自己的功能点')
          }).catch(err => {
          });
      },
      //触发器的可读功能点选项改变
      wPtSelect(value, index) {
        /* const arrWpt = this.wPt;
        if (this.wptChose[index]) {
          arrWpt[this.wptChose[index]].checked = false;
        }
        arrWpt.forEach((val, dex) => {
          if (val.featureID === value) {
            val.checked = true;
            this.wptChose[index] = dex;
          }
        });
        console.log(arrWpt, 9); */
        const that = this;
        that.wPt.forEach(element => {
          element.checked = false;
        });
        this.customTriggerData.controlList.forEach((val, i) => {
          that.wPt.forEach((ele, j) => {
            if (ele.featureID == val.featureID) {
              ele.checked = true;
            }
          });
        });


        // console.log("触发器的可读功能点选项改变",value,index);
        // console.log(this.wPt,1);
        // let selectedItem=this.selectedItem,pos=this.pos;
        // selectedItem[index]={},pos[index]=null;
        // if(selectedItem[index]){
        //   this.wPt=this.wPt.splice(pos[index],0,selectedItem[index])
        // }
        // this.wPt.forEach((val,i)=>{
        //   if(val.featureID==value){
        //     selectedItem[index]=this.wPt.splice(i,1);
        //     pos[index]=i;
        //   }
        // });        
      },
      setUnfold(item) {
        item.unfold = !item.unfold;
      },
      delFset(id, index) {
        this.$Modal.confirm({
          title: '删除提示',
          content: "确定要删除吗？",
          onOk: res => {
            this.axios.get(this.api.delFset + id, { showError: true, errorText: "功能集删除失败" }).then(res => {
              console.log(res);
              if (res.result == "1") {
                console.log(index, 'index哦')
                this.featureList.splice(index, 1);
                this.$Message.info("功能集删除成功")
              }
            }).catch(err => {

            });
          }
        })
      },
      delFeature(id, index, items) {
        const that = this;
        this.$Modal.confirm({
          title: '删除提示',
          content: "确定要删除吗？",
          onOk: res => {
            this.axios.get(this.api.delFeature + id, { showError: true, errorText: "功能点删除失败" }).then(res => {
              console.log(res);
              if (res.result == "1") {
                if (items) {
                  items.features.splice(index, 1);
                  that.$Message.info("功能集的功能点删除成功");
                } else {
                  that.featureList.splice(index, 1);
                  that.$Message.info("功能点删除成功");
                }
              }
            }).catch(err => {

            });
          }
        })
      },
      delFeaturePrompt(id, index, items) {
        const that = this;
        this.$Modal.confirm({
          title: '删除提示',
          content: "确定要删除吗？",
          onOk: res => {
            this.axios.get(this.api.delFeature + id, { showError: true, errorText: "功能点删除失败" }).then(res => {
              console.log(res);
              if (res.result == "1") {
                items.splice(index, 1);
                that.$Message.info("功能点删除成功");
              }
            }).catch(err => {

            });
          }
        })
      },
      //删除触发器控制
      deltrigContrl(id, index) {
        this.$Modal.confirm({
          title: '删除提示',
          content: "确定要删除吗？",
          onOk: res => {
            if (id) {
              this.axios.get(this.api.deltrigContrl + id, { showError: true, errorText: "触发器控制删除失败" }).then(res => {
                console.log(res);
                if (res.result == "1") {
                  this.customTriggerData.controlList.splice(index, 1);
                  this.$Message.info("删除成功");
                  this.getAlltrig(this.id);
                }
              }).catch(err => {

              });
            } else {
              this.customTriggerData.controlList.splice(index, 1);
            }
          }
        })
      },
      //获取功能集功能点列表
      getFeatureList(id) {
        const that = this;
        this.axios.get(this.api.fsall,
          {
            data: {
              current: this.pageObj1.current,
              size: this.pageObj1.size,
              id: this.id
            },
            showError: true,
            errorText: "功能点获取失败"
          })
          .then(res => {
            console.log(res);
            if (res.result == "1") {
              const resData = res.data;
              that.pageObj1.total = resData.total || 0;
              that.featureList = [];
              resData.records.forEach(val => {
                if (val.type == 0) {
                  that.$set(val, "unfold", false);
                }
                that.featureList.push(val);
                console.log(that.featureList);
              });
              if (that.status !== null && that.status < 1) {
                that.changeStatus();
              }
              that.modelCustomFunGroup = false;
            }
          }).catch(err => {

          });
      },
      //功能集功能点列表翻页
      turnPage1(cur) {
        this.pageObj1.current = cur;
        this.getFeatureList(this.id)
      },
      //获取触发器列表
      getAlltrig(id) {
        const that = this;
        this.axios.get(this.api.alltrig,
          {
            data: {
              current: this.pageObj2.current,
              size: this.pageObj2.size,
              id: this.id
            },
            showError: true, errorText: "触发器获取失败"
          })
          .then(res => {
            console.log(res);
            if (res.result == "1") {
              that.tableTriggerList = res.data.records || [];
              that.pageObj2.total = res.data.total || 0;
            }
          }).catch(err => {
            console.log(err);
          });
      },
      //触发器列表翻页
      turnPage2(cur) {
        this.pageObj2.current = cur;
        this.getAlltrig(this.id)
      },
      // 获取功能设置表格列表数据
      getTableFunctionList() {
        // 模拟生成，实际要读接口
        let data = [];
        for (let i = 0; i < 5; i++) {
          data.push({
            setId: i + 1,
            setType: "功能集",
            setName: "GPS功能集" + i,
            data: "smart_1",
            dataType: "浮点型",
            readWrite: "可读",
            maxMin: "12" - i,
            decimal: "两位小数" + i,
            ifDecimal: "传输",
            note: "开发中",
            functionPoint: [
              {
                setId: "0" + (i + 1),
                setType: "功能点",
                setName: "GPS功能集",
                data: "smart_" + i,
                dataType: "浮点型",
                readWrite: "可读",
                maxMin: "12" - i,
                decimal: "两位小数",
                ifDecimal: "传输",
                note: "开发中"
              },
              {
                setId: "0" + (i + 2),
                setType: "功能点",
                setName: "GPS功能集",
                data: "smart_" + i + 1,
                dataType: "浮点型",
                readWrite: "可读",
                maxMin: "12" - i - 1,
                decimal: "两位小数",
                ifDecimal: "传输",
                note: "开发中"
              }
            ]
          });
        }
        this.tableFunctionList = data;
      },
      // 获取触发器设置表格列表数据
      getTableTriggerList() {
        let data = [];
        for (let i = 0; i < 5; i++) {
          data.push({
            setId: i + 1,
            tirggerName: "烟雾报警0" + (i + 1),
            triggerFunction: "温度",
            triggerType: "报警",
            triggerResult: "电话",
            associate: "湿度",
            controlType: "正向" + i,
            note: "开发中",
            control: []
          });
          for (let j = 0; j < 2; j++) {
            data[i].control.push({
              triggerType: "报警",
              triggerResult: "电话" + j,
              associate: "湿度",
              controlType: "正向" + i
            });
          }
        }
        this.tableTriggerList = data;
      },
      // 获取功能点的选项列表
      getTabOneList() {
        const data = [
          "高度",
          "方向",
          "速度",
          "温度",
          "电压",
          "转速",
          "角度",
          "浓度",
          "电流",
          "风速",
          "照度",
          "时间",
          "数量",
          "湿度",
          "压力",
          "压强",
          "亮度",
          "功率",
          "扭矩",
          "开关",
          "阀门",
          "油耗"
        ];
        data.forEach((val, index) => {
          this.tabOneList.push({
            value: index,
            label: val,
            checked: false
          });
        });
      },
      // 获取功能集的选项列表
      getTabTwoList() {
        const data = [
          "高度",
          "方向",
          "速度",
          "温度",
          "电压",
          "转速",
          "角度",
          "浓度",
          "电流",
          "风速",
          "照度",
          "时间",
          "数量",
          "湿度",
          "压力",
          "压强",
          "亮度",
          "功率",
          "扭矩",
          "开关",
          "阀门",
          "油耗"
        ];
        data.forEach((val, index) => {
          this.tabTwoList.push({
            value: index,
            label: val,
            checked: false
          });
        });
      },
      // 获取触发器的选项列表
      getTabThreeList() {
        const data = [
          "高度",
          "方向",
          "速度",
          "温度",
          "电压",
          "转速",
          "角度",
          "浓度",
          "电流",
          "风速",
          "照度",
          "时间",
          "数量",
          "湿度",
          "压力",
          "压强",
          "亮度",
          "功率",
          "扭矩",
          "开关",
          "阀门",
          "油耗"
        ];
        data.forEach((val, index) => {
          this.tabThreeList.push({
            value: index,
            label: val,
            checked: false
          });
        });
      },
      getTabList() {
        const that = this;
        this.axios.get(this.api.temfea)
          .then(res => {
            console.log("获得功能集合功能点的模板", res);
            if (res.result == "1") {
              const resData = res.data;
              that.tabOneList = [];
              that.tabTwoList = [];
              resData.forEach(val => {
                if (val.type == "1") {
                  that.tabOneList.push({
                    value: val.id,
                    label: val.name,
                    checked: false
                  });
                } else {
                  that.tabTwoList.push({
                    value: val.id,
                    label: val.name,
                    checked: false
                  });
                }
              });
            } else {
              this.$Message.error("res.msg");
            }
          }).catch(err => {
          });
      },
      // 确定增加功能点/集、触发器
      okAddSet() {
        // 功能点方面（保存为模板，实际上要存储到后台）   
        let tabOneList = [], tabTwoList = [];
        this.tabOneList.forEach(val => {
          if (val.checked) {
            tabOneList.push(val.value);
          }
        });
        this.tabTwoList.forEach(val => {
          if (val.checked) {
            tabTwoList.push(val.value);
          }
        });
        if (tabOneList.length == 0 && tabTwoList.length == 0) {
          this.$Message.info("请至少选择一个功能点或功能集");
          return this.changeLoading();
        }
        let objData = {
          ptID: this.id,
          fsList: JSON.stringify(tabTwoList),
          fList: JSON.stringify(tabOneList)
        }
        this.axios.post(this.api.importfea, {
          data: objData
        }).then(res => {
          console.log(res);
          if (res.result == '1') {
            this.$Message.info("添加成功！");
            this.modelAddSet = false;
            this.getFeatureList(this.id);
            this.getAlltrig(this.id);
            //从接口一步获取功能点功能集模板
            this.getTabList();
          } else {
            this.$Message.info(res.msg);
            return this.changeLoading();
          }
        });
      },
      // 取消增加功能点/集、触发器
      cancelAddSet() {
        this.tabOneList.forEach(val => {
          val.checked = false;
        });
        this.tabTwoList.forEach(val => {
          val.checked = false;
        });
        this.tabThreeList.forEach(val => {
          val.checked = false;
        });
      },
      // 获取原始自定义功能点数据
      getCustomFunDotData() {
        this.customFunDotData = {
          id: "",
          funName: "",
          dataName: "",
          dataValue: 1,
          readValue: 0,
          max: null,
          min: null,
          decimalValue: 1,
          transValue: 0,
          remark: ""
        };
      },
      // 自定义功能点
      addFunDotItem() {
        // 重置一下初始数据
        this.getCustomFunDotData();
        this.modelAddSet = false;
        this.modelCustomFunDot = true;
      },
      // 保存功能点数据
      okCustomFunDot() {
        if (this.customFunDotData.funName) {
          console.log("set.vue");
          const id = this.customFunDotData.id;
          let _this = this;
          let objData = this.checkFunDotData(_this.customFunDotData);
          if (!objData) {
            return;
          }
          console.log(_this.customFunDotData.dataValue);
          if (id) {
            objData.featureID = id;
          }
          this.axios.post(this.api.customFunDot, /* {
            featureName: _this.customFunDotData.funName||'',//功能点名称
            dataName:_this.customFunDotData.dataName||'',//标识符
            dataType: _this.customFunDotData.dataValue||0,//数据类型
            featureRW: _this.customFunDotData.readValue||0,//读写类型
            bottomLimit: _this.customFunDotData.min||0,//下限
            topLimit: _this.customFunDotData.max||0,//上限
            featureDotNumber: _this.customFunDotData.decimalList||0,//小数位数
            translateInt: _this.customFunDotData.transValue||0,//小数点传输 
            remark: _this.customFunDotData.remark||'';
          } */{ data: objData }).then(res => {
              console.log(res);
              if (res.result == '1') {
                this.$Message.info("保存成功");
                this.modelCustomFunDot = false;
                this.getFeatureList(this.id);
              } else {
                this.$Message.info(res.msg);
                return this.changeLoading();
              }
            }).catch(err => {
              console.log(err);
              this.$Message.info(err);
              return this.changeLoading();
            });
        } else {
          this.$Message.info("请完整填写所有选项！");
          return this.changeLoading();
        }
      },
      // 获取原始自定义功能集数据
      getCustomFunGroupData() {
        this.customFunGroupData = {
          groupName: "",
          dotList: [
          ]
        };
      },
      // 自定义功能集
      addFunGroupItem() {
        // 重置一下初始数据
        this.getCustomFunGroupData();
        this.modelAddSet = false;
        this.modelCustomFunGroup = true;
      },
      // 编辑功能集
      editFunGroupItem(id) {
        const that = this;
        // 通过id读取到这个功能集的所有信息（用assign会有bug，出现不能及时新增和删除数据。 估计是最开始customFunGroupData不能定位{}而应该定null）
        this.customFunGroupData = {
          groupName: "功能集4",
          dotList: []
        };
        this.modelCustomFunGroup = true;
      },
      // 编辑功能点
      editFunDotItem(id) {
        //读取标识符
        this.getKeyWords(this.id);
        this.axios.get(this.api.getFunDotDetail + id, { showError: true, errorText: '获取功能点数据失败' }).then(res => {
          if (res.result === '1') {
            const resData = res.data;
            let objData = {
              id: resData.featureID,
              funName: resData.featureName,
              dataName: resData.dataName,
              oldDataName: resData.dataName,
              dataValue: resData.dataType,
              remark: resData.remark,
              readValue: resData.featureRW,
              min: resData.bottomLimit,
              max: resData.topLimit,
              decimalValue: resData.featureDotNumber || 1,
              transValue: resData['translateInt'],
            }
            Object.assign(this.customFunDotData, objData);
            this.modelCustomFunDot = true;
          }
        });
      },
      // 编辑功能集
      editFset(id) {
        //读取标识符
        this.getKeyWords(this.id);
        const that = this;
        this.axios.get(this.api.getFset + id, { showError: true, errorText: '获取功能集数据失败' }).then(res => {
          if (res.result === '1') {
            const resData = res.data;
            console.log(resData);
            let objData = {
              id: resData.featureSetID,
              groupName: resData.featureSetName,
              remark: resData.remark,
              dotList: []
            }
            if (resData.flist.length > 0) {
              for (let i = 0; i < resData.flist.length; i++) {
                objData.dotList.push({
                  show: false,
                  funName: "",
                  dataName: "",
                  dataValue: 1,
                  readValue: 0,
                  max: null,
                  min: null,
                  decimalValue: 1,
                  transValue: 0,
                  remark: ""
                });
                Object.assign(objData.dotList[i], {
                  id: resData.flist[i].featureID,
                  funName: resData.flist[i].featureName,
                  dataName: resData.flist[i].dataName,
                  oldDataName: resData.flist[i].dataName,
                  dataValue: resData.flist[i].dataType,
                  remark: resData.flist[i].remark,
                  readValue: resData.flist[i].featureRW,
                  min: resData.flist[i].bottomLimit,
                  max: resData.flist[i].topLimit,
                  decimalValue: resData.flist[i].featureDotNumber || 1,
                  transValue: resData.flist[i]['translateInt'],
                });
              }
            }
            Object.assign(that.customFunGroupData, objData);
            that.modelCustomFunGroup = true;
          }
        });
      },
      // 在功能集弹窗里增加一项功能点
      addFunDotToGruup() {
        this.customFunGroupData.dotList.push({
          show: false,
          funName: "",
          dataName: "",
          dataValue: 1,
          readValue: 0,
          max: null,
          min: null,
          decimalValue: 1,
          transValue: "",
          remark: ""
        });
      },
      // 删除功能集列表的一项
      delFunGroupItem(id, index) {
        this.$Modal.confirm({
          title: "删除提示",
          content: "是否删除功能集以及其中的所有功能点？",
          onOk: res => {
            // 这里要调接口，删除这个产品（通过id删除）
            this.tableFunctionList.splice(index, 1);
          }
        });
      },
      // 通用判断功能点数据valid的方法
      checkFunDotData(dotname) {
        const _this = this;
        if (!dotname.funName) {
          _this.$Message.info('功能点名称为必填项');
          return _this.changeLoading();
        }
        if (!dotname.dataName) {
          _this.$Message.info('标识符为必填项');
          return _this.changeLoading();
        }
        if (!dotname.dataValue) {
          _this.$Message.info('数据类型为必选项');
          return _this.changeLoading();
        }
        const reg1 = /^\w{1,12}$/g;
        if (!reg1.test(dotname.dataName)) {
          _this.$Message.info('标识符为1-12位字符');
          return _this.changeLoading();
        }
        let hasKeywords = false;
        /* hasKeywords = _this.keywords.some(val => {
          return val == dotname.dataName;
        }); */
        if (!dotname.oldDataName || (dotname.oldDataName !== dotname.dataName)) {
          hasKeywords = _this.keywords.some(val => {
            return val == dotname.dataName;
            /* if (val == dotname.dataName) {
              console.log(val);
              _this.$Message.info('该标识符已存在！');
              return _this.changeLoading();
            } */
          });
        }
        if (hasKeywords) {
          _this.$Message.info('该标识符已存在！');
          return _this.changeLoading();
        }
        let objData = {
          productTypeID: _this.id,
          featureName: dotname.funName || '', //功能点名称
          dataName: dotname.dataName || '', //标识符
          dataType: dotname.dataValue || 0, //数据类型
          remark: dotname.remark || '',
        };
        if (dotname.dataValue == 4 || dotname.dataValue == 1) {
          if ((dotname.readValue === '') || (dotname.readValue === null)) {
            _this.$Message.info('读写类型为必选项');
            return _this.changeLoading();
          }
          objData.featureRW = dotname.readValue || 0; //读写类型
        } else if (dotname.dataValue == 2) {
          if ((dotname.readValue === '') || (dotname.readValue === null)) {
            _this.$Message.info('读写类型为必选项');
            return _this.changeLoading();
          }
          if ((dotname.min === '') || (dotname.min === null)) {
            _this.$Message.info('下限为必选项');
            return _this.changeLoading();
          }
          if ((dotname.max === '') || (dotname.max === null)) {
            _this.$Message.info('上限为必选项');
            return _this.changeLoading();
          }
          objData.featureRW = dotname.readValue || 0; //读写类型
          objData.bottomLimit = dotname.min || 0; //下限
          objData.topLimit = dotname.max || 0; //上限
        } else if (dotname.dataValue == 3) {
          if ((dotname.readValue === '') || (dotname.readValue === null)) {
            _this.$Message.info('读写类型为必选项');
            return _this.changeLoading();
          }
          if ((dotname.min === '') || (dotname.min === null)) {
            _this.$Message.info('下限为必选项');
            return _this.changeLoading();
          }
          if ((dotname.max === '') || (dotname.max === null)) {
            _this.$Message.info('上限为必选项');
            return _this.changeLoading();
          }
          if (!dotname.decimalValue) {
            _this.$Message.info('小数位数为必选项');
            return _this.changeLoading();
          }
          if ((dotname.transValue === '') || (dotname.transValue === null)) {
            _this.$Message.info('小数点传输为必选项');
            return _this.changeLoading();
          }
          console.log(dotname.min.toFixed(dotname.decimalValue));
          objData.featureRW = dotname.readValue || 0; //读写类型
          objData.bottomLimit = dotname.min.toFixed(dotname.decimalValue) || 0; //下限
          objData.topLimit = dotname.max.toFixed(dotname.decimalValue) || 0; //上限
          objData.featureDotNumber = dotname.decimalValue || 0; //小数点位数
          objData.translateInt = dotname.transValue || 0; //是否整数传输
        }
        return objData;
      },
      //通用判断触发器数据valid的方法
      checkTriggerData(customTriggerData, _this) {
        if (customTriggerData.triggerName) {
          let objData = {
            trigger: {
              name: customTriggerData.triggerName || '', //触发器名称
              remark: customTriggerData.remark || '',
              productTypeID: _this.id,
              featureID: _this.customTriggerData.featureID,
            },
            triWarn: {},
            triControl: []
          };
          if (customTriggerData.alarmList.length == 0 && customTriggerData.controlList.length == 0) {
            _this.$Message.info('触发器报警方式或控制方式请至少完整填写一种');
            return _this.changeLoading();
          }
          objData.triWarn = {};
          if (customTriggerData.alarmList.length > 0) {
            objData.triggerCondition = customTriggerData.triggerCondition;
            objData.triggerValue = customTriggerData.triggerValue;
            let alarmList = customTriggerData.alarmList;
            if (alarmList[0].checked && alarmList[0].hasConfirm) {
              objData.triWarn.trigsms = alarmList[0].number
            }
            if (alarmList[1].checked && alarmList[1].hasConfirm) {
              objData.triWarn.trigtel = alarmList[1].number
            }
            if (alarmList[2].checked && alarmList[2].hasConfirm) {
              objData.triWarn.trigemail = alarmList[2].number
            }
            if (customTriggerData.dataType === 2 || customTriggerData.dataType === 3) {
              if (!customTriggerData.triggerCondition) {
                _this.$Message.info('警报触发条件为必选项');
                return _this.changeLoading();
              }
              if (!customTriggerData.triggerValue) {
                _this.$Message.info('警报触发值为必选项');
                return _this.changeLoading();
              }
              objData.triWarn.triggerCondition = customTriggerData.triggerCondition;
              objData.triWarn.triggerValue = customTriggerData.triggerValue;
            }
            if (!objData.triWarn.trigsms && !objData.triWarn.trigtel && !objData.triWarn.trigemail) {
              _this.$Message.info('请至少准确填写一种警报方式');
              return _this.changeLoading();
            }
          }
          if (customTriggerData.alarmList.length > 0 && Object.keys(objData.triWarn).length == 0) {
            return;
          }
          objData.triControl = [];
          if (customTriggerData.controlList.length > 0) {
            for (var index = 0; index < customTriggerData.controlList.length; index++) {
              let val = customTriggerData.controlList[index];
              if (!val.featureID) {
                _this.$Message.info('请选择控制' + index + 1 + '的功能点');
                return _this.changeLoading();
              }
              objData.triControl.push({
                featureID: val.featureID,
                controlStyle: val.directValue
              });
              if (customTriggerData.dataType === 2 || customTriggerData.dataType === 3) {
                if (!val.triggerCondition) {
                  _this.$Message.info('请选择控制' + index + 1 + '的触发条件');
                  return _this.changeLoading();
                }
                if (!val.triggerValue) {
                  _this.$Message.info('请填写控制' + index + 1 + '的触发值');
                  return _this.changeLoading();
                }
                if (!val.destValue) {
                  _this.$Message.info('请填写控制' + index + 1 + '的目标值');
                  return _this.changeLoading();
                }
                objData.triControl[index].triggerCondition = val.triggerCondition;
                objData.triControl[index].triggerValue = val.triggerValue;
                objData.triControl[index].destValue = val.destValue;
              }
              if (val.id) {
                objData.triControl[index].trigcontrolID = val.id;
              }
            }
          }
          if (customTriggerData.controlList.length > 0 && Object.keys(objData.triControl).length == 0) {
            return;
          }
          /* if (Object.keys(objData.triWarn).length == 0 && Object.keys(objData.triControl).length == 0) {
            _this.$Message.info('触发器报警方式或控制方式请至少完整填写一种');
            return _this.changeLoading();
          } */
          return objData;
        } else {
          _this.$Message.info('触发器名称为必填项');
          return _this.changeLoading();
        }
      },

      // 保存功能集数据
      okCustomFunGroup() {
        let _this = this;
        console.log("保存功能集数据");
        if (this.customFunGroupData.groupName) {
          let fsetData = {
            featureSetName: this.customFunGroupData.groupName,
            productTypeID: this.id,
            pflist: []
          };
          function checkDotList() {
            if (_this.customFunGroupData.dotList.length > 0) {
              dotlist: for (let i = 0; i < _this.customFunGroupData.dotList.length; i++) {
                let dotname = _this.customFunGroupData.dotList[i];
                if (!dotname.funName) {
                  _this.$Message.info('功能点' + (i + 1) + '功能点名称为必填项');
                  _this.changeLoading();
                  break dotlist;
                }
                _this.customFunGroupData.dotList.forEach(val => {
                  val.show = false;
                });
                dotname.show = true;
                if (!dotname.dataName) {
                  _this.$Message.info('功能点' + (i + 1) + '标识符为必填项');
                  _this.changeLoading();
                  break dotlist;
                }
                if (!dotname.dataValue) {
                  _this.$Message.info('功能点' + (i + 1) + '数据类型为必选项');
                  _this.changeLoading();
                  break dotlist;
                }
                const reg1 = /^\w{1,12}$/g;
                if (!reg1.test(dotname.dataName)) {
                  _this.$Message.info('功能点' + (i + 1) + '标识符为1-12位字符');
                  _this.changeLoading();
                  break dotlist;
                }
                let hasKeywords = false;
                /* hasKeywords = _this.keywords.some(val => {
                  return val == dotname.dataName;
                }); */
                if (!dotname.oldDataName || (dotname.oldDataName !== dotname.dataName)) {
                  hasKeywords = _this.keywords.some(val => {
                    return val == dotname.dataName;
                    /* if (val == dotname.dataName) {
                      console.log(val);
                      _this.$Message.info('该标识符已存在！');
                      return _this.changeLoading();
                    } */
                  });
                }
                if (hasKeywords) {
                  _this.$Message.info('该标识符已存在！');
                  return _this.changeLoading();
                }
                let sameKeywords = false;
                let sameIndex = null;
                sameKeywords = _this.customFunGroupData.dotList.some((val, index) => {
                  sameIndex = index;
                  return val.dataName == dotname.dataName && index !== i;
                });
                if (sameKeywords) {
                  _this.$Message.info('功能点' + (i + 1) + '与功能点' + (sameIndex + 1) + '使用相同标识符！');
                  _this.changeLoading();
                  break dotlist;
                }
                let objData = {
                  productTypeID: _this.id,
                  featureName: dotname.funName || '', //功能点名称
                  dataName: dotname.dataName || '', //标识符
                  dataType: dotname.dataValue || 0, //数据类型
                  remark: dotname.remark || '',
                };
                if (dotname.dataValue == 4 || dotname.dataValue == 1) {
                  if ((dotname.readValue === '') || (dotname.readValue === null)) {
                    _this.$Message.info('功能点' + (i + 1) + '读写类型为必选项');
                    _this.changeLoading();
                    break dotlist;
                  }
                  objData.featureRW = dotname.readValue || 0; //读写类型
                } else if (dotname.dataValue == 2) {
                  if ((dotname.readValue === '') || (dotname.readValue === null)) {
                    _this.$Message.info('功能点' + (i + 1) + '读写类型为必选项');
                    _this.changeLoading();
                    break dotlist;
                  }
                  if ((dotname.min === '') || (dotname.min === null)) {
                    _this.$Message.info('功能点' + (i + 1) + '下限为必选项');
                    _this.changeLoading();
                    break dotlist;
                  }
                  if ((dotname.max === '') || (dotname.max === null)) {
                    _this.$Message.info('功能点' + (i + 1) + '上限为必选项');
                    _this.changeLoading();
                    break dotlist;
                  }
                  objData.featureRW = dotname.readValue || 0; //读写类型
                  objData.bottomLimit = dotname.min || 0; //下限
                  objData.topLimit = dotname.max || 0; //上限
                } else if (dotname.dataValue == 3) {
                  if ((dotname.readValue === '') || (dotname.readValue === null)) {
                    _this.$Message.info('功能点' + (i + 1) + '读写类型为必选项');
                    _this.changeLoading();
                    break dotlist;
                  }
                  if ((dotname.min === '') || (dotname.min === null)) {
                    _this.$Message.info('功能点' + (i + 1) + '下限为必选项');
                    _this.changeLoading();
                    break dotlist;
                  }
                  if ((dotname.max === '') || (dotname.max === null)) {
                    _this.$Message.info('功能点' + (i + 1) + '上限为必选项');
                    _this.changeLoading();
                    break dotlist;
                  }
                  if (!dotname.decimalValue) {
                    _this.$Message.info('功能点' + (i + 1) + '小数位数为必选项');
                    _this.changeLoading();
                    break dotlist;
                  }
                  if ((dotname.transValue === '') || (dotname.transValue === null)) {
                    _this.$Message.info('功能点' + (i + 1) + '小数点传输为必选项');
                    _this.changeLoading();
                    break dotlist;
                  }
                  console.log(dotname.min.toFixed(dotname.decimalValue));
                  objData.featureRW = dotname.readValue || 0; //读写类型
                  objData.bottomLimit = dotname.min.toFixed(dotname.decimalValue) || 0; //下限
                  objData.topLimit = dotname.max.toFixed(dotname.decimalValue) || 0; //上限
                  objData.featureDotNumber = dotname.decimalValue || 0; //小数点位数
                  objData.translateInt = dotname.transValue || 0; //是否整数传输
                }
                /* if (_this.checkFunDotData(_this.customFunGroupData.dotList[i])) {
                  objData.pflist.push(_this.checkFunDotData(_this.customFunGroupData.dotList[i]));
                } else {
                  let str = '请正确填写功能点' + (i + 1) + '的标识符';
                  _this.$Message.info(str);
                  _this.changeLoading();
                  return;
                } */
                if (dotname.id) {
                  objData.featureID = dotname.id;
                }
                fsetData.pflist.push(objData);
              }
            }
          }
          checkDotList();
          if (_this.customFunGroupData.dotList.length > fsetData.pflist.length) {
            return;
          }
          if (fsetData.pflist) {
            fsetData.pflist = JSON.stringify(fsetData.pflist);
          } else {
            delete fsetData.pflist;
          }
          if (this.customFunGroupData.id) {
            fsetData.featureSetID = this.customFunGroupData.id;
          } else {
            delete fsetData.featureSetID;
          }
          this.axios.post(this.api.editpt, {
            data: fsetData
          }).then(res => {
            console.log(res);
            if (res.result == '1') {
              this.$Message.info("保存成功");
              this.modelCustomFunGroup = false;
              this.getFeatureList(this.id);
            } else {
              this.$Message.info(res.msg);
              return this.changeLoading();
            }
          });
        } else {
          console.log(1, '新增功能集莫名关闭');
          this.$Message.info("请正确填写功能集名称");
          return this.changeLoading();
        }
      },
      // 获取原始自定义触发器数据
      getCustomTriggerData(featureID, dataType, bottomLimit, topLimit, featureName) {
        this.customTriggerData = {
          featureID: featureID,
          id: "",
          triggerName: "",
          dotValue: "功能点一",
          dotList: [
            { label: "功能点一", value: "功能点一" },
            { label: "功能点二", value: "功能点二" },
            { label: "功能点三", value: "功能点三" }
          ],
          alarmList: [],
          controlList: [],
          remark: ""
        };
        if (dataType) {
          this.customTriggerData.dataType = dataType;
          this.customTriggerData.bottomLimit = bottomLimit;
          this.customTriggerData.topLimit = topLimit;
          this.customTriggerData.triggerCondition = '=';
          this.customTriggerData.triggerValue = null;
          this.customTriggerData.featureName = featureName;
        }
      },
      // 自定义触发器
      addTriggerItem(featureID, dataType, bottomLimit, topLimit, featureName) {
        //读取可写功能点
        this.getWpt(this.id, featureID);
        // 重置一下初始数据
        if (dataType) {
          this.getCustomTriggerData(featureID, dataType, bottomLimit, topLimit, featureName);
        } else {
          this.getCustomTriggerData(featureID);
        }
        this.modelAddSet = false;
        this.modelCustomTrigger = true;
      },
      // 编辑触发器
      editTriggerItem(featureID, triggerID) {
        //读取可写功能点        
        this.getWpt(this.id, featureID);
        // 通过id读取到这个触发器的所有信息
        const that = this;
        this.axios.get(this.api.trigDetail + triggerID,
          {
            showError: true,
            errorText: "该触发器信息获取失败"
          })
          .then(res => {
            console.log(res);
            if (res.result == "1") {
              const resData = res.data;
              let objData = {
                triggerName: resData.name,
                featureName: resData.featureName,
                dataType: resData.dataType,
                bottomLimit: resData.bottomLimit,
                topLimit: resData.topLimit,
                alarmList: [],
                controlList: [],
                remark: resData.remark,
                triggerID: resData.triggerID,
                productTypeID: resData.productTypeID,
                featureID: featureID
              };
              if (resData.ptcList.length > 0) {
                resData.ptcList.forEach((val, index) => {
                  objData.controlList.push({
                    id: val.trigcontrolID,
                    featureID: val.featureID,
                    directValue: val.controlStyle,
                    directList: [
                      { label: "正向", value: 1 },
                      { label: "负向", value: 0 }
                    ],
                    wPt: that.wPt,
                    triggerCondition: val.triggerCondition || '=',
                    triggerValue: val.triggerValue || null,
                    destValue: val.destValue || null
                  });
                });
              }
              if (resData.ptwEntity.trigemail || resData.ptwEntity.trigsms || resData.ptwEntity.trigtel) {
                objData.trigwarnID = resData.ptwEntity.trigwarnID;
                objData.triggerCondition = resData.ptwEntity.triggerCondition || '=';
                objData.triggerValue = resData.ptwEntity.triggerValue || null;
                objData.alarmList = [
                  {
                    label: "短信",
                    value: "短信",
                    checked: false,
                    name: "手机号码",
                    place: "请输入手机号码",
                    number: "",
                    hasSend: false,
                    hasConfirm: false,
                    time: 60,
                    code: ""
                  },
                  {
                    label: "电话",
                    value: "电话",
                    checked: false,
                    name: "电话",
                    place: "请输入手机号码",
                    number: "",
                    hasSend: false,
                    hasConfirm: false,
                    time: 60,
                    code: ""
                  },
                  {
                    label: "邮箱",
                    value: "邮箱",
                    checked: false,
                    name: "邮箱",
                    place: "请输入邮箱",
                    number: "",
                    hasSend: false,
                    hasConfirm: false,
                    time: 60,
                    code: ""
                  }];
                if (resData.ptwEntity.trigsms) {
                  objData.alarmList[0].checked = true;
                  objData.alarmList[0].hasSend = true;
                  objData.alarmList[0].hasConfirm = true;
                  objData.alarmList[0].number = resData.ptwEntity.trigsms;
                }
                if (resData.ptwEntity.trigtel) {
                  objData.alarmList[1].checked = true;
                  objData.alarmList[1].hasSend = true;
                  objData.alarmList[1].hasConfirm = true;
                  objData.alarmList[1].number = resData.ptwEntity.trigtel;
                }
                if (resData.ptwEntity.trigemail) {
                  objData.alarmList[2].checked = true;
                  objData.alarmList[2].hasSend = true;
                  objData.alarmList[2].hasConfirm = true;
                  objData.alarmList[2].number = resData.ptwEntity.trigemail;
                }
                console.log("objData.alarmList", objData.alarmList);
              }
              that.customTriggerData = {
                triggerName: "xxx控制器",
                dotValue: "功能点三",
                dotList: [
                  { label: "功能点一", value: "功能点一" },
                  { label: "功能点二", value: "功能点二" },
                  { label: "功能点三", value: "功能点三" }
                ],
                alarmList: [
                  {
                    label: "短信",
                    value: "短信",
                    checked: false,
                    name: "手机号码",
                    place: "请输入手机号码",
                    number: "",
                    hasSend: false,
                    hasConfirm: false,
                    time: 60,
                    code: ""
                  },
                  {
                    label: "电话",
                    value: "电话",
                    checked: false,
                    name: "电话",
                    place: "请输入电话号码",
                    number: "",
                    hasSend: false,
                    hasConfirm: false,
                    time: 60,
                    code: ""
                  },
                  {
                    label: "邮箱",
                    value: "邮箱",
                    checked: false,
                    name: "邮箱",
                    place: "请输入邮箱",
                    number: "",
                    hasSend: false,
                    hasConfirm: false,
                    time: 60,
                    code: ""
                  }
                ],
                controlList: [
                  {
                    id: '',
                    featureID: "",
                    directValue: 1,
                    directList: [
                      { label: "正向", value: 1, checked: false },
                      { label: "负向", value: 0, checked: false }
                    ],
                    wPt: that.wPt
                  }
                ],
                remark: "没什么"
              };
              Object.assign(that.customTriggerData, objData);
              /* Object.assign(that.customTriggerData.alarmList, objData.alarmList); */
              console.log(that.customTriggerData);
              this.modelCustomTrigger = true;
            }
          }).catch(err => {
            console.log(err);
          });
      },
      // 创建报警触发项
      addTriggerAlarm() {
        if (this.customTriggerData.alarmList.length > 0) {
          this.customTriggerData.alarmList = [];
        } else {
          this.customTriggerData.alarmList = [
            {
              label: "短信",
              value: "短信",
              checked: false,
              name: "手机号码",
              place: "请输入手机号码",
              number: "",
              hasSend: false,
              hasConfirm: false,
              time: 60,
              code: ""
            },
            {
              label: "电话",
              value: "电话",
              checked: false,
              name: "电话",
              place: "请输入手机号码",
              number: "",
              hasSend: false,
              hasConfirm: false,
              time: 60,
              code: ""
            },
            {
              label: "邮箱",
              value: "邮箱",
              checked: false,
              name: "邮箱",
              place: "请输入邮箱",
              number: "",
              hasSend: false,
              hasConfirm: false,
              time: 60,
              code: ""
            }];
        }
      },
      // 创建控制触发项
      addTriggerControl() {
        this.customTriggerData.controlList.push({
          id: '',
          name: "",
          directValue: 1,
          directList: [
            { label: "正向", value: 1, checked: false },
            { label: "负向", value: 0, checked: false }
          ],
          wPt: this.wPt,
          triggerCondition: '=',
          triggerValue: null,
          destValue: null
        });
      },
      // 删除控制触发项
      delTriggerControl(id, index) {
        this.customTriggerData.controlList.splice(index, 1);
      },
      // 删除触发器表格里一项
      delTriggerItem(id, index) {
        const that = this;
        this.$Modal.confirm({
          title: "删除提示",
          content: "是否删除该触发器？",
          onOk: res => {
            // 这里要调接口，删除这个产品（通过id删除）
            that.axios.get(that.api.deltrig + id, { showError: true, errorText: "触发器删除失败" }).then(res => {
              console.log(res);
              if (res.result == "1") {
                that.tableTriggerList.splice(index, 1);
                that.getFeatureList(that.id);
              }
            }).catch(err => {
              console.log(err);
            });
          }
        });
      },
      //触发器报警触发的确定与修改
      trigChangeStatus(item, index) {
        if (item.hasConfirm) {
          item.hasConfirm = !item.hasConfirm;
        } else {
          const number = item.number;
          if (index != 2) {
            if (!this.regPhone(number)) {
              this.$Message.info("请输入正确格式的手机号码");
              return;
            }
            this.axios.post(this.api.verifyCode, {
              data: {
                phone: number,
                vcode: item.code
              }
            }).then(res => {
              if (res.result === '1') {
                item.hasConfirm = !item.hasConfirm;
              } else {
                this.$Message.error(res.msg);
              }
            }).catch(err => {
              console.log(err);
            });
          } else {
            if (!this.regMail(number)) {
              this.$Message.info("请输入正确格式的邮箱");
              return;
            }
            this.axios.post(this.api.verifyEmailCode, {
              data: {
                email: number,
                vcode: item.code
              }
            }).then(res => {
              if (res.result === '1') {
                item.hasConfirm = !item.hasConfirm;
              } else {
                this.$Message.error(res.msg);
              }
            }).catch(err => {
              console.log(err);
            });
          }
        }
        if (item.hasSend) {
          item.hasSend = false;
        }
      },
      // 全选报警方式
      choseAllAlarm(alarmItem) {
        alarmItem.typeList.forEach(val => {
          val.checked = alarmItem.allChecked ? false : true;
        });
        alarmItem.allChecked = !alarmItem.allChecked;
      },
      // 单个选择报警方式
      alarmChecked(item, index) {
        if (item.checked) {
          item.checked = false;
        } else {
          item.checked = true;
        }
      },
      // 倒计时函数
      countDownTime(item) {
        let fnCount = () => {
          let count = setTimeout(() => {
            if (item.time <= 0) {
              clearTimeout(count);
              item.hasSend = false;
              item.time = 60;
            } else {
              item.time -= 1;
              fnCount();
            }
          }, 1000);
        };
        fnCount();
      },
      // 点击发送验证码按钮获取验证码
      getCode(item, index) {
        const number = item.number;
        if (index != 2) {
          if (!this.regPhone(number)) {
            this.$Message.info("请输入正确格式的手机号码");
            return;
          }
          this.axios.get(this.api.getCode + number, {
          }).then(res => {
            if (res.result === '1') {
              item.hasSend = true;
              this.countDownTime(item);
              this.$Message.success("验证码已发送到您的手机，请注意查收！");
            } else {
              this.$Message.error(res.msg);
            }
          }).catch(err => {
            console.log(err);
          });
        } else {
          if (!this.regMail(number)) {
            this.$Message.info("请输入正确格式的邮箱");
            return;
          }
          //邮箱接口
          this.axios.get(this.api.sendEmailCode, {
            data: {
              email: number
            }
          }).then(res => {
            if (res.result === '1') {
              item.hasSend = true;
              this.countDownTime(item);
              this.$Message.success("验证码已发送到您的邮箱，请注意查收！");
            } else {
              this.$Message.error(res.msg);
            }
          }).catch(err => {
            console.log(err);
          });
        }
      },
      // 保存触发器数据
      okCustomTrigger() {
        const id = this.customTriggerData.triggerID;
        let _this = this;
        let objData = {
          trigger: {
            triggerID: ""
          }
        };
        console.log(_this.customTriggerData.dataValue);
        const triggerData = this.checkTriggerData(_this.customTriggerData, _this);
        if (triggerData) {
          objData = triggerData;
          if (id) {
            objData.trigger.triggerID = id;
          } else {
            delete objData.trigger.triggerID;
          }
          console.log(objData);
          if (!objData) return;
          // objData.trigger.featureID = _this.id;
          objData.trigger = JSON.stringify(objData.trigger);
          objData.triWarn = JSON.stringify(objData.triWarn);
          objData.triControl = JSON.stringify(objData.triControl);
          this.axios.post(this.api.editTrigger, { data: objData }).then(res => {
            console.log(res);
            if (res.result === '1') {
              this.$Message.info("已保存");
              this.modelCustomTrigger = false;
              this.getAlltrig(this.id);
              this.getFeatureList(this.id);
            } else {
              this.$Message.info(res.msg);
              return this.changeLoading();
            }
          });
        }
      },
      // 跳下一步骤页面
      pageToNext() {
        let query = { id: this.id };
        this.$router.push({
          path: "/home/setapp",
          query: query
        });
      },
      //编辑功能集里的功能点时，先判断是否有其他功能点在编辑状态，有的话返回，否则把该功能点的show设为true
      changeShow(all, item) {
        function change() {
          for (var i = 0; i < all.length; i++) {
            if (all[i].show) {
              return;
            }
          }
          item.show = true;
        };
        change();
      },
      saveSingleFundot(list, item, i) {
        let objData = this.checkFunDotData(item);
        if (!objData) return;
        let sameKeywords = false;
        let sameIndex = null;
        sameKeywords = list.some((val, index) => {
          sameIndex = index;
          return val.dataName == item.dataName && index !== i;
        });
        if (sameKeywords) {
          _this.$Message.info('该功能点与功能点' + (sameIndex + 1) + '使用相同标识符！');
          return;
        }
        item.show = false;
      }
    },
    filters: {
      floatNum: function (num) {
        value = value.toFixed(num);
        return value;
      }
    }
  };
</script>
<style lang="less" scoped>
  .content {
    .ivu-btn {
      border-color: #57a3f3;
      color: #57a3f3;
    }
    .home-set-con {
      padding: 0;
      background-color: transparent;
      .set_div {
        background: #FFFFFF;
        box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
        border-radius: 2px;
        padding: 0 0 14px;
        &:nth-child(2) {
          margin-top: 17px;
        }
        h3 {
          padding: 20px;
          line-height: 32px;
          font-size: 16px;
          color: #17233D;
        }
        p {
          padding: 24px;
        }
      }
    }
  }

  .mytable {
    width: 100%;
    border-collapse: collapse;
    th,
    td {
      padding: 13px 3px;
      border: none;
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      text-align: left;
      font-size: 14px;
      color: rgba(28, 36, 56, 0.80);
      &:first-child {
        padding-left: 12px;
      }
    }
    &.fsettable {
      th,
      td {
        padding-left: 28px;
      }
      .parent-tr td {
        &:first-child {
          padding-left: 12px;
        }
      }
    }
    th {
      padding: 5px 3px;
      height: 40px;
      background: rgba(20, 35, 63, 0.04);
      font-size: 12px;
      color: #17233D;
    }
    .child-tr td {
      background: rgba(20, 35, 63, 0.04);
    }
    .hide {
      display: none;
    }
    .ghost-gray {
      border: 1px solid rgba(23, 35, 61, 0.15);
      color: rgba(23, 35, 61, 0.80);
    }
  }

  .modal {
    .label {
      line-height: 34px;
      font-size: 14px;
      color: rgba(29, 36, 54, 0.8);
      font-weight: normal;
      text-align: left;
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
      &.checked,
      &.ivu-radio-wrapper-checked {
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
    .check_a_icon_uncheck {
      display: inline-block;
      width: 14px;
      height: 14px;
      background: #FFFFFF;
      border: 1px solid #DCDDE2;
      border-radius: 2px;
      vertical-align: middle;
      margin-right: 7px;
    }
    .trig_switch {
      width: 80px;
      height: 28px;
      background: #FFFFFF;
      border: 1px solid rgba(23, 35, 61, 0.10);
      border-radius: 16px;
      &_btn {
        width: 39px;
        height: 26px;
        padding: 0;
        border: none;
        border-radius: 16px;
        line-height: 28px;
        text-align: center;
        font-size: 12px;
        color: rgba(23, 35, 61, 0.55);
        &.ivu-radio-wrapper-checked {
          background: #008CF8;
          color: #FFFFFF;
        }
        &.ivu-radio-wrapper:after,
        &.ivu-radio-wrapper:before {
          display: none;
        }
      }
    }
    .trig_bg {
      width: 360px;
      box-sizing: border-box;
      padding: 8px 10px;
      display: inline-block;
      background: rgba(23, 35, 61, 0.03);
      border: 1px dashed rgba(23, 35, 61, 0.25);
      border-radius: 2px;
      margin-right: 5px;
      .trig_append_btn {
        color: #008CF8;
        &[disabled] {
          color: rgba(23, 35, 61, 0.25);
        }
      }
    }
    .trig_line {
      width: 550px;
      margin: 0 auto;
      height: 1px;
      background: rgba(23, 35, 61, 0.10);
    }
  }

  .page_container {
    padding: 0 20px;
    overflow: hidden;
    clear: both;
    .turn_page {
      margin-top: 15px;
      float: right;
    }
  }
</style>
<style lang="less">
  .trig_modal {
    .ivu-modal-body {
      padding: 0px 0 16px;
      .trig_name {
        margin: 0;
        padding: 18px 24px;
        background: rgba(23, 35, 61, 0.04);
        box-shadow: 0 2px 4px 0 rgba(23, 35, 61, 0.25);
        border-radius: 2px;
      }
      .ivu-input-group-append {
        background: #fff;
      }
      .ivu-input[disabled]+.ivu-input-group-append {
        background: #f3f3f3;
      }
      .mtb15 {
        padding-left: 24px;
        padding-right: 12px;
        .ivu-icon-ios-trash-outline {
          color: #333;
        }
      }
      .mb10 {
        padding-left: 24px;
        padding-right: 12px;
      }
    }
  }

  .set_modal {
    .ivu-modal-body {
      padding: 0px 0 16px;
      .trig_name {
        margin: 0;
        padding: 18px 24px;
        background: rgba(23, 35, 61, 0.04);
        box-shadow: 0 2px 4px 0 rgba(23, 35, 61, 0.25);
        border-radius: 2px;
      }
      .ivu-input-group-append {
        background: #fff;
      }
      .ivu-input[disabled]+.ivu-input-group-append {
        background: #f3f3f3;
      }
      .mtb15 {
        padding-left: 24px;
        padding-right: 12px;
        .ivu-icon-ios-trash-outline {
          color: #333;
        }
      }
      .mb10 {
        padding-left: 24px;
        padding-right: 12px;
      }
      .btn {
        display: inline-block;
        width: 80px;
        height: 32px;
        border: 1px solid #008CF8;
        border-radius: 2px;
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #008CF8;
        line-height: 32px;
        cursor: pointer;
      }
      .btn_txt {
        display: inline-block;
        width: 80px;
        height: 32px;
        border-radius: 2px;
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: rgba(23, 35, 61, 0.55);
        line-height: 32px;
        cursor: pointer;
      }
    }
  }
</style>