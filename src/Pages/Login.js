import React, { useState } from 'react'
import { Card, Input, Icon, Button, Spin, message } from 'antd'
import 'antd/dist/antd.css'
import '../static/css/Login.css';
import servicePath from '../config/apiUrl'

import axios from 'axios'


function Login(props) {

  const [userName, setuserName] = useState('')
  const [password, setusePassword] = useState('')
  const [isLoading, setisLoading] = useState('')



  const CheckLogin = () => {

    //console.log("CheckLogin")
    setisLoading(true)

    if (!userName) {
      message.error("用户名为空！")
      setTimeout(() => {
        setisLoading(false)
      }, 500);
      return false
    } else if (!password) {
      message.error("密码为空！")
      setTimeout(() => {
        setisLoading(false)
      }, 500);
      return false
    }

    let loginData = {
      'userName': userName,
      'password': password
    }

    axios({
      method: 'post',
      url: servicePath.checkLogin,
      data: loginData,
      withCredentials: true
    }).then(
      res => {
        console.log(res.data)
        setisLoading(false)
        if (res.data.data === '登录成功') {
          localStorage.setItem('openId', res.data.openId)
          props.history.push('/index')
        } else {
          message.error("登录失败！")
        }
      }
    )
  }
  return (
    <div className="login-div">

      <Spin tip="Loading......" spinning={isLoading}>
        <Card title="假闲鱼 Blog 后台管理" bordered={true} style={{ width: 400 }}>

          <Input
            id="userName"
            size="large"
            placeholder="Enter your userName"
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={(e) => { setuserName(e.target.value) }}
          />
          <br /><br />

          <Input.Password
            id="password"
            size="large"
            placeholder="Enter your password"
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={(e) => { setusePassword(e.target.value) }}
          />
          <br /><br />

          <Button type="primary" size="large" block onClick={CheckLogin}>登录</Button>

        </Card>
      </Spin>

    </div>
  )
}

export default Login
