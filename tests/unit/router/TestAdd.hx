package tests.unit.router;

import haxe.unit.TestCase;
import routerhx.Router;
import routerhx.errors.RouterHxError;
import routerhx.errors.ExistsRouteError;
import routerhx.errors.ActionTypeError;

using Reflect;

class TestAdd extends TestCase {
    var router: Router;

    override public function setup() {
        router = new Router();
    }

    public function testAddDuplicateAction() {
        var path = '/path';
        var action = function() {
        };

        router.add(path, action);

        var error_message = '';
        try {
            router.add(path, action);
        } catch(e: ExistsRouteError) {
            error_message = getErrorMessage(e);
        }

        assertTrue(~/Already exists path:/.match(error_message));
    }

    public function testAddInvalidActionType() {
        var path = '/path';
        var action = 100;

        var error_message = '';
        try {
            router.add(path, action);
        } catch(e: ActionTypeError) {
            error_message = getErrorMessage(e);
        }

        assertTrue(~/Unexpected parameter type\./.match(error_message));
    }

    public function testAddCallbackAction() {
        var path = '/path';
        var action = function() {
        };

        router.add(path, action);
        var routes: Map<String, Dynamic> = router.getProperty('routes');

        assertEquals(action, routes.get(path).action.cb);
    }

    public function testAddInstanceAction() {
        var path = '/path';
        var class_name = 'tests.unit.router.TestAdd_MockClass';
        var method_name = 'test';
        var action = '$class_name#$method_name';

        router.add(path, action);
        var routes: Map<String, Dynamic> = router.getProperty('routes');

        assertEquals(class_name, routes.get(path).action.class_method.class_name);
        assertEquals(method_name, routes.get(path).action.class_method.method_name);
    }

    function getErrorMessage(e: RouterHxError) {
        #if JsStandAlone
        return e.message;
        #else
        return e.toString();
        #end
    }
}

class TestAdd_MockClass {
    public function new() {}
    public function test() {}
}
