<template>
     <el-row>
         <el-col :span="8" v-for="point in pointsData" :key="point.id">
             <p><b>{{ point.title }}</b> </p>
              <el-dropdown @command="handleCommand">
                  <el-button size="mini" type="primary">
                   {{getPointByID(point.id)}} <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                        :command="{point:item,id: point.id}"
                        v-for="item in points" :key="item.id">
                        {{item.name}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
              </el-dropdown>
         </el-col>
         <el-col :span="8">
             <p><b>Total Points</b> </p>
             <el-col :span="24">
                <b><span style="font-size:20px">{{sumPoints()}}</span></b>
             </el-col>
             <!--<el-col :span="14">-->
                <!--<el-button type="text" size="medium" icon="el-icon-check"></el-button>-->
             <!--</el-col>-->
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
      methods:{
          handleCommand(data) {
              this.taskDetail.points[data.id] = data.point.id;
              this.updatePointTask();
          },
          sumPoints() {
              let that = this;
              let sum = 0;
              let arrayPoint = Object.keys(this.taskDetail.points);
              arrayPoint.forEach(function (point) {
                  sum += that.getPointByID(point, true) || 0;
              });
              return sum;
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

</style>
