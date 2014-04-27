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

class Greet {
  public function say(message) {
    trace(message);
  }
}

class Main {
  public function new() {
    var router = new Router(),
        greet = new Greet();
    router.addCb("/", index);
    router.add("/greet/<message>", greet, "say");
    router.raisePushState("a", "click", "href");
    router.run("/");
  }

  inline function index() {
    trace("index");
  }
}
```

### for javascript
```js
function Greet() {
  this.say = function(message) {
    console.log(message);
  }
}

var router = new RouterHx(),
    greet = new Greet();

  router.addCb("/", function() {
    console.log("index");
  });
  router.add("/greet/<message>", greet, say);
  router.raisePushState("a", "click", "href");
  router.run("/");
```

## ライセンス
MIT