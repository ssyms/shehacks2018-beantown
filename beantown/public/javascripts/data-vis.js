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

    var needs = data['needs'];
    var my_series = [];
    var my_labels = [];
    var max_value = needs[0];
    for(var i = 0; i < 7; i++) {
      var cname = "donutClass" + (i % 12);
      if(max_value.percentile < needs[i].percentile) max_value = needs[i];
      my_series.push({
        value: (1000 * needs[i].percentile),
        className: cname
      });
      my_labels.push(needs[i].name);
    }
    var chart = new Chartist.Pie('.ct-chart', {
      series: my_series,
      labels: my_labels
    }, {
      donut: true,
      showLabel: true
    });


    $("#values").text("You would work best in an environment that values " + max_value.name);
    val_descrpitions = {
      'Challenge': 'Make sure you work someplace you find interesting! You work well under pressure.',
      'Closeness': "You work best when you're surrounded by friends. Get to know the company culture before accepting a job.",
      'Curiosity': "Curiosity killed the cat, but satisfaction brought it back. You enjoy exploring new things!",
      'Excitement': "Some workplaces work at a faster pace than others. Make sure the culture is up to your speed.",
      'Harmony': "You prefer working in a peaceful environment. Be careful of high pressure workpaces.",
      'Ideal': "Your want a company as idealistic as you! Visiting the office will give you a better sense of the company culture.",
      'Liberty': "You like having your independence, so find a workplace with a lot of freedom.",
      'Love': 'You care about others and want them to care about you.',
      'Practicality': 'You prefer solving practical problems, rather than moonshots.',
      'Self-expression': "You work best in companies that give you the freedom to be yourself at work. Check out the company handbook before you take a job to get a sense of how restrictive it is.",
      'Stability': "You prefer working in companies that are more well-established. Startups might not be for you.",
      'Structure': "You like it when a company hasa clear chain of command and a solid work flow."
    }
    $("#val_description").text(val_descrpitions[max_value.name]);

    chart.on('draw', function(data) {
      if(data.type === 'slice') {
        // Get the total path length in order to use for dash array animation
        var pathLength = data.element._node.getTotalLength();

        // Set a dasharray that matches the path length as prerequisite to animate dashoffset
        data.element.attr({
          'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
        });

        // Create animation definition while also assigning an ID to the animation for later sync usage
        var animationDefinition = {
          'stroke-dashoffset': {
            id: 'anim' + data.index,
            dur: 1000,
            from: -pathLength + 'px',
            to:  '0px',
            easing: Chartist.Svg.Easing.easeOutQuint,
            // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
            fill: 'freeze'
          }
        };

        // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
        if(data.index !== 0) {
          animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
        }

        // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
        data.element.attr({
          'stroke-dashoffset': -pathLength + 'px'
        });

        // We can't use guided mode as the animations need to rely on setting begin manually
        // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
        data.element.animate(animationDefinition, false);
      }
    });

    // For the sake of the example we update the chart every time it's created with a delay of 8 seconds
    chart.on('created', function() {
      if(window.__anim21278907124) {
        clearTimeout(window.__anim21278907124);
        window.__anim21278907124 = null;
      }
      window.__anim21278907124 = setTimeout(chart.update.bind(chart), 10000);
    });

    var behave = data['behavior'];

    var be_series = [];
    for(var i = 0; i < behave.length; i++) {
      if(behave[i].name == 'Sunday') {
        be_series.push(behave[i].percentage*100)
      }
      if(behave[i].name == 'Monday') {
        be_series.push(behave[i].percentage*100)
      }
      if(behave[i].name == 'Tuesday') {
        be_series.push(behave[i].percentage*100)
      }
      if(behave[i].name == 'Wednesday') {
        be_series.push(behave[i].percentage*100)
      }
      if(behave[i].name == 'Thursday') {
        be_series.push(behave[i].percentage*100)
      }
      if(behave[i].name == 'Friday') {
        be_series.push(behave[i].percentage*100)
      }
      if(behave[i].name == 'Saturday') {
        be_series.push(behave[i].percentage*100)
      }
    }
    var barchart = new Chartist.Bar('.ct-chart-bar', {
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      series: [be_series]
    }, {
      stackBars: false
    })

    barchart.on('draw', function(data) {
      if(data.type === 'bar') {
        data.element.attr({
          style: 'stroke-width: 30px'
        });
      }
    });


});
