package tests.unit.action.instance;

import haxe.unit.TestCase;
import routerhx.action.Instance;
import routerhx.errors.InvalidActionError;

class TestNew extends TestCase {

    public function testExpectThrowInvalidActionError() {
        try {
            new Instance('a#b#c');
            assertTrue(false);
        } catch(e: InvalidActionError) {
            assertTrue(true);
        }
    }

}
