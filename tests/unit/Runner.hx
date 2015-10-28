package tests.unit;

import haxe.unit.TestRunner;
import tests.unit.path.TestMatch;
import tests.unit.path.TestIncludeRouteParams;

class Runner {
    static function main() {
        var runner = new TestRunner();

        // Append test classes.
        runner.add(new TestMatch());
        runner.add(new TestIncludeRouteParams());

        runner.run();
    }
}
