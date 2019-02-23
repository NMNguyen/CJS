<template>
    <div>
        <div>
            <el-upload
                    ref="upload"
                    class="upload-demo"
                    name="attached_file"
                    :action="url"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    multiple
                    :thumbnail-mode="true"
                    :data="data_attach_file"
                    :headers="headers"
                    :on-exceed="handleExceed"
                    :list-type="mode_show_attachments"
                    :file-list="fileList">
                <div class="btn-attach title-add_attach">
                     <span v-text="fileList.length" v-if="fileList.length"></span>
                    <span>attachments</span>
                </div>
                <div class="btn-attach mode_add_attach">
                    <i class="material-icons" @click="mode_show_module_attach()">view_module</i>
                    <i class="material-icons" @click="mode_show_list_attach()">list</i>
                </div>
                <div slot="trigger" class="btn-attach add_attach">
                    <i  class="material-icons">add_box</i>
                </div>

            </el-upload>
        </div>
        <el-tabs type="border-card" class="comments-activities-tabs">
            <el-tab-pane>
                <span slot="label">{{count_comment}} Comments</span>
                <div class="body-comment">
                    <div class="container-comment" v-for="(comment, index) in data_activities_task_show">
                        <span v-if="comment.comment && !comment['delete_comment_date']" class="comments-task">
                            <el-row :gutter="10" class="comment-row">
                                <el-col :span="1">
                                    <div>
                                        <img  :src="comment.user['photo'] " style="border-radius: 50%;width:50px;"/>
                                    </div>
                                </el-col>
                                <el-col :span="21">
                                    <div class="content-comment-task">
                                        <span class="user-comment-display-name">{{comment.user.name}}</span>
                                        <span class="user-comment-display-name">{{comment.created_at | moment('DD/MM/YYYY HH:mm')}}</span>
                                        <span v-if="comment.edit_comment_date" class="time-edit-comment">đã chỉnh sửa: {{comment.edit_comment_date | moment('DD/MM/YYYY HH:mm')}}</span>

                                        <div class="comment-box" v-html="comment.comment_html"></div>
                                    </div>
                                </el-col>
                                <el-col :span="2" v-if="comment.user.pk == user_login.id" class="edit-deleted-comment">
                                    <i @click="trigger_deleted_comment(comment)" class="material-icons icon-deleted-comment">delete_forever</i>
                                    <i @click="trigger_edit_comment(comment)" class="material-icons icon-edit-comment">edit</i>

                                </el-col>
                            </el-row>
                        </span>
                    </div>
                </div>
                <div class="btn-confirm-comment">
                    <el-row :gutter="10">
                        <el-col :span="23">
                            <froala :tag="'textarea'" :config="config" v-model="comment_msg"></froala>
                            <!--<el-input :rows="row_comment"class="input-comment" type="textarea" v-model="comment_msg"></el-input>-->
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
                                                 <div v-if="index == 'points'">
                                                    <span v-html="get_content_field_actived_point(item)"></span>
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
        name: "Comment",
        data(){
            return{
                user_login:JSON.parse(localStorage.getItem('userInfo')),
                config: {
                    toolbarSticky: false,
                    // toolbarInline: true,
                    spellcheck: false,
                    charCounterCount: false,
                    // toolbarVisibleWithoutSelection: true,
                    toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'insertImage', 'insertLink', 'insertFile'],
                },
                mode_show_attachments:'text',
                url:`${this.$urlAPI}/userstories/attachments`,
                headers:{Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`},
                fileList: [],
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
                },
                mode_comment:'comment',
                id_edit_comment:''
            }
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
            },
            data_attach_file() {
                return {
                    project: 1,
                    object_id: this.taskId,
                    from_comment: false,
                }
            }
        },
        props:{
            dataActivitiesTask:{
                type: Array,
                default: [],

            },
            taskId:{
                type: [String,Number],
                default: '',
            },
            listAttachFile:{
                type: Array,
                default: [],
            }

        },
        watch:{
            dataActivitiesTask(val){
                if(val){
                    this.data_activities_task_show = val
                }
            },
            listAttachFile(val){
                if(val){
                 this.fileList = val
                }
            }
        },
        methods:{
            trigger_edit_comment(commemt){
                alert("fuckkkk")
                console.log(commemt)
                this.mode_comment = 'edit_comment'
                this.comment_msg = commemt['comment']
                this.id_edit_comment = commemt.id
                alert(this.mode_comment)
            },
            trigger_deleted_comment(commemt){
                this.$emit('deleted-comment',commemt.id)
            },
            mode_show_module_attach(){
                this.mode_show_attachments = 'text'
            },
            mode_show_list_attach(){
                this.mode_show_attachments = 'text'
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
                let that = this;
                let headers = {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                };
                axios.delete(`${that.$urlAPI}/userstories/attachments/${file.id}`, {
                    headers: headers
                })
                .then(function (res) {
                });
            },
            handlePreview(file) {
                $('.el-upload-list__item-name').attr({target: '_blank',
                    href  : file.preview_url});

            },
            handleExceed(files, fileList) {
                this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`Bạn có chắc muốn xóa ${ file.name }？`);
            },
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
                console.log(content)
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
            get_content_field_actived_point(content){
               if(content){
                    for(var point in content){
                        if(content[point] && content[point].length >0){
                            content[point].forEach(function (item, i) {
                                if (item == null || item == '') {
                                    content[point][i] = "..."
                                }
                            })
                            return content[point].join(' &rsaquo; ')
                        }
                    }

                }
            },
            save_comment(){
                let toMarkdown = require('to-markdown');
                if(this.mode_comment == 'comment') {
                    this.$emit('push-comment', toMarkdown(this.comment_msg, { gfm: true }));
                }else if(this.mode_comment == 'edit_comment'){
                    let data = {
                        id : this.id_edit_comment ,
                        comment: toMarkdown(this.comment_msg, { gfm: true })
                    }
                    this.$emit('push-edit-comment', data);
                }
                this.comment_msg = ""
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
    >>>.comments-task .el-col-21 .content-comment-task {
        padding-left: 15px;
    }
    >>>.activitie-task .el-col-23 .content-comment-task{
        padding-left: 20px;
    }
    >>>.comments-task .el-col-21 img{
        max-width: 95%;
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
    >>> .btn-attach {
        display: inline-block;
    }
    >>> .el-upload{
        float: right;
    }
    >>> .mode_add_attach{
        float: right;
    }
    >>> .upload-demo{
        padding: 20px 10px ;
        border-top: 1px solid #e4e3e3 ;
        margin-top: 10px;
    }
    >>> .icon-edit-comment:hover, .icon-deleted-comment:hover{
        color: #409EFF;
        cursor: pointer;
    }
    >>> .comment-row:hover .icon-edit-comment,.comment-row:hover .icon-deleted-comment{
        display: block;
    }
    >>>.edit-deleted-comment{

    }
    >>> .icon-edit-comment, .icon-deleted-comment{
        display: none;
        float: right;
        padding: 0px 3px;
        font-size: 14px;
    }
    >>> .body-comment {
        overflow-y: scroll;

    }
</style>
