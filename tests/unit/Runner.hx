package tests.unit;

import haxe.unit.TestRunner;
import tests.unit.path.TestMatch;
import tests.unit.path.TestIncludeRouteParams;
import tests.unit.router.TestAdd;
import tests.unit.router.TestDispatch;

class Runner {
    static function main() {
        var runner = new TestRunner();

        // Append test classes.
        runner.add(new TestMatch());
        runner.add(new TestIncludeRouteParams());
        runner.add(new TestAdd());
        runner.add(new TestDispatch());

        runner.run();
    }
}
