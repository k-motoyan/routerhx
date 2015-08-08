package routerhx;

using StringTools;

@:tink class Path {

    var path_pattern: String;

    public function new(path_pattern: String) {
        this.path_pattern = path_pattern;
    }

    public function match(path: String): Bool {
        return genPathRegexp(path_pattern).match(path);
    }

    public function includeRouteParams(path: String): Map<String, String> {
        var keys = getKeys(path_pattern);
        var r = genPathRegexp(path_pattern);
        var params: Map<String, String> = new Map();

        if (r.match(path)) {
            for ([i in 1...(keys.length + 1), key in keys]) {
                params.set(key, r.matched(i));
            }
        }

        return params;
    }

    function genPathRegexp(path: String): EReg {
        var escaped_path = path.replace("/", "\\/");
        var regexp_str = "^" + ~/:[^\/]+/g.replace(escaped_path, "([^\\/]+)") + "$";
        return new EReg(regexp_str, "g");
    }

    inline function getKeys(path: String): Array<String> {
        var keys = [];

        var m = ~/:[^\/]+/g;
        var pos = 0;

        while ( pos < path.length ) {
            if ( m.matchSub(path, pos) ) {
                var m_pos = m.matchedPos();
                keys.push( path.substr(m_pos.pos + 1, m_pos.len - 1) );
                pos = m_pos.pos + m_pos.len;
            } else {
                pos = path.length;
            }
        }

        return keys;
    }

}
