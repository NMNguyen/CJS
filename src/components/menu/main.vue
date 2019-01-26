<template>
    <el-menu default-active="1" class="el-menu-gantt" mode="horizontal">
      <el-menu-item  class="menu__logo" index="1">
          <img src="../../assets/gantt-logo.png" width="30px">
          CJS's Gantt
      </el-menu-item>
      <el-submenu class="menu__profile" index="2">
          <template slot="title">
              <img class="menu__profile_avatar" :src="avatarUser">
          </template>
            <el-menu-item class="menu__profile__display_name" index="2-1">{{ displayNameUser }}</el-menu-item>
            <el-menu-item index="2-2">Đăng xuât</el-menu-item>
          </el-submenu>
    </el-menu>
</template>

<script>
    export default {
        name: 'menu',
        data(){
            return{
                userData: JSON.parse(localStorage.getItem('userInfo')),
            }
        },
        computed:{
            avatarUser(){
                return this.userData['photo'];
            },
            displayNameUser(){
                return this.userData['full_name'];
            }
        }
    };
</script>

<style scoped>
    >>>.menu__logo{
        font-size: 30px;
        font-weight:bold;
    }
    >>>.menu__profile{
        float:right;
    }
    >>>.menu__profile_avatar{
        width: 50px;
        border-radius:50%;
    }
    >>>.menu__profile__display_name{
        font-weight:bold;
    }
</style>

