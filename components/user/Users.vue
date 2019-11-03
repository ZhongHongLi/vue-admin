<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userlist" style="width: 100%;" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeSwitch(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 分配 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 删除 -->
            <el-tooltip content="分配角色" :enterable="false" placement="top" effect="dark">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页数据 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="addclose" >
     <!-- 对话框主题内容 -->
  <el-form :model="addFrom" status-icon :rules="addFromRule" ref="addFromRef" label-width="70px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addFrom.username"></el-input>
  </el-form-item>
  
    <el-form-item label="密码" prop="password">
    <el-input v-model="addFrom.password"></el-input>
    </el-form-item>
    
     <el-form-item label="邮箱" prop="email">
    <el-input v-model="addFrom.email"></el-input>
    </el-form-item>
    
    
     <el-form-item label="手机" prop="mobile">
    <el-input v-model="addFrom.mobile"></el-input>
    </el-form-item>
    
    
  </el-form>
  


      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱的规则
      const checkEmail=(rule,value,cb)=>{
          const regEmail=/^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
          if(regEmail.test(value)){
              //合法的邮箱
              return cb()
          }
          cb(new Error('请输入正确的邮箱'))
      } 
      const checkMobile=(rule,value,cb)=>{
          const regMobile=/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[678]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
          if(regMobile.test(value)){
              return cb()
          }
          cb(new Error('请输入正确的手机号'))
      }
    return {    
     //获取用户列表参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 3
      },
      userlist: [],
      total: 0,
      dialogVisible:false,
      //添加表单对象
      addFrom:{
          username:'',
          password:'',
          email:'',
          mobile:''
      },
      //验证规则
      addFromRule:{
          username:[
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password:[
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 5, max: 10, message: '用户名长度在 5 到 10 个字符', trigger: 'blur' }
          ],
          email:[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              {validator:checkEmail,trigger: 'blur'}
          ],
          mobile:[
               { required: true, message: '请输入手机号', trigger: 'blur' },
                {validator:checkMobile,trigger: 'blur'}
             
          ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$http.get("users", { params: this.queryInfo }).then(res => {
        if (res.data.meta.status != 200)
          return this.$message.error("获取数据失败");
        const data = res.data.data;
        this.userlist = data.users;
        this.total = data.total;
      });
    },
    // 监听pagesize该表的时间
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页码值 改变的时间
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听switch的改变
    changeSwitch(changes) {
      // console.log(changes)
      this.$http
        .put(`users/${changes.id}/state/${changes.mg_state}`)
        .then(res => {
          const data = res.data.data;
          if (res.data.meta.status != 200) {
            changes.mg_state = !changes.mg_state;
            this.$message.error("更新状态失败");
          }
          this.$message.success("更新状态成功");
        });
    },
    //输入完毕按点击后清空文本框的值
    addclose(){
        this.$refs.addFromRef.resetFields()
    },
    //添加用户效验用户信息
    addUser(){
        this.$refs.addFromRef.validate(valid=>{
            if(!valid) return this.$message.error('验证失败')
            this.$message.success('验证成功')
            // 发起添加用户的请求
            this.$http.post('users',this.addFrom).then((res)=>{
                if(res.data.meta.status!=201){
                    this.$message.error('添加用户失败')
                }
                  this.$message.success('添加用户成功')
                  //添加完毕后让显示框隐藏
                  this.dialogVisible=false
                  this.getUserList()
            })
        })
    }
  }
};
</script>

<style scoped lang="less">
</style>
