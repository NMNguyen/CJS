<template>
    <span>
        <el-row>
            <el-col :span="24">
                <menu-top></menu-top>
            </el-col>
        </el-row>
        <!--<el-row class="gantt-container">-->
            <!--<el-col :span="4">-->
                <!--<div class="block">-->
                    <!--<el-date-picker-->
                      <!--v-model="datetimeTask"-->
                      <!--type="date"-->
                      <!--placeholder="Ngày tạo">-->
                    <!--</el-date-picker>-->
                <!--</div>-->
            <!--</el-col>-->
        <!--</el-row>-->
        <el-row class="gantt-container">
            <el-row :span="24">
              <el-table
                  @row-click="rowClick"
                  height="90vh"
                  ref="filterTable"
                :data="dataTaskSpint"
                :default-sort = "{prop: 'id', order: 'descending'}"
                :row-class-name="tableRowClassName"
                style="width: 100%">
                <el-table-column
                  prop="ref"
                  label="#"
                  sortable
                  width="70">
                </el-table-column>
                <el-table-column
                  :filters="dataProject['us_statuses']"
                  prop="status_extra_info[name]"
                  label="Cột"
                  :filter-method="filterColumn"
                  filter-placement="bottom-end"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="subject"
                  sortable=""
                  label="Task"
                  width="500">
                </el-table-column>
                <el-table-column
                    width="120"
                  prop="created_date"
                    :sort-method="sortDateTime"
                  label="Ngày tạo">
                    <template slot-scope="scope">
                        {{ scope.row.created_date | moment('DD/MM/YYYY') }}
                    </template>
                </el-table-column>
                <el-table-column
                  width="120"
                  sortable=""
                  :sort-method="sortDateTime"
                  label="Deadline">
                    <template slot-scope="scope">
                        {{ scope.row.attributes_values[9] | moment('DD/MM/YYYY') }}
                    </template>
                </el-table-column>
                <el-table-column
                  width="150"
                  sortable=""
                  :sort-method="sortProgressDate"
                  label="Ngày còn lại">
                    <div slot-scope="scope">
                        <span :class="getClassMessage(getSubtractTime(scope.row).result)">
                            {{ getMessageDeadline(getSubtractTime(scope.row).result, getSubtractTime(scope.row).diff) }}
                        </span>
                    </div>
                </el-table-column>
                <el-table-column
                  width="180"
                  :filters="assingedUser"
                  :filter-method="filterTag"
                  filter-placement="bottom-end"
                  prop="assigned_to_extra_info[full_name_display]"
                  label="Người đảm nhận">
                </el-table-column>
                <el-table-column
                  width="100"
                  sortable=""
                  prop="total_points"
                  label="Points">
                </el-table-column>
                <el-table-column
                  width="120"
                  prop="is_closed"
                  sortable=""
                  label="Trạng thái">
                    <template slot-scope="scope">
                        <i v-if="scope.row.is_closed" class="el-icon-check"></i>
                        <i v-else class="el-icon-loading"></i>
                  </template>
                </el-table-column>
                <el-table-column
                    sortable=""
                  prop="finish_date"
                  :sort-method="sortFinishDate"
                  label="Hoàn thành">
                    <template slot-scope="scope">
                        <span>{{ scope.row.finish_date | moment('DD/MM/YYYY') }}</span>
                    </template>
                </el-table-column>
              </el-table>
            </el-row>
        </el-row>
        <modal-detail-task
             v-on:close-modal="closeModal"
             :points="dataProject.points"
             :task="currentTaskData"
             :dialog-visible="dialogVisible">
        </modal-detail-task>
    </span>
</template>

