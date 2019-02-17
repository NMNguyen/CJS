<template>
    <el-row :gutter="10">
        <el-col :span="24">
            <el-collapse v-model="openCustomField">
              <el-collapse-item title="Custom Field" name="1">
                    <el-col :span="12"  v-for="attr in customAttr" :key="attr.id" style="margin-bottom:10px"  class="customField__container">
                        <el-col :span="10">
                            <h3 class="demo-input-label">{{attr.name}}</h3>
                            <p style="font-size:14px">{{attr.description}}</p>
                        </el-col>
                        <el-col :span="13">
                            <el-date-picker
                              v-if="attr.id==9"
                              v-model="taskDetail.attributes_values[attr.id]"
                              type="date"
                              placeholder="Pick a day">
                            </el-date-picker>
                            <el-input
                              v-else
                              type="textarea"
                              :autosize="{ minRows: 6, maxRows: 6}"
                              v-model="taskDetail.attributes_values[attr.id]"
                              >
                            </el-input>
                        </el-col>
                        <el-col :span="1" class="btn-confirm-comment">
                            <el-tooltip class="item" effect="dark" content="Save" placement="right">
                                <i @click="saveAttr" class="material-icons save-comment">save</i>
                            </el-tooltip>
                            <!--<el-tooltip class="item" effect="dark" content="Cancel" placement="right">-->
                                <!--<i @click="" class="material-icons save-comment">cancel</i>-->
                            <!--</el-tooltip>-->
                        </el-col>
                    </el-col>
              </el-collapse-item>
            </el-collapse>
        </el-col>
    </el-row>
</template>

<script>
    // https://agilebackend.herokuapp.com/api/v1/userstories/custom-attributes-values/5670
  import axios from 'axios';
  export default {
      name: 'custom_field',
      data(){
          return {
              openCustomField: ['1'],

          }
      },
      props:{
          taskDetail:{
              type: Object,
              default(){
                  return {};
              }
          },
          customAttr:{
              type: Array,
              default: []
          }
      },
      methods: {
          getValueAttr(id) {
              return this.taskDetail.attributes_values[id];
          },
          saveAttr() {
              let data = {
                  attributes_values: this.taskDetail.attributes_values,
                  version: this.taskDetail.version_attr
              };
              let that = this;
              let headers = {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
              };
              axios.patch(`${that.$urlAPI}/userstories/custom-attributes-values/${that.taskDetail.id}`, data, {
                  headers: headers
              })
              .then(function (res) {
                  that.$set(that.taskDetail, 'version', res['data'].version_attr);
              });
          },
      }
  };
</script>

<style scoped>
    >>>.customField__container:hover .btn-confirm-comment{
        display:block;
    }
    >>>.el-collapse-item__header{
        font-size:18px
    }
    >>>.el-date-editor.el-input{
        width:100%;
    }
     >>>.btn-confirm-comment{
         display: none;
     }
    >>>.btn-confirm-comment .material-icons{
        cursor: pointer;
        font-size: 24px;
        margin-top:0px;
    }
</style>
