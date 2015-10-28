package tests.unit.router;

import routerhx.Router;
import haxe.unit.TestCase;

import tests.unit.router.TestDispatch_MockClass;

class TestDispatch extends TestCase {
    var router: Router;

    override public function setup() {
        router = new Router();
        router.add('/cb', function() { throw 'cb dispatched.'; });
        router.add('/class_method_for_hx',
                   'tests.unit.router.TestDispatch_MockClass#test');
        router.add('/class_method_for_js',
                   'router.mock_classes.TestDispatch_MockClass#test');
    }

    public function testDispatchCallback() {
        var message = '';
        try {
            router.dispatch('/cb');
        } catch(e: String) {
            message = e;
        }

        assertTrue(~/cb dispatched\./.match(message));
    }

    public function testDispatchClassMethod() {
        var message = '';
        try {
            #if JsStandAlone
            router.dispatch('/class_method_for_js');
            #else
            router.dispatch('/class_method_for_hx');
            #end
        } catch(e: String) {
            message = e;
        }

        assertTrue(~/class method dispatched\./.match(message));
    }

    public function testNoRouteMatch() {
        var message = '';
        try {
            router.dispatch('/nothign_route_path');
        } catch(e: String) {
            message = e;
        }

        assertTrue(~/No route match:/.match(message));
    }
}
