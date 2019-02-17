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
                      <el-col :span="14">
                          <el-card class="box-card custom-editor">
                               <!--<vue-editor id="editor1" v-model="task.description_html"></vue-editor>-->
                                <froala :tag="'textarea'" :config="config" v-model="task.description_html"></froala>
                                <button id="saveButton" @click="save">Save</button>
                          </el-card>
                      </el-col>
                      <el-col :span="10">
                          <el-row :gutter="10">
                              <el-col :span="14">
                                     <el-card class="box-card" style="min-height:203px">
                                      <div slot="header" class="clearfix">
                                        <span><b>Points</b></span>
                                      </div>
                                         <el-row>
                                             <el-col :span="8">
                                                 <p><b>Product Owner</b> </p>
                                                  <el-dropdown size="mini" split-button type="primary">
                                                      0
                                                      <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item>Action 1</el-dropdown-item>
                                                        <el-dropdown-item>Action 2</el-dropdown-item>
                                                        <el-dropdown-item>Action 3</el-dropdown-item>
                                                        <el-dropdown-item>Action 4</el-dropdown-item>
                                                      </el-dropdown-menu>
                                                  </el-dropdown>
                                             </el-col>
                                             <el-col :span="8">
                                                  <p><b>Developer</b></p>
                                                  <el-dropdown size="mini" split-button type="primary">
                                                      0
                                                      <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item>Action 1</el-dropdown-item>
                                                        <el-dropdown-item>Action 2</el-dropdown-item>
                                                        <el-dropdown-item>Action 3</el-dropdown-item>
                                                        <el-dropdown-item>Action 4</el-dropdown-item>
                                                      </el-dropdown-menu>
                                                  </el-dropdown>
                                             </el-col>
                                             <el-col :span="8">
                                                <p><b>Sale</b></p>
                                                  <el-dropdown size="mini" split-button type="primary">
                                                      0
                                                      <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item>Action 1</el-dropdown-item>
                                                        <el-dropdown-item>Action 2</el-dropdown-item>
                                                        <el-dropdown-item>Action 3</el-dropdown-item>
                                                        <el-dropdown-item>Action 4</el-dropdown-item>
                                                      </el-dropdown-menu>
                                                  </el-dropdown>
                                             </el-col>
                                         </el-row>
                                         <el-row>
                                             <el-col :span="8">
                                                  <p><b>Deploy</b></p>
                                                  <el-dropdown size="mini" split-button type="primary">
                                                      0
                                                      <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item>Action 1</el-dropdown-item>
                                                        <el-dropdown-item>Action 2</el-dropdown-item>
                                                        <el-dropdown-item>Action 3</el-dropdown-item>
                                                        <el-dropdown-item>Action 4</el-dropdown-item>
                                                      </el-dropdown-menu>
                                                  </el-dropdown>
                                             </el-col>
                                             <el-col :span="8">
                                                  <p><b>Designer</b></p>
                                                  <el-dropdown size="mini" split-button type="primary">
                                                      0
                                                      <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item>Action 1</el-dropdown-item>
                                                        <el-dropdown-item>Action 2</el-dropdown-item>
                                                        <el-dropdown-item>Action 3</el-dropdown-item>
                                                        <el-dropdown-item>Action 4</el-dropdown-item>
                                                      </el-dropdown-menu>
                                                  </el-dropdown>
                                             </el-col>
                                             <el-col :span="8">
                                                 <p><b>Total Points</b></p>
                                                    <h3>10</h3>
                                             </el-col>
                                         </el-row>
                                    </el-card>
                              </el-col>
                              <el-col :span="10">
                                  <el-card class="box-card" style="min-height:203px">
                                      <div slot="header" class="clearfix">
                                          <span><b>Người đảm nhận</b></span>
                                      </div>
                                      <div style="padding:10px 0px">
                                          <el-row>
                                              <el-col :span="6">
                                                <img :src="task.assigned_to_extra_info['photo']" style="border-radius: 50%;width:50px;">
                                              </el-col>
                                              <el-col :span="16">
                                                  <h3>{{task.assigned_to_extra_info['full_name_display']}}</h3>
                                              </el-col>
                                          </el-row>
                                          <el-row>
                                              <p><b>Trạng thái task</b></p>
                                              <el-dropdown size="mini" split-button type="primary">
                                                  Ready for test
                                                  <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item>Action 1</el-dropdown-item>
                                                    <el-dropdown-item>Action 2</el-dropdown-item>
                                                    <el-dropdown-item>Action 3</el-dropdown-item>
                                                    <el-dropdown-item>Action 4</el-dropdown-item>
                                                  </el-dropdown-menu>
                                              </el-dropdown>
                                          </el-row>
                                      </div>
                                    </el-card>
                              </el-col>
                          </el-row>
                      </el-col>
                  </el-col>
              </el-row>
          </span>
          <span slot="footer" class="dialog-footer">
            <!--<el-button @click="closeModal">Cancel</el-button>-->
            <!--<el-button type="primary" @click="dialogVisible = false">Confirm</el-button>-->
          </span>
        </el-dialog>
    </span>
</template>
<script>
  import axios from 'axios';

  import { VueEditor } from "vue2-editor";
  import VueFroala from 'vue-froala-wysiwyg';
// var datasource = ["Jacob", "Isabella", "Ethan", "Emma", "Michael", "Olivia" ];
//
// // Build data to be used in At.JS config.
// var names = $.map(datasource, function (value, i) {
//   return {
//     'id': i, 'name': value, 'email': value + "@email.com"
//   };
// });
  export default {
      name: 'modal_detail_task',
      components:{
          VueEditor,
          VueFroala
      },
      data(){
          return{
              configAt: {
                  at: "@",
                  data: names,
                  displayTpl: '<li>${name} <small>${email}</small></li>',
                  limit: 200
                },
              config: {
                  placeholderText: 'Edit Your Content Here!',
                  charCounterCount: false,
                  saveParam: 'description',
                  saveURL: this.urlToSave,
                  saveMethod: 'PATCH',
                  events: {
                      // 'froalaEditor.initialized': function (e, editor) {
                      //   editor.$el.atwho(this.configAt);
                      //   editor.events.on('keydown', function (e) {
                      //     if (e.which == $.FroalaEditor.KEYCODE.ENTER && editor.$el.atwho('isSelecting')) {
                      //       return false;
                      //     }
                      //   }, true);
                      // }
                    }
              },
              isEditTitleTask: false,
              editor: null,
          }
      },
      computed: {
          urlToSave(){
              return `${this.$urlAPI}/userstories/${this.task.id}`
          }
      },
      beforeDestroy() {
          // this.editor.destroy();
      },
      props:{
          dialogVisible:{
              type: Boolean,
              default: false,
          },
          task:{
              type: Object,
              default: {},
          }
      },
      watch:{
          dialogVisible(newVal){
              if (newVal){
                  this.getDetailTask();
              }
          }
      },
      methods:{
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
              axios.get(`${that.$urlAPI}/userstories/by_ref?order_by=kanban_order&project=1&ref=${that.task.ref}`, {
                  headers: headers
              })
              .then(function (res) {
                  that.task['description_html'] = res['data'].description_html;
                  that.$forceUpdate();
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
        font-size:24px;
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
</style>
