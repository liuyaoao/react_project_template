import React, {Component} from 'react';
import pureRender from 'pure-render-decorator';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as indexActions from '../actions/index_action';

import { Layout, Menu, Breadcrumb, Icon,Affix as AffixPc } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

import superagent from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
superagentJsonapify(superagent);
// import { is, fromJS} from 'immutable';
// import {Tool} from '../Config/Tool';
// import {Header,template} from './common/mixin';
// import template from './common/template';


class IndexPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saleMoney:'',  //销售金额
            name:'',   //姓名
            phone:'',   //电话
            products:[],    //销售商品
            postProduct:[], //上传的商品信息
            serverId:'',   // 图片id
            picSrc:'',     //图片src
            organizationsData:null,
            saleOldvalue:'',    //金额上次input值
            preventMountSubmit:true,//防止重复提交
        }

        this.changeValue = (type,event) => {
            if (type === 'money') {
                let value = event.target.value;
                if((/^\d*?\.?\d{0,2}?$/gi).test(value)){
                    if ((/^0+[1-9]+/).test(value)) {
                        value = value.replace(/^0+/,'');
                    }
                    if ((/^0+0\./).test(value)) {
                        value = value.replace(/^0+/,'0');
                    }
                    value = value.replace(/^\./gi,'0.');
                    this.state.saleOldvalue = value;
                    this.state.inputLength = value.length;
                }else{
                      value = this.state.saleOldvalue;
                }
                this.setState({
                    saleMoney:value
                })
            }else if (type === 'name') {
                this.setState({
                    name:event.target.value
                })
            }else if(type === 'phone'){
                let value = event.target.value.replace(/\D/gi,'')
                this.setState({
                    phone:value
                })
            }
        }

        this.chooseImage = () => {
            Tool.alert('测试环境无法获取微信签名');
            let self = this;
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: res => {
                    let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    self.setState({picSrc:localIds});
                    self.uploadImage(localIds)
                }
            });

        }

        this.uploadImage = (localIds) => {
            let self = this;
            localIds = localIds.toString()
            wx.uploadImage({
                localId: localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: res => {
                    let serverId = res.serverId; // 返回图片的服务器端ID
                    self.setState({serverId:serverId});
                }
            });
        }

        this.postInform = () => {
            if (this.state.saleMoney == '') {
                Tool.alert('请输入订单金额');
            }else if (this.state.name == '') {
                Tool.alert('请输入客户姓名');
            }else if (this.state.phone == ''||!/^1\d{10}$/.test(this.state.phone)) {
                Tool.alert('请输入正确的电话号码');
            }else if (this.state.postProduct.length == 0) {
                Tool.alert('请选择销售的产品');
            }else if (this.state.picSrc !== ''&&this.state.serverId == '') {
                Tool.alert('图片上传失败，请重新上传图片');
            }else if (this.state.serverId == '') {
                Tool.alert('请上传售卖发票凭证');
            }else{
                if (this.state.postProduct instanceof Object) {
                    this.state.postProduct = JSON.stringify(this.state.postProduct);
                }
                if (this.state.preventMountSubmit) {
                    this.state.preventMountSubmit == false;
                    this.props.getData('/sales/sales/input',{sales_money:this.state.saleMoney,customers_name :this.state.name,customers_phone :this.state.phone,products :this.state.postProduct,invoice_ids :this.state.serverId},(res) => {
                        if (res.http_code == 200) {
                            Tool.alert(res.data.msg);
                            this.setState({
                                saleMoney:'',
                                name:'',
                                phone:'',
                                products:[],
                                serverId:'',
                                picSrc:'',
                                postProduct:[],
                                preventMountSubmit:true
                            })
                        }else{
                            this.state.preventMountSubmit = true;
                            Tool.alert(res.msg)
                        }
                    },'input')
                }
            }
        }

        this.deleteImg = () => {
            this.setState({picSrc:'',serverId:''})
        }

    }

    componentWillMount() {
      let _this = this;
      const request = superagent.get('../../test_data/organizations.json')
        .then(function(response) {
          const body = response.body;
          console.log("request local orgnizasitions:",body);
          _this.setState({"organizationsData":body});
        });
    }
    componentDidMount() {
        // const url = window.location.href.split('#')[0];
        // const successFun = (res) => {
        //     wx.config({
        //         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        //         appId: res.appId, // 必填，公众号的唯一标识
        //         timestamp: res.timestamp, // 必填，生成签名的时间戳
        //         nonceStr: res.nonceStr, // 必填，生成签名的随机串
        //         signature: res.signature, // 必填，签名，见附录1
        //         jsApiList: ['chooseImage','uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        //     });
        // }
        //
        // //this.props.getData('core/wx/jssdkNotLogin', {url: url}, successFun, 'jssdk');
        // //获取微信签名，demo不需要
        // wx.ready(() => {
        //     wx.hideOptionMenu();
        // })
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    // }

    // componentWillUpdate(nextProps,nextState){
    //     if (this.props !== nextProps) {
    //         let {data} = nextProps.state;
    //
    //     }
    // }
    getListContentElements(){
      let oneRow = (<div className="addressbook_row">
            <span className="addressbook_avator">
              <img className="member_icon" width="40" height="40" src={''}/>
            </span>
            <div className="addressbook_detail">
              <div className="member_name">liuyaoao</div>
              <div className="member_desc">yaoao.liu@dragonflow.com</div>
            </div>
            <div className="addressbook_oper">
              <Link to={'/signup_user_complete'} className='signup-team-login'>
                发起聊天
              </Link>
            </div>
          </div>);

      let content = (<div className="addressbook_list">
            {oneRow}
            {oneRow}
            {oneRow}
            {oneRow}
            {oneRow}
          </div>);
      return content;
    }
    getPCElements(sidebar){
      let content = this.getListContentElements();
      return ( <Layout style={{ height: '100vh' }}>
                <Header className="header custom_ant_header addressbook_header" style={{position:'fixed',width:'100%',zIndex:'99999'}}>
                      <div className="custom_ant_header_logo addressbook_logo" >
                        <span className="logo_icon"><img width="40" height="40" src={''}/></span>
                        <div className="logo_title">
                          <p>@张三丰</p><p>司法E通</p>
                          </div>
                      </div>
                      <Breadcrumb className="bread_content" style={{ margin: '0 10px',float:'left' }}>
                        <Breadcrumb.Item className="bread_item">电子通讯录</Breadcrumb.Item>
                        <Breadcrumb.Item className="bread_item">局长</Breadcrumb.Item>
                      </Breadcrumb>
                </Header>
                <Layout style={{marginTop:'64px'}}>
                  {sidebar}
                  <Layout style={{ padding: '0' }}>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280,overflow: 'initial' }}>
                      {content}
                    </Content>
                  </Layout>
                </Layout>
              </Layout>);
    }
    render() {

      const sidebar = (<Sider width={240}
          className="custom_ant_sidebar addressSidebar"
          style={{ background: '#2071a7',color:'#fff',overflow: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            openKeys={this.state.openKeys}
            selectedKeys={[this.state.current]}
            style={{ width: 240 }}
            onOpenChange={this.onMenuOpenChange}
            onClick={this.handleClick} >
            <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 2</Menu.Item>
              <Menu.Item key="3">Option 3</Menu.Item>
              <Menu.Item key="4">Option 4</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
              </SubMenu>
            </SubMenu>
            <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>);

      let finalEle = this.getPCElements(sidebar);

      return (<div className="address_book_container">
        {finalEle}
      </div>);
    }

    // componentWillUnmount() {
    //     cancelAnimationFrame(this.state.requestID);
    // }
}
IndexPage.propTypes = {
  testData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}
function mapStateToProps(state) {
  const { testData } = state.indexReducer
  return {
    testData
  }
}

// function mapDispatchToProps(dispatch) {
//   return {
//     todoActions: bindActionCreators(todoActionCreators, dispatch),
//     counterActions: bindActionCreators(counterActionCreators, dispatch)
//   }
// }

export default connect(mapStateToProps)(IndexPage)
// export default connect(mapStateToProps, mapDispatchToProps)(IndexPage)
