var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the database
mongoose.connect('mongodb+srv://test:test@cluster0-juezr.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }) ;

//Create a schema = this is like a blueprint

var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);
// var itemOne = Todo({item: 'buy flowers'}).save(function(err){
//     if (err) throw err;
//     console.log('item saved');
// });

// var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kickass some code'}]
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app) {

    app.get('/todo', function(req, res){
        //get data from mongoDB and pass it to view
        Todo.find({}, function(err, data) {
            if (err) throw err;
            res.render('todo', {todos: data});
        });

    });

    app.post('/todo', urlencodedParser, function(req, res){
        //get data from the view and added to mongoDB
        var newTodo = Todo(req.body).save(function(err,data) {
            if (err) throw err;
            res.json(data);
        });

    });

    app.delete('/todo/:item', function(req, res) {
        //delete the requested item from mongoDB
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).deleteOne(function(err,data){
            if (err) throw err;
            res.json(data);
        });
    });

};