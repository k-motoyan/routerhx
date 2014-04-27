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
}

@:expose("RouterHx")
class Router {
    static var BEFORE_METHOD_NAME = "before";
    static var AFTER_METHOD_NAME = "after";

    var window: DOMWindow;
    var routes: Array<Route>;
    var options: Options;
    var before: Void -> Void;
    var after: Void -> Void;

    public function new(?options: Options = null) {
        this.window = Browser.window;
        this.routes = new Array();
        this.options = if (Type.typeof(options) != TNull) options else _getDefaultOptions();
        if (!_checkUsablePushState()) throw "unusable push state this browser.";
        _setPopState();
    }

    public function add(url: String, object: Dynamic, method_name: String): Void {
        url = StringTools.replace(url, "/", "\\/");
        var regex = ~/<[^\/]+>/g;
        this.routes.push({
            url_pattern: new EReg("^" + regex.replace(url, "([^\\/]+)") + "$", ""),
            object     : object,
            method_name: method_name
        });
    }

    public function addCb(url: String, cb: Dynamic): Void {
        url = StringTools.replace(url, "/", "\\/");
        var regex = ~/<[^\/]+>/g;
        this.routes.push({
            url_pattern: new EReg("^" + regex.replace(url, "([^\\/]+)") + "$", ""),
            cb         : cb,
        });
    }

    public function setBefore(cb: Void -> Void): Void {
        this.before = cb;
    }

    public function setAfter(cb: Void -> Void): Void {
        this.after = cb;
    }

    public function run(?uri: String = null, ?from_pop_state: Bool = false): Void {
        if (Type.typeof(uri) == TNull) {
            uri = Browser.location.pathname;
        }
        for (route in this.routes) {
            if ( true == route.url_pattern.match(uri) ) {
                if (Type.typeof(this.before) != TNull) this.before();

                if (Type.typeof(route.cb) != TNull) {
                    _execCb(route.url_pattern, route.cb);
                } else if (Type.typeof != route.object) {
                    for (method_name in [Router.BEFORE_METHOD_NAME, route.method_name, Router.AFTER_METHOD_NAME]) {
                        _execObj(route.url_pattern, route.object, method_name);
                    }
                }

                if (Type.typeof(this.after) != TNull) this.after();
                if (!from_pop_state) _setPushState(uri);
                break;
            }
        }
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
        return {};
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
    }

    inline function _execObj(url_pattern: EReg, obj: Dynamic, method: String): Void {
        if ( Reflect.hasField(obj, method) ) {
            Reflect.callMethod( obj, Reflect.field(obj, method), _includeParams(url_pattern) );
        }
    }

    static function main() { }
}