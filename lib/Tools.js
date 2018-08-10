
/**
 * @name Tools.js
 * @auhor 李磊
 * @date 2018.8.8
 * @desc 公用的工具函数库，包括打印、日期、http请求等相关函数
 */

// 引入全局配置文件
import config from "../config";

// 数据持久化
import {AsyncStorage} from 'react-native';
import Storage from 'react-native-storage';

// 提示
import Toast from "react-native-root-toast";



export default class Tools extends Object{

	constructor(){

		super();

		// 配置
		this.config = {
			// 打印开关（默认打开）
			isLog:true
		};

		// 定时器列表
		this.timers = [];

		// 初始化持久化存储实例
		this.storage = new Storage({
		  	// 最大容量，默认值1000条数据循环存储
		  	size: 1000,

		  	// 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
		  	// 如果不指定则数据只会保存在内存中，重启后即丢失
		  	storageBackend: AsyncStorage,
		    
		  	// 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
		  	defaultExpires: null,
		    
		  	// 读写时在内存中缓存数据。默认启用。
		  	enableCache: true,
		    
		  	// 如果storage中没有相应数据，或数据已过期，
		  	// 则会调用相应的sync方法，无缝返回最新数据。
		  	// sync方法的具体说明会在后文提到
		  	// 你可以在构造函数这里就写好sync的方法
		  	// 或是在任何时候，直接对storage.sync进行赋值修改
		  	// 或是写到另一个文件里，这里require引入
		  	sync: null
		  	
		});

	}

	/**
	 * @method getInstance
	 * @params
	 * @return Tools的实例对象
	 * @desc 该函数是一个Tools类的工厂函数，方便创建实例，可直接通过Tools.getInstance()方式调用
	 */
	static getInstance(){
		return new Tools();
	}

	/**
	 * @method log
	 * @params mark->打印标记；msg->打印内容
	 * @return
	 * @desc 打印函数，通过传入的标记（mark）来区分打印内容
	 */
	log(mark,msg){

		if(this.config.isLog){
			let mk = "";
			if(mark){mk=mark;}
			if(msg instanceof Array || msg instanceof Object){
				msg = JSON.stringify(msg);
			}
			console.log("@"+mk+"  "+msg);
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
		return JSON.parse(str);
	}

	/**
	 * @method jsonStr
	 * @params JSON对象
	 * @return JSON字符串
	 * @desc 把JSON对象转为字符串
	 */
	jsonStr(obj){
		return JSON.stringify(obj);
	}

	/**
	 * @method combine
	 * @params JSON对象
	 * @return JSON字符串
	 * @desc 把JSON对象转为字符串
	 */
	combine(a,b){
		return Object.assign(a,b);
	}

	/**
	 * @method toast
	 * @params msg->提示内容；duration->提示持续时间
	 * @return
	 * @desc 公用弹窗提示，依赖react-native-easy-toast组件
	 * 更多，请参照：hhttps://github.com/magicismight/react-native-root-toast
	 */
	toast(msg,duration){

		// toast配置
		let conf = {
		    duration: Toast.durations.LONG,
		    position: -150,
		    shadow: true,
		    animation: true,
		    hideOnPress: false,
		    delay:0
		};

		if(duration){conf.duration=duration}
		// toast实例
		Toast.show(msg,conf);

		// 默认返回当前指针，方便链式操作
		return this;
	}

	/**
	 * @method getDate
	 * @params stamp->时间戳，以秒或者毫秒为单位；ismili->单位是否为毫秒，默认是秒
	 * @return 以yy-mm-dd hh:mm:ss的格式返回日期
	 * @desc 把时间戳转换为常见的时间格式
	 */
	getDate(stamp,ismili){

		let date = new Date();
		if(stamp){
			if(ismili){
				date = new Date(stamp);
			}else{
				date = new Date(stamp*1000);
			}
		}
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		if(month < 10){
			month = "0"+month;
		}
		let day = date.getDate();
		if(day < 10){
			day = "0"+day;
		}
		let hour = date.getHours();
		if(hour < 10){
			hour = "0"+hour;
		}
		let minute = date.getMinutes();
		if(minute < 10){
			minute = "0"+minute;
		}
		let second = date.getSeconds();
		if(second < 10){
			second = "0"+second;
		}

		let final = year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
		return final;

	}

	/**
	 * @method save
	 * @params key->数据键；value->值
	 * @return 
	 * @desc 保存数据到本地，封装于AsyncStroage
	 */
	save(key,value){

		if(this.storage){

			let val = {};
			
			val.value = value;

			this.storage.save({
			    key: key,// 注意:请不要在key中使用_下划线符号!
			    data: val,
			    
			    // 如果不指定过期时间，则会使用defaultExpires参数
			    // 如果设为null，则永不过期
			    expires: null
			 });
		}

		// 默认返回当前指针，方便链式操作
		return this;
	}

	/**
	 * @method load
	 * @params key->数据键；callback->回调函数
	 * @return 
	 * @desc 获取指定键名的数据
	 */
	load(key,callback){
		if(this.storage){
			this.storage.load({
			    key: key,
			}).then(ret => {
			    // 如果找到数据，则在then方法中返回
			    callback(ret.value,null);
			}).catch(err => {
			    // 如果没有找到数据且没有sync方法，
			    // 或者有其他异常，则在catch中返回
				callback(null,err);
			});
		}

		// 默认返回当前指针，方便链式操作
		return this;
	}

	/**
	 * @method remove
	 * @params key->数据键
	 * @return 
	 * @desc 删除指定键名的数据
	 */
	remove(key){
		if(this.storage){
			this.storage.remove({
			    key: key
			});
		}

		// 默认返回当前指针，方便链式操作
		return this;

	}

	/**
	 * @method countDown
	 * @params second->倒计时秒数；callback->回调函数
	 * @return 
	 * @desc 倒计时
	 */
	countDown(second,callback){
	    var time = second;
	    var id = null;
	    if(time>0 && !id){
	       	id = setInterval(function(){
	         	time --;
	          	if(callback){callback(time);}
	          	if(time == 0){
	            	clearInterval(id);
	          	}
	        },1000);
	        this.timers.push(id);
	    }

	    return this;
	}

	/**
	 * @method clearTimer
	 * @params
	 * @return 
	 * @desc 清除定时器
	 */
	clearTimer(){
		
	    // 清除定时器
		for(var i=0;i<this.timers.length;i++){
			clearInterval(this.timers[i]);
		}
		
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

		// 默认配置
		let defConfig = {
			method:"GET",
			headers: {
			    "Accept": "application/json",
			    "Content-Type": "application/json"
			}
		};

		// 合并配置
		if(config){
			defConfig = Object.assign(defConfig,config);
		}

		// 发送请求，使用RN的默认请求方式fetch,
		// 更多资料，请参见:https://reactnative.cn/docs/network/
		if(url){
			fetch(url,defConfig)
			.then(function(ret){
				if(config.success){
					config.success(JSON.parse(ret._bodyText));
				}
			})
			.catch(function(err){
				if(config.error){
					config.error(err);
				}
			});
		}

		// 默认返回当前指针，方便链式操作
		return this;

	}

}

