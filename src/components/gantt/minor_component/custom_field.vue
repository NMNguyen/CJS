<template>
    <el-row :gutter="10">
        <el-col :span="24">
            <el-collapse v-model="openCustomField">
              <el-collapse-item title="Custom Field" name="1">
                    <el-col :span="12"  v-for="attr in customAttr" :key="attr.id" style="margin-bottom:10px">
                        <el-col :span="10">
                            <h3 class="demo-input-label">{{attr.name}}</h3>
                            <p style="font-size:14px">{{attr.description}}</p>
                        </el-col>
                        <el-col :span="14">
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
                    </el-col>
              </el-collapse-item>
            </el-collapse>
        </el-col>
    </el-row>
</template>

<script>
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
      methods:{
          getValueAttr(id){
              return this.taskDetail.attributes_values[id];
          }
      }
  };
</script>

<style scoped>
    >>>.el-collapse-item__header{
        font-size:18px
    }
    >>>.el-date-editor.el-input{
        width:100%;
    }
</style>
