# materialize-tabs

materialize-tabs is standalone the tabs component taken from materialize-css. It's dependent only on jQuery.

# Install

```sh
$ npm install materialize-tabs
```

# Usage
Use with browserify as,
```javascript
require('materialize-tabs');
// This will attach tabs to jQuery
// You do not need to declare jQuery as a global
```
For direct use in a browser,
```html
<link rel="stylesheet" type="text/css" href="/dist/jquery.materialize-tabs.min.css">
<script type="text/javascript" src="/dist/jquery.materialize-tabs.min.js"></script>
```
This includes jQuery as well.

If jQuery is already present, use,
```html
<link rel="stylesheet" type="text/css" href="/dist/jquery.materialize-tabs.css">
<script type="text/javascript" src="/src/js/tabs.js"></script>
```
Make sure you include jQuery before including tabs.js

For calling the api, refer http://materializecss.com/tabs.html