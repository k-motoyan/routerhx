TestDispatch_MockClass = function() {};

TestDispatch_MockClass.prototype = {
    test: function() {
        throw 'class method dispatched.';
    },
    test_param: function(params) {
        params.assertion(params.param);
    }
};

exports.TestDispatch_MockClass = TestDispatch_MockClass;