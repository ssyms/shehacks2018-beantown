var express = require('express');
var router = express.Router();
var my_insights;

function parentId(tweet) {
  if (tweet.in_reply_to_screen_name != null) {
    return tweet.in_reply_to_user_id;
  } else if (tweet.retweeted && (tweet.current_user_retweet != null)) {
    return tweet.current_user_retweet.id_str;
  }
};

function toContentItem(tweet) {
  return {
    id: tweet.id_str,
    language: tweet.lang,
    contenttype: 'text/plain',
    content: tweet.text.replace('[^(\\x20-\\x7F)]*',''),
    created: Date.parse(tweet.created_at),
    reply: tweet.in_reply_to_screen_name != null,
    parentid: parentId(tweet)
  };
};

function get_insights(params) {
  var res = {};

  const PersonalityInsightsV3 =
      require('watson-developer-cloud/personality-insights/v3');

  var url = params.url || 'https://gateway.watsonplatform.net/personality-insights/api' ;
  var use_unauthenticated =  params.use_unauthenticated || false ;

  const personality_insights = new PersonalityInsightsV3({
      'version_date': '2016-05-20',
      "url": "https://gateway.watsonplatform.net/personality-insights/api",
      "username": "4966fd78-48c9-4a5d-a258-d374138fc5dd",
      "password": "i0mSXScBcdph"
    });

    personality_insights.profile(params,
      function(err, response) {
        if (err) {
          console.log('error:', err);
        } else {
          my_insights = JSON.stringify(response, null, 2);
        }
      }
    );
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var loading = false;
  res.render('index', { title: 'Express', json: my_insights});
});

router.post('/profile', function(req, res, next) {
  console.log(req.body);
  loading = true;
  var Twit = require('twit');
  var T = new Twit({
    consumer_key: 'pY2FCyJlHkbfZh5k7zzTAl957',
    consumer_secret: 'lehQuMJRkae5kjEkn67WKIcjaHX37iwsLkOtwzDtyp2wMEH4Bx',
    access_token: '155794248-o0GuQi1zdyTZGmR9XeGJEO0X3NWljbhGzNCQSqI6',
    access_token_secret: 'i0JA19er0lYZWZkerCarEF7WGotkunFHdBKUkt7axvsXy'
  })

  var options = { screen_name: req.body.username,
                  count: 600 };

  T.get('statuses/user_timeline', options , function(err, data) {
    var params = {};
    params.content_items = data.map(toContentItem);
    get_insights(params);
  });
  loading = false;
  res.render('profile', { title: req.body.username, json: my_insights});
});

module.exports = router;
