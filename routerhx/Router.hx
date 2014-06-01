package routerhx;

import js.Browser;
import js.html.DOMWindow;
import js.html.Element;
import js.html.Event;
import js.html.PopStateEvent;

typedef Route = {
  url_pattern: EReg,
  ?class_path: String,
  ?cb: Dynamic,
  ?method_name: String
}

typedef Options = {
  class_path_prefix: String,
  notfound_path: String
}

/**
 * Router is client side simple routing liblary.
 * usable from haxe or javascript.
 */
@:expose("RouterHx")
class Router {
  static inline var BEFORE_METHOD_NAME = "before";
  static inline var AFTER_METHOD_NAME = "after";
  static var ROUTE_REGEX(null,null) = ~/<[^\/]+>/g;

  var window: DOMWindow;
  var routes: Array<Route>;
  var options: Options;
  var before: Void -> Void;
  var after: Void -> Void;
  var route_objects: Map<String, Dynamic>;

  public function new(?options: Options) {
    window = Browser.window;
    routes = [];
    route_objects = new Map();
    this.options = if (Type.typeof(options) != TNull) options else _getDefaultOptions();
    if (!_checkUsablePushState()) throw "unusable push state this browser.";
    RouterEvent.init();
    _setPopState();
  }

  public function add(url: String, class_path: String, method_name: String): Void {
    url = StringTools.replace(url, "/", "\\/");
    this.routes.push({
      url_pattern: new EReg("^" + ROUTE_REGEX.replace(url, "([^\\/]+)") + "$", ""),
      class_path: class_path,
      method_name: method_name
    });
  }

  public function addCb(url: String, cb: Dynamic): Void {
    url = StringTools.replace(url, "/", "\\/");
    this.routes.push({
      url_pattern: new EReg("^" + ROUTE_REGEX.replace(url, "([^\\/]+)") + "$", ""),
      cb: cb,
    });
  }

  public function setBefore(cb: Void -> Void): Void {
    this.before = cb;
  }

  public function setAfter(cb: Void -> Void): Void {
    this.after = cb;
  }

  public function run(?uri: String, ?from_pop_state: Bool, ?notfound_uri: String): Void {
    if (Type.typeof(uri) == TNull) uri = Browser.location.pathname;

    for (route in routes) {
      if ( true == route.url_pattern.match(uri) ) {
        // execute instance level before action.
        if (Type.typeof(this.before) != TNull) {
          this.before();
          window.dispatchEvent(RouterEvent.eventGlobalBeforeEnd);
        }

        // when execute callback.
        if (Type.typeof(route.cb) != TNull) {
          _execCb(route.url_pattern, route.cb);
        // when execute class method.
        } else if (Type.typeof(route.class_path) != TNull) {
          for (method_name in [BEFORE_METHOD_NAME, route.method_name, AFTER_METHOD_NAME]) {
            _execObj(route.url_pattern, route.class_path, method_name);
          }
        }

        // execute instance level after action.
        if (Type.typeof(this.after) != TNull) {
          this.after();
          window.dispatchEvent(RouterEvent.eventGlobalAfterEnd);
        }

        if (!from_pop_state) if (Type.typeof(notfound_uri) == TNull) _setPushState(uri) else _setPushState(notfound_uri);
        return;
      }
    }
    this.run(options.notfound_path, false, uri);
  }

  public function raisePushState(targetSelector: String, fire: String, uriAttr: String, ?bindElement: Element): Void {
    var targets =
      if (Type.typeof(bindElement) == TNull)
        Browser.document.querySelectorAll(targetSelector) else bindElement.querySelectorAll(targetSelector);
    for (target in targets) {
      var target = cast(target, Element);
      target.addEventListener(fire, function(e: Event) {
        this.run( target.getAttribute(uriAttr) );
        e.preventDefault();
      });
    }
  }

  inline function _getDefaultOptions(): Options {
    return {
      class_path_prefix: "",
      notfound_path: "/404"
    };
  }

  inline function _setPopState(): Void {
    this.window.addEventListener("popstate", function(e: PopStateEvent) {
      if ( Type.typeof(e.state) != TNull ) this.run(Browser.location.pathname, true);
    });
  }

  inline function _setPushState(uri: String): Void {
    this.window.history.pushState("", "", uri);
  }

  inline function _includeParams(regex: EReg): Array<String> {
    var params = [];
    var param_count = untyped regex.r.m.length;
    param_count = if (Type.typeof(param_count) == TNull) 0 else cast(param_count, Int);
    if (param_count > 0) for (i in 1...param_count) params.push( regex.matched(i) );
    return params;
  }

  inline function _checkUsablePushState(): Bool {
    return
      if ( (Type.typeof(this.window.history)           != TNull) &&
           (Type.typeof(this.window.history.pushState) != TNull)    ) true else false;
  }

  inline function _execCb(url_pattern: EReg, cb: Dynamic): Void {
    cb.apply(this, _includeParams(url_pattern));
    window.dispatchEvent(routerhx.RouterEvent.eventMainEnd);
  }

  inline function _execObj(url_pattern: EReg, class_path: String, method: String): Void {
    var path = options.class_path_prefix + class_path;
    if (!route_objects.exists(path)) {
      #if JsStandAlone
        var cls = _getDynamicClassForJs(class_path);
      #else
        var cls = Type.resolveClass(class_path);
      #end
      route_objects.set(path, Type.createInstance(cls, []));
    }

    var obj = route_objects.get(path);
    if ( Type.typeof( Reflect.getProperty(obj, method) ) == TFunction ) {
      Reflect.callMethod( obj, Reflect.field(obj, method), _includeParams(url_pattern) );

      switch (method) {
        case BEFORE_METHOD_NAME: window.dispatchEvent(RouterEvent.eventBeforeEnd);
        case AFTER_METHOD_NAME: window.dispatchEvent(RouterEvent.eventAfterEnd);
        default: window.dispatchEvent(RouterEvent.eventMainEnd);
      }
    }
  }

  inline function _getDynamicClassForJs(class_path: String): Class<Dynamic> {
    var cls: Dynamic = Browser.window;
    for (part in class_path.split(".")) {
      untyped if (Type.typeof(cls[part]) == TNull) throw 'class $part not found.';
      untyped cls = cls[part];
    }
    return cls;
  }

  static function main() {}
}