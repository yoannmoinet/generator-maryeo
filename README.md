# Generator Maryeo
[Yeoman](http://yeoman.io) generator for scalable Marionette webapps.

Tools requirement
------------------

- [nodejs](http://nodejs.org).
- [Yeoman](http://yeoman.io).
- [GruntCLI](https://github.com/gruntjs/grunt-cli).
- [Bower](https://bower.io).

The Generator
-----------


The Web App
-----------

### Install dependencies & Run

```javascript
// Install both bower and grunt-cli
npm install -g bower && npm install -g grunt-cli

// Update/install dependencies
npm install && bower install

// Build the solution && start the webserver.
npm start
```

You can also use Grunt :

```javascript
grunt           //Launch a webserver.
grunt test      //Launch test suite.
grunt build     //Build.
```

Usage
-----

### Import the solution

The solution has a few dependencies not included in the package.
- jQuery.
- Underscore.
- Backbone.
- Marionette ( + Wreqr + Babysitter + Radio )
- Handlebars.

Then you can use it with RequireJS :

```javascript
define( function ( require ) {
    var App = require('application');
});
```


### Create a subApp

Your subApp needs to import the `application` module.

Then it needs to implement a sub-module onto it.

##### Pre-requisites

- A Controller, which will handle your internal routing.
- A Routes array :
```javascript
MySubApp.routes = [
//{'route': 'handler', need Auth?, hide Header? }
    {'subApp': 'index', auth: false, hideHeader: true},
    {'subApp/projects(/:projectID)': 'projects', auth: true}
];
```
- An initializer which will initialize your controller, your view, your routes etc...
- To trigger `'SubApp:creation'` onto the `Bus` once the App is ready.
- A finalizer, which will kill all your stuffs and avoid memory leaks.

##### Examples

See the [**SubApp Example**](example/main.js) and the [**SubAppView Example**](example/views/AppExView.js) to better understand how to integrate your SubApp.

#### /!\ WatchOut /!\

If you are developping from inside the framework, don't forget to
add `apps/[YOUR_SUBAPP]/[YOUR_SUBAPP]` into `app/main.js`.

Or else it won't be loaded.

### Create stylesheets.

When developing from inside the framework you can add you `.scss` files into `app/sass/_modules`.

And then load them into both `styles.dark.scss` and `styles.light.scss` with `@import '_modules/[YOUR_SUBAPP]';`

### Import the styles.

You need to import your theme inside your html file.

```html
<html>
    <head>
    <link id="theme" href="./build/css/styles.dark.css" rel="stylesheet" type="text/css">
  </head>
</html>
```


### I18N

You can use the internationalization's helper inside Handlebars templates with `{{i18n 'my_key'}}`.

You just have to add your entries inside `app/locales/translations.[lng].json` :

```javascript
//translations.fr.json
{
    "my_key": "Mon texte traduit."
}

//translation.en.json
{
    "my_key": "My translated text."
}
```

Then inside your subApp you can listen to `Bus.on('change:lang', action)` to be able to re-render your views.

#### Register new strings

You can also register new strings for your subApp :

```javascript
var en = require( 'json!apps/SubApp/locales/translations.en.json' );
Bus.request('App.i18n').addLocales( 'en', en );
```

Contributing
------------

A few guidelines to follow when contributing.

- Git's branching : [Git Flow](http://nvie.com/posts/a-successful-git-branching-model/).
- Commits : [Angular commit message guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines).
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```
- [Unit Test EVERYTHING](test).
