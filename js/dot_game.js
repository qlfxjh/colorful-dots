// JavaScript Document

//Writed at: 2014-11-07
//Writed by John Wong
//base in jQuery;
var DotGame = function(){
	this.wrap = JW('play_ground');
	this.$wrap = $(this.wrap);
	this.canvas = JW("canvas");
    this.eDotsNum = JW("kill_num");
    this.eCentNum = JW('game_cent');
    this.eBestScore = JW('best_cent');
	this.width = this.wrap.offsetWidth;
	this.height = this.width;
	this.colors = ["green", "blue", "pink", "orange", "purple", "red"];
	this.colMax = 8;
	this.lineMax = 8;
    this.cents = 0;
    this.bestScore = parseInt(localStorage.getItem("bestScore"));
    this.centMeasure = [0,1,2,4,8,12,18,26,36,50,68,90,116,140,170,200,240,300,400,540,700];
    this.vanishedDotsCount = 0;
	this.dots = new Array(this.colMax*this.lineMax);
	this.currentDots = []; 
    this.currentColor;
    this.lineSpan;
    this.colSpan;

    if(isNaN(this.bestScore)){
        this.bestScore = 0;
    }
    this.eBestScore.innerHTML = this.bestScore;
	
	
	//set the canvas;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasContext.fillStyle = "#cc0000";
    this.canvasContext.strokeStyle = "#cc0000";
    this.canvasContext.lineWidth = 8;
    this.canvasContext.save();
	
	//set the ground;
	this.wrap.style.height = this.width+ "px";
	

	//create the dots
	var span, pos;
	for(var i=0; i<this.lineMax; i++){
		for(var j=0; j<this.colMax; j++){
			span = document.createElement("SPAN");
			pos = this.getPosition(i,j);
			span.style.left = pos.left + 'px';
			span.style.top = pos.top + 'px';
            span.color = this.createColor();
			span.className = span.color;
			this.wrap.appendChild(span);
			this.dots[i*this.colMax+j] = span;
		}
	}
	var offset = JW.offset(this.wrap); 
	this.wrapLeft = offset.left;
	this.wrapTop = offset.top;
    
	//bind the events
	var that = this;
	this.wrap.onmousedown = function(e){that.onmousedown(e);};
	this.wrap.ontouchstart = function(e){that.onmousedown(e);};
	this.wrap.onmouseup = function(e){that.onmouseup(e);};
	this.wrap.ontouchend = function(e){that.onmouseup(e);};
	this.wrap.onmousemove = function(e){that.onmousemove(e);};
	addEvent(this.wrap, 'touchmove', function(e){that.onmousemove(e);});
	this.wrap.onmouseleave = function(e){that.onmouseup(e);};
	
};

