# input-mask
A simple input mask directive for AngularJS. It's currently only for numeric characters.

## How to use
First, replace the module name with yours.
```js
angular.module('yourModuleName').directive('inputMask', ...) // replace module name
```

Using it is as simple as follows
```html
<input type="text" input-mask="xx / xx / xxxx" ng-model="$ctrl.myModel"/>
```
