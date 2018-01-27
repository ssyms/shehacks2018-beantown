var width = 960,
    height = 500,
    root;

var force = d3.layout.force()
    .linkDistance(80)
    .charge(-120)
    .gravity(.05)
    .size([width, height])
    .on("tick", tick);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

d3.json("graph.json", function(error, json) {
  if (error) throw error;

  root = json;
  update();
});

function update() {
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);

  // Restart the force layout.
  force
      .nodes(nodes)
      .links(links)
      .start();

  // Update links.
  link = link.data(links, function(d) { return d.target.id; });

  link.exit().remove();

  link.enter().insert("line", ".node")
      .attr("class", "link");

  // Update nodes.
  node = node.data(nodes, function(d) { return d.id; });

  node.exit().remove();

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .on("click", click)
      .call(force.drag);

  nodeEnter.append("circle")
      .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; });

  nodeEnter.append("text")
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

  node.select("circle")
      .style("fill", color);
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function color(d) {
  return d._children ? "#3182bd" // collapsed package
      : d.children ? "#c6dbef" // expanded package
      : "#fd8d3c"; // leaf node
}

// Toggle children on click.
function click(d) {
  if (d3.event.defaultPrevented) return; // ignore drag
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update();
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}

$( document ).ready(function() {
    console.log( "ready!" );
    console.log(data);
    var i,
    s,
    N = 100,
    E = 500,
    g = {
      nodes: [],
      edges: []
    };
    // Generate a random graph:
    var personality_traits = data['personality'];
    for (var i = 0; i < personality_traits.length; i++)
      g.nodes.push({
        id: 'n' + i,
        label: personality_traits[i].name,
        x: Math.random(),
        y: Math.random(),
        size: 100*personality_traits[i].percentile,
        color: '#666'
      });

    /* for (i = 0; i < E; i++)
      g.edges.push({
        id: 'e' + i,
        source: 'n' + (Math.random() * N | 0),
        target: 'n' + (Math.random() * N | 0),
        size: Math.random(),
        color: '#ccc'
      }); */
    // Instantiate sigma:
    s = new sigma({
      graph: g,
      container: 'graph-container'
    });
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
