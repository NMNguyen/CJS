<template>
     <el-row style="margin-top:20px">
         <el-col :span="24" v-for="point in pointsData" :key="point.id">
             <!--<p><b>{{ point.title }}</b> </p>-->
              <el-dropdown placement="top-start" @command="handleCommand">
                  <el-button size="medium" type="primary">
                      <el-col :span="4">{{getPointByID(point.id)}} <i class="el-icon-arrow-down el-icon--right"></i></el-col>
                      <el-col :span="20">
                          <span style="float:right">{{point.title}}</span>
                      </el-col>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                        :command="{item:item,id: point.id}"
                        v-for="item in points" :key="item.id">
                        {{item.name}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
              </el-dropdown>
         </el-col>
         <el-col :span="24" class="detailTask__total_point">
              <el-col :span="4" style="text-align: center">
                  {{sumPoints}}
              </el-col>
              <el-col :span="20">
                  <span style="float:right">Total Points</span>
              </el-col>
         </el-col>
     </el-row>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'point',
      props:{
        points:{
           type: Array,
           default: function(){
              return []
          }
        },
        pointsData:{
          type: Array,
          default: function(){
              return []
          }
        },
        taskDetail:{
            type: Object,
            default: {}
        }
      },
      computed:{
          sumPoints(){
              let sum = 0;
              let that = this;
              let arrayPoint = Object.keys(this.taskDetail.points);
              if (arrayPoint){
                  arrayPoint.forEach(function (point) {
                      sum += that.getPointByID(point, true) || 0;
                  });
              }
              return sum;
          }
      },
      methods:{
          handleCommand(data) {
              this.taskDetail.points[data.id] = data.item.id;
              this.updatePointTask();
          },
          getPointByID(id, sum) {
              let idPoint = this.taskDetail.points[id];
              let point = this.points.find(function (p) {
                  return p.id == idPoint;
              }).value || (sum ? 0:'?');
              return point
          },
          updatePointTask() {
              let that = this;
              let headers = {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
              };
              let data = {'points': this.taskDetail.points, 'version':this.taskDetail.version};
              axios.patch(`${that.$urlAPI}/userstories/${that.taskDetail.id}`, data, {
                  headers: headers
              })
              .then(function (res) {
                  that.taskDetail.version +=1;
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
