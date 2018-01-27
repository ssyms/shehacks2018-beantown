var width = 1250,
    height = 800,
    root;

var force = d3.layout.force()
    .linkDistance(80)
    .charge(-120)
    .gravity(.05)
    .size([width, height])
    .on("tick", tick);

var svg = d3.select("#graph-container").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

function flatten_data(data) {
  var graph = {
   "name": "You",
   "size": 100000,
   "children": []
  }
  var personality = data['personality'];
  for(var i = 0; i < personality.length; i++) {

    var gr = {
      name: personality[i].name,
      children: [],
      size: (75000*personality[i].percentile)
    };

    for(var j = 0; j < personality[i].children.length; j++) {
      gr.children.push({
        name: personality[i].children[j].name,
        size: (40000*personality[i].children[j].percentile)
      })
    }
    graph.children.push(gr);

  }
  return graph;
}

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
  return d._children ? "#96ceb4" // collapsed package
      : d.children ? "#ffcc5c" // expanded package
      : "#88d8b0"; // leaf node
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
    var descriptions = {
      'Openness': {
        'high': 'A person with a high level of openness to experience in a personality test enjoys trying new things. Jobs such as advertising, research, and other artistic occupations all benefit from high openness.',
        'low': 'A person who scores low in openness on a career test may excel in jobs that involve routine work and do not require creativity.'
      },
      'Conscientiousness': {
        'high': 'These individuals are dependable, organized, and persevere, which means they will accomplish their professional goals. Research shows that the conscientiousness personality trait relates to job performance across different types of occupations.',
        'low': 'People who score low on conscientiousness tend to be laid back, less goal-oriented, and less driven by success.'
      },
      'Extraversion': {
        'high': 'Individuals high in extraversion on a career test have a tendency to seek out the company and stimulation of other people. They enjoy engaging with the external world.',
        'low': 'Introverts get their energy from within themselves. They are self-motivated and at their best when working solo.'
      },
      'Agreeableness': {
        'high': 'Agreeable individuals find it important to get along with others, giving them an advantage for building teams and maintaining harmony on the work floor.',
        'low': 'People who score low on agreeableness in a personality test often make excellent scientists, critics, or soldiers.'
      },
      'Emotional range': {
        'high': 'A person who has a high level of emotional stability is preferred in most professions because they have more control over their emotions at work.',
        'low': 'Employees with low emotional stability should avoid high stress work, as they are more likely to be distracted by deadlines and pressure.'
      },
    }
    d3.json("graph.json", function(error, json) {
      if (error) throw error;
      var personality_traits = data['personality'];
      console.log(json);
      root = flatten_data(data);
      console.log(root);
      update();
    });

    var personality = data['personality'];
    var first_trait = personality[0];
    var second_trait = personality[0];
    var worst_trait = personality[0];
    for(var i = 0; i < personality.length; i++) {
      if(personality[i].percentile > first_trait.percentile) {
        first_trait = personality[i];
      } else if (personality[i].percentile > second_trait.percentile) {
        second_trait = personality[i];
      }

      if(personality[i].percentile < worst_trait.percentile) {
        worst_trait = personality[i];
      }


    }
    $('#myDiv').append("<ul id='newList' class='traitList'></ul>");
    $("#newList").append("<li>"+descriptions[first_trait.name]["high"]+"</li><br>");

    $("#newList").append("<li>"+descriptions[second_trait.name]["high"]+"</li><br>");

    $("#newList").append("<li>"+descriptions[worst_trait.name]["low"]+"</li><br>");
    $("#highest").text("Looks like you scored highest on " + first_trait.name);
    var delay_time = 400;
    /*$("#my_list ul li").each(function() {
        $(this).delay(delay_time).animate({"top" : "+=20px"}, "fast");
    });*/
});
