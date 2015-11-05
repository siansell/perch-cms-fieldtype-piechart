$(window).on('Perch_Init_Editors', initCharts);

$('div[id^="simona_piechart_chart_"]').each(function(index) {
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
  , top: '-10px' // Top position relative to parent
  , left: '20%' // Left position relative to parent
  , shadow: false // Whether to render a shadow
  , hwaccel: false // Whether to use hardware acceleration
  , position: 'relative' // Element positioning
  };
  console.log(this);
  var spinner = new Spinner(opts).spin(this);
  this.appendChild(spinner.el);
});

google.load('visualization', '1.0', {'packages':['corechart']});
google.setOnLoadCallback(initCharts);

var simona_piechart = [];

function initCharts() {

  $('div[id^="simona_piechart_chart_"]').each(function(index) {

    var current = this.id;
    var result = $.grep(simona_piechart, function(e){
      return e.id == current;
    });

    if (result.length == 0) {   //does the piechart already exist (blocks)

      var pc = new PieChart(this.id);

      simona_piechart.push(pc);
      var data = $('#'+this.id.replace('simona_piechart_chart_', '')+'_data').val();

      pc.setData(data);
      pc.title = $(this).attr('data-title');
      pc.is3d = $(this).attr('data-is3d');
      pc.drawChart(pc.hot);

      //update chart on title change
      $('#'+this.id.replace('simona_piechart_chart_', '') + '_title').change(function() {
        pc.title = this.value;
        pc.drawChart(pc.hot);
      });

      //update chart on is3d change
      $('#'+this.id.replace('simona_piechart_chart_', '') + '_is3d').change(function() {
        pc.is3d = ($(this).is(":checked")) ? true : false;
        pc.drawChart(pc.hot);
      });

      //update table on numberformat change
      // $('#'+this.id.replace('simona_piechart_chart_', '') + '_numberformat').change(function() {
      //   pc.numberformat = ($(this).is(":checked")) ? 'pc' : 'count';
      //   th = [
      //     'Item',
      //     ($(this).is(":checked")) ? 'Percentages' : 'Count',
      //     'Colour'
      //   ];
      //   pc.hot.updateSettings({
      //     colHeaders: th
      //   });
      //   pc.hot.render();
      //   pc.drawChart(pc.hot);
      // });

    }

  });

}

function PieChart(id) {

  this.id = id;
  this.title = 'Pie Chart';
  this.hot = 'undefined';
  this.chart = 'undefined';
  this.is3d = false;
  this.width = 460;
  this.height = 320;
  this.numberformat = 'count';

  this.drawChart = function(hot) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Item');
    data.addColumn('number', 'Count');
    var hotdata = hot.getData();
    var chartData = [];
    var colors = [];
    $.each(hotdata, function(i,o) {
      if (o.item && !isNaN(o.count)) {
        chartData.push([o.item, parseFloat(o.count)]);
      }
      if (o.color) {
        colors.push(o.color);
      }
    });
    data.addRows(chartData);
    var options = {
      'title': this.title,
      'width': this.width,
      'height': this.height,
      'colors': colors,
      'is3D': this.is3d,
    };
    var chart = new google.visualization.PieChart(document.getElementById(this.id));
    chart.draw(data, options);
    this.chart = chart;
  },

  this.updateData = function(hot) {
    var parent = this;
    var d = [];
    $.each(hot.getData(), function(i,o) {
      if (o.item && !isNaN(o.count) ) {
        d.push([o.item, parseFloat(o.count), o.color]);
      }
    });
    $('#'+parent.id.replace('simona_piechart_chart_', '')+'_data').val(JSON.stringify(d));
  },

  this.setData = function(data) {

    dataArray = JSON.parse(data);

    var tableData = [];
    $.each(dataArray, function(i,o) {
      var x = {};
      x.item = o[0];
      x.count = o[1];
      x.color = o[2];
      tableData.push(x);
    });

    var container = document.getElementById(this.id.replace('_chart_', '_data_'));
    var parent = this;
    var id = parent.id;
    this.hot = new Handsontable(container, {
      data: tableData,
      // cells: function (r, c, prop) {
      //   if (c == 1) {
      //     var cellProperties = {}
      //     cellProperties = {
      //       format: parent.numberformat == 'count' ? '0.00' : '0.00%',
      //     }
      //     return cellProperties
      //   }
      // },
      minSpareRows: 1,
      rowHeaders: false,
      colHeaders: ['Item', 'Count', 'Colour'],
      columns: [
        {data: 'item'},
        {data: 'count', type: 'numeric'},
        {data: 'color'}
      ],
      columnSorting: false,
      contextMenu: ['row_above', 'row_below', 'remove_row'],
      afterChange: function(change, source) {
        parent.updateData(this);
        parent.drawChart(this);
      },
      afterRemoveRow: function(change, source) {
        parent.updateData(this);
        parent.drawChart(this);
      },
    });

  }

};
