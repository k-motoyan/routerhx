package tests.unit;

import haxe.unit.TestRunner;
import tests.unit.path.TestMatch;
import tests.unit.path.TestIncludeRouteParams;
import tests.unit.router.TestAdd;
import tests.unit.router.TestDispatch;
import tests.unit.action.callback.TestExec as TestCallbackExec;

class Runner {
    static function main() {
        var runner = new TestRunner();

        // Append test classes.
        runner.add(new TestMatch());
        runner.add(new TestIncludeRouteParams());
        runner.add(new TestAdd());
        runner.add(new TestDispatch());
        runner.add(new TestCallbackExec());

        runner.run();
    }
}
