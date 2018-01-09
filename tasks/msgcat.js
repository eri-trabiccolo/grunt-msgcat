/*
 * grunt-msgcat
 * https://github.com/eri-trabiccolo/grunt-msgcat
 *
 * Copyright (c) 2018 Rocco Aliberti
 * Licensed under the GPL3 license.
 */

'use strict';

var shell = require( 'shelljs' );

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerMultiTask('msgcat', 'Grunt plug-in to merge .po files with msgcat.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options;

    // Return warning if not found msgcat command
    if ( ! shell.which( 'msgcat' ) ) {
      grunt.fail.fatal( 'GNU gettext is not installed in your system PATH.' );
    }

    if ( this.files.length < 1 ) {
      grunt.verbose.warn( 'Destination not written because no source files were provided.' );
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join( grunt.util.normalizelf( grunt.util.linefeed ) );


      // Make sure grunt creates the destination folders if they don't exist.
      if( ! grunt.file.exists( '_'+f.dest ) ) {
        grunt.file.write( '_'+f.dest, '' );
      }
      // Run external tool synchronously.
      var command = 'msgcat --use-first ' + f.dest + ' ' + f.src[0] + ' -o _' + f.dest;
      //grunt.log.error( f.src[0] );
      if( shell.exec( command ).code !== 0 ) {
        grunt.log.error( 'Failed merge "*.po" files "msgcat".'.cyan );
        shell.exit(1);
      } else {
        grunt.verbose.writeln( 'File ' + f.dest.cyan + ' Created.' );
      }
    });

    // Process the Message.
    if ( this.files.length > 1 ) {
      var message = "Total merged " + this.files.length + ' ".po" files.';
      grunt.log.ok( message );
    }

  });

};