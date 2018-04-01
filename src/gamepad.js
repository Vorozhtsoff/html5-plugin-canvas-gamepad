import font from './font';
var bit = font;

var CanvasGamepad = (function(){
	/*
	** @param canvas {object}
	*/
	var canvas;

	/*
	** @param ctx {context}
	*/
	var ctx;

	/*
	** @param px {int}
	** @param py {int}
	*/
	var px = 0;
	var py = 0;

	var width = window.innerWidth;
	var height = window.innerHeight;

	/*
	** @param scale {array}
	*/
	var scale = [
		(window.innerWidth/width),
		(window.innerHeight/height)
	];

	/*
	**
	*/

	/*
	** @param bit {object}
	** @description 8 bit font used in application
	*/
	var font = {}


	/*
	**
	*/
	var touches = {};
	var map = {};

  /*
  ** @param toggle {boolean}
  */
  var toggle = false;

  /*
  ** @param ready {boolean}
  */
  var ready = false;

  /*
  ** @param hint {boolean}
  */
  var hint = false;

	/*
	** @param debug {boolean}
	*/
	var debug = false;
	/*
	** @param debug {boolean}
	*/
	var trace = false;

	/*
	** @param hidden {boolean}
	*/
	var hidden = false;

	/*
	** @param position {string}
	** @description
	** TOP_LEFT | TOP_RIGHT | BOTTOM_LEFT | BOTTOM_RIGHT
	*/
	var layout = "BOTTOM_RIGHT";



	/*
	** @param radius {int}
	*/
	var radius = 25;

	/*
	** @param opacity {float} (0.0 -> 1.0)
	** @description opacity
	*/
	var opacity = 0.4;

	/*
	** @param colors {object}
	** @description color collection used in app in rgba format
	*/
	var colors = {
		red:"rgba(255,0,0," + opacity +")",
		green:"rgba(0,255,0," + opacity +")",
		blue:"rgba(0,0,255," + opacity +")",
		purple:"rgba(255,0,255," + opacity +")",
		yellow:"rgba(255,255,0," + opacity +")",
		cyan:"rgba(0,255,255," + opacity +")",
		black:"rgba(0,0,0," + opacity +")",
		white:"rgba(255,255,255," + opacity +")",
		joystick:{
			base:"rgba(0,0,0," + opacity +")",
			dust:"rgba(0,0,0," + opacity +")",
			stick:"rgba(204,204,204,1)",
			ball:"rgba(255,255,255,1)"
		}
	}

	/*
	** @param buttons {int}
	*/
	var buttons = 0;

	/*
	** @param buttons_layout {array}
	*/
	var buttons_layout = [
		[
			{x:0,y:0,r:radius,color:colors.red,name:"a"}
		],
		[
			{x:-(radius/4),y:radius+(radius/2),r:radius,color:colors.red,name:"a"},
			{x:(radius+(radius/0.75)),y:-radius+(radius/2),r:radius,color:colors.green,name:"b"}
		],
		[
			{x:-radius*0.75,y:radius*2,r:radius,color:colors.red,name:"a"},
			{x:radius*1.75,y:radius,r:radius,color:colors.green,name:"b"},
			{x:radius*3.5,y:-radius,r:radius,color:colors.blue,name:"c"}
		],
		[
			{x:-radius,y:radius,r:radius,color:colors.red,name:"a"},
			{x:radius*2-radius,y:-(radius+(radius))+radius,r:radius,color:colors.green,name:"b"},
			{x:radius*2-radius,y:(radius+radius)+radius,r:radius,color:colors.blue,name:"x"},
			{x:radius*3,y:0+radius,r:radius,color:colors.purple,name:"y"}
		]
	];
	/*
	** @param button_offset {object}
	*/
	var button_offset = {x:(radius*3),y:(radius*3)};
	/*
	** @param buttons_layout_built {boolean}
	*/
	var buttons_layout_built = false;

	/*
	** @param start {boolean}
	*/
	var start = true;
	var start_button = {x:width/2,y:-15,w:50,h:15,color:colors.black,name:"start"};

	/*
	** @param start {boolean}
	*/
	var select = false;
	var select_button = {x:width/2,y:-15,w:50,h:15,color:colors.black,name:"select"};

	/*
	** @param hidden {boolean}
	*/
	var joystick = true;

 	/*
	** @method setup
	** @description
	*/
	function setup(config)
	{
		document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
		css();
		var length = 0;
		for(var prop in config){if(config.hasOwnProperty(prop)){length++;}}
		if(length > 0)
		{
			config.canvas ? stage.assign(config.canvas) : stage.create();
			for(var prop in config)
			{
				switch(prop)
				{
					case "debug":
					case "trace":
					case "layout":
					case "start":
					case "select":
					case "hidden":
					case "joystick":
					case "hint":
						switch(typeof config[prop])
						{
							case "string":
								eval(prop + "='" + config[prop] + "'");
							break;
							case "boolean":
							case "number":
								eval(prop + "=" + config[prop]);
							break;
							case "object":
								switch(prop)
								{
									case "start":
									case "select":
										eval(prop + "=" + true);
										eval(prop + "_button.key=\"" + config[prop].key + "\"");
									break;
								}
							break;
						}
					break;
					case "buttons":
						buttons = config[prop].length - 1;
						if(config[prop].length > buttons_layout.length){buttons = buttons_layout.length-1}
						buttons_layout = buttons_layout[buttons];
						for(var n = 0; n < buttons + 1; n++)
						{
							var button = config[prop][n];
							if(button.name){buttons_layout[n].name = button.name;};
							if(button.color){buttons_layout[n].color = button.color;};
							if(button.key){buttons_layout[n].key = button.key;};
							buttons_layout_built = true;
						}
					break;
				}
			}
		}
		/*
		** @description default setting
		*/
		else
		{
			stage.create();
		}
		if(!buttons_layout_built){buttons_layout = buttons_layout[buttons];};

		if(start){buttons_layout.push(start_button)};
		if(select){buttons_layout.push(select_button)};

		events.bind();
		controller.init();
		init();
	}

 	/*
	** @method setup
	** @description
	*/
	function init()
	{
		/*
		** show loading
		*/
		ctx.fillStyle = "rgba(0,0,0,0.5)";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = bit.small;
		ctx.fillText("loading", width/2, height/2);
		if(joystick){controller.stick.draw();}
		controller.buttons.draw();
		setTimeout(function(){ready = true;},250);
	};

 	/*
	** @method setup
	** @description
	*/
	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if(!hidden)
		{
			if(debug){helper.debug();};
			if(trace){helper.trace();};
			if(joystick){controller.stick.draw();}
			controller.buttons.draw();
		}
	};

	/*
	** @property stage {object}
	** @description used to create and assign canvas object
	*/
	var stage = {
		create:function(id)
		{
			var id = id || "CanvasGamepad";
			canvas = document.createElement('canvas');
			canvas.setAttribute("id", id);
			document.body.appendChild(canvas);
			stage.assign(id)
		},
		assign:function(id)
		{
			if(!document.getElementById(id)){stage.create(id);}
			canvas = document.getElementById(id);
			stage.adjust();
		},
		adjust:function()
		{
			ctx = canvas.getContext('2d');
			ctx.canvas.width = width*scale[0];
			ctx.canvas.height = height*scale[1];
			ctx.scale(scale[0], scale[1]);
		}
	};

	/*
	** @property controller {object}
	** @description used to draw the controller
	*/
	var controller = {
		init:function()
		{
			var layout_string = layout;
			layout = {x:0,y:0};
			switch(layout_string)
			{
				case "TOP_LEFT":
					var shift = 0;
					for(var n = 0; n < buttons_layout.length; n++)
					{
						if(buttons_layout[n].r)
						{
							shift += buttons_layout[n].r;
							buttons_layout[n].y -= buttons_layout[n].r*2;
						}
					}
					layout.x = shift + button_offset.x;
					layout.y = 0 + button_offset.y;
				break;
				case "TOP_RIGHT":
					layout.x = width - button_offset.x;
					layout.y = 0 + button_offset.y;
				break;
				case "BOTTOM_LEFT":
					var shift = 0;
					for(var n = 0; n < buttons_layout.length; n++)
					{
						if(buttons_layout[n].r)
						{
							shift += buttons_layout[n].r
						}
					}
					layout.x = shift + button_offset.x;
					layout.y = height - button_offset.y;
				break;
				case "BOTTOM_RIGHT":
					layout.x = width - button_offset.x;
					layout.y = height - button_offset.y;
				break;
			}

			controller.buttons.init();
			if(joystick){controller.stick.init();}
		},
		buttons:{
			init:function()
			{
				for(var n = 0; n < buttons_layout.length; n++)
				{
					var button = buttons_layout[n];
					var x = layout.x - button.x;
					var y = layout.y - button.y;
					if(button.r)
					{
						var r = button.r;
						buttons_layout[n]["hit"] = {x:[x-r, x+(r*2)], y:[y-r, y+(r*2)], active:false};
					}
					else
					{
						button.x = width/2 - (button.w);
						if(start && select)
						{
							switch(button.name)
							{
								case "select":
									button.x = width/2 - (button.w) - (button.h*2);
								break;
								case "start":
									button.x = width/2;
								break;
							}
						}
						var x = button.x;
						var y = layout.y - button.y;
						buttons_layout[n]["hit"] = {x:[x, x+button.w], y:[y, y+button.h], active:false};
					}
					map[button.name] = 0;
				}
			},
			draw:function()
			{
				for(var n = 0; n < buttons_layout.length; n++)
				{
					var button = buttons_layout[n];
					var name = button.name;
					var color = button.color;

					var x = layout.x - button.x;
					var y = layout.y - button.y;
					button.dx = x;
					button.dy = y;

					if(button.r)
					{
						var r = button.r;

						if(button.hit)
						{
							if(button.hit.active)
							{
								ctx.fillStyle = color;
								ctx.beginPath();
								ctx.arc(x, y, r+5, 0, 2 * Math.PI, false);
								ctx.fill();
								ctx.closePath();
							}
						}

						ctx.fillStyle = color;
						ctx.beginPath();
						ctx.arc(x, y, r, 0, 2 * Math.PI, false);
						ctx.fill();
						ctx.closePath();
						ctx.strokeStyle=color;
						ctx.lineWidth = 2;
						ctx.stroke();

						ctx.fillStyle = "rgba(255,255,255,1)";
						ctx.textAlign = "center";
						ctx.textBaseline = "middle";
						ctx.font = bit.button;
						ctx.fillText(button.name, x, y);
					}
					else
					{
						var w = button.w;
						var h = button.h;
						var x = button.x;
						var y = button.dy;
						var r = 10;
						ctx.fillStyle = color;
						if(button.hit)
						{
							if(button.hit.active)
							{
								ctx.roundRect(x-5, y-5, w+10, h+10, r*2).fill();
							}
						}
						ctx.roundRect(x, y, w, h, r).fill();
						ctx.strokeStyle=color;
						ctx.lineWidth = 2;
						ctx.stroke();
						ctx.fillStyle = "rgba(0,0,0,0.5)";
						ctx.textAlign = "center";
						ctx.textBaseline = "middle";
						ctx.font = bit.button;
						ctx.fillText(button.name, x+w/2, y+(h*2));
					}

					if(button.key && hint)
					{
						ctx.fillStyle = "rgba(0,0,0,0.25)";
						ctx.textAlign = "center";
						ctx.textBaseline = "middle";
						ctx.font = bit.button;
						if(button.name == "start" || button.name == "select")
						{
							x += w/2
						}
						ctx.fillText(button.key, x, y-(r*1.5));
					}
				}
			},
			state:function(id, n, type)
			{
				if(touches[id].id != "stick")
				{
					var touch = {
						x:touches[id].x,
						y:touches[id].y
					};
					var button = 	buttons_layout[n];
					var name = button.name;

					var dx = parseInt(touch.x - button.dx);
 					var dy = parseInt(touch.y - button.dy);
 					var dist = width;
 					if(button.r)
 					{
 						dist = parseInt(Math.sqrt(dx*dx + dy*dy));
 					}
 					else
 					{
						if(touch.x > button.hit.x[0] && touch.x < button.hit.x[1] && touch.y > button.hit.y[0] && touch.y < button.hit.y[1])
						{
							dist = 0;
						}
 					}
 					if(dist < radius && touches[id].id != "stick")
 					{
						if(!type)
						{
							touches[id].id = name;
						}
						else
						{
							switch(type)
							{
								case "mousedown":
									touches[id].id = name;
								break;
								case "mouseup":
									delete touches[id].id;
									controller.buttons.reset(n);
								break;
							}
						}
 					}
					if(touches[id].id == name)
 					{
 						map[name] = 1;
 						button.hit.active = true;
 						if(dist > radius)
 						{
 							button.hit.active = false;
 							map[name] = 0;
 							delete touches[id].id	;
 						}
 					}
				}
			},
			reset:function(n)
			{
				var button = 	buttons_layout[n];
				var name = button.name;
				button.hit.active = false;
				map[name] = 0;
			}
		},
		stick:{
			radius:40,
			x:0,
			y:0,
			dx:0,
			dy:0,
			init:function()
			{
				this.radius = 40;
				this.x = (width) - (layout.x);
				this.y = layout.y;
				this.dx = this.x;
				this.dy = this.y;
				map["x-dir"] = 0;
				map["y-dir"] = 0;
				map["x-axis"] = 0;
				map["y-axis"] = 0;
			},
			draw:function()
			{
				ctx.fillStyle = colors.joystick.base;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();

				ctx.fillStyle = colors.joystick.dust;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius-5, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();

				ctx.fillStyle = colors.joystick.stick;
				ctx.beginPath();
				ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();

				ctx.fillStyle = colors.joystick.ball;
				ctx.beginPath();
				ctx.arc(this.dx, this.dy, this.radius-10, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			},
			state:function(id, type)
			{
				var touch = {
					x:touches[id].x,
					y:touches[id].y
				};
				var dx = parseInt(touch.x - this.x);
				var dy = parseInt(touch.y - this.y);
				var dist = (parseInt(Math.sqrt(dx*dx + dy*dy)));
				if(dist < (this.radius*1.5))
				{
					if(!type)
					{
						touches[id].id = "stick";
					}
					else
					{
						switch(type)
						{
							case "mousedown":
								touches[id].id = "stick";
							break;
							case "mouseup":
								delete touches[id].id;
								controller.stick.reset();
							break;
						}
					}
				}
				if(touches[id].id == "stick")
				{
					if(Math.abs(parseInt(dx)) < (this.radius/2)){this.dx = this.x + dx;}
					if(Math.abs(parseInt(dy)) < (this.radius/2)){this.dy = this.y + dy;}
					map["x-axis"] = (this.dx - this.x)/(this.radius/2);
					map["y-axis"] = (this.dy - this.y)/(this.radius/2);
					map["x-dir"] = Math.round(map["x-axis"]);
					map["y-dir"] = Math.round(map["y-axis"]);

					if(dist > (this.radius*1.5))
					{
						controller.stick.reset();
						delete touches[id].id;
					}
				}
			},
			reset:function()
			{
				this.dx = this.x;
				this.dy = this.y;
				map["x-dir"] = 0;
				map["y-dir"] = 0;
				map["x-axis"] = 0;
				map["y-axis"] = 0;
			}
		}
	}


	/*
	**
	*/
	var events = {
		bind:function()
		{
			var ev = {
				browser:["mousedown", "mouseup", "mousemove"],
				app:["touchstart", "touchend", "touchmove"]
			}
			ev = (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) ?
			ev.app :
			ev.browser;
			for(var e in ev)
			{
				canvas.addEventListener(ev[e], CanvasGamepad.events, false);
			}
		},
		listen:function(e)
		{
			if(e.type)
			{
				var type = e.type;
				if(e.type.indexOf("mouse") != -1)
				{
					e.identifier = "desktop";
					e = {touches:[e]}
				}
				for(var n = 0; n < (e.touches.length > 5 ? 5 : e.touches.length); n++)
				{
					var id = e.touches[n].identifier;
					if(!touches[id])
					{
						touches[id] = {
							x:e.touches[n].pageX,
							y:e.touches[n].pageY
						}
					}
					else
					{
						touches[id].x = e.touches[n].pageX;
						touches[id].y = e.touches[n].pageY;
					}
				}

				/*
				**
				*/
				for(var id in touches)
				{
					switch(type)
					{
						case "touchstart":
						case "touchmove":
							controller.stick.state(id);
							for(var n = 0; n < buttons_layout.length; n++)
							{
								controller.buttons.state(id, n);
							}
						break;
						case "mousedown":
						case "mousemove":
						case "mouseup":
							controller.stick.state(id, type);
							for(var n = 0; n < buttons_layout.length; n++)
							{
								controller.buttons.state(id, n, type);
							}
						break;
					}
				}

				/*
				** @description remove touchend from touches
				*/
				if(e.type == "touchend")
				{
					var id = e.changedTouches[0].identifier;
					if(touches[id].id == "stick"){controller.stick.reset();}
					for(var n = 0; n < buttons_layout.length; n++)
					{
						if(touches[id].id == buttons_layout[n].name)
						{
							controller.buttons.reset(n);
						}
					}
					if(touches[id]){delete touches[id];}

					if(e.changedTouches.length > e.touches.length)
					{
						var length = 0;
						var delta = e.changedTouches.length - e.touches.length;
						for(var id in touches)
						{
							if(length >= delta){delete touches[id];};
							length++;
						}
					}
					if(e.touches.length == 0)
					{
						touches = {};
						for(var n = 0; n < buttons_layout.length; n++)
						{
							controller.buttons.reset(n);
						}
						controller.stick.reset();
					}
				}
			}
			else
			{
	      var keys = e;
	      var dir = 0;
				for(var prop in keys)
				{
	        switch(prop)
	        {
	          case "%"://left
	            if(keys[prop]){dir+=1;}
	          break;
	          case "&"://up
	            if(keys[prop]){dir+=2;}
	          break;
	          case "'"://right
	            if(keys[prop]){dir+=4;}
	          break;
	          case "("://down
	            if(keys[prop]){dir+=8;}
	          break;
	          default:
	            if(keys[prop])
              {
                for(var n = 0; n < buttons_layout.length; n++)
                {
                	if(buttons_layout[n].key)
                	{
                		if(buttons_layout[n].key == prop)
                		{
											touches[buttons_layout[n].name] = {id:buttons_layout[n].name, x:buttons_layout[n]["hit"].x[0] + buttons_layout[n].w/2 , y:buttons_layout[n]["hit"].y[0] + buttons_layout[n].h/2};
                			controller.buttons.state(buttons_layout[n].name, n, "mousedown")
                		}
                	}
                }
              }
              else
              {
              	if(!keys[prop])
              	{
              		for(var n = 0; n < buttons_layout.length; n++)
              		{
										if(buttons_layout[n].key)
	                	{
	                		if(buttons_layout[n].key == prop)
	                		{
	                			controller.buttons.reset(n)
	                			delete touches[buttons_layout[n].name];
	                		}
	                	}
              		}
              		delete keys[prop];
              	}
              }
	          break;
	        }
					controller.stick.dx = controller.stick.x;
	        controller.stick.dy = controller.stick.y;
					switch(dir)
	        {
	          case 1://left
	            controller.stick.dx = controller.stick.x-controller.stick.radius/2;
	          break;
	          case 2://up
	            controller.stick.dy = controller.stick.y-controller.stick.radius/2;
	          break;
	          case 3://left up
	            controller.stick.dx = controller.stick.x-controller.stick.radius/2;
	            controller.stick.dy = controller.stick.y-controller.stick.radius/2;
	          break;
	          case 4://right
	            controller.stick.dx = controller.stick.x+controller.stick.radius/2;
	          break;
	          case 6://right up
	            controller.stick.dx = controller.stick.x+controller.stick.radius/2;
	            controller.stick.dy = controller.stick.y-controller.stick.radius/2;
	          break;
	          case 8://down
	            controller.stick.dy = controller.stick.y+controller.stick.radius/2;
	          break;
	          case 9://left down
	            controller.stick.dx = controller.stick.x-controller.stick.radius/2;
	            controller.stick.dy = controller.stick.y+controller.stick.radius/2;
	          break;
	          case 12://right down
	            controller.stick.dx = controller.stick.x+controller.stick.radius/2;
	            controller.stick.dy = controller.stick.y+controller.stick.radius/2;
	          break;
	          default:
	            controller.stick.dx = controller.stick.x;
	            controller.stick.dy = controller.stick.y;
	          break;
	        }
	        if(dir != 0)
	        {
						touches["stick"] = {id:"stick"};
		        controller.stick.state("stick", "mousemove");
	        }
	        else
	        {
	        	controller.stick.reset();
						delete touches["stick"];
	        }
				}
			}

			return events.broadcast();
		},
		broadcast:function()
		{
			return map;
		},
		observe:function()
		{
			return events.broadcast();
		}
	};

	/*
	** @property invert {method}
	** @param color {string}
	** @description invert color
	*/
	function invert(color)
	{

	}


	/*
	** @property helper {object}
	** @description display debug and trace info
	*/
	var helper = {
		debug:function()
		{
			var dy = 15;
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.textAlign = "left";
			ctx.textBaseline = "middle";
			ctx.font = bit.medium;
			ctx.fillText("debug", 10, dy);
			ctx.font = bit.small;
			dy += 5;
			for(var prop in touches)
			{
				dy += 10;
				var text = prop + " : " + JSON.stringify(touches[prop]).slice(1,-1);
				ctx.fillText(text, 10, dy);
			}
		},
		trace:function()
		{
			var dy = 15;
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			ctx.font = bit.medium;
			ctx.fillText("trace", width-10, dy);
			ctx.font = bit.small;
			dy += 5;
			for(var prop in map)
			{
				dy += 10;
				var text = prop + " : " + map[prop];

				ctx.fillText(text, width-10, dy);
			}
		}
	};

	/*
	**
	*/
	function css()
	{
		var style = document.createElement('style');
		style.innerHTML = ""
		+ "\n@font-face {"
		+ "\n\t\tfont-family: 'bit';"
    + "\n\t\tsrc: url(" + bit + ") format('truetype');"
    + "\n\t\tfont-weight: normal;"
    + "\n\t\tfont-style: normal;"
		+ "}"
		+ "\n"
    + "* {"
    + "\n\t\tpadding: 0;"
    + "\n\t\tmargin: 0;"
    + "\n\t\t-webkit-touch-callout: none;"
    + "\n\t\t-webkit-user-select: none;"
    + "}"
    + "\n"
    + "html"
    + "{"
    + "\n\t\t-ms-touch-action: manipulation;"
    + "\n\t\ttouch-action: manipulation;"
    + "\n}"
    + "\n\n"
    + "body"
    + "{"
    + "\n\t\twidth:  100%;"
    + "\n\t\theight: 100%;"
    + "\n\t\tmargin: 0px;  "
    + "\n\t\tpadding:0px; "
    + "\n\t\ttouch-action: none;"
    + "\n\t\t-ms-touch-action: none;"
    + "\n\t\toverflow: hidden;"
    + "\n}"
    + "\n"
    + "canvas"
    + "{"
    + "\n\t\timage-rendering: optimizeSpeed;"
    + "\n\t\timage-rendering: -moz-crisp-edges;"
    + "\n\t\timage-rendering: -webkit-optimize-contrast;"
    + "\n\t\timage-rendering: -o-crisp-edges;"
    + "\n\t\timage-rendering: crisp-edges;"
    + "\n\t\t-ms-interpolation-mode: nearest-neighbor;"
    + "\n\t\t touch-action-delay: none;"
    + "\n\t\ttouch-action: none;"
    + "\n\t\t-ms-touch-action: none;"
    + "\n\t\tposition:fixed;"
    + "\n}"
    + "\n";
		document.head.appendChild(style);

		bit = {
			button:"18px 'bit'",
			small:"12px 'bit'",
			medium:"16px 'bit'",
			large:"24px 'bit'",
			huge:"48px 'bit'"
		}
	};

  /*
  ** @method loop {method}
  ** @description this is the
  */

  (function loop(){
    toggle = toggle ? false : true;
    if(toggle)
    {
      requestAnimationFrame(loop);
      return;
    }
    if(ready){draw();}
    requestAnimationFrame(loop);
  })();

	CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
	  if (w < 2 * r) r = w / 2;
	  if (h < 2 * r) r = h / 2;
	  this.beginPath();
	  this.moveTo(x+r, y);
	  this.arcTo(x+w, y,   x+w, y+h, r);
	  this.arcTo(x+w, y+h, x,   y+h, r);
	  this.arcTo(x,   y+h, x,   y,   r);
	  this.arcTo(x,   y,   x+w, y,   r);
	  this.closePath();
	  return this;
	}

  return {
  	setup:function(config){setup(config);},
		draw:function(){draw();},
		events:function(e){return events.listen(e);},
		observe:function(){return events.observe();}
  };
})();

export default CanvasGamepad;
