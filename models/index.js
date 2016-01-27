var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var statuses = ['open','closed'];

var pageSchema = new Schema({
  title:    {type: String, required: true},
  urlTitle: {type: String, required: true},
  content:  {type: String, required: true},
  status:   {type: String, enum: statuses},
  date:     {type: Date, default: Date.now},
  tags:      {type: Array},
  author:   {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}

pageSchema.pre('save', function(next, done){
  this.urlTitle = generateUrlTitle(this.title);
  next();
});

// find similar
pageSchema.methods.findSimilarTypes = function () {
  return this.model('Page').find({ urlTitle: { $ne: this.urlTitle } }, { tags: { $in: this.tags } });
  // return this.model('Page').find({ tags: { $in: this.tags } }, { urlTitle: { $ne: this.urlTitle } } );
};

pageSchema.statics.findByTag = function(tag){
  return this.find({ tags: {$elemMatch: { $eq: tag } } } ).exec();
};

pageSchema.virtual('route').get(function (){
	return "/wiki/" + this.urlTitle;
});

var userSchema = new Schema({
  name: String,
  email: {type: String, unique: true}
});

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  Page: Page,
  User: User
};