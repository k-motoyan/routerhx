# RouterHx

RouterHx is simply javascript routing library.

# Install

From haxelib.

※ it works.

```
haxelib install routerhx
```

From npm.

※ it works.

```
npm install routerhx
```

# Usage

## Using Haxe

### Basic usage

```hx
import routerhx.RouterHx;

class Main {
    static function main() {
        var r = new RouterHx;

        // Set callback.
        r.add('/cb', function(params) {
            trace('callback.');
        });

        // Set class method.
        r.add('/hello/:name', 'Greet#say');
        
        r.dispatch('/cb');  // callback.
        r.dispatch('/hello/world'); // Hello world
    }
}

class Greet {
    public function say(params) {
        trace('Hello ${params.get("name")}');
    }
}
```

### Given parameter

```hx
import routerhx.RouterHx;

class Main {
    static function main() {
        var r = new RouterHx;
        
        r.add('/:foo', function(params) {
            trace( params.get('foo') );
            trace( params.get('bar') );
        });
        
        r.dispatch('/foo', [ 'bar' => 'bar' ]); // foo, bar
    }
}
```

## Using javascript

### Basic usage

```js
var Greet = function() {};
Greet.prototype = {
    say: function(params) {
        console.log('Hello ' + params.name);
    }
};

exports.Greet = Greet;
```

```js
var routerhx = require('./path/to/routerhx.js');
var r = new routerhx.RouterHx();

// Set callback.
r.add('/cb', function(params) {
    console.log('callback.');
});

// Set class method.
r.add('/hello/:name', 'path.to.greet.Greet#say');

r.dispatch('/cb'); // callback.
r.dispatch('/hello/world'); // Hello world
```

### Given parameter

※ it works.
