
(function(){
    'use strict';

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

})();