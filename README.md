# RouterHx

RouterHxはjavascriptをターゲットにしたpushState対応のルーティングライブラリです。

## インストール

### for Haxe

haxelibからインストールして下さい
```
haxelib git routerhx https://github.com/k-motoyan/routerhx.git
```

### for javascript

このリポジトリをcloneしてjs/router.min.jsを読み込んで利用して下さい。
```
git clone https://github.com/k-motoyan/routerhx.git
```

## 使い方

### for Haxe
```hx
import routerhx.Router;

class pkg.Greet {
  public function say(message) {
    trace("say " + message);
  }
}

class Main {
  public function new() {
    var router = new Router();

    router.addCb("/", _index);
    router.add("/greet/<message>", "pkg.Greet", "say");

    router.run("/"); // console on "index".
    router.run("/greet/morning"); // console on "say morning".
    router.run("/greet/hello"); // console on "say hello".
  }

  inline function _index() {
    trace("index");
  }
}
```

### for javascript
```js
var namespace = {};

namespace.Greet = function(message) {
  this.say = function(message) {
    console.log("say " + message);
  }
}

var router = new RouterHx();

router.addCb("/", function() {
  console.log("index");
});
router.add("/greet/<message>", "namespace.Greet", say);

router.run("/"); // console on "index".
router.run("/greet/morning"); // console on "say morning".
router.run("/greet/hello"); // console on "say hello".
```

## ライセンス
MIT