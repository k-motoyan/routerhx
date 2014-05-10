(function () { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
}
var Reflect = function() { }
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
var Std = function() { }
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
var StringTools = function() { }
StringTools.__name__ = true;
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
var ValueType = { __ename__ : true, __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
Type.__name__ = true;
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
		var c = v.__class__;
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
}
var UseRouter = function() { }
UseRouter.__name__ = true;
UseRouter.main = function() {
	var router = new routerhx.Router(), header = js.Browser.document.getElementById("header"), footer = js.Browser.document.getElementById("footer"), sub_header = js.Browser.document.getElementById("sub-header"), sub_footer = js.Browser.document.getElementById("sub-footer"), global_before_end = js.Browser.document.getElementById("event-dispatch-global-before"), global_after_end = js.Browser.document.getElementById("event-dispatch-global-after"), before_end = js.Browser.document.getElementById("event-dispatch-before"), after_end = js.Browser.document.getElementById("event-dispatch-after"), greet = new Greet();
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
	router.add("/",greet,"index");
	router.add("/index",greet,"index");
	router.add("/greet/<message>",greet,"say");
	router.addCb("/micro",function() {
		var contents = js.Browser.document.getElementById("contents");
		contents.innerHTML = "micro";
	});
	router.addCb("/micro/<number>",function(number) {
		var contents = js.Browser.document.getElementById("contents");
		contents.innerHTML = "micro" + number;
	});
	router.add("/dispathc1",greet,"dispatch");
	router.addCb("/dispathc2",function() {
	});
	router.addCb("/dynamic",function() {
		var contents = js.Browser.document.getElementById("contents");
		contents.innerHTML = "dynamic";
	});
	router.addCb("/404",function() {
		var contents = js.Browser.document.getElementById("contents");
		contents.innerHTML = "not found";
	});
	js.Browser.window.addEventListener("globalBeforeEnd",function(e) {
		global_before_end.innerHTML = "global before dispatched";
	});
	js.Browser.window.addEventListener("globalAfterEnd",function(e) {
		global_after_end.innerHTML = "global after dispatched";
	});
	js.Browser.window.addEventListener("beforeEnd",function(e) {
		before_end.innerHTML = "before dispatched";
	});
	js.Browser.window.addEventListener("afterEnd",function(e) {
		after_end.innerHTML = "after dispatched";
	});
	router.raisePushState("a","click","href");
	router.run("/dynamic");
}
var Greet = function() {
};
Greet.__name__ = true;
Greet.prototype = {
	after: function() {
		var sub_footer = js.Browser.document.getElementById("sub-footer");
		sub_footer.innerHTML = "local after";
	}
	,dispatch: function() {
	}
	,say: function(message) {
		var contents = js.Browser.document.getElementById("contents");
		contents.innerHTML = message;
	}
	,index: function() {
		var contents = js.Browser.document.getElementById("contents");
		contents.innerHTML = "index";
	}
	,before: function() {
		var sub_header = js.Browser.document.getElementById("sub-header");
		sub_header.innerHTML = "local before";
	}
	,__class__: Greet
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = true;
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
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
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
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
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
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Browser = function() { }
js.Browser.__name__ = true;
var routerhx = {}
routerhx.Router = function(options) {
	this.window = js.Browser.window;
	this.routes = [];
	this.options = Type["typeof"](options) != ValueType.TNull?options:{ notfound_path : "/404"};
	if(!(Type["typeof"](this.window.history) != ValueType.TNull && Type["typeof"](($_=this.window.history,$bind($_,$_.pushState))) != ValueType.TNull?true:false)) throw "unusable push state this browser.";
	routerhx.RouterEvent.init();
	this._setPopState();
};
$hxExpose(routerhx.Router, "RouterHx");
routerhx.Router.__name__ = true;
routerhx.Router.main = function() {
}
routerhx.Router.prototype = {
	_execObj: function(url_pattern,obj,method) {
		if(Type["typeof"](Reflect.getProperty(obj,method)) == ValueType.TFunction) {
			Reflect.field(obj,method).apply(obj,this._includeParams(url_pattern));
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
	,_execCb: function(url_pattern,cb) {
		cb.apply(this,this._includeParams(url_pattern));
		this.window.dispatchEvent(routerhx.RouterEvent.eventMainEnd);
	}
	,_checkUsablePushState: function() {
		return Type["typeof"](this.window.history) != ValueType.TNull && Type["typeof"](($_=this.window.history,$bind($_,$_.pushState))) != ValueType.TNull?true:false;
	}
	,_includeParams: function(regex) {
		var params = [];
		var param_count = regex.r.m.length;
		param_count = Type["typeof"](param_count) == ValueType.TNull?0:js.Boot.__cast(param_count , Int);
		if(param_count > 0) {
			var _g = 1;
			while(_g < param_count) {
				var i = _g++;
				params.push(regex.matched(i));
			}
		}
		return params;
	}
	,_setPushState: function(uri) {
		this.window.history.pushState("","",uri);
	}
	,_setPopState: function() {
		var _g = this;
		this.window.addEventListener("popstate",function(e) {
			if(Type["typeof"](e.state) != ValueType.TNull) _g.run(js.Browser.location.pathname,true);
		});
	}
	,_getDefaultOptions: function() {
		return { notfound_path : "/404"};
	}
	,raisePushState: function(targetSelector,fire,uriAttr,bindElement) {
		var _g1 = this;
		var targets = Type["typeof"](bindElement) == ValueType.TNull?js.Browser.document.querySelectorAll(targetSelector):bindElement.querySelectorAll(targetSelector);
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
	,run: function(uri,from_pop_state,notfound_uri) {
		if(from_pop_state == null) from_pop_state = false;
		if(Type["typeof"](uri) == ValueType.TNull) uri = js.Browser.location.pathname;
		var _g = 0, _g1 = this.routes;
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
				} else if(Type["typeof"] != route.object) {
					var _g2 = 0, _g3 = ["before",route.method_name,"after"];
					while(_g2 < _g3.length) {
						var method_name = _g3[_g2];
						++_g2;
						this._execObj(route.url_pattern,route.object,method_name);
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
	,setAfter: function(cb) {
		this.after = cb;
	}
	,setBefore: function(cb) {
		this.before = cb;
	}
	,addCb: function(url,cb) {
		url = StringTools.replace(url,"/","\\/");
		this.routes.push({ url_pattern : new EReg("^" + routerhx.Router.ROUTE_REGEX.replace(url,"([^\\/]+)") + "$",""), cb : cb});
	}
	,add: function(url,object,method_name) {
		url = StringTools.replace(url,"/","\\/");
		this.routes.push({ url_pattern : new EReg("^" + routerhx.Router.ROUTE_REGEX.replace(url,"([^\\/]+)") + "$",""), object : object, method_name : method_name});
	}
	,__class__: routerhx.Router
}
routerhx.RouterEvent = function() { }
routerhx.RouterEvent.__name__ = true;
routerhx.RouterEvent.init = function() {
	routerhx.RouterEvent.eventGlobalBeforeEnd = js.Browser.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventGlobalBeforeEnd.initEvent("globalBeforeEnd",false,true);
	routerhx.RouterEvent.eventGlobalAfterEnd = js.Browser.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventGlobalAfterEnd.initEvent("globalAfterEnd",false,true);
	routerhx.RouterEvent.eventBeforeEnd = js.Browser.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventBeforeEnd.initEvent("beforeEnd",false,true);
	routerhx.RouterEvent.eventAfterEnd = js.Browser.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventAfterEnd.initEvent("afterEnd",false,true);
	routerhx.RouterEvent.eventMainEnd = js.Browser.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventMainEnd.initEvent("mainEnd",false,true);
}
routerhx.RouterEvent.createGlobalBeforeEnd = function() {
	routerhx.RouterEvent.eventGlobalBeforeEnd = js.Browser.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventGlobalBeforeEnd.initEvent("globalBeforeEnd",false,true);
}
routerhx.RouterEvent.createGlobalAfterEnd = function() {
	routerhx.RouterEvent.eventGlobalAfterEnd = js.Browser.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventGlobalAfterEnd.initEvent("globalAfterEnd",false,true);
}
routerhx.RouterEvent.createBeforeEnd = function() {
	routerhx.RouterEvent.eventBeforeEnd = js.Browser.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventBeforeEnd.initEvent("beforeEnd",false,true);
}
routerhx.RouterEvent.createAfterEnd = function() {
	routerhx.RouterEvent.eventAfterEnd = js.Browser.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventAfterEnd.initEvent("afterEnd",false,true);
}
routerhx.RouterEvent.createMainEnd = function() {
	routerhx.RouterEvent.eventMainEnd = js.Browser.document.createEvent("CustomEvent");
	routerhx.RouterEvent.eventMainEnd.initEvent("mainEnd",false,true);
}
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
js.Browser.location = typeof window != "undefined" ? window.location : null;
routerhx.Router.BEFORE_METHOD_NAME = "before";
routerhx.Router.AFTER_METHOD_NAME = "after";
routerhx.Router.ROUTE_REGEX = new EReg("<[^/]+>","g");
UseRouter.main();
function $hxExpose(src, path) {
	var o = typeof window != "undefined" ? window : exports;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();
