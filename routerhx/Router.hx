package routerhx;

import js.Browser;
import js.html.DOMWindow;
import js.html.Element;
import js.html.Event;
import js.html.PopStateEvent;

typedef Route = {
    url_pattern : EReg,
    ?object     : Dynamic,
    ?cb         : Dynamic,
    ?method_name: String
}

typedef Options = {
  notfound_path: String
}

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

    public function new(?options: Options = null) {
        this.window = Browser.window;
        this.routes = [];
        this.options = if (Type.typeof(options) != TNull) options else _getDefaultOptions();
        if (!_checkUsablePushState()) throw "unusable push state this browser.";
        RouterEvent.init();
        _setPopState();
    }

    public function add(url: String, object: Dynamic, method_name: String): Void {
        url = StringTools.replace(url, "/", "\\/");
        this.routes.push({
            url_pattern: new EReg("^" + ROUTE_REGEX.replace(url, "([^\\/]+)") + "$", ""),
            object     : object,
            method_name: method_name
        });
    }

    public function addCb(url: String, cb: Dynamic): Void {
        url = StringTools.replace(url, "/", "\\/");
        this.routes.push({
            url_pattern: new EReg("^" + ROUTE_REGEX.replace(url, "([^\\/]+)") + "$", ""),
            cb         : cb,
        });
    }

    public function setBefore(cb: Void -> Void): Void {
        this.before = cb;
    }

    public function setAfter(cb: Void -> Void): Void {
        this.after = cb;
    }

    public function run(?uri: String = null, ?from_pop_state: Bool = false, ?notfound_uri: String): Void {
      if (Type.typeof(uri) == TNull) uri = Browser.location.pathname;

      for (route in this.routes) {
        if ( true == route.url_pattern.match(uri) ) {
          if (Type.typeof(this.before) != TNull) {
            this.before();
            window.dispatchEvent(RouterEvent.eventGlobalBeforeEnd);
          }

          if (Type.typeof(route.cb) != TNull) {
            _execCb(route.url_pattern, route.cb);
          } else if (Type.typeof != route.object) {
            for (method_name in [BEFORE_METHOD_NAME, route.method_name, AFTER_METHOD_NAME]) {
              _execObj(route.url_pattern, route.object, method_name);
            }
          }

          if (Type.typeof(this.after) != TNull) {
            this.after();
            window.dispatchEvent(RouterEvent.eventGlobalAfterEnd);
          }

          if (!from_pop_state) if (Type.typeof(notfound_uri) == TNull) _setPushState(uri) else _setPushState(notfound_uri);
          return;
        }
      }
      this.run(this.options.notfound_path, false, uri);
    }

    public function raisePushState(targetSelector: String, fire: String, uriAttr: String, ?bindElement: Element = null): Void {
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

    inline function _checkUsablePushState() {
        return
            if ( (Type.typeof(this.window.history)           != TNull) &&
                 (Type.typeof(this.window.history.pushState) != TNull)    ) true else false;
    }

    inline function _execCb(url_pattern: EReg, cb: Dynamic): Void {
        cb.apply(this, _includeParams(url_pattern));
        window.dispatchEvent(routerhx.RouterEvent.eventMainEnd);
    }

    inline function _execObj(url_pattern: EReg, obj: Dynamic, method: String): Void {
        if ( Type.typeof( Reflect.getProperty(obj, method) ) == TFunction ) {
            Reflect.callMethod( obj, Reflect.field(obj, method), _includeParams(url_pattern) );

            switch (method) {
              case BEFORE_METHOD_NAME: window.dispatchEvent(RouterEvent.eventBeforeEnd);
              case AFTER_METHOD_NAME: window.dispatchEvent(RouterEvent.eventAfterEnd);
              default: window.dispatchEvent(RouterEvent.eventMainEnd);
            }
        }
    }

    static function main() { }
}