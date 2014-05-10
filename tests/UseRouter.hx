package ;

import js.Browser;
import routerhx.Router;

class UseRouter{
  static function main() {
    var router = new Router(),
        header = Browser.document.getElementById("header"),
        footer = Browser.document.getElementById("footer"),
        sub_header = Browser.document.getElementById("sub-header"),
        sub_footer = Browser.document.getElementById("sub-footer"),
        global_before_end = Browser.document.getElementById("event-dispatch-global-before"),
        global_after_end = Browser.document.getElementById("event-dispatch-global-after"),
        before_end = Browser.document.getElementById("event-dispatch-before"),
        after_end = Browser.document.getElementById("event-dispatch-after"),
        greet = new Greet();

    router.setBefore(function() {
      header.innerHTML = "";
      footer.innerHTML = "";
      sub_header.innerHTML = "";
      sub_footer.innerHTML = "";
      global_before_end.innerHTML = "";
      global_after_end.innerHTML = "";
      before_end.innerHTML = "";
      after_end.innerHTML = "";
      header.innerHTML = "global before";
    });
    router.setAfter(function() {
      footer.innerHTML = "global after";
    });

    router.add("/", greet, "index");
    router.add("/index", greet, "index");
    router.add("/greet/<message>", greet, "say");

    router.addCb("/micro", function() {
      var contents = Browser.document.getElementById("contents");
      contents.innerHTML = "micro";
    });
    router.addCb("/micro/<number>", function(number) {
      var contents = Browser.document.getElementById("contents");
      contents.innerHTML = 'micro$number';
    });

    router.add("/dispathc1", greet, "dispatch");
    router.addCb("/dispathc2", function() {});

    router.addCb("/dynamic", function() {
      var contents = Browser.document.getElementById("contents");
      contents.innerHTML = "dynamic";
    });

    router.addCb("/404", function() {
      var contents = Browser.document.getElementById("contents");
      contents.innerHTML = "not found";
    });

    Browser.window.addEventListener("globalBeforeEnd", function(e) {
      global_before_end.innerHTML = "global before dispatched";
    });
    Browser.window.addEventListener("globalAfterEnd", function(e) {
      global_after_end.innerHTML = "global after dispatched";
    });
    Browser.window.addEventListener("beforeEnd", function(e) {
      before_end.innerHTML = "before dispatched";
    });
    Browser.window.addEventListener("afterEnd", function(e) {
      after_end.innerHTML = "after dispatched";
    });

    router.raisePushState("a", "click", "href");
    router.run("/dynamic");
  }
}

class Greet {
  public function new() { }
  public function before() {
    var sub_header = Browser.document.getElementById("sub-header");
    sub_header.innerHTML = "local before";
  }
  public function index() {
    var contents = Browser.document.getElementById("contents");
    contents.innerHTML = "index";
  }
  public function say(message) {
    var contents = Browser.document.getElementById("contents");
    contents.innerHTML = message;
  }
  public function dispatch() {}
  public function after() {
    var sub_footer = Browser.document.getElementById("sub-footer");
    sub_footer.innerHTML = "local after";
  }
}