package tests.unit.path;

import haxe.unit.TestCase;
import routerhx.Path;

class TestMatch extends TestCase {
    var staticPath: Path;
    var dynamicPath: Path;

    override public function setup() {
        staticPath = new Path('/foo/bar');
        dynamicPath = new Path('/foo/:bar');
    }

    public function testStaticPathToMatch() {
        assertTrue(staticPath.match('/foo/bar'));
    }

    public function testStaticPathToMissMatchWhenTailSlash() {
        assertFalse(this.staticPath.match('/foo/bar/'));
    }

    public function testDynamicPathToMatch() {
        assertTrue(this.dynamicPath.match('/foo/baz'));
    }

    public function testDynamicPathToMissMatchWhenTailSlash() {
        assertFalse(this.dynamicPath.match('/foo/baz/'));
    }
}
