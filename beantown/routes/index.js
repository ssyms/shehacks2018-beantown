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
          return 'error!';
        } else {
          console.log(JSON.stringify(response, null, 2));
          return JSON.stringify(response, null, 2);
        }
      }
    );
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var insights = get_insights(defaultParameters);
  console.log(insights);
  res.render('index', { title: 'Express', json: insights});
});

module.exports = router;
