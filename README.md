[![](https://david-dm.org/stefanwalther/sense-go.png)](https://david-dm.org/stefanwalther/sense-go)

# sense-go

> Library to easily handle validation, deployment, packaging and testing web projects (e.g. Mashups for Qlik Sense, Qlik Sense Visualization Extensions or basically any other project ...).

**Note: This library is in development and not ready to use, yet**

***

<!-- toc -->

* [Installation](#installation)
* [Purpose](#purpose)
* [Deployment by convention](#deployment-by-convention)
* [Tasks](#tasks)
  - [Bump](#bump)
  - [Clean](#clean)
  - [Copy](#copy)
  - [Import](#import)
* [JsonLint](#jsonlint)
* [JsonMinify](#jsonminify)
  - [Less](#less)
  - [Replace](#replace)
  - [Wbfolder](#wbfolder)
* [Task Chains](#task-chains)
* [Contributing](#contributing)
* [Author](#author)
* [License](#license)

_(Table of contents generated by [verb])_

<!-- tocstop -->

***

## Installation

Install sense-go in your project

```js
npm install sense-go --save-dev
```

Install Gulp4, to run your local gulpfile.js

```js
npm install git://github.com/gulpjs/gulp#4.0 --save-dev
```

Create a gulpfile.js in the root folder of your project, containing the following minimal code:

```js
var gulp = require('gulp');
var senseGo = require('sense-go');

var userConfig = {
    "packageName": "Your Package Name"
};

senseGo.init( gulp, userConfig,  function (  ) {
  // Your own gulp tasks or task-chains here
  // ...
});
```

Run any of the below described gulp commands or create your own task-chains.

## Purpose

Main purpose of this library is to provide a framework to easily

* validate
* package
* deploy and
* test

**Visualization Extensions** created for Qlik Sense.

The implementation is a based on the deployment functionality in the [Yeoman Generator for Visualization Extensions](https://github.com/stefanwalther/generator-qsExtension).

The main reason behind creating this library is that I am creating a lot of different visualization extensions for Qlik Sense, but in any of these projects I include some kind of deployment system (so far always using grunt). If I have to make changes to the general deployment approach I have to change every single visualization extension repository, which is not really ideal. So introducing this library centralizes the deployment needs and allows me to re-use a central approach.

Technically speaking sense-go is just a collection of configurable gulp tasks which can be easily re-used when developing your Qlik Sense visualization extensions.

## Deployment by convention

The entire concept follows **conventions** I am using when setting up a project:

```
| PROJECT-ROOT
|-- build           <= all builds, including source code or zipped files
    |-- dev         <= target for the development build
    |-- release     <= target for the release build
|-- docs            <= documentation files, then used by verb
|-- src             <= all source files
    |-- lib
        |-- css     <= see below *
        |-- less    <= less files
| .sense-go.yml     <= sense-go configuration file
| .verb.md          <= verbs readme template
| gulpfile.js       <= gulp file using sense-go
| package.json
```

* If using less files is preferred for a project I keep this folder empty, otherwise all the .css files will be place here

**_sense-go_** works best if you follow these conventions, otherwise everything is configurable, it's just a bit more work to get sense-go running immediately.

## Tasks

Get a list of all tasks by running

```
gulp --tasks
```

### Bump

> Bumps the version in your package.json file

**`gulp bump:patch`**

* Changes the version in package.json from `  0.2.1` to `  0.2.2`
* Shortcuts: `gulp b` or `gulp b:p`

**`gulp bump:minor`**

* Changes the version in package.json from `  0.2.1` to `  0.3.1`
* Shortcut: `gulp b:min`

**`gulp bump:major`**

* Changes the version in package.json from `  0.2.1` to `  1.0.0`
* Shortcut: `gulp b:maj`

**`gulp bump:version`**

* Set the package.json version to a specific value given by the parameter `--newversion` resp. `--nv`.
* Shortcut: `gulp b:v`
* Example:

```
gulp bump:version --newversion=0.1.0
gulp b:v --nv=0.1.0
```

**Possible command line parameters**

**`--tag`**

* Tags the current version of your commit with the newly created version created by any of the bump-tasks.

**`--commit="Your commit message"`**

* Commits all files with the given commit message, if no commit message is defined, "." will be committed as a message.

### Clean

> Cleaning and deleting folders.

**`gulp clean:tmp`**

* Deletes all files in the `.tmp` directory

**`gulp clean:buildDev`**

* Deletes all files in the `./build/dev` directory

**`clean:localExtensionDir`**

* Deletes all files in the project's local extension folder

### Copy

> Copy files to a specific directory on your system

**`gulp copy:toTmp`** - Copies all files (except the excluded ones) from the `src` folder to the `.tmp` folder

Settings used:

* srcDir
* tmpDir

Excluded files:

* *.less

**`copy:tmpToDev`** - Copies all files (except the excluded ones) from the `.tmp` folder to `.\build\dev` folder

Settings used:

* tmpDir
* buildDevDir

Excluded files:

* *.less

**`copy:tmpToLocal`** - Copies all files (except the excluded ones) from the `.tmp` directory to the local extension directory, creating a new folder for the current package and eventually deleting any already existing files in the targeted folder.

Settings used:

* tmpDir
* localExtensionDir

Excluded files:

* *.less

### Import

> Import files to the deployment

The main use-case behind this task is to be able to import "external" files from external dependencies (e.g. node_modules or bower) into the .tmp directory to use them in the solution.

`gulp import`

Define the file you want to import in your `sense-go.yml` file as follows:

Example:

```
import:
  files:
    - ["./node_modules/sense-angular-directives/dist/eui-collapse/eui-collapse.js", "./.tmp/lib/components/eui-collapse"]
    - ["./node_modules/sense-angular-directives/dist/eui-note/eui-note.js", "./.tmp/lib/components/eui-note"]
    - ["./node_modules/sense-angular-directives/dist/eui-note/eui-note.css", "./.tmp/lib/components/eui-note"]
    - ["./node_modules/sense-angular-directives/dist/eui-note/eui-note.ng.html", "./.tmp/lib/components/eui-note"]
    - ["./node_modules/sense-angular-directives/dist/eui-tablesort/eui-tablesort.js", "./.tmp/lib/components/eui-tablesort"]
    - ["./node_modules/sense-angular-directives/dist/eui-tablesort/eui-tablesort.css", "./.tmp/lib/components/eui-tablesort"]
    - ["./node_modules/sense-angular-directives/dist/eui-tooltip/eui-tooltip.js", "./.tmp/lib/components/eui-tooltip"]
    - ["./node_modules/sense-angular-directives/dist/eui-tooltip/eui-tooltip.css", "./.tmp/lib/components/eui-tooltip"]
```

## JsonLint

(to be documented)

## JsonMinify

> Minify JSON & QEXT files

All less tasks automatically create a sourcemap (using [gulp-sourcemaps](http://github.com/floridoo/gulp-sourcemaps)) and autoprefix (using [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer))

**`gulp jsonminify:tmp`**

Settings used:

* tmpDir

Uses the following gulp plugins:

[gulp-jsonminify](https://www.npmjs.com/package/gulp-jsonminify): Minifies blocks of JSON-like content into valid JSON by removing all whitespace and comments. | [homepage](https://github.com/tcarlsen/gulp-jsonminify)

### Less

> Converts .less files to .css files

All less tasks automatically create a sourcemap (using [gulp-sourcemaps](http://github.com/floridoo/gulp-sourcemaps)) and autoprefix (using [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer))

**`gulp less:reduce`**

Uses /src/less/main.less, resolves all its dependencies and creates /.tmp/css/main.css

Settings used:

* srcDir
* tmpDir

**`gulp less:reduce`**

Converts every .less file from the source directory to a corresponding .css file in the .tmp directory

Settings used:

* srcDir
* tmpDir

Uses the following gulp plugins:

* [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer): Prefix CSS | [homepage](https://github.com/sindresorhus/gulp-autoprefixer)
* [gulp-less](https://www.npmjs.com/package/gulp-less): Less for Gulp | [homepage](https://github.com/plus3network/gulp-less)
* [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps): Source map support for Gulp.js | [homepage](http://github.com/floridoo/gulp-sourcemaps)

### Replace

> Replaces string patterns in text files across your project.

**Usage**

* Use @@ to prefix the key to be replaced with a given value
* Replacements will only be performed in the following file types:
  - .html
  - .js
  - .json
  - .qext
  - .txt
  - .xml
  - .yml

**Using data from package.json**

All keys from your package.json file are available out of the box if you use the prefix `pkg`
* To get the version, use `@@pkg.version`
* To the get name, use `@@pkg.name`
* etc.

**Builtin patterns**

The following patterns are available out of the box:

`@@timestamp` - Defaults to new Date().getTime()

**Adding replacement patterns**

Add new replacements patterns in your .sense-go.yml file:

(TBC)

(All replace tasks use the plugin gulp-replace-task)

### Wbfolder

> Create a wbfolder.wbl file to be used in Workbench/Qlik Dev Hub

**`gulp wbfolder`**

* Creates a wbfolder.wbl file in  the `.tmp` directory.

Settings used:

* `wbfolder.cwd` - Working directory
* `wbfolder.src` - Source mask
* `wbfolder.dest` - Wbfolder.wbl file destination

## Task Chains

Based on gulp tasks provided by sense-go you can then create your task chains.
Some are already predefined:

**`gulp build`**

`gulp.task( 'build', gulp.series( 'init', 'clean:tmp', 'copy:toTmp', 'replace:tmp', 'clean:buildDev', 'copy:tmpToDev', 'clean:localExtensionDir', 'copy:tmpToLocal' ) );`

## Create your own task-chains

You can add additional tasks on top of sense-go, mixing your very own tasks with sense-go tasks, etc.

* Always initialize a task chain with the `init` task
* When creating your own tasks, note that sense-go relies on Gulp4

**Example:**

```js
'use strict';
var gulp = require('gulp');
var senseGo = require('./lib/');

var userConfig = {
    "packageName": "sense-go"
};

senseGo.init( gulp, userConfig,  function (  ) {
  
  // Create your own task chain, and overwrite the current 'build' task
  `gulp.task( 'build', gulp.series( 'init', 'clean:tmp', 'copy:toTmp', 'myTask1', 'myTask2' ) );`
  
});
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/stefanwalther/sense-go/issues).
The process for contributing is outlined below:

1. Create a fork of the project
2. Work on whatever bug or feature you wish
3. Create a pull request (PR)

I cannot guarantee that I will merge all PRs but I will evaluate them all.

## Author

**Stefan Walther**

+ [qliksite.io](http://qliksite.io)
* [twitter/waltherstefan](http://twitter.com/waltherstefan)
* [github.com/stefanwalther](http://github.com/stefanwalther)

## License

Copyright © 2015 Stefan Walther
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on November 03, 2015._