DotGame.prototype = {
	getPosition: function(line, col){
		this.colSpan = this.width/this.colMax;
		this.lineSpan = this.height/this.lineMax;
		var _left = Math.round(col*this.colSpan + this.colSpan*0.5);
		var _top = Math.round(line*this.lineSpan + this.lineSpan*0.5);
		return {left:_left, top:_top};
	},
    getPosition2 : function(index){
        var y = Math.floor(index/this.colMax);
        var x = index%this.colMax;
        return this.getPosition(y,x);
    },
    getDotsIndexByPosition:function(left, top){
        var line = Math.floor(top/this.lineSpan);
        var col = Math.floor(left/this.colSpan);
        return line*this.colMax+col;
    },
	createColor: function(){
		return this.colors[JW.createRandom(this.colors.length)];
	},
	onmousedown: function(e){
		e = window.event?window.event:e;
		this.ifDrag = true;
        this.currentDots = [];
		var target = e.target;
		if(target.tagName == "SPAN"){
			this.currentLength = 1;
			var _touchX, _touchY;
			if(!!e.touches){
				_touchX = e.touches[0].pageX;
				_touchY = e.touches[0].pageY;
			}else{
				_touchX = e.clientX;
				_touchY = e.clientY;
			}
			var _left = _touchX - this.wrapLeft;
			var _top = _touchY - this.wrapTop;
			this.update(_left,_top,e);
		}
        e.preventDefault();
		return false;
        
	},
	onmouseup: function(e){
		this.ifDrag = false;
        
        var dotsLength = this.currentDots.length;
        if(dotsLength<2){
            $(this.dots[this.currentDots[0]]).removeClass('selected');
            return;
        }
        
        for(var i=0; i<dotsLength; i++){
            this.wrap.removeChild(this.dots[this.currentDots[i]]);
            this.dots[this.currentDots[i]] = null;
        }
        this.vanishedDotsCount = this.vanishedDotsCount+dotsLength;
        this.cents = this.cents + this.centMeasure[dotsLength];
        this.eDotsNum.innerHTML = this.vanishedDotsCount;
        this.eCentNum.innerHTML = this.cents;
        
        var span, pos;
        for(var i=this.dots.length-1; i>=0; i--){
            
            if(this.dots[i]!=null){
                continue;
            }else{
                for(var j = i-this.colMax; j>=0; j = j-this.colMax){
                    if(this.dots[j]!=null){
                        this.dots[i] = this.dots[j];
                        this.dots[j] = null;
                        pos = this.getPosition2(i);
                        this.dots[i].style.left = pos.left+"px";
                        this.dots[i].style.top = pos.top+"px";
                        break;
                    }
                }
                if(this.dots[i]==null){
                    span = document.createElement("SPAN");
                    pos = this.getPosition2(i);
                    span.style.left = pos.left + 'px';
                    span.style.top = pos.top + 'px';
                    span.color = this.createColor();
                    span.className = span.color;
                    this.wrap.appendChild(span);
                    this.dots[i] = span;
                }
            }
        }
        if(this.currentDots.length!=0){
           this.currentDots = []; 
        }

        if(this.cents > this.bestScore){
            this.bestScore = this.cents;
            this.eBestScore.innerHTML = this.bestScore;
            localStorage.setItem("bestScore",this.bestScore);
        }
        this.pathClear();
        e.preventDefault();
		return false;
        
	},
	onmousemove: function(e){
		if(this.ifDrag){
			e = window.event?window.event:e;
			var _touchX, _touchY;
			if(!!e.touches){
				_touchX = e.touches[0].pageX;
				_touchY = e.touches[0].pageY;
			}else{
				_touchX = e.clientX;
				_touchY = e.clientY;
			}
			var _left = _touchX - this.wrapLeft;
			var _top = _touchY - this.wrapTop;
			this.update(_left,_top,e);
			return false;
		}
        e.preventDefault();
		return false;
	},
	update: function(disLeft,disTop, e){
		//disLeft/
        
        var target, dotIndex;
        dotIndex = this.getDotsIndexByPosition(disLeft, disTop);
        console.debug(this.currentDots.length);
        if(this.currentDots.length==0){
            this.currentDots.push(dotIndex);
            target = this.dots[dotIndex];
            this.currentColor = target.color;
            $(target).addClass('selected');
            this.pathStart(dotIndex);
        }else if(dotIndex == this.currentDots[this.currentDots.length-1]){
            return;
        }else{
            if(this.dots[dotIndex].color != this.currentColor){ 
                console.debug('the color is not same!');
                return; 
            }
            
            for(var i=0, len = this.currentDots.length; i<len ; i++){
                if(dotIndex==this.currentDots[i]){
                    return;
                }
            }
            var oldIndex = this.currentDots[this.currentDots.length-1];
            var dis = Math.abs(oldIndex - dotIndex);
            if(dis==this.colMax||dis==1){
                target = this.dots[dotIndex];
                this.currentDots.push(dotIndex);
                $(target).addClass('selected');
                this.pathDraw(dotIndex);
            }
        }
	},
    pathStart: function(dotIndex){
        var pos = this.getPosition2(dotIndex);
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(pos.left, pos.top);
    },
    pathDraw: function(dotIndex){
        var pos = this.getPosition2(dotIndex);
        this.canvasContext.lineTo(pos.left, pos.top);
        this.canvasContext.stroke();
    },
    pathClear: function(){
        this.canvasContext.clearRect(0,0,this.width, this.height);
    },
	restart:function(){
		//create the dots
        this.cents = 0;
        this.eCentNum.innerHTML = 0;
        this.vanishedDotsCount = 0;
        this.eDotsNum.innerHTML = 0;
		$("span", this.wrap).remove();
		var span, pos;
		for(var i=0; i<this.lineMax; i++){
			for(var j=0; j<this.colMax; j++){
				span = document.createElement("SPAN");
				pos = this.getPosition(i,j);
				span.style.left = pos.left + 'px';
				span.style.top = pos.top + 'px';
				span.color = this.createColor();
				span.className = span.color;
				this.wrap.appendChild(span);
				this.dots[i*this.colMax+j] = span;
			}
		}
	}
};

var dotGame = new DotGame();
