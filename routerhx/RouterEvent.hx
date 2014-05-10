package routerhx;

import js.Browser;
import js.html.Event;

class RouterEvent {
  public static var eventGlobalBeforeEnd: Event;
  public static var eventGlobalAfterEnd: Event;
  public static var eventBeforeEnd: Event;
  public static var eventAfterEnd: Event;
  public static var eventMainEnd: Event;

  public static function init() {
    createGlobalBeforeEnd();
    createGlobalAfterEnd();
    createBeforeEnd();
    createAfterEnd();
    createMainEnd();
  }

  static inline function createGlobalBeforeEnd() {
    eventGlobalBeforeEnd = Browser.document.createEvent("CustomEvent");
    eventGlobalBeforeEnd.initEvent("globalBeforeEnd", false, true);
  }

  static inline function createGlobalAfterEnd() {
    eventGlobalAfterEnd = Browser.document.createEvent("CustomEvent");
    eventGlobalAfterEnd.initEvent("globalAfterEnd", false, true);
  }

  static inline function createBeforeEnd() {
    eventBeforeEnd = Browser.document.createEvent("CustomEvent");
    eventBeforeEnd.initEvent("beforeEnd", false, true);
  }

  static inline function createAfterEnd() {
    eventAfterEnd = Browser.document.createEvent("CustomEvent");
    eventAfterEnd.initEvent("afterEnd", false, true);
  }

  static inline function createMainEnd() {
    eventMainEnd = Browser.document.createEvent("CustomEvent");
    eventMainEnd.initEvent("mainEnd", false, true);
  }
}