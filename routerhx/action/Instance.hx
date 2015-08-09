package routerhx.action;

import routerhx.errors.NotFoundNameSpaceError;
import routerhx.errors.UndefinedMethodError;
import routerhx.errors.UndefinedClassError;
import routerhx.errors.InvalidActionError;
import tink.core.Error;
import Reflect;
import js.Browser;

using StringTools;
using Lambda;
using Type;

typedef ClassMethod = {
    class_name: String,
    method_name: String
}

class Instance implements Action {

    var class_method: ClassMethod;

    public function new(class_method: String) {
        this.class_method = parseToClassMethod(class_method);
    }

    public function exec(params: Map<String, String>): Void {
        var class_name  = class_method.class_name;
        var method_name = class_method.method_name;

        #if JsStandAlone
        var cls = getDynamicClassForJs(class_name);
        switch (cls.typeof()) {
            case TFunction:
            case _: throw new UndefinedClassError('Undefined class: $class_name');
        }
        #else
        var cls = class_name.resolveClass();
        switch (cls.typeof()) {
            case TObject:
            case _: throw new UndefinedClassError('Undefined class: $class_name');
        }
        #end

        var instance = cls.createInstance([]);
        switch (Reflect.getProperty(instance, method_name).typeof()) {
            case TFunction:
            case _: throw new UndefinedMethodError('Undefined method: ${class_name}.${method_name}');
        }

        var method_field = Reflect.field(instance, method_name);

        #if JsStandAlone
        var method_params = [untyped params.h];
        #else
        var method_params = [params];
        #end

        Reflect.callMethod(instance, method_field, method_params);
    }

    function parseToClassMethod(val: String): ClassMethod {
        var splited: Array<String> = val.split('#');

        if (splited.length != 2) {
            throw new InvalidActionError('invalid action value, should give like [class name]#[method name]');
        }

        return { class_name: splited[0], method_name: splited[1] };
    }

    function getDynamicClassForJs(class_path: String): Class<Dynamic> {
        return if (Reflect.hasField(Browser, 'window')) {
            var cls: Dynamic = Browser.window;
            for (part in class_path.split(".")) {
                untyped if (cls[part].typeof() == TNull) {
                    throw new NotFoundNameSpaceError('$part not found.');
                }
                untyped cls = cls[part];
            }
            cls;
        } else {
            var class_parts = class_path.split('.');
            var class_name = class_parts[class_parts.length - 1];
            var path = class_parts.filter(function(part) {
                return if (class_name == part) false else true;
            }).join('/').toLowerCase();
            untyped __js__("require('./' + {0} + '.js')[{1}]", path, class_name);
        }
    }

}
