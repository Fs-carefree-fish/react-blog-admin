import React, { useState, useEffect } from 'react'
import marked from 'marked'

import '../static/css/AddArticle.css'

import { Row, Col, Input, Select, Button, DatePicker, message } from 'antd'
import axios from 'axios'
import servicePath from '../config/apiUrl'

const { Option } = Select;
const { TextArea } = Input;

//全局变量
const defaultTypeValue = "选择类别"

function AddArticle(props) {



  //eslint-disable-next-line
  const [articleId, setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  //eslint-disable-next-line
  const [articleTitle, setArticleTitle] = useState('')   //文章标题
  //eslint-disable-next-line
  const [articleContent, setArticleContent] = useState('')  //markdown的编辑内容
  //eslint-disable-next-line
  const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
  //eslint-disable-next-line
  const [introducemd, setIntroducemd] = useState()            //简介的markdown内容
  //eslint-disable-next-line
  const [introducehtml, setIntroducehtml] = useState('等待编辑') //简介的html内容
  //eslint-disable-next-line
  const [showDate, setShowDate] = useState()   //发布日期
  //eslint-disable-next-line
  //const [updateDate, setUpdateDate] = useState() //修改日志的日期
  //eslint-disable-next-line
  const [typeInfo, setTypeInfo] = useState([]) // 文章类别信息（总体）
  //eslint-disable-next-line
  const [selectedType, setSelectType] = useState(defaultTypeValue) //选择的文章类别
  //eslint-disable-next-line
  useEffect(() => {
    getTypeInfo()
    //获得文章ID
    let tmpId = props.match.params.id
    console.log(props.match)
    if (tmpId) {
      setArticleId(tmpId)//设置文章 id 如果为0是新增的 否则是要修改
      getArticleById(tmpId)
    }
    // eslint-disable-next-line
  }, [])


  marked.setOptions({
    renderer: marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
  });


  //文章内容

  const changeContent = (e) => {
    setArticleContent(e.target.value)//获得的值
    let html = marked(e.target.value)
    setMarkdownContent(html)
  }

  //文章简介

  const changeIntroduce = (e) => {
    setIntroducemd(e.target.value)
    let html = marked(e.target.value)
    setIntroducehtml(html)
  }

  //获取类型

  const getTypeInfo = () => {
    axios({
      method: 'get',
      url: servicePath.getTypeInfo,
      withCredentials: true
    }).then(
      res => {
        if (res.data.data === '没有登录') {
          localStorage.removeItem('openId')
          props.history.push('/')
          //console.log("没有")
        } else {
          setTypeInfo(res.data.data)
          console.log(res.data.data)
          //console.log("有")
        }
      }
    )
  }

  //选择类型

  const selectTypeHandler = (value) => {
    setSelectType(value)
  }

  //发布（保存）文章
  const saveArticle = () => {
    if (selectedType === defaultTypeValue) {
      message.error("请填写文章类型~")
      return false
    } else if (!articleTitle) {
      message.error("请填写文章标题~")
      return false
    } else if (!articleContent) {
      message.error("请填写文章内容~")
      return false
    } else if (!introducemd) {
      message.error("请填写文章简介~")
      return false
    } else if (!articleContent) {
      message.error("请填写文章内容~")
      return false
    } else if (!showDate) {
      message.error("请填写发布日期~")
      return false
    }

    let dataProps = {}   //传递到接口的参数
    dataProps.type_id = selectedType
    dataProps.title = articleTitle
    dataProps.article_content = articleContent
    dataProps.introduce = introducemd
    let datetext = showDate.replace('-', '/') //把字符串转换成时间戳
    dataProps.addTime = (new Date(datetext).getTime()) / 1000//时间 单位为秒
    //console.log(dataProps)

    if (articleId === 0) {//等于0是指新增加的文章
      dataProps.view_count = Math.ceil(Math.random() * 100) + 1000
      //dataProps.view_count = 10
      axios({
        method: 'post',
        url: servicePath.addArticle,
        data: dataProps,
        withCredentials: true
      }).then(
        res => {
          console.log(res.data)
          setArticleId(res.data.insertId)//将数据表中的对应id保存在 articleId
          if (res.data.isSuccess) {
            message.success('文章保存成功')
          } else {
            message.error('文章保存失败');
          }
        }
      )
    } else {
      dataProps.id = articleId//数据表中的对应id
      axios({
        method: 'post',
        url: servicePath.updateArticle,
        //header: { 'Access-Control-Allow-Origin': '*' },
        data: dataProps,
        withCredentials: true
      }).then(
        res => {

          if (res.data.isScuccess) {
            message.success('修改成功！')
          } else {
            message.error('修改失败！');
          }


        }
      )
    }


  }

  //（根据id获取文章）用于修改文章的
  const getArticleById = (id) => {
    axios(servicePath.getArticleById + id, {
      withCredentials: true,
      header: { 'Access-Control-Allow-Origin': '*' }
    }).then(
      res => {
        console.log(res)
        setArticleTitle(res.data.data[0].title)
        setArticleContent(res.data.data[0].article_content)
        let html = marked(res.data.data[0].article_content)
        setMarkdownContent(html)
        setIntroducemd(res.data.data[0].introduce)
        let tmpInt = marked(res.data.data[0].introduce)
        setIntroducehtml(tmpInt)
        setShowDate(res.data.data[0].addTime)
        setSelectType(res.data.data[0].typeId)
      }
    )
  }



  return (
    <div>
      <div>
        <Row gutter={5}>
          <Col span={18}>
            <Row gutter={10} >
              <Col span={20}>
                <Input
                  value={articleTitle}
                  onChange={(e) => { setArticleTitle(e.target.value) }}
                  placeholder="博客标题"
                  size="large" />
              </Col>
              <Col span={4}>
                &nbsp;
                    <Select defaultValue={selectedType} onChange={selectTypeHandler} size="large">
                  {
                    typeInfo.map((item, index) => {
                      return (
                        <Option key={index} value={item.Id}>{item.typeName}</Option>
                      )
                    })
                  }
                  {/* <Option value="Sign Up">视频教程</Option> */}
                </Select>
              </Col>
            </Row>
            <br />
            <Row gutter={10} >
              <Col span={12}>
                <TextArea
                  className="markdown-content"
                  value={articleContent}
                  rows={35}
                  placeholder="文章内容"
                  onChange={changeContent}
                />
              </Col>
              <Col span={12}>
                <div
                  className="show-html"
                  dangerouslySetInnerHTML={{ __html: markdownContent }}
                >
                </div>
              </Col>
            </Row>
          </Col>

          <Col span={6}>

            <Row>
              <Col span={24}>
                <Button size="large">暂存文章</Button>&nbsp;
              <Button type="primary" size="large" onClick={saveArticle}>发布文章</Button>
                <br />
              </Col>
            </Row>

            <Col span={24}>
              <br />
              <TextArea
                rows={4}
                placeholder="文章简介"
                onChange={changeIntroduce}
                value={introducemd}
              />
              <br /><br />
              <div className="introduce-html"
                dangerouslySetInnerHTML={{ __html: introducehtml }}></div>
            </Col>

            <Col span={12}>
              <div className="date-select">
                <DatePicker
                  onChange={(data, dataString) => { setShowDate(dataString) }}
                  placeholder="发布日期"
                  size="large"

                />
              </div>
            </Col>
          </Col>



        </Row>
      </div>
    </div>
  )
}

export default AddArticle

