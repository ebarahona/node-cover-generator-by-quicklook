# cover-generator-by-quicklook

This tools runs for MAC OS X only.
Extracts the first picture (cover) of an document (PDF, iWork documents, Microsoft Office documents, epub, CBr, CBZ, C7...).

If no output is specified, the picture will have the same name like the ebook but with '.jpg' extension.
It's possible to generate several outputs in several dimensions for a given ducument.

## Getting started

### Quick Look
This tool uses the [Quick Look](https://en.m.wikipedia.org/wiki/Quick_Look) and it's command tool [qlmanage](https://www.google.de/search?q=generator+by&oq=generator+by&aqs=chrome..69i57j0l5.2758j0j7&sourceid=chrome&ie=UTF-8). 
(Quick Look is a quick preview feature developed by Apple Inc. which was introduced in its operating system, Mac OS X 10.5 Leopard.)

Type "qlmanage -m" in the command line (terminal, shell) to see the installed Quick Look plugins.
Additional plugins can be installed: I recommend [Simple Comic](https://en.wikipedia.org/wiki/Simple_Comic) for comics. 
Information about more Quick Look plugins can be found here: [QuickLook Plugins List](http://www.quicklookplugins.com/).

## Usage (script)

### Example: Single File
```js
var ecql = require('./../index.js');

ecql.extractCover(
    '/Volumes/2TB/jdownload/Eigentlich ist mein Leben gar n - Chris Nolde.epub', {
        forceOverwrite: true,
        outputs: [
            {nameExtension: "", size: 300},     // abc.cbr -> abc.jpg
            {nameExtension: "_xl", size: 1200}  // abc.cbr -> abc_xl.jpg
        ],
        tmpDir: '/Volumes/ramdisk/tmp'
    }, function(err) {
    if (err) return console.error(err);
    console.info('Done.');
});
```
### Example: Glob
```js
var ecql = require('./../index.js');

ecql.extractCoverGlob(
    '/Volumes/2TB/jdownload/___x/**/*.+(epub|cb*|pdf)', {
    forceOverwrite: true,
    outputs: [
        {nameExtension: "", size: 600}     // abc.cbr -> abc.jpg
    ],
    tmpDir: '/Volumes/ramdisk/tmp'

}, function(err) {
    if (err) return console.error(err);
    console.info('Done.');
});
```
Information about glob file pattern can be found here: [Glob Primer](www.npmjs.com/package/glob#glob-primer).

### Options

Key            | Possible values       | Comment
-------------- | ----------------------|-------------------------------------------------
forceDirectory | true/false/undefined  | if false, an existing jpeg file will not be overwritten.  
outputs        | \<array>              | See below. 
tempDir        | \<String>             | '.' (default) or absolute path 

Sample for option.outputs:
```js
outputs:[
    // abc.cbr -> abc.jpg
    {nameExtension: "", size: 300},   
    // abc.cbr -> abc_xl.jpg
    {nameExtension: "_xl", size: 1200}, 
    // original size. abc.cbr -> abc_o.jpg
    {nameExtension: "_o", size: null}          
]
// dimension: [width, height]} . a wildcard is not possible at the moment.
```

