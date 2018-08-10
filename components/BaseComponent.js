
/**
 * @name BaseComponent.js
 * @auhor 李磊
 * @date 2018.8.8
 * @desc 基本的Component，封装了组件很常用的一些功能，包括打印、提示、请求、消息等
 */

import React, {Component} from "react";
import {Platform,DeviceEventEmitter} from "react-native";
import config from "../config";
import Tools from "../lib/Tools";

export default class BaseComponent extends Component{
	
	constructor(props){
		super(props);

		// 工具函数库
		this.T = Tools.getInstance();

		// 消息监听器
		this.listeners = [];

		// 系统类型
		this.OS = Platform.OS;

		// 获取页面参数和导航器
		if(this.props.navigation){
			this.params = this.props.navigation.state.params;
			this.navigate = this.props.navigation.navigate;
		}
		this.goBack = this.goBack.bind(this);
		this.goPage = this.goPage.bind(this);
	}

	/**
	 * @method log
	 * @params mark->打印标记；msg->打印内容
	 * @return
	 * @desc 打印函数，通过传入的标记（mark）来区分打印内容
	 */
	log(mark,msg){

		if(this.T){
			this.T.log(mark,msg);
		}
		// 默认返回当前指针，方便链式操作
		return this;
	}

	/**
	 * @method json
	 * @params JSON字符串
	 * @return JSON对象
	 * @desc 把JSON字符串转为对象
	 */
	json(str){
		if(this.T){
			return this.T.json(str);
		}
	}

	/**
	 * @method jsonStr
	 * @params JSON对象
	 * @return JSON字符串
	 * @desc 把JSON对象转为字符串
	 */
	jsonStr(obj){
		if(this.T){
			return this.T.jsonStr(obj);
		}
	}

	/**
	 * @method toast
	 * @params msg->提示内容；duration->提示持续时间
	 * @return
	 * @desc 公用弹窗提示，依赖
	 */
	toast(msg,duration){
		if(this.T){
			this.T.toast(msg,duration);
		}

		// 默认返回当前指针，方便链式操作
		return this;

	}

	/**
	 * @method saveAccount
	 * @params account->账号内容
	 * @return
	 * @desc 快捷保存用户登录的账号
	 */
	saveAccount(account){
		if(this.T){
			this.T.save("account",account);
		}

		// 默认返回当前指针，方便链式操作
		return this;

	}

	/**
	 * @method rmAccount
	 * @params callback->回调函数
	 * @return
	 * @desc 快捷删除用户登录的账号
	 */
	getAccount(callback){
		if(this.T){
			this.T.load("account",callback);
		}

		// 默认返回当前指针，方便链式操作
		return this;

	}

	/**
	 * @method rmAccount
	 * @params
	 * @return
	 * @desc 快捷删除用户登录的账号
	 */
	rmAccount(){
		if(this.T){
			this.T.remove("account");
		}

		// 默认返回当前指针，方便链式操作
		return this;

	}

	/**
	 * @method emit
	 * @params name->消息名字；msg->消息内容，JSON对象
	 * @return
	 * @desc 发送消息，对应是用listen来监听
	 */
	emit(name,msg){
		DeviceEventEmitter.emit(name,msg);

		// 默认返回当前指针，方便链式操作
		return this;

	}

	/**
	 * @method listen
	 * @params name->消息名字，可以传数组；callback->回调函数
	 * @return
	 * @desc 监听消息
	 */
	listen(name,callback){

		if(name instanceof Array){
			for(var i=0;i<name.length;i++){
				var id = DeviceEventEmitter.addListener(name,callback);
				this.listeners.push(id);
			}
			return;
		}

		var id = DeviceEventEmitter.addListener(name,callback);
		this.listeners.push(id);

		// 默认返回当前指针，方便链式操作
		return this;

	}

	/**
	 * @method select
	 * @params datas->平台相关数据
	 * @return 返回对应平台的数据
	 * @desc 平台选择，用法等同于Platform.select()
	 */
	select(datas){
		return Platform.select(datas);
	}

	/**
	 * @method goBack
	 * @params
	 * @return
	 * @desc 返回之前的页面
	 */
	goBack(){
		if(this.props.navigation){
			this.props.navigation.goBack();
		}

		// 默认返回当前指针，方便链式操作
		return this;

	}

	/**
	 * @method goPage
	 * @params
	 * @return
	 * @desc 跳转到指定页面
	 */
	goPage(page,params){
		if(this.navigate){
			this.navigate(page,params);
		}

		// 默认返回当前指针，方便链式操作
		return this;

	}

	/**
	 * @method request
	 * @params url->请求地址；config->请求配置，实例如下：
	 	{
			method:"POST",
			body: JSON.stringify({
			    param1: "value",
			    param2: "value"
			})
	 	}
	 * @return
	 * @desc 公用请求函数，不存在跨域问题
	 */
	request(url,config){
		if(this.T){
			this.T.request(url,config);
		}

		// 默认返回当前指针，方便链式操作
		return this;

	}

	componentWillUnmount(){
		// 清除消息监听器
		for(var i=0;i<this.listeners.length;i++){
			this.listeners[i].remove();
		}
		if(this.T){
			this.T.clearTimer();
		}
	}

}