<template>
    <span>
        <el-dialog
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          :before-close="closeModal"
          :fullscreen="true"
          :show-close="false"
          width="80%">
            <span slot="title" @click="editTitleTask">
                <h2 class="refTaskID" v-show="!isEditTitleTask">#{{task.ref}}</h2>
                <el-input
                    @keypress.13.native="submit"
                    ref="titleInput"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    type="textarea"
                    @blur="isEditTitleTask = false"
                    v-model="task.subject"
                    :disabled="!isEditTitleTask">
                </el-input>
            </span>
          <span>
              <el-row :gutter="10">
                  <el-col :span="24">
                      <el-col :span="18">
                          <el-card class="box-card custom-editor">
                               <!--<vue-editor id="editor1" v-model="task.description_html"></vue-editor>-->
                              <div class="btn-confirm-comment">
                                <el-row :gutter="10">
                                    <el-col :span="23">
                                        <froala :tag="'textarea'" :config="config" v-model="task.description_html"></froala>
                                        <!--<el-input :rows="row_comment"class="input-comment" type="textarea" v-model="comment_msg"></el-input>-->
                                    </el-col>
                                    <el-col :span="1">
                                        <div>
                                            <el-tooltip class="item" effect="dark" content="Save" placement="right">
                                                <i @click="save()" class="material-icons save-comment">save</i>
                                            </el-tooltip>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                          </el-card>
                          <custom-field
                              :task-detail="taskDetail"
                              :custom-attr="customAttr"></custom-field>
                      </el-col>
                      <el-col :span="6">
                          <el-row :gutter="10">
                              <el-col :span="24">
                                  <el-card class="box-card" style="min-height:203px">
                                      <el-row>
                                          <p><b>Trạng thái task</b></p>
                                          <el-dropdown size="default" split-button type="primary">
                                              Ready for test
                                              <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item>Action 1</el-dropdown-item>
                                                <el-dropdown-item>Action 2</el-dropdown-item>
                                                <el-dropdown-item>Action 3</el-dropdown-item>
                                                <el-dropdown-item>Action 4</el-dropdown-item>
                                              </el-dropdown-menu>
                                          </el-dropdown>
                                      </el-row>
                                      <point
                                          :points="points"
                                          :task-detail="taskDetail"
                                          :points-data="pointsData">
                                      </point>
                                      <div style="padding:10px 0px">
                                          <el-row>
                                              <div v-if="task.assigned_to == null">
                                                    <el-alert
                                                        title="Chưa có người đảm nhận"
                                                        :closable="false"
                                                        type="error">
                                                    </el-alert>
                                                  <el-button size="mini" class="add-watchers" @click="show_modal_assign_to()"><i class="material-icons icon-add-watchers">add</i> <span>Phân công</span></el-button>
                                                  <el-button size="mini" class="add-watchers" @click="assign_to_me()"><i class="material-icons icon-add-watchers">add</i> <span>Phân công cho tôi</span></el-button>
                                              </div>
                                              <div v-else >
                                                  <p><b>Người đảm nhận</b></p>
                                                  <el-tag
                                                      :key="task.assigned_to"
                                                      closable
                                                      :disable-transitions="false"
                                                      @close="handleClose(task.assigned_to,'assign')">
                                                      <template>
                                                          <img :src="task.assigned_to_extra_info['photo']">
                                                          <p class="name-watchers">{{task.assigned_to_extra_info['full_name_display']}}</p>
                                                      </template>
                                                  </el-tag>
                                              </div>
                                          </el-row>
                                          <el-row>
                                              <p style="display: inline-block"><b>Người theo dõi</b></p>
                                              <el-button size="mini" class="add-watchers" @click="show_search_watcher()"><i class="material-icons icon-add-watchers">add</i> <span>Thêm</span></el-button>
                                              <div>
                                                  <el-tag
                                                      :key="id"
                                                      v-for="id in task.watchers"
                                                      closable
                                                      :disable-transitions="false"
                                                      @close="handleClose(id,'watchers')">
                                                      <template>
                                                          <img :src="members[id].photo">
                                                          <p class="name-watchers">{{members[id].full_name_display}}</p>
                                                      </template>
                                                  </el-tag>
                                              </div>
                                          </el-row>
                                      </div>
                                    </el-card>
                              </el-col>
                          </el-row>
                      </el-col>
                  </el-col>
                 <el-col :span="18">
                      <comment
                          v-on:push-comment="push_comment_task($event)"
                          v-on:push-edit-comment="push_edit_comment_task($event)"
                          :dataActivitiesTask="data_activities_task"
                          :listAttachFile="list_attach_file"
                          :taskId="task.id"
                      ></comment>
                  </el-col>

              </el-row>
          </span>

          <span slot="footer" class="dialog-footer">
            <!--<el-button @click="closeModal">Cancel</el-button>-->
              <!--<el-button type="primary" @click="dialogVisible = false">Confirm</el-button>-->
          </span>
        </el-dialog>
        <el-dialog
            title="Tìm người đảm nhận"
            :visible.sync="show_add_watch"
            width="30%"
            append-to-body
        >
        <el-autocomplete
            popper-class="emp-autocomplete"
            @select="handleSelect"
            :fetch-suggestions="querySearch"
            v-model="search_staff"
            >
            <template class="search-users" slot-scope="{ item }">
                <img :src="item.photo">
                <p class="name-watchers">{{item.full_name_display}}</p>
            </template>
            <i class="el-icon-search el-input__icon" slot="suffix"></i>
        </el-autocomplete>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show_add_watch = false">Cancel</el-button>
            <el-button type="primary" @click="add_watcher_and_assign_to()">Confirm</el-button>
        </span>
        </el-dialog>
    </span>

