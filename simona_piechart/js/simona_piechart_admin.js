google.load('visualization', '1.0', {'packages':['corechart']});
google.setOnLoadCallback(initCharts);

var simona_piechart = [];

function initCharts() {

  $('div[id^="simona_piechart_chart_"]').each(function(index) {

    var pc = new PieChart(this.id);
    simona_piechart.push(pc);
    var data = $('#'+this.id.replace('simona_piechart_chart_', '')+'_data').val();
    // console.log(data);
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

  });

}

function PieChart(id) {

  this.id = id;
  this.title = 'Pie Chart';
  this.hot = 'undefined';
  this.chart = 'undefined';
  this.is3d = false;

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
      'width': 460,
      'height': 320,
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
    // console.log(d);
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
    this.hot = new Handsontable(container, {
      data: tableData,
      minSpareRows: 1,
      rowHeaders: false,
      colHeaders: ['Item', 'Count', 'Colour'],
      columns: [
        {data: 'item'},
        {data: 'count', type: 'numeric'},
        {data: 'color'}
      ],
      columnSorting: true,
      contextMenu: true,
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
