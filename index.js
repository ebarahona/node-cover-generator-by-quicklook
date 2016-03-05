(function () {

    'use strict';
    var child_process = require('child_process');
    var exec = child_process.exec;
    var path = require('path');
    var fs = require('fs');

    var glob = require("glob");
    var async = require("async");
    var mac = require('os').platform() === 'darwin';

    module.exports = ecql;

    ecql.extractCoverGlob = extractCoverGlob;
    ecql.extractCover = createThumbForFile;

    ecql();

    function ecql() { }

    /*
     TODO eigenes Modul  cover-generator-by-quicklook

     qlmanage -o . -t -s 600 "/Users/marc/ebooks/Romane/_todo/neu/Eigentlich ist mein Leben gar n - Chris Nolde.epub"
     && sips -s format jpeg "/Users/marc/ebooks/Romane/_todo/neu/Eigentlich ist mein Leben gar n - Chris Nolde.epub.png" --out .
     && rm "/Users/marc/ebooks/Romane/_todo/neu/Eigentlich ist mein Leben gar n - Chris Nolde.epub.png"
     && mv "/Users/marc/ebooks/Romane/_todo/neu/Eigentlich ist mein Leben gar n - Chris Nolde.epub.jpg" "/Users/marc/ebooks/Romane/_todo/neu/Eigentlich ist mein Leben gar n - Chris Nolde.jpg"

     */

    var todos = [];

    var defaultCallback = function defaultCallback(err) {
        if (err) console.error(err);
    };

    function extractCoverGlob(pattern, options, callback) {
        if (!mac) return console.error("Error: this runs undere MAC OS X only.", null, null);
        if (!pattern) return console.error("Error: pattern missing.", null, null);
        if (!options) return console.error("Error: options missing.", null, null);

        if (!callback) callback = defaultCallback;

        todos = [];
        glob(pattern, {}, function (err, files) {
            if (err) return callback(err, null, null);

            console.info('Glob: ' + files.length + ' files found.');
            for (var i = 0; i < files.length; i++) {
                createThumbForFile(files[i], options)
            }
            async.waterfall(todos, function (err, result) {
                console.info('Outputs created:', todos.length);
                callback(err, result);
            });
        });
    }

    function createThumbForFile(sourceFile, options) {
        if (!mac) return console.error("Error: this runs undere MAC OS X only.", null, null);
        for (var i = 0; i < options.outputs.length; i++) {
            todos.push(
                (function(idx){
                    return function (callback) {
                        createThumbForFileForIndex(sourceFile, options, idx, callback);
                    }; // go
                })(i)
            );
        }
    }

    function createThumbForFileForIndex(sourceFile, options, outputIndex, callback) {

        var output = options.outputs[outputIndex];

        var sourceDirname = path.dirname(sourceFile);
        var sourceExtname = path.extname(sourceFile);
        var sourceBasename = path.basename(sourceFile, sourceExtname);

        var tmpDir = options.tmpDir;
        var tempFile1 = path.join(tmpDir,'/', sourceBasename + sourceExtname + '.png');
        var tempFile2 = path.join(tmpDir,'/', sourceBasename + sourceExtname + '.jpg');
        var targetFile = path.join(sourceDirname,'/', sourceBasename + output.nameExtension + '.jpg');
        var sizeStr = output.size ? (' -s ' + output.size): '';
        var cmd =
            ' qlmanage -o '+tmpDir+' -t ' + sizeStr + ' "'+sourceFile+'" ' +
            ' && sips -s format jpeg "'+tempFile1+'" --out ' + tmpDir +
            ' && rm "'+tempFile1+'" ' +
            ' && mv "' + tempFile2 + '" "' + targetFile + '"';

        fs.access(targetFile, fs.R_OK, function(err) {
            if (err /* file does'nt exist */ || options.forceOverwrite) {
                exec(cmd, function (error, stdout, stderr) {
                    if (error) console.error(error, cmd);
                    if (stdout) console.info('Created: ', targetFile);
                    //if (stderr) console.warn(stderr);
                    callback();
                });
            } else {
                callback();
            }
        });

    }


    //// Test:
    //function test1() {
    //    var options = {
    //        forceOverwrite: true,
    //        outputs: [
    //            {nameExtension: "", size: 300},     // abc.cbr -> abc.jpg
    //            {nameExtension: "_xl", size: 1200}  // abc.cbr -> abc_xl.jpg
    //            //{nameExtension: "_o", size: null}   // abc.cbr -> abc_o.jpg, original size.
    //        ],
    //        tmpDir: '/Volumes/ramdisk/tmp'
    //    };
    //    var sourceFile = "/Volumes/2TB/jdownload/___x/Eigentlich ist mein Leben gar n - Chris Nolde.epub";
    //    createThumbForFile(sourceFile, options);
    //    async.waterfall(todos, function (err, result) {
    //        if (err) console.error(err);
    //        console.info('Outputs created:', todos.length);
    //        // all done.
    //    });
    //}
    //
    //function test2() {
    //    var options = {
    //        forceOverwrite: true,
    //        outputs: [
    //            {nameExtension: "", size: 300},     // abc.cbr -> abc.jpg
    //            {nameExtension: "_xl", size: 1200}  // abc.cbr -> abc_xl.jpg
    //            //{nameExtension: "_o", size: null} // abc.cbr -> abc_o.jpg, original size.
    //        ],
    //        tmpDir: '/Volumes/ramdisk/tmp'
    //    };
    //    extractCoverGlob("/Volumes/2TB/jdownload/___x/**/*.epub", options, function(err){
    //        console.info('All done. :-)');
    //    });
    //
    //}
    //
    //test2();

})();