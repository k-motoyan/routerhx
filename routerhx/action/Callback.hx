package routerhx.action;

@:tink class Callback implements Action {

    var cb: Dynamic -> Void;

    public function new(cb: Dynamic -> Void) {
        this.cb = cb;
    }

    public function exec(params: Map<String, Dynamic>): Void {
        #if JsStandAlone
        cb(untyped params.h);
        #else
        cb(params);
        #end
    }

}
