package tests.unit.path;

import haxe.unit.TestCase;
import routerhx.Path;

class TestIncludeRouteParams extends TestCase {
    var noneParamPath: Path;
    var singleParamPath: Path;
    var multiParamsPath: Path;

    override public function setup() {
        noneParamPath = new Path('/foo/bar');
        singleParamPath = new Path('/foo/:bar');
        multiParamsPath = new Path('/foo/:bar/:baz');
    }

    public function testNoneParamPathToReturnsEmptyMap() {
        var actual = noneParamPath.includeRouteParams('/foo/bar');
        assertEquals('{}', actual.toString());
    }

    public function testSingleParamPathToReturnsGivenValue() {
        var actual = singleParamPath.includeRouteParams('/foo/actual');
        assertEquals('actual', actual.get('bar'));
    }

    public function testMultiParamsPathToReturnsGivenValues() {
        var actual = multiParamsPath.includeRouteParams('/foo/actual1/actual2');
        assertEquals('actual1', actual.get('bar'));
        assertEquals('actual2', actual.get('baz'));
    }
}
