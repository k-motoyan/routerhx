package routerhx.action;

interface Action {

    public function exec(params: Map<String, String>): Void;

}
