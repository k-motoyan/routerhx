package routerhx;

import routerhx.action.Action;
import routerhx.action.Callback;
import routerhx.action.Instance;

using StringTools;
using Type;

typedef RouteProc = {
    path: Path,
    action: Action
}

@:expose("RouterHx")
class Router {

    var routes: Map<String, RouteProc>;

    public function new() {
        this.routes = new Map();
    }

    public function add(path_pattern: String, action: Dynamic): Void {
        if (routes.exists(path_pattern)) {
            throw 'Already exists path: $path_pattern';
        }

        var _action = switch(action.typeof()) {
            case TFunction: new Callback(action);
            case TClass(String): new Instance(action);
            case _: throw "Unexpected parameter action.";
        }

        routes.set(path_pattern, { path: new Path(path_pattern), action: _action });
    }

    public function dispatch(path: String) {
        for (route_proc in routes) {
            if (route_proc.path.match(path)) {
                var params = route_proc.path.includeRouteParams(path);
                return route_proc.action.exec(params);
            }
        }

        // TODO define not found action.
        throw 'No route match: $path';
    }

    static function main() {}

}