<script>
    import MenuTop from '../menu/main';
    import ModalDetailTask from './minor_component/modal_detail_task';
    import axios from 'axios';
    export default {
        name: 'gantt',
        components: {
            MenuTop,
            ModalDetailTask
        },
        mounted(){
            this.getDataProject();
            this.getDataMileStone();
            this.getDataTaskSprint();
        },
        data(){
            return{
                value: null,
                datetimeTask: null,
                options1: ['list', 'of', 'options'],
                assingedUser: [],
                dataMileStone: {},
                dataTaskSpint: [],
                deadline_status__class:[],
                dataProject: [],
                columnList: [],
                dialogVisible: false,
                currentTaskData: {},
            }
        },
        methods:{
            closeModal(){
                this.dialogVisible = false;
            },
            rowClick(rowData){
                this.currentTaskData = rowData;
                this.dialogVisible = true;
            },
            sortProgressDate(val1, val2){
                if (typeof val1.attributes_values[9] == 'undefined' || typeof val2.attributes_values[9] == 'undefined'){
                    return val1.attributes_values[9] || val2.attributes_values[9] == undefined;
                }
                return this.getSubtractTime(val1).diff - this.getSubtractTime(val2).diff;
            },
            sortFinishDate(val1, val2){
                if (typeof val1.finish_date == 'undefined' || typeof val2.finish_date == 'undefined'){
                    return val1 || val2 == undefined;
                }
                return new Date(val1.finish_date).getTime() - new Date(val2.finish_date).getTime();
            },
            sortDateTime(val1,val2){
                if (typeof val1.attributes_values[9] == 'undefined' || typeof val2.attributes_values[9] == 'undefined'){
                    return val1 || val2 == undefined;
                }
                return new Date(val1.attributes_values[9]).getTime() - new Date(val2.attributes_values[9]).getTime();
            },
            filterTag(value, row) {
                return row.assigned_to === value;
            },
            filterColumn(value, row) {
                return row.status_extra_info['name'] === value;
            },
            getClassMessage(type){
                let classColor = '';
                switch (type) {
                    case 1:
                        classColor = 'done';
                        break;
                    case 2:
                        classColor = 'done';
                        break;
                    case 4:
                        classColor = 'danger';
                        break;
                    case 5:
                        classColor = 'warning';
                        break;
                }
                return classColor;
            },
            getMessageDeadline(type, diff){
                let messages = {
                    '1': `Đã hoàn thành được ${diff} ngày`,
                    '2': `Đúng hạn`,
                    '3': 'Còn 0 ngày',
                    '4': `Quá ${diff} ngày`,
                    '5': `Còn ${diff * -1} ngày`,
                };
                if (['1','4','5'].indexOf(type)== -1 && !(diff >= 0)){
                    return '';
                }else{
                    return messages[type];
                }

            },
            getSubtractTime(rowData){
                let deadline = rowData.attributes_values[9];
                let dateNow = Vue.moment();
                let diff = 0;
                let result = 1;
                // Case đã hoàn thành
                if (rowData.is_closed){
                    diff = Vue.moment(deadline).diff(Vue.moment(rowData.finish_date), 'days');
                    if (diff > 0){
                        result = 1;
                    }
                    else{
                        result = 2;
                    }
                }else{
                    diff = Vue.moment(dateNow).diff(Vue.moment(deadline), 'days');
                    if (diff == 0){
                        result = 3;
                    }else if (diff > 0){
                        result = 4;
                    }else{
                        result = 5;
                    }
                }
                return {'result': result, 'diff': diff};
            },
            tableRowClassName({row, rowIndex}) {
                if (row.status === 232) {
                  return 'row-ux-review';
                } else if (row.status === 3) {
                  return 'row-coding';
                } else if (row.status === 244){
                    return 'row-'
                } else if (row.status === 257) {
                    return 'row-intergration-test';
                }
                return '';
              },
            getAttrTaskData(task){
                let that = this;
                let headers = {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
                axios.get(`${that.$urlAPI}/userstories/custom-attributes-values/${task.id}`,{
                    headers: headers
                }).then(function(res){
                    task['attributes_values'] = res['data']['attributes_values'];
                    that.dataTaskSpint.push(task);
                })
            },
            customNameUser({full_name}){
                if (full_name === ''){
                    return 'Chưa có người đảm nhận';
                }else{
                    return full_name;
                }
            },
            getDataTaskSprint(){
                let that = this;
                let pars = {
                    'include_attachment': 1,
                    'include_tasks': 1,
                    'project': 1,
                    'status__is_archived': false,
                    // 'page': 5,
                }
                let headers = {
                    // maxContentLength: 100,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    // 'x-disable-pagination': false,
                }
                axios.get(`${that.$urlAPI}/userstories`,{
                    params: pars,
                    headers: headers
                }).then(function(res){
                    res['data'].forEach(function(task, index){
                        that.getAttrTaskData(task, index);
                    });
                })
            },
            getDataMileStone(){
                let that = this;
                let pars = {
                    'project': 1,
                };
                axios.get(`${that.$urlAPI}/userstories/filters_data`, {params:pars})
                    .then(function (res) {
                        // handle success
                        that.dataMileStone = res['data'];
                        that.assingedUser = res['data']['assigned_to'].map(user=>{
                            let u = user;
                            u['text'] = u.full_name === '' ? 'Chưa có người đảm nhận':u.full_name;
                            u['value'] = u.id;
                            return u;
                        })
                    });
            },
            getDataProject(){
                let that = this;
                let pars = {
                    'slug': 'fountainhead-cloudjet-kpi',
                };
                let headers = {
                    // maxContentLength: 100,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
                axios.get(`${that.$urlAPI}/projects/by_slug`, {
                    params:pars,
                    headers: headers,
                })
                    .then(function (res) {
                        // handle success
                        that.dataProject = res['data'];
                        that.dataProject['us_statuses'] = res['data']['us_statuses'].map(us=>{
                            let col = us;
                            col['text'] = us.name;
                            col['value'] = us.name;
                            return col;
                        })
                    });
            },
        }
    };
</script>

<style scoped>
    >>>.gantt-container{
        margin-top:10px;
        background: white;
        padding:10px;
    }

    .el-table .row-ready {
        background-color: rgb(245, 121, 0);
    }

    .el-table .row-coding {
        background-color: rgb(206, 92, 0);
    }

    >>>.el-table .row-ux-review .el-table_1_column_2{
        color: rgb(78, 154, 6);
    }

    >>>.el-table .row-intergration-test .el-table_1_column_2{
        color: rgb(196, 160, 0);
    }
    >>>.el-table__row{
        cursor:pointer;
    }
    .el-table .row-demo{
        background-color:rgb(32, 74, 135);
    }
    >>>.done{
        color:#409EFF;
    }
    >>>.warning{
        color: #E6A23C;
    }
    >>>.danger{
        color: #F56C6C;
    }
</style>
