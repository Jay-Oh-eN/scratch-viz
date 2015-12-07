/*  TODO: ES6 modules with rollup.js
    
    Rollup.js allows us to specify exactly
    which blocks we want to import.  This
    can help to not overwhelm users if you
    only need a subset of the blocks for
    your application.  Edit these imports
    as well as the extension functions and
    descriptor below.


import * as marks from 'mark';
import * as scales from 'scale';
import * as channels from 'channel';

*/

(function(ext) {
    var win = null;
    var canvas_url = "http://jay-oh-en.github.io/scratch-viz/canvas.html";
    var viz;

    // to support multiple charts
    ext._charts = {};
    
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    var add_column = function(viz, col, name) {
        if (viz.data[0].values.length !== 0) {
            parsed = [];

            for(var i = 0; i < col.length; i++) {
                var tmp = viz.data[0].values[i];
                tmp[name] = col[i];
                parsed.push(tmp);
            }
        } else {
            parsed = col.map(function(d) {
                var tmp = {};
                tmp[name] = d;
                return tmp;
            });
        }

        return parsed;
    };

    var default_column = function(column) {
        if (typeof column == 'string') {
            data = column.split(' ');
            name = data.shift();

            scale = {
                "name": name,
                "nice": true,
                "range": null,
                "domain": {"data": "table", "field": name}
            };

            return {
                data: data.map(function(d) { return +d; }),
                name: name,
                scale: scale
            };
        } else {
            return column;
        }
    };

    var parse_non_numeric = function parse_non_numeric(column) {
        var data = [];

        if (column.search(/"|'/) !== -1) {
            var re = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
            var match = re.exec(column);

            while(match !== null) {
                data.push(match[1]);
                match = re.exec(column);
            }
        } else {
            data = column.split(' ');
        }

        return data;
    };

    ext._generate_id = function generate_id(obj) {
        //_.uniqueId('mark');
        return Object.keys(obj).length + 1
    };

    ext._new_shape = function new_shape(type) {
        var id = 'mark_' + ext._generate_id();
        ext._shapes[id] = { type: type }
        return id;
    };

    ext.init_vega = function init_vega(width, height) {
        return {
          "width": width,
          "height": height,
          "data": [
            {
              "name": "table",
              "values": []
            }
          ],
          "scales": [],
          "axes": [],
          "marks": [
            {
              "type": "symbol",
              "from": {"data": "table"},
              "properties": {
                "enter": {
                  "x": {"scale": "x", "field": ""},
                  "y": {"scale": "y", "field": ""}
                }
              }
            }
          ]
        };
    }

    ext.create_figure = function create_figure(width, height, callback) {
        var id = ext._generate_id(ext._charts);
        var vl = ext.init_vega(width, height);

        ext._charts[id] = { chart: vl, width: width, height: height };
        viz = vl;

        if(win === null || win.closed !== false){
          win = window.open(canvas_url);

          window.addEventListener("message", function(event) {
            if (event.origin !== 'http://jay-oh-en.github.io')
                return;

            if (event.data === 'loaded') {
                console.log('Popup opened... Continuing with Scratch blocks');
                callback();
            } else {
                console.log(event.data);
                return;
            }
          }, false);
      } else {
        callback();
      }
    };

    ext.circle = function circle() {
        viz.marks[0].type = "symbol";
        viz.marks[0].properties.enter.fillOpacity = {"value": 0.7};
        viz.marks[0].properties.enter.size = {"value": 20};
        viz.marks[0].properties.update = {
            "fill": {"value": "#3182bd"}
        };

        viz.marks[0].properties.hover = {
            "fill": {"value": "#FFBF00"}
        };
    };

    ext.rectangle = function rectangle() {
        viz.marks[0].type = "rect";
        viz.marks[0].properties.enter.y2 = {"scale": "y", "value": 0};
        viz.marks[0].properties.enter.width = {
            "scale": "x",
            "band": true,
            "offset": -1
        };

        viz.marks[0].properties.update = {
            "fill": {"value": "#3182bd"}
        };
        
        viz.marks[0].properties.hover = {
            "fill": {"value": "#FFBF00"}
        };
    };

    ext.line = function line() {
        viz.marks[0].type = "line";
        viz.marks[0].properties.enter.stroke = {
            "value": "#3182bd"
        };
    };

    ext.area = function area() {
        viz.marks[0].type = "area";
        viz.marks[0].properties.enter.y2 = {"scale": "y", "value": 0};
        viz.marks[0].properties.update = {
            "fill": {"value": "#3182bd"}
        };
        
        viz.marks[0].properties.hover = {
            "fill": {"value": "#FFBF00"}
        };
    };

    // ext.arc = function arc() {
    //     viz.marks[0].type = "arc";
    // };

    ext.x_pos = function(column) {
        var params = default_column(column);

        viz.data[0].values = add_column(viz, params.data, params.name);
        
        params.scale.name = "x";
        params.scale.range = "width";

        viz.scales.push(params.scale);

        viz.axes.push({
            "type": "x",
            "scale": "x",
            //"offset": 5,
            //"ticks": 5,
            "title": params.name
        });

        viz.marks[0].properties.enter.x.field = params.name;
    };

    ext.y_pos = function(column) {
        var params = default_column(column);

        viz.data[0].values = add_column(viz, params.data, params.name);
        
        params.scale.name = "y";
        params.scale.range = "height";

        viz.scales.push(params.scale);

        viz.axes.push({
            "type": "y",
            "scale": "y",
            //"offset": 5,
            //"ticks": 5,
            "title": params.name
        });

        viz.marks[0].properties.enter.y.field = params.name;
    };

    ext.attr_size = function(column, min, max) {
        var params = default_column(column);

        viz.data[0].values = add_column(viz, params.data, params.name);
        
        params.scale.name = "size";
        params.scale.range = [min, max];

        viz.scales.push(params.scale);

        viz.marks[0].properties.enter.size = {
            "scale": "size",
            "field": params.name
        };
    };

    ext.attr_color = function(column) {
        var params = default_column(column);

        viz.data[0].values = add_column(viz, params.data, params.name);
        
        params.scale.name = "c";
        params.scale.type = "ordinal";
        params.scale.range = "category10";

        viz.scales.push(params.scale);

        viz.legends = [
            {
              "fill": "c",
              "title": params.name,
              "offset": 10
            }
          ];

        viz.marks[0].properties.enter.fill = {
            "scale": "c",
            "field": params.name
        };

        viz.marks[0].properties.update.fill = {
            "scale": "c",
            "field": params.name
        };
    };

    ext.scale_log = function scale_log(column) {
        var data = column.split(' ');
        var name = data.shift();
        var numeric = data.map(function(d) { return +d; });

        var payload = {
            data: numeric,
            name: name,
            scale: {
                "name": name,
                "nice": true,
                "type": "log",
                "range": null,
                "domain": {"data": "table", "field": name}
            }
        };

        return payload;
    };

    ext.scale_ordinal = function scale_ordinal(column) {
        var data = parse_non_numeric(column);
        var name = data.shift();

        var payload = {
            data: data,
            name: name,
            scale: {
                "name": name,
                "nice": true,
                "type": "ordinal",
                "range": null,
                "domain": {"data": "table", "field": name}
            }
        }

        return payload;
    };

    ext.scale_time = function scale_time(column) {
        var data = parse_non_numeric(column);
        var name = data.shift();

        var date = {};
        date[name] = "date";

        viz.data[0].format = {
            "type": "json",
            "parse": date
        };

        var payload = {
            data: data,
            name: name,
            scale: {
                "name": name,
                "nice": true,
                "type": "time",
                "range": null,
                "domain": {"data": "table", "field": name}
            }
        };

        return payload;
    };

    ext.scale_pow = function scale_pow(column, exp) {
        var data = column.split(' ');
        var name = data.shift();
        var numeric = data.map(function(d) { return +d; });

        var payload = {
            data: numeric,
            name: name,
            scale: {
                "name": name,
                "nice": true,
                "type": "pow",
                "exponent": exp,
                "range": null,
                "domain": {"data": "table", "field": name}
            }
        };

        return payload;
    };

    ext.scale_sqrt = function scale_sqrt(column) {
        var data = column.split(' ');
        var name = data.shift();
        var numeric = data.map(function(d) { return +d; });

        var payload = {
            data: numeric,
            name: name,
            scale: {
                "name": name,
                "nice": true,
                "type": "sqrt",
                "range": null,
                "domain": {"data": "table", "field": name}
            }
        };

        return payload;
    };

    ext.title = function title(content) {
        viz.axes.push({
          "type": "x",
          "scale": "x",
          "title": content,
          "orient": "top",
          "values": [],
          "properties": {
            "title": {
              "fontSize": {
                "value": 20
              }
            },
            "axis": {
              "strokeOpacity": {
                "value": 0
              }
            }
          }
        });
    };

    ext.draw = function draw() {
        debugger;
        console.log('Drawing chart now');

        win.postMessage(viz, canvas_url);

        console.log('Posted message!');
    };

    // Block and block menu descriptions.
    // Comment out any you want to hide from interface.
    var descriptor = {
        blocks: [
        ['w', 'Chart width: %n height: %n', 'create_figure', 960, 500],
        [' ', 'circle', 'circle'],
        [' ', 'rectangle', 'rectangle'],
        [' ', 'line', 'line'],
        [' ', 'area', 'area'],
        // [' ', 'arc', 'arc'],
        [' ', 'x %s', 'x_pos', 'column'],
        [' ', 'y %s', 'y_pos', 'column'],
        [' ', 'size %s min: %n max: %n', 'attr_size','column', 5, 500],
        [' ', 'color %s', 'attr_color', 'column'],
        ['r', 'log %s', 'scale_log', 'column'],
        ['r', 'ordinal %s', 'scale_ordinal', 'column'],
        ['r', 'time %s', 'scale_time', 'column'],
        ['r', 'pow %s exponent: %n', 'scale_pow', 'column', 2],
        ['r', 'sqrt %s', 'scale_sqrt', 'column'],
        [' ', 'title %s', 'title', "My Awesome Chart"],
        [' ', 'draw', 'draw']
        ]
    };

    // Register the extension
    ScratchExtensions.register('Scratch Viz', descriptor, ext);
})({});