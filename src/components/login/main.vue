<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="login__title">
                    <h1>Đăng nhập</h1>
                </div>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="6">
                <div class="login__container">
                    <el-form label-position="top" label-width="100px" :model="userLoginData">
                        <el-form-item label="Tên đăng nhập">
                            <el-input placeholder="Tên đăng nhập hoặc email"
                                      v-model="userLoginData.username"></el-input>
                        </el-form-item>
                        <el-form-item label="Mật khẩu">
                            <el-input type="password" v-model="userLoginData.password"></el-input>
                        </el-form-item>
                        <el-form-item class="login__button_group">
                            <el-button type="primary" @click="loginUser">Đăng nhập</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import axios from 'axios';
    import router from '../../router';

    export default {
        name: 'Login',
        data() {
            return {
                userLoginData: {
                    username: '',
                    password: '',
                }
            };
        },
        methods: {
            loginUser() {
                let that = this;
                let pars = {
                    'username': that.userLoginData.username,
                    'password': that.userLoginData.password,
                    'type': 'normal',
                };
                axios.post(`${that.$urlAPI}/auth`, pars)
                    .then(function (res) {
                        // handle success
                        localStorage.setItem('token', `${res['data']['auth_token']}`);
                        localStorage.setItem('userInfo', JSON.stringify(res['data']));
                        router.replace('/');
                    });
            }
        },
        mounted() {
            if (localStorage.getItem('token')) {
                router.replace('/');
            }
        }
    };
</script>

<style scoped>
    >>> .el-form--label-top .el-form-item__label {
        float: left;
        font-weight: bold;
    }

    >>> .login__container {
        background: white;
        padding: 15px;
    }

    >>> .login__title h1 {
        color: white;
    }

    >>> .login__button_group {
        margin-bottom: 10px;
        width: 100%;
    }
</style>
