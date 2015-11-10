package routerhx.action;

import routerhx.errors.NotFoundNameSpaceError;
import routerhx.errors.UndefinedMethodError;
import routerhx.errors.UndefinedClassError;
import routerhx.errors.InvalidActionError;
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

    public function exec(params: Map<String, Dynamic>): Void {
        var class_name  = class_method.class_name;
        var method_name = class_method.method_name;

        #if JsStandAlone
        var klass = getDynamicClassForJs(class_name);
        switch (klass.typeof()) {
            case TFunction:
            case _: throw new UndefinedClassError('Undefined class: $class_name');
        }
        #else
        var klass = class_name.resolveClass();
        switch (klass.typeof()) {
            case TObject:
            case _: throw new UndefinedClassError('Undefined class: $class_name');
        }
        #end

        var instance = klass.createInstance([]);
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
        return
        if (Reflect.hasField(Browser, 'window')) {
            // Case web browser.
            var klass: Dynamic = Browser.window;
            for (part in class_path.split('.')) {
                untyped if (klass[part].typeof() == TNull) {
                    throw new NotFoundNameSpaceError('$part not found.');
                }
                untyped klass = klass[part];
            }
            klass;
        } else {
            // Case nodejs.
            var class_parts = class_path.split('.');
            var class_name = class_parts[class_parts.length - 1];
            var path = class_parts.filter(function(part) {
                return if (class_name == part) false else true;
            }).join('/').toLowerCase();
            untyped __js__("require('./' + {0} + '.js')[{1}]", path, class_name);
        }
    }

}
