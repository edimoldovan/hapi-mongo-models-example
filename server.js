var Hapi = require("hapi");
var server = new Hapi.Server();
var hapiMongoModels = {
  register: require("hapi-mongo-models"),
  options: {
    mongodb: {
      url: "mongodb://localhost:27017/example",
      settings: {}
    },
    autoIndex: false,
    models: {
      users: "./models/users"
    }
  }
};

server.register(hapiMongoModels, function (err) {
  if (err) {
    console.log("Failed loading plugin");
  }
});

server.connection({ 
  host: "localhost", 
  port: 8000 
});

server.route({
  method: "GET",
  path:"/api/{namespace}/{id?}", 
  handler: function (request, reply) {
    var namespace = request.params.namespace;
    var model = require("./models/" + namespace);
    var page = request.url.query.page ? parseInt(request.url.query.page, 10) : 1;
    var id = request.params.id ? encodeURIComponent(request.params.id) : null;

    if (hapiMongoModels.options.models[namespace]) {
      if (id) {
        model.findById(id, function(err, result) {
          if (err) {
            reply(err);
          }
          reply(result);
        });
      } else {
        model.pagedFind({}, "name email", {}, 100, page, function(err, results) {
          if (err) {
            reply(err);
          }
          reply(results);
        });
      }
    } else {
      reply({error:"not available"}).code(404);
    }
  }
});

server.route({
  method: "POST",
  path:"/api/{namespace}", 
  handler: function (request, reply) {
    var namespace = request.params.namespace;
    var model = require("./models/" + namespace);

    if (hapiMongoModels.options.models[namespace]) {
      model.insert(request.payload, function(err, results) {
        if (err) {
          reply(err);
        }
        reply(results);
      });
    } else {
      reply({error:"not available"}).code(404);
    }
  }
});

server.start(function () {
  console.log("Server running at:", server.info.uri);
});











