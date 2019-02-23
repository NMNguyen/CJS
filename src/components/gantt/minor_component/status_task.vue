<template>
    <el-row style="margin-top:20px">
        <el-col :span="24">
            <el-dropdown  placement="bottom-end" @command="handleCommand">
                <el-button size="medium" type="primary" style="white-space: normal;">
                    <el-col :span="20">
                        <span>{{show_current_status}}</span>
                    </el-col>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                        :command="{name: status.name,id: status.id}"
                        v-for="status in dataProject.us_statuses" :keyname="status.id">
                        {{status.name}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
    </el-row>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "status_task",
        data(){
          return{
              current_id_status:'',
              status_task_show:{}
          }
        },
        props:{
            dataTaskSpint:{
                type: Object,
                default: {}
            },
            taskDetail:{
                type: Object,
                default: {}
            },
            dataProject:{
                type: [Object,Array]
            }
        },
        watch: {
        },
        computed:{
            show_current_status(){
                let that = this
                if(that.taskDetail){
                    let current_status = that.dataProject.us_statuses.find(function(item) {
                        return item.id == that.taskDetail.status;
                    })
                    return current_status.name
                }
            }
        },
        methods:{
            handleCommand(data) {
                 console.log(data)
                 this.$set(this.status_task_show,'name', data.name)
                 this.current_id_status = data.id
                 this.update_status_task();
            },
            update_status_task() {
                let that = this;
                let headers = {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                };
                let data = {'status': this.current_id_status, 'version':this.taskDetail.version};
                axios.patch(`${that.$urlAPI}/userstories/${that.taskDetail.id}`, data, {
                    headers: headers
                })
                    .then(function (res) {
                        console.log(res)
                        that.taskDetail.version +=1;
                        that.taskDetail = Object.assign(that.taskDetail,res['data'])
                        that.$forceUpdate();
                    });
            }
        }
    };
</script>

<style scoped>
    >>>.detailTask__total_point{
        background:#909399;
        padding:10px 20px;
        color:white;
        font-size:16px;
        font-weight:bold;
    }
</style>
<style>
    .el-dropdown-menu{
        max-width: 280px;
        max-height: 400px;
        overflow-y: auto;
    }
</style>
