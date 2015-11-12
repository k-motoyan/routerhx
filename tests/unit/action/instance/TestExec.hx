package tests.unit.action.instance;

import haxe.unit.TestCase;
import routerhx.action.Instance;
import routerhx.errors.UndefinedClassError;

using Type;

class TestExec extends TestCase {
    public function testExecShouldThrowErrorWhenNotExistsClass() {
        var instance = new Instance('not.exists#Class');

        try {
            instance.exec(new Map());
        } catch(e: UndefinedClassError) {
            assertTrue(true);
        }
    }
}
