if (typeof jQuery == 'undefined') {
  document.write('<scr'+'ipt type="text\/javascript" src="/perch/core/assets/js/jquery-1.11.3.min.js"><'+'\/sc'+'ript>');
}
if (typeof google == 'undefined') {
  document.write('<scr'+'ipt type="text\/javascript" src="https://www.google.com/jsapi"><'+'\/sc'+'ript>');
}

if (typeof CMSPieChart == 'undefined') {
  CMSPieChart  = {};
}

CMSPieChart.UI = function()
{

  var init  = function() {
    if (CMSPieChart.charts.length) {
      var options = {packages: ['corechart'], callback : draw_charts};
      google.load('visualization', '1.0', options);
    }
  };

  function draw_charts() {

    setTimeout(function() { //wait for google to load as setonloadcallback notg working?!

      // console.log(google);
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
          'is3D':chart['is3d']
        };

        // console.log(document.getElementById(chart.chart_id));

        // Instantiate and draw our chart, passing in some options.
        var c = new google.visualization.PieChart(document.getElementById(chart.chart_id));
        c.draw(data, options);

      };

    }, 3000);

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
