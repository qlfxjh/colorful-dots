// JavaScript Document
function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function goTop(){
	window.scrollTo(0,0);
}



/*页面弹层的JS*/
var Pop = function(){
	this.target = null;
	this.bg = document.createElement('DIV');
	this.bg.className = "pop_mask";
	this.bg.id = "pop_over_bg";
	document.body.appendChild(this.bg);	
};
Pop.prototype = {
	show: function(id){
		if(this.target!=null) return;
		this.target = JW(id);
		this.bg.style.display = "block";
		this.target.style.display = "block";
		//var clientWidth = document.documentElement.clientWidth;
		var clientHeight = document.documentElement.clientHeight;
		//var width = this.target.offsetWidth;
		var height = this.target.offsetHeight;
		var top = parseInt((clientHeight-height)/2);
		//var left = parseInt((clientWidth-width)/2);
		this.target.style.top = top+"px";

	},
	hide: function(){
		this.bg.style.display = "none";
		this.target.style.display = "none";
		this.target = null;
	},
	resize: function(){
		var clientHeight = document.documentElement.clientHeight;
		var height = this.target.offsetHeight;
		var top = parseInt((clientHeight-height)/2);
		this.target.style.top = top+"px";
	}
};

//var oPop = new Pop();



function reload(){
	window.location.reload();
}


function tabShift(e, tabNav, preIdStr){
	///*第一个参数为event;*/
	///*第二个参数为this;*/
	///*第三个参数为tav_con的id前缀，如果为空，表示不通过id来获取tab_con,而是通过寻找tab_nav的同一个父亲元素下的class="tab_con"来获取tab_con对象;*/
	$tabNav = $(tabNav);
	var lis = $tabNav.find("li");
	var target = window.event?event.srcElement:e.target;
	var tabCons;
	//获取到当前点击的li
	try
	{
		while(target.tagName!="LI"||target == document.body){
			target = target.parentNode;
		}
	}
	catch(err){
		
	};
	
	if(target==document.body){
		return;
	}
	
	var idx = lis.index(target);
	if(tabNav.tagName=="UL"){
		tabCons = $(tabNav).parent().siblings(".tab_con");
	}else{
		tabCons = $(tabNav).siblings(".tab_con");
	}
	
	//切换tab_con
	if(arguments.length>2){
		//通过id来获取tab_con
		for(var i=0; i<lis.length; i++){
			if(i==idx){
				$("#"+preIdStr+(i+1)).show();
			}else{
				$("#"+preIdStr+(i+1)).hide();
			}
		}
	}else{
		tabCons.hide().eq(idx).show();
	}
	
	//切换tab_nav li当前项
	lis.removeClass("current").eq(idx).addClass("current");
}

function tabShiftSet(ulId, consIdPre, index){
	var ul = $("#"+ulId);
	var lis = ul.find("li");
	var currentLi = lis.filter("li.current");
	var oldIndex = lis.index(currentLi);
	var newIndex;
	if(index=="+1"){
		newIndex=oldIndex+1;
	}else if(index=="-1"){
		newIndex = oldIndex-1;
	}else{
		newIndex = index;
	}
	
	if(newIndex>lis.length-1){
		newIndex=lis.length-1
	}else if(newIndex<0){
		newIndex = 0;
	}
	lis.removeClass("current").eq(newIndex).addClass("current");
	//通过id来获取tab_con
	for(var i=0; i<lis.length; i++){
		if(i==newIndex){
			$("#"+consIdPre+(i+1)).show();
		}else{
			$("#"+consIdPre+(i+1)).hide();
		}
	}	
}

function JW(id){
	return document.getElementById(id);
}

JW.offset = function(elem){
	var docElem, win,
		box = { top: 0, left: 0 },
		doc = elem && elem.ownerDocument,
		strundefined = typeof undefined;

	if ( !doc ) {
		return;
	}
	docElem = doc.documentElement;
	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = window;
	console.log(box.left+"_"+win.pageXOffset+"_"+docElem.clientLeft);
	return {
		top: box.top + win.pageYOffset - docElem.clientTop,
		left: box.left + win.pageXOffset - docElem.clientLeft
	}
}
//生成一个从0-(_limit-1)的随机数;
JW.createRandom = function(_limit){
	var ranNum = Math.floor(Math.random()*_limit);
	return ranNum;
}














/*extend function, improved*/
function extend(subClass, superClass){
	var F = function(){};
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;
	
	subClass.superclass = superClass.prototype;
	if(superClass.prototype.constructor == Object.prototype.constructor){
		//console.debug("superClass.prototype.constructor==Object.prototype.constructor");
		//superClss为手写类，他的原型指向Object.prototype;
		//如果superClass为继承的类的话，那么就不会指向Object.prototype;
		superClass.prototype.constructor = superClass;
	}
}
function addEvent(el, type, fn){
     if(window.addEventListener){
          el.addEventListener(type, fn, false);
     }
     else if(window.attachEvent){
          el.attachEvent('on'+type, fn);
     }
     else{
          el['on'+type] =fn;
     }
}

/*Interface*/
var Interface = function(name, methods){
	if(arguments.length != 2){
		throw new Error("Interface constructor called with "+ arguments.length + "")
	}
	this.name = name;
	this.methods = [];
	for(var i=0, len = methods.length; i<len; i++){
		if(typeof methods[i] !== 'string'){
			throw new Error("Interface constructor expects method names to be passed in as a string.");
		}
		this.methods.push(methods[i]);
	}
};

//Static class method of Interface
Interface.ensureImplements = function(object){
	if(arguments.length <2 ){
		throw new Error("Function Interface.ensureImplements called with "+
		arguments.length + " arguments, but expected at least 2."
		);
	}
	for(var i= 1, len = arguments.length; i<len; i++){
		var interface = arguments[i];
		if(interface.constructor !== Interface){
			throw new Error("Function Interface.ensureImplements expects arguments two and above to be instances of Interface.");
		}
		for(var j=0, methodsLen = interface.methods.length; j< methodsLen; j++){
			var method = interface.methods[j];
			if(!object[method]||typeof object[method] !== 'function'){
				throw new Error("Function Interface.ensureImplements: object"
				+" does not implement the "+interface.name
				+" inerface.Method" + method + "was not found.");
			}
		}
	}
};






