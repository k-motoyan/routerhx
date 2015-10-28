TestDispatch_MockClass = function() {};

TestDispatch_MockClass.prototype = {
    test: function() {
        throw 'class method dispatched.';
    }
};

exports.TestDispatch_MockClass = TestDispatch_MockClass;