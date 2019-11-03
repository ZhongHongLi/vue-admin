<template>
  <div class="LoginContainer">
    <!-- 登录模块 -->
    <div class="login_box">
      <div class="avatar-box">
        <img src="../assets/img/logo.jpeg" alt="">
      </div>
      <!-- 表单区域 -->
        <el-form  class="form-box" ref="loginFromRef"  :model="loginFrom" :rules="loginFormRules">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input  placeholder="账号" v-model="loginFrom.username"   prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
            <el-form-item prop="password" >
            <el-input  placeholder="密码" type="password"  v-model="loginFrom.password"    prefix-icon="iconfont icon-3702mima"></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item class="btns">
              <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetLoginFrom">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loginFrom:{
          username:'admin',
          password:'123456'
        },
        //验证规则对象
        loginFormRules:{
          username:[
                 { required: true, message: '请输入账号', trigger: 'blur' },
                 { min: 5, max: 10, message: '账号长度在 5 到 10 个字符', trigger: 'blur' }
          ],
          password:[
                 { required: true, message: '请输入密码', trigger: 'blur' },
                 { min: 5, max: 10, message: '密码长度在 5 到 10 个字符', trigger: 'blur' }
          ],
          
        }
      };
    },
    created() {
    },
    methods: {
      resetLoginFrom(){
        // console.log(this)重置验证
        this.$refs.loginFromRef.resetFields()
      },
      login(){
        this.$refs.loginFromRef.validate(async valid=>{
          if(!valid) return 
       const {data:res}=await  this.$http.post('/login',this.loginFrom)
            if(res.meta.status!==200) return this.$message.error('登录失败')
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token',res.data.token)
            this.$router.push('/home')
              
          })
         
      }
    }
  };
</script>

<style scoped lang="less">
  .LoginContainer {
    height: 100%;
    background-color: #2b4b6b !important;
    .login_box {
      width: 450px;
      height: 300px;
      background-color: #fff;
      border-radius: 3px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .avatar-box {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        border: 3px solid #eee;
        background-color: #fff;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }
      .form-box{
        position: absolute;
        bottom:0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
      }
      .btns{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
