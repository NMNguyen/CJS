<template>
    <div>
        <!--<div v-for="commemt in data_actived_task">-->
            <!--tesssssssssssst-->
        <!--</div>-->
        <el-tabs type="border-card" class="comments-activities-tabs">
            <el-tab-pane>
                <span slot="label">{{count_comment}} Comments</span>
                <div class="container-comment" v-for="(commemt, index) in data_activities_task_show">
                    <span v-if="commemt.comment" class="comments-task">
                        <el-row :gutter="10">
                            <el-col :span="1">
                                <div>
                                    <img  :src="commemt.user['photo'] " style="border-radius: 50%;width:50px;"/>
                                </div>
                            </el-col>
                            <el-col :span="23">
                                <div class="content-comment-task">
                                    <span class="user-comment-display-name">{{commemt.user.name}}</span>
                                    <span class="user-comment-display-name">{{commemt.created_at | moment('DD/MM/YYYY HH:mm')}}</span>
                                    <span v-if="commemt.edit_comment_date" class="time-edit-comment">đã chỉnh sửa: {{commemt.edit_comment_date | moment('DD/MM/YYYY HH:mm')}}</span>

                                    <div class="comment-box" v-html="commemt.comment_html"></div>
                                </div>
                            </el-col>
                        </el-row>
                    </span>
                </div>
                <div class="btn-confirm-comment">
                    <el-row :gutter="10">
                        <el-col :span="23">
                            <el-input :rows="row_comment"class="input-comment" type="textarea" v-model="comment_msg"></el-input>
                        </el-col>
                        <el-col :span="1">
                            <div>
                                <el-tooltip class="item" effect="dark" content="Save" placement="right">
                                    <i @click="save_comment()" class="material-icons save-comment">save</i>
                                </el-tooltip>
                            </div>
                            <div>
                                <el-tooltip class="item" effect="dark" content="Cancel" placement="right">
                                    <i @click="cancel_comment()" class="material-icons cancel-comment">close</i>
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane >
                <span slot="label">{{count_activities}} Activities</span>
                <div v-for="(activitie, index) in data_activities_task_show">
                    <span class="activitie-task">
                        <el-row :gutter="10">
                            <el-col :span="1">
                                <div>
                                    <img  :src="activitie.user['photo']" style="border-radius: 50%;width:50px;"/>
                                </div>
                            </el-col>
                            <el-col :span="23">
                                <div class="content-comment-task" v-if="activitie.values_diff">
                                    <span class="user-comment-display-name">{{activitie.user.name}}</span>
                                    <span class="user-comment-display-name">{{activitie.created_at | moment('DD/MM/YYYY HH:mm')}}</span>
                                    <span v-if="activitie.edit_comment_date" class="time-edit-comment">đã chỉnh sửa: {{activitie.edit_comment_date | moment('DD/MM/YYYY HH:mm')}}</span>
                                    <div>
                                        <div class="comment-box" v-for="(item,index) in activitie.values_diff" >
                                            <div v-if="array_field_log_has_type_array.includes(index)">
                                                <div class="title-active-task" v-html="get_title(index,item)"></div>
                                                <div v-html="show_description(item)"></div>
                                            </div>
                                            <div v-if="array_field_log_has_type_obj.includes(index)">
                                                <div class="title-active-task" v-html="get_title(index,item)"></div>
                                                <div v-if="index == 'custom_attributes'">
                                                    <span v-html="get_name_field_actived(item)"></span>
                                                    <span v-html="get_content_field_actived(item)"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </el-col>
                        </el-row>
                    </span>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "comment_task.vue",
        data(){
            return{
                row_comment:5,
                data_activities_task_show:[],
                array_field_log_has_type_array:['assigned_to','status','milestone','description_diff','subject'],
                array_field_log_has_type_obj:['custom_attributes','points'],
                comment_msg:'',
                convent_field:{
                    'assigned_to':'assigned to',
                    'status': 'status',
                    'description_diff':'description',
                    'milestone': 'Sprint',
                    'subject': 'subject',
                    'created_custom_attributes':'created custom attributes',
                    'updated_custom_attributes':'updated custom attributes'
                }
            }
        },
        mounted(){

        },
        beforeDestroy(){

        },
        computed:{
            count_comment() {
                if(this.data_activities_task_show ){
                    return this.data_activities_task_show.reduce((cnt,elm) => elm.comment? cnt+1:cnt,0)
                }
            },
            count_activities() {
                if(this.data_activities_task_show ){
                    return this.data_activities_task_show.reduce((cnt,elm) => cnt+1,0)
                }
            }
        },
        props:{
            dataActivitiesTask:{
                type: Array,
                default: [],
            },
            version:{
                type: [String,Number],
                default: '',
            }

        },
        watch:{
            dataActivitiesTask(val){
                if(val){
                    this.data_activities_task_show = val
                }
            }
        },
        methods:{
            show_description(array_description){
                if (array_description.length >0){
                    array_description.forEach(function (item, i) {
                        if(item == null || item == ''){
                            array_description[i] = "..."
                        }
                    })
                    return array_description.join(' &rsaquo; ')
                }
            },
            get_title: function (title,content) {
                if(title == 'custom_attributes' && content){
                    if( content['changed'] && content['changed'].length>0){
                        return this.convent_field['updated_custom_attributes']
                    }else if(content['new'] && content['new'].length>0){
                        return this.convent_field['created_custom_attributes']
                    }
                }else if(this.convent_field.hasOwnProperty(title) && content) {
                    return this.convent_field[title]
                }else {
                    return title
                }
            },
            get_name_field_actived: function (content) {
                if( content['changed'] && content['changed'].length>0){
                    return content['changed'][0].name
                }else if(content['new'] && content['new'].length>0){
                    return content['new'][0].name
                }else {
                    return
                }
            },
            get_content_field_actived: function (content) {
                if( content['changed'] && content['changed'].length>0){
                    if (content['changed'][0].changes && content['changed'][0].changes['value'].length >0){
                        content['changed'][0].changes['value'].forEach(function (item, i) {
                            if(item == null || item == ''){
                                content['changed'][0].changes['value'][i] = "..."
                            }
                        })
                        return content['changed'][0].changes['value'].join(' &rsaquo; ')
                    }
                }else if(content['new'] && content['new'].length>0){
                    return content['new'][0].value_diff
                }else {
                    return
                }
            },
            save_comment(){
                var comment = {
                    comment: this.comment_msg,
                    version: this.version
                }
                this.$emit('push-comment',comment).then(function () {
                   this.comment_msg = ""
                })

            },
            cancel_comment(){
                this.comment_msg = ""
            }

        },
        // created(){
        //     this.get_data_actived_task();
        // }
    }
</script>

<style scoped>
    >>>.user-comment-display-name{
        color: #5b8200;
        margin-right: .5rem;
    }
    >>>.comments-task .el-row, .activitie-task .el-row{
        padding: 20px 0px;
    }
    >>>.comments-task .el-col-23 .content-comment-task , .activitie-task .el-col-23 .content-comment-task{
        padding-left: 15px;
    }
    >>>.comments-activities-tabs {
        margin-top: 20px;
    }
    >>>.comments-activities-tabs .time-edit-comment{
        background: #e4e3e3;
        margin: 0 .5rem;
        padding: .25rem;
    }
    >>>.activitie-task .el-col-23 .title-active-task {
        background: #e4e3e3;
        margin: .25rem .5rem;
        padding: .25rem;
        display: inline-block;
    }
    >>>.btn-confirm-comment{
        padding-top: 20px;
        border-top: 1px solid #e4e3e3;
    }
    >>> .input-comment .el-textarea__inner{
        font-size: 12px;
        font-family: "Helvetica Neue";
    }
    >>>.btn-confirm-comment .material-icons{
        cursor: pointer;
        font-size: 16px;
    }
</style>