</template>
<script>
    import axios from 'axios';
    import VueFroala from 'vue-froala-wysiwyg';
    import Comment from  './comment_task';
    import Point from './point';
    import CustomField from './custom_field';

    export default {
        name: 'modal_detail_task',
        components:{
            VueFroala,
            Comment,
            Point,
            CustomField
        },
        data:function(){
            return{
                pointsData: [{
                    'title': 'Product Owner',
                    'id': 5
                }, {
                    'title': 'Developer',
                    'id': 19,
                }, {
                    'title': 'Sale',
                    'id': 20
                }, {
                    'title': 'Deploy',
                    'id': 21
                }, {
                    'title': 'Designer',
                    'id': 233
                }],
                user_login:JSON.parse(localStorage.getItem('userInfo')),
                task:{},
                mode_assign:'assign_to',
                arr_watcher_new:'',
                search_staff:'',
                show_add_watch:false,
                isEditTitleTask: false,
                editor: null,
                data_activities_task:[],
                list_attach_file:[],
                config: {
                    fontSizeDefaultSelection: '16',
                    heightMax: 700,
                    heightMin: 600,
                    toolbarSticky: false,
                    // toolbarInline: true,
                    spellcheck: false,
                    charCounterCount: false,
                    // toolbarVisibleWithoutSelection: true,
                    toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'insertImage', 'insertLink', 'insertFile'],
                }
            }
        },
        mounted(){

        },
        computed: {
            urlToSave(){
                return `${this.$urlAPI}/userstories/${this.taskDetail.id}`
            }
        },
        beforeDestroy() {
            // this.editor.destroy();
        },
        props: {
            points:{
              type: Array,
              default: function(){
                  return []
              }
            },
            customAttr:{
                type: Array,
                default: function(){
                    return []
                }
            },
            dialogVisible:{
                type: Boolean,
                default: false
            },
            taskDetail:{
                type: Object,
                default: {}
            },
            members:{
                type: [Array,Object],
                default: []
            }
        },
        watch:{
            dialogVisible(newVal){
                if (newVal){
                    this.getDetailTask();
                    this.get_data_activities_task();
                    this.get_attach_file();
                }
            },
            taskDetail(val){
                if (val){
                    this.task = Object.assign(this.task,val)
                }
            }
        },
        methods:{
            update_version(){
              this.task.version +=1;
            },
            show_search_watcher(){
                this.show_add_watch = true;
                this.mode_assign="watchers"
            },
            show_modal_assign_to(){
                this.show_add_watch = true;
                this.mode_assign="assign_to"
            },
            assign_to_me(){
                this.mode_assign="assign_to_me"
                this.add_watcher_and_assign_to()
            },
            handleSelect(item) {
                console.log(item.id)
                this.search_staff = item.full_name_display
                this.arr_watcher_new = item.id
            },
            querySearch(queryString, cb) {
                let members = _.toArray(this.members);
                console.log(members)
                let results = queryString ? members.filter(this.createFilter(queryString)) : members;
                // call callback function to return suggestions
                cb(results);
            },
            createFilter(queryString) {
                return (member) => {
                    return (member.full_name_display.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleClose(tag,mode) {
                this.$confirm('Bạn có chắc muốn xóa ' + this.members[tag].full_name_display, {
                    confirmButtonText: 'Xác nhận',
                    cancelButtonText: '',
                    type: 'warning'
                }).then(() => {
                    console.log(mode)
                    if(mode == 'watchers'){
                        this.task.watchers.splice(this.task.watchers.indexOf(tag), 1);
                        this.deleted_watcher_and_assign_to(this.task.watchers,'watchers')
                    }else if(mode == 'assign'){
                        this.deleted_watcher_and_assign_to(null,'assign')
                    }


                }).catch(() => {
                });

            },
            deleted_watcher_and_assign_to(id,mode){
                let that = this;
                let data = {}
                if(mode == 'assign'){
                    data = Object.assign({}, {
                        version: that.task.version,
                        assigned_to:null
                    });
                }else if(mode == 'watchers'){
                    data = {
                        version: that.task.version,
                        watchers:id
                    }
                }
                let headers = {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                };
                axios.patch(`${that.$urlAPI}/userstories/${that.taskDetail.id}`, data,{
                    headers:headers
                })
                    .then(function (res) {
                        if(res['data']) {
                            if (mode == 'watchers') {
                                that.$set(that, 'task', res['data'])
                                that.$set(that.task, 'watchers', res['data'].watchers);
                            }
                            if (mode == 'assign') {
                                that.$set(that, 'task', res['data'])
                                that.$set(that.task, 'assigned_to_extra_info', res['data'].assigned_to_extra_info);
                                that.$set(that.task, 'assigned_to', res['data'].assigned_to);
                            }
                            that.$set(that.task,'version',res['data'].version)
                        }
                        that.$forceUpdate();

                    });
            },
            add_watcher_and_assign_to(){
                let that = this;
                let data = {}
                console.log(that.mode_assign)
                if(that.mode_assign == 'assign_to'){
                    data = {
                        version: that.task.version,
                        assigned_to:that.arr_watcher_new
                    }
                }else if(that.mode_assign == 'assign_to_me'){
                    data = {
                        version: that.task.version,
                        assigned_to:that.user_login.id
                    }
                }else if(that.mode_assign == 'watchers') {
                    that.task.watchers.push(that.arr_watcher_new)
                    data = {
                        version: that.task.version,
                        watchers:that.task.watchers
                    }
                }
                let headers = {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                };
                axios.patch(`${that.$urlAPI}/userstories/${that.taskDetail.id}`, data,{
                    headers:headers
                })
                    .then(function (res) {
                        console.log(res)
                        that.show_add_watch = false
                        console.log(res['data'].version)
                        if(res['data']){
                            if(that.mode_assign == 'watchers'){
                                that.$set(that,'task',res['data'])
                                that.$set(that.task,'watchers', res['data'].watchers);
                            }
                            if(that.mode_assign == 'assign_to' || that.mode_assign == 'assign_to_me'){
                                that.$set(that,'task',res['data'])
                                that.$set(that.task,'assigned_to_extra_info', res['data'].assigned_to_extra_info);
                                that.$set(that.task,'assigned_to', res['data'].assigned_to);
                            }
                            that.$set(that.task,'version',res['data'].version)
                            that.search_staff = ''
                        }
                        that.$forceUpdate();

                    }).catch(() => {
                    that.show_add_watch = false
                    that.search_staff = ''
                });
            },
            save() {
                var toMarkdown = require('to-markdown');
                let that = this;
                let headers = {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                };
                let pars = {
                    'description': toMarkdown(this.task.description_html, { gfm: true }),
                    'version': that.task.version
                };
                axios.patch(`${that.$urlAPI}/userstories/${that.task.id}`, pars, {
                    headers: headers
                })
                .then(function (res) {
                    that.task.version += 1;
                });
            },
            submit(e){
                e.preventDefault();
            },
            editTitleTask(){
                let that = this;
                that.isEditTitleTask = true;
                setTimeout(function(){
                    that.$refs.titleInput.$refs.textarea.focus();
                }, 300)
            },
            closeModal(){
                this.$emit('close-modal');
            },
            getDetailTask(){
                let that = this;
                let headers = {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                };
                axios.get(`${that.$urlAPI}/userstories/by_ref?order_by=kanban_order&project=1&ref=${that.taskDetail.ref}`, {
                    headers: headers
                })
                .then(function (res) {
                    that.$set(that, 'task', res['data'])
                    that.task['description_html'] = res['data'].description_html;
                    that.$forceUpdate();
                });
            },
            get_data_activities_task(){
                let that = this;
                let headers = {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                };
                axios.get(`${that.$urlAPI}/history/userstory/${that.taskDetail.id}`, {
                    headers:headers
                })
                .then(function (res) {
                    if(res && res.data.length > 0){
                        that.data_activities_task = res.data
                    }
                })
            },
            push_comment_task(comment){
                let data = {
                    version: this.task.version,
                    comment:comment
                }
                let that = this;
                let headers = {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                };
                axios.patch(`${that.$urlAPI}/userstories/${that.taskDetail.id}`, data,{
                    headers:headers
                })
                .then(function (res) {
                    that.get_data_activities_task();
                    if(res['data']){
                        that.$set(that.task,'version',res['data'].version)
                    }
                    //that.$forceUpdate();
                })
            },
            push_edit_comment_task(comment){
                let that = this;
                let data = {comment: comment.comment}
                let headers = {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                };
                axios.post(`${that.$urlAPI}/history/userstory/${that.taskDetail.id}/edit_comment?id=${comment.id}`, data,{
                    headers:headers
                })
                .then(function (res) {
                    that.get_data_activities_task();
                    //that.$forceUpdate();
                })
            },
            get_attach_file(){
                let that = this;
                let headers = {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                };
                axios.get(`${that.$urlAPI}/userstories/attachments?object_id=${that.taskDetail.id}&project=1`, {
                    headers: headers
                })
                .then(function (res) {
                    that.list_attach_file = res.data
                });
            }

        }
    };
</script>

<style scoped>
    >>>.el-dialog.is-fullscreen{
        text-align: left;
        /*background:#67C23A;*/
    }
    >>>.el-dialog__title{
        font-weight:bold;
    }
    >>>.el-textarea.is-disabled .el-textarea__inner{
        color:black;
        font-size:24px;
        padding-left:95px;
        cursor:pointer;
    }
    >>>.el-textarea__inner{
        font-size:20px;
    }
    >>>.el-dialog__body{
        padding-top:0px;
    }
    >>>#editor1{
        max-height:80vh;
        overflow-y:scroll;
    }
    >>>.el-card__header{
        padding: 10px 20px;
    }
    >>>.el-card__body{
        padding:0px 20px;
    }
    >>>.custom-editor .el-card__body{
        padding:0px;
    }
    >>>.refTaskID{
        position: absolute;
        top:10px;
        left:30px;
    }
    >>>.el-tag{
        height: 50px;
        width: 100%;
        line-height: 20px;
        position: relative;
        display: flex;
        margin: 5px 0px;
        background-color: #ffffff;
        color: #000000;
        font-weight: bold;
        border: none;
    }
    >>>.el-tag img{
        position: absolute;
        bottom: 10px;
        left: 2px;
        height: 30px;
        width: 30px;
        border-radius: 50%;
    }
    >>>.el-tag .el-icon-close{
        display: none;
        position: absolute;
        top: 16px;
        right: 2px;

    }
    >>>.el-tag:hover{
        background-color: rgba(64,158,255,.1);
        /*color: #409EFF;*/
        border: 1px solid rgba(64,158,255,.2);
        font-weight: bold;
    }
    >>>.el-tag:hover .el-icon-close{
        display: block;
        position: absolute;
        top: 16px;
        right: 2px;
    }
    >>>.add-watchers{
        display: inline-block;
        padding: 7px 7px;
        position: relative;
    }
    >>>.add-watchers span{
        padding-left: 5px;
    }
    >>> .icon-add-watchers{
        font-size: 13px;
        position: absolute;
        bottom: 7px;
        left: 3px;
    }
    >>>.el-tag .name-watchers{
        font-size: 14px;
        padding-left: 30px;
        display: inline-block;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: normal;
        line-break: strict;
        hyphens: none;
        -webkit-hyphens: none;
        -moz-hyphens: none;
    }
    /*>>>.el-autocomplete-suggestion li {*/
        /*position: relative;*/
        /*vertical-align: middle;*/
    /*}*/
    /*>>>.el-autocomplete-suggestion li > p{*/
        /*display: inline-block;*/
        /*font-size: 16px;*/
        /*font-weight: bold;*/
    /*}*/
    /*>>>.el-autocomplete-suggestion li > img{*/
        /*position: absolute;*/
        /*border-radius: 50% 50% !important;*/
        /*height: 40px;*/
        /*display: inline-block;*/
    /*}*/
    >>>.el-alert__content{
        font-size:18px;
        font-weight:bold;
    }
    >>>.el-alert--error{
        margin-bottom:10px;
    }
    >>>.btn-confirm-comment .material-icons{
        cursor: pointer;
        font-size: 16px;
        margin-top:10px;
    }
</style>
<style>
    .el-dropdown{
        width: 100%;
    }
    .el-dropdown .el-button--medium{
        width: 100%;
        border-radius: unset;
    }
    .el-autocomplete-suggestion li > img{
        border-radius: 50% 50%;
        height: 40px;
        display: inline-block;
    }
    .el-autocomplete-suggestion li {
        vertical-align: middle;
    }
    .el-autocomplete-suggestion li > p{
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
    }
</style>
