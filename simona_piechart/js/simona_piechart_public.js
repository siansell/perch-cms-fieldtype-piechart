if (typeof jQuery == 'undefined') {
  document.write('<scr'+'ipt type="text\/javascript" src="/perch/core/assets/js/jquery-1.11.3.min.js"><'+'\/sc'+'ript>');
}

if (!googleloaded) {
  document.write('<scr'+'ipt type="text\/javascript" src="https://www.google.com/jsapi"><'+'\/sc'+'ript>');
  var googleloaded = true;
}

if (!spinjsloaded) {
  document.write('<scr'+'ipt type="text\/javascript" src="/perch/addons/fieldtypes/simona_piechart/js/spin.min.js"><'+'\/sc'+'ript>');
  var spinjsloaded = true;
}

if (typeof CMSPieChart == 'undefined') {
  CMSPieChart  = {};
}

CMSPieChart.UI = function()
{

  var init  = function() {

    if (CMSPieChart.charts.length) {

      $('div[id^="simona_piechart_"]').each(function(index) {
        var opts = {
          lines: 13 // The number of lines to draw
        , length: 4 // The length of each line
        , width: 6 // The line thickness
        , radius: 10 // The radius of the inner circle
        , scale: 1 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#000' // #rgb or #rrggbb or array of colors
        , opacity: 0 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '30px' // Top position relative to parent
        , left: '10%' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'relative' // Element positioning
        };
        // console.log(this);
        var spinner = new Spinner(opts).spin(this);
        this.appendChild(spinner.el);
      });

      var options = {packages: ['corechart'], callback : draw_charts};
      google.load('visualization', '1.0', options);

    }

  };

  function draw_charts() {

      var chart = {};
      for (i=0;i<CMSPieChart.charts.length;i++) {

        chart = CMSPieChart.charts[i];

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Item');
        data.addColumn('number', 'Count');
        var chartData = [];
        var colors = [];
        var json =JSON.parse(chart['data']);
        $.each(json, function(i,o) {
          chartData.push([o[0], parseFloat(o[1])]);
          colors.push(o[2]);
        });
        data.addRows(chartData);

        // Set chart options
        var options = {
          'title':chart['title'],
          'width':chart['width'],
          'height':chart['height'],
          'colors': colors,
          'is3D':chart['is3d'],
        };

        // Instantiate and draw our chart, passing in some options.
        var c = new google.visualization.PieChart(document.getElementById(chart.chart_id));
        c.draw(data, options);

      };

  };

  return {
    init: init,
  };

}();

CMSPieChart.Loader = function(){

  var func = CMSPieChart.UI.init;
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    };
  }
}();
