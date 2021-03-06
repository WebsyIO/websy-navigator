module.exports = function(grunt) {
  grunt.initConfig({
    includes: {
      main: {
        src: ['navigator.js'],
        dest: 'temp/',
        cwd: 'src/js'
      }
    },
    watch: {
      styles: {
        files: ['src/**/*.js','src/less/**/*.less'], // which files to watch
        tasks: ['includes','babel','uglify','less','copy'],
        options: {
          nospawn: true,
          livereload: true
        }
      }
    },
    less:{
      main: {
        options: {
          compress: false,
          yuicompress: false,
          optimization: 2
        },
        files: [
          {"dist/websy-navigator.min.css":"src/less/main.less"}
        ]
      }
    },
    babel: {
  		options: {
  			sourceMap: false,
  			"presets": ["@babel/preset-env"],
				"plugins": ["@babel/plugin-transform-object-assign"]  		
  		},
  		dist: {
  			files: [
          {
    				'temp/websy-navigator-pre.js': 'temp/navigator.js'
    			}
        ]
  		}
  	},
    uglify:{
      options : {
        beautify : false,
        mangle   : {
          properties: false,
          reserved: ["onPopState"]
        },
        reserveDOMProperties: true,
        reserved: ["onPopState"],
        compress : true
      },
      build: {
        files: [
          {"dist/websy-navigator.min.js":"temp/websy-navigator-pre.js"}
        ]
      }
    },    
    copy: {
      main: {
        files: [
          { src: ['temp/websy-navigator-pre.js'], dest: 'examples/resources/websy-navigator.min.js'},
          { src: ['dist/websy-navigator.min.css'], dest: 'examples/resources/websy-navigator.min.css'},
          {
						src: ['temp/navigator.js'],
						dest: 'dist/websy-navigator.debug.js'
					}
        ],
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.registerTask('default', ['copy','includes','babel','uglify','less','copy','watch']);
  grunt.registerTask('build', ['copy','includes','babel','uglify','less','copy']);
};
