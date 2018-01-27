$( document ).ready(function() {
    console.log( "ready!" );
    console.log(data);
    var sigRoot = document.getElementById('sig');
    var sigInst = sigma.init(sigRoot).drawingProperties({
      defaultLabelColor: '#ccc',
      font: 'Arial',
      edgeColor: 'source',
      defaultEdgeType: 'curve'
    }).graphProperties({
      minNodeSize: 1,
      maxNodeSize: 10
    });

    sigInst.addNode('hello',{
      label: 'Hello',
      color: '#ff0000',
      x: 1
    }).addNode('world',{
      label: 'World !',
      color: '#00ff00',
      x: 2
    }).addEdge('hello_world','hello','world').draw();
    /* var myChart = Highcharts.chart('container', {

      chart: {
          polar: true
      },

      title: {
          text: 'Highcharts Polar Chart'
      },

      pane: {
          startAngle: 0,
          endAngle: 360
      },

      xAxis: {
          tickInterval: 45,
          min: 0,
          max: 360,
          labels: {
              formatter: function () {
                  return this.value + '°';
              }
          }
      },

      yAxis: {
          min: 0
      },

      plotOptions: {
          series: {
              pointStart: 0,
              pointInterval: 45
          },
          column: {
              pointPadding: 0,
              groupPadding: 0
          }
      },

      series: [{
          type: 'column',
          name: 'Column',
          data: [8, 7, 6, 5, 4, 3, 2, 1],
          pointPlacement: 'between'
      }, {
          type: 'line',
          name: 'Line',
          data: [1, 2, 3, 4, 5, 6, 7, 8]
      }, {
          type: 'area',
          name: 'Area',
          data: [1, 8, 2, 7, 3, 6, 4, 5]
      }]
  }); */
});
