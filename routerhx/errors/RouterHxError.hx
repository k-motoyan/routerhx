package routerhx.errors;

#if JsStandAlone
class RouterHxError extends js.Error {
    public function new(message:String) {
        super();
        this.message = message;
    }
}
#else
class RouterHxError extends tink.core.Error {
    public function new(message:String, ?pos:tink.core.Error.Pos) {
        super(null, message, pos);
    }
}
#end