(function ($hx_exports) { "use strict";
var $hxClasses = {};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,__class__: EReg
};
var IMap = function() { };
$hxClasses["IMap"] = IMap;
IMap.__name__ = true;
Math.__name__ = true;
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = true;
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var ValueType = { __ename__ : true, __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = true;
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c;
		if((v instanceof Array) && v.__enum__ == null) c = Array; else c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var UseRouter = function() { };
$hxClasses["UseRouter"] = UseRouter;
UseRouter.__name__ = true;
UseRouter.main = function() {
	var router = new routerhx.Router();
	var header = window.document.getElementById("header");
	var footer = window.document.getElementById("footer");
	var sub_header = window.document.getElementById("sub-header");
	var sub_footer = window.document.getElementById("sub-footer");
	var global_before_end = window.document.getElementById("event-dispatch-global-before");
	var global_after_end = window.document.getElementById("event-dispatch-global-after");
	var before_end = window.document.getElementById("event-dispatch-before");
	var after_end = window.document.getElementById("event-dispatch-after");
	router.setBefore(function() {
		header.innerHTML = "";
		footer.innerHTML = "";
		sub_header.innerHTML = "";
		sub_footer.innerHTML = "";
		global_before_end.innerHTML = "";
		global_after_end.innerHTML = "";
		before_end.innerHTML = "";
		after_end.innerHTML = "";
		header.innerHTML = "global before";
	});
	router.setAfter(function() {
		footer.innerHTML = "global after";
	});
	router.add("/","Greet","index");
	router.add("/index","Greet","index");
	router.add("/greet/<message>","Greet","say");
	router.addCb("/micro",function() {
		var contents = window.document.getElementById("contents");
		contents.innerHTML = "micro";
	});
	router.addCb("/micro/<number>",function(number) {
		var contents1 = window.document.getElementById("contents");
		contents1.innerHTML = "micro" + number;
	});
	router.add("/dispathc1","Greet","dispatch");
	router.addCb("/dispathc2",function() {
	});
	router.addCb("/dynamic",function() {
		var contents2 = window.document.getElementById("contents");
		contents2.innerHTML = "dynamic";
	});
	router.addCb("/404",function() {
		var contents3 = window.document.getElementById("contents");
		contents3.innerHTML = "not found";
	});
	window.addEventListener("globalBeforeEnd",function(e) {
		global_before_end.innerHTML = "global before dispatched";
	});
	window.addEventListener("globalAfterEnd",function(e1) {
		global_after_end.innerHTML = "global after dispatched";
	});
	window.addEventListener("beforeEnd",function(e2) {
		before_end.innerHTML = "before dispatched";
	});
	window.addEventListener("afterEnd",function(e3) {
		after_end.innerHTML = "after dispatched";
	});
	router.raisePushState("a","click","href");
	router.run("/dynamic");
};
var Greet = function() { };
$hxClasses["Greet"] = Greet;
Greet.__name__ = true;
Greet.prototype = {
	before: function() {
		var sub_header = window.document.getElementById("sub-header");
		sub_header.innerHTML = "local before";
	}
	,index: function() {
		var contents = window.document.getElementById("contents");
		contents.innerHTML = "index";
	}
	,say: function(message) {
		var contents = window.document.getElementById("contents");
		contents.innerHTML = message;
	}
	,dispatch: function() {
	}
	,after: function() {
		var sub_footer = window.document.getElementById("sub-footer");
		sub_footer.innerHTML = "local after";
	}
	,__class__: Greet
};
var haxe = {};
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,__class__: haxe.ds.StringMap
};
var js = {};
js.Boot = function() { };
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = true;
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
var routerhx = {};
routerhx.Router = $hx_exports.RouterHx = function(options) {
	this.window = window;
	this.routes = [];
	this.route_objects = new haxe.ds.StringMap();
	if(Type["typeof"](options) != ValueType.TNull) this.options = options; else this.options = { class_path_prefix : "", notfound_path : "/404"};
	if(!(Type["typeof"](this.window.history) != ValueType.TNull && Type["typeof"](($_=this.window.history,$bind($_,$_.pushState))) != ValueType.TNull?true:false)) throw "unusable push state this browser.";
	routerhx.RouterEvent.init();
	this._setPopState();
};
$hxClasses["routerhx.Router"] = routerhx.Router;
routerhx.Router.__name__ = true;
routerhx.Router.main = function() {
};
routerhx.Router.prototype = {
	add: function(url,class_path,method_name) {
		url = StringTools.replace(url,"/","\\/");
		this.routes.push({ url_pattern : new EReg("^" + routerhx.Router.ROUTE_REGEX.replace(url,"([^\\/]+)") + "$",""), class_path : class_path, method_name : method_name});
	}
	,addCb: function(url,cb) {
		url = StringTools.replace(url,"/","\\/");
		this.routes.push({ url_pattern : new EReg("^" + routerhx.Router.ROUTE_REGEX.replace(url,"([^\\/]+)") + "$",""), cb : cb});
	}
	,setBefore: function(cb) {
		this.before = cb;
	}
	,setAfter: function(cb) {
		this.after = cb;
	}
	,run: function(uri,from_pop_state,notfound_uri) {
		if(Type["typeof"](uri) == ValueType.TNull) uri = window.location.pathname;
		var _g = 0;
		var _g1 = this.routes;
		while(_g < _g1.length) {
			var route = _g1[_g];
			++_g;
			if(true == route.url_pattern.match(uri)) {
				if(Type["typeof"](this.before) != ValueType.TNull) {
					this.before();
					this.window.dispatchEvent(routerhx.RouterEvent.eventGlobalBeforeEnd);
				}
				if(Type["typeof"](route.cb) != ValueType.TNull) {
					route.cb.apply(this,this._includeParams(route.url_pattern));
					this.window.dispatchEvent(routerhx.RouterEvent.eventMainEnd);
				} else if(Type["typeof"](route.class_path) != ValueType.TNull) {
					var _g2 = 0;
					var _g3 = ["before",route.method_name,"after"];
					while(_g2 < _g3.length) {
						var method_name = _g3[_g2];
						++_g2;
						this._execObj(route.url_pattern,route.class_path,method_name);
					}
				}
				if(Type["typeof"](this.after) != ValueType.TNull) {
					this.after();
					this.window.dispatchEvent(routerhx.RouterEvent.eventGlobalAfterEnd);
				}
				if(!from_pop_state) {
					if(Type["typeof"](notfound_uri) == ValueType.TNull) this.window.history.pushState("","",uri); else this.window.history.pushState("","",notfound_uri);
				}
				return;
			}
		}
		this.run(this.options.notfound_path,false,uri);
	}
	,raisePushState: function(targetSelector,fire,uriAttr,bindElement) {
		var _g1 = this;
		var targets;
		if(Type["typeof"](bindElement) == ValueType.TNull) targets = window.document.querySelectorAll(targetSelector); else targets = bindElement.querySelectorAll(targetSelector);
		var _g = 0;
		while(_g < targets.length) {
			var target = targets[_g];
			++_g;
			var target1 = [js.Boot.__cast(target , Element)];
			target1[0].addEventListener(fire,(function(target1) {
				return function(e) {
					_g1.run(target1[0].getAttribute(uriAttr));
					e.preventDefault();
				};
			})(target1));
		}
	}
	,_getDefaultOptions: function() {
		return { class_path_prefix : "", notfound_path : "/404"};
	}
	,_setPopState: function() {
		var _g = this;
		this.window.addEventListener("popstate",function(e) {
			if(Type["typeof"](e.state) != ValueType.TNull) _g.run(window.location.pathname,true);
		});
	}
	,_setPushState: function(uri) {
		this.window.history.pushState("","",uri);
	}
	,_includeParams: function(regex) {
		var params = [];
		var param_count = regex.r.m.length;
		if(Type["typeof"](param_count) == ValueType.TNull) param_count = 0; else param_count = js.Boot.__cast(param_count , Int);
		if(param_count > 0) {
			var _g = 1;
			while(_g < param_count) {
				var i = _g++;
				params.push(regex.matched(i));
			}
		}
		return params;
	}
	,_checkUsablePushState: function() {
		if(Type["typeof"](this.window.history) != ValueType.TNull && Type["typeof"](($_=this.window.history,$bind($_,$_.pushState))) != ValueType.TNull) return true; else return false;
	}
	,_execCb: function(url_pattern,cb) {
		cb.apply(this,this._includeParams(url_pattern));
		this.window.dispatchEvent(routerhx.RouterEvent.eventMainEnd);
	}
	,_execObj: function(url_pattern,class_path,method) {
		var path = this.options.class_path_prefix + class_path;
		if(!this.route_objects.exists(path)) {
			var cls = Type.resolveClass(class_path);
			var value = Type.createInstance(cls,[]);
			this.route_objects.set(path,value);
		}
		var obj = this.route_objects.get(path);
		if(Type["typeof"](Reflect.getProperty(obj,method)) == ValueType.TFunction) {
			Reflect.callMethod(obj,Reflect.field(obj,method),this._includeParams(url_pattern));
			switch(method) {
			case "before":
				this.window.dispatchEvent(routerhx.RouterEvent.eventBeforeEnd);
				break;
			case "after":
				this.window.dispatchEvent(routerhx.RouterEvent.eventAfterEnd);
				break;
			default:
				this.window.dispatchEvent(routerhx.RouterEvent.eventMainEnd);
			}
		}
	}
	,_getDynamicClassForJs: function(class_path) {
		var cls = window;
		var _g = 0;
		var _g1 = class_path.split(".");
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			if(Type["typeof"](cls[part]) == ValueType.TNull) throw "class " + part + " not found.";
			cls = cls[part];
		}
		return cls;
	}
	,__class__: routerhx.Router
};
routerhx.RouterEvent = function() { };
$hxClasses["routerhx.RouterEvent"] = routerhx.RouterEvent;
routerhx.RouterEvent.__name__ = true;
routerhx.RouterEvent.init = function() {
	routerhx.RouterEvent.eventGlobalBeforeEnd = window.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventGlobalBeforeEnd.initEvent("globalBeforeEnd",false,true);
	routerhx.RouterEvent.eventGlobalAfterEnd = window.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventGlobalAfterEnd.initEvent("globalAfterEnd",false,true);
	routerhx.RouterEvent.eventBeforeEnd = window.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventBeforeEnd.initEvent("beforeEnd",false,true);
	routerhx.RouterEvent.eventAfterEnd = window.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventAfterEnd.initEvent("afterEnd",false,true);
	routerhx.RouterEvent.eventMainEnd = window.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventMainEnd.initEvent("mainEnd",false,true);
};
routerhx.RouterEvent.createGlobalBeforeEnd = function() {
	routerhx.RouterEvent.eventGlobalBeforeEnd = window.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventGlobalBeforeEnd.initEvent("globalBeforeEnd",false,true);
};
routerhx.RouterEvent.createGlobalAfterEnd = function() {
	routerhx.RouterEvent.eventGlobalAfterEnd = window.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventGlobalAfterEnd.initEvent("globalAfterEnd",false,true);
};
routerhx.RouterEvent.createBeforeEnd = function() {
	routerhx.RouterEvent.eventBeforeEnd = window.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventBeforeEnd.initEvent("beforeEnd",false,true);
};
routerhx.RouterEvent.createAfterEnd = function() {
	routerhx.RouterEvent.eventAfterEnd = window.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventAfterEnd.initEvent("afterEnd",false,true);
};
routerhx.RouterEvent.createMainEnd = function() {
	routerhx.RouterEvent.eventMainEnd = window.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventMainEnd.initEvent("mainEnd",false,true);
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = true;
$hxClasses.Array = Array;
Array.__name__ = true;
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
routerhx.Router.BEFORE_METHOD_NAME = "before";
routerhx.Router.AFTER_METHOD_NAME = "after";
routerhx.Router.ROUTE_REGEX = new EReg("<[^/]+>","g");
UseRouter.main();
})(typeof window != "undefined" ? window : exports);
