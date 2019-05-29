<template>
    <div>
        <Row class="expand-row">
            <table class="table">
                <tr v-for="item in row" :key="item.setId">
                    <td class="expand-value" width="11.11%">{{ item.setId }}</td>
                    <td class="expand-value" width="11.11%">{{ item.tirggerName }}</td>
                    <td class="expand-value" width="11.11%">{{ item.triggerFunction }}</td>
                    <td class="expand-value" width="11.11%">{{ item.triggerType }}</td>
                    <td class="expand-value" width="11.11%">{{ item.triggerResult }}</td>
                    <td class="expand-value" width="11.11%">{{ item.associate }}</td>
                    <td class="expand-value" width="11.11%">{{ item.controlType }}</td>
                    <td class="expand-value" width="11.11%">{{ item.note }}</td>
                    <td class="expand-value" width="11.11%">                        
                        <a href="javascript:void(0)" @click="view" style="marign-right:5px;">编辑</a>
                        <a href="javascript:void(0)" @click="del" style="marign-right:5px;">删除</a>
                    </td>
                </tr>
            </table>
            <!-- <Row v-for="item in row" :key="item.setId">
                <Col span="3">
                    <span class="expand-value">{{ item.setId }}</span>
                </Col>
                <Col span="2">
                    <span class="expand-value">{{ item.setType }}</span>
                </Col>
                <Col span="2">
                    <span class="expand-value">{{ item.setName }}</span>
                </Col>
                <Col span="2">
                    <span class="expand-value">{{ item.data }}</span>
                </Col>
                <Col span="2">
                    <span class="expand-value">{{ item.dataType }}</span>
                </Col>
                <Col span="2">
                    <span class="expand-value">{{ item.readWrite }}</span>
                </Col>
                <Col span="2">
                    <span class="expand-value">{{ item.maxMin }}</span>
                </Col>
                <Col span="2">
                    <span class="expand-value">{{ item.decimal }}</span>
                </Col>
                <Col span="2">
                    <span class="expand-value">{{ item.ifDecimal }}</span>
                </Col>
                <Col span="2">
                    <span class="expand-value">{{ item.note }}</span>
                </Col>
                <Col span="2">
                    <span class="expand-value">
                        <a href="javascript:void(0)" @click="view" style="marign-right:5px;">编辑</a>
                        <a href="javascript:void(0)" @click="view" style="marign-right:5px;">删除</a>
                    </span>
                </Col>
            </Row> -->
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Array
        },
        methods: {          
            view: () => {
                this.show( params.index )
            },
            del: () => {
                this.remove( params.index )
            }
        }
    };
</script>
<style lang="less" scoped>
    .expand-row{
        margin-bottom: 16px;
        .ivu-table-expanded-cell{
            padding-left: 0;
            padding-right:0;
        }
    }
    .table{
        width: 100%;
        .expand-value{
            //text-align: center;
        }
    }
</style>