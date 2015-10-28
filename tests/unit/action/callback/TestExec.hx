package tests.unit.action.callback;

import haxe.unit.TestCase;
import routerhx.action.Callback;

class TestExec extends TestCase {
    var cb: Callback;

    override public function setup() {
        cb = new Callback(function(params: Dynamic) {
            #if JsStandAlone
            throw params.message;
            #else
            throw params.get('message');
            #end
        });
    }

    public function testExec() {
        var params: Map<String, String> = new Map();
        params.set('message', 'exec callback');

        var message = '';
        try {
            cb.exec(params);
        } catch(e: String) {
            message = e;
        }

        assertTrue(~/exec callback/.match(message));
    }
}
