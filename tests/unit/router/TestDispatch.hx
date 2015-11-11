package tests.unit.router;

import routerhx.Router;
import haxe.unit.TestCase;

import tests.unit.router.TestDispatch_MockClass;

class TestDispatch extends TestCase {
    var router: Router;

    override public function setup() {
        router = new Router();
    }

    public function testDispatchCallback() {
        router.add('/cb', function() {
            assertTrue(true);
        });

        router.dispatch('/cb');
    }

    public function testDispatchClassMethod() {
        router.add('/class_method_for_hx',
                   'tests.unit.router.TestDispatch_MockClass#test');

        router.add('/class_method_for_js',
                   'router.mock_classes.TestDispatch_MockClass#test');

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

    public function testDispatchCallbackGivenParams() {
        router.add('/cb/:param', function(params) {
            #if JsStandAlone
            untyped assertEquals(params.param, 'param');
            untyped assertEquals(params.extend, 'extend');
            #else
            assertEquals(params.get('param'), 'param');
            assertEquals(params.get('extend'), 'extend');
            #end
        });

        router.dispatch('/cb/param', [ 'extend' => 'extend' ]);
    }

    public function testDispatchClassMethodGivenParams() {
        router.add('/class_method_for_hx/:param',
                   'tests.unit.router.TestDispatch_MockClass#test_param');

        router.add('/class_method_for_js/:param',
                   'router.mock_classes.TestDispatch_MockClass#test_param');

        var extend_param: Map<String, Dynamic> = new Map();
        extend_param.set('assertion', function(url_param) {
            assertEquals(url_param, 'param');
        });

        #if JsStandAlone
        router.dispatch('/class_method_for_js/param', extend_param);
        #else
        router.dispatch('/class_method_for_hx/param', extend_param);
        #end
    }
}
