
(function(){
    'use strict';

    var ecql = require('./../index.js');

    ecql.extractCoverGlob('/Volumes/2TB/jdownload/___x/**/*.epub', {
        forceOverwrite: true,
        outputs: [
            {nameExtension: "", size: 300},     // abc.cbr -> abc.jpg
            {nameExtension: "_xl", size: 1200}  // abc.cbr -> abc_xl.jpg
            //{nameExtension: "_o", size: null} // abc.cbr -> abc_o.jpg, original size.
        ],
        tmpDir: '/Volumes/ramdisk/tmp'

    }, function(err) {
        if (err) return console.error(err);
        console.info('Done.');
    });

})();