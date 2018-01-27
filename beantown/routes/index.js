var express = require('express');
var router = express.Router();

const defaultParameters = {
  'textToAnalyze':
      'Call me Ishmael. Some years ago-never mind how long precisely-having \
      little or no money in my purse, and nothing particular to interest \
      me on shore, I thought I would sail about a little and see the \
      watery part of the world. It is a way I have of driving off the \
      spleen and regulating the circulation. Whenever I find myself \
      growing grim about the mouth; whenever it is a damp, drizzly \
      November in my soul; whenever I find myself involuntarily pausing \
      before coffin warehouses, and bringing up the rear of every \
      funeral I meet; and especially whenever my hypos get such an upper \
      hand of me, that it requires a strong moral principle to prevent \
      me from deliberately stepping into the street, and methodically \
      knocking people\'s hats off-then, I account it high time to get to \
      sea as soon as I can. This is my substitute for pistol and ball. \
      With a philosophical flourish Cato throws himself upon his sword; \
      I quietly take to the ship. There is nothing surprising in this. \
      If they but knew it, almost all men in their degree, some time or \
      other, cherish very nearly the same feelings towards the ocean \
      with me. There now is your insular city of the Manhattoes, belted \
      round by wharves as Indian isles by coral reefs-commerce surrounds \
      it with her surf. Right and left, the streets take you waterward.',
  'username':      '"4966fd78-48c9-4a5d-a258-d374138fc5dd',
  'password':      'i0mSXScBcdph',
  'url' : 'https://sandbox-watson-proxy.mybluemix.net/personality-insights/api',
  'use_unauthenticated' : true
}

var my_insights = '';

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

    personality_insights.profile(
      {
        content: params.textToAnalyze,
        content_type: 'text/plain',
        consumption_preferences: true
      },
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
  var insights = get_insights(defaultParameters);

  var Twit = require('twit');
  var T = new Twit({
    consumer_key: 'pY2FCyJlHkbfZh5k7zzTAl957',
    consumer_secret: 'lehQuMJRkae5kjEkn67WKIcjaHX37iwsLkOtwzDtyp2wMEH4Bx',
    access_token: '155794248-o0GuQi1zdyTZGmR9XeGJEO0X3NWljbhGzNCQSqI6',
    access_token_secret: 'i0JA19er0lYZWZkerCarEF7WGotkunFHdBKUkt7axvsXy'
  })

  var options = { screen_name: 'billnye',
                  count: 600 };

  T.get('statuses/user_timeline', options , function(err, data) {
    var params = {};
    params.content_items = data.map(toContentItem);
    get_insights(params);
  });
  res.render('index', { title: 'Express', json: my_insights});
});

module.exports = router;
