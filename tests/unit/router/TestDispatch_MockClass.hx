package tests.unit.router;

class TestDispatch_MockClass {
    public function new() {}

    public function test() {
        throw 'class method dispatched.';
    }

    public function test_param(params: Map<String, Dynamic>) {
        params.get('assertion')(params.get('param'));
    }
}