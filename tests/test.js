QUnit.done = function(results){
  if (results.failed) {
    console.log("failed"); 
  } else {
    console.log("success");
  }
};

$(document).ready(function() {
  var LibraryLocal = Backbone.Collection.extend({
      localStorage: new Backbone.LocalStorage("libraryStore")
    }),
    LibrarySession = Backbone.Collection.extend({
      sessionStorage: new Backbone.SessionStorage("libraryStore")
    }),
    attrs = {
      title  : 'The Tempest',
      author : 'Bill Shakespeare',
      length : 123
    },
    libraryLocal = null,
    librarySession = null;
    
  module("localStorage on collections", {
      setup: function() {
          window.localStorage.clear();
          libraryLocal = new LibraryLocal();
      }
  });
  
  test("should be empty initially", function() {
      equals(libraryLocal.length, 0, 'empty initially');
      libraryLocal.fetch();
      equals(libraryLocal.length, 0, 'empty read');
  });
  
  test("should create item", function() {
      libraryLocal.create(attrs);
      equals(libraryLocal.length, 1, 'one item added');
      equals(libraryLocal.first().get('title'), 'The Tempest', 'title was read');
      equals(libraryLocal.first().get('author'), 'Bill Shakespeare', 'author was read');
      equals(libraryLocal.first().get('length'), 123, 'length was read');
  });
  
  test("should discard unsaved changes on fetch", function() {
        libraryLocal.create(attrs);
        libraryLocal.first().set({ 'title': "Wombat's Fun Adventure" });
        equals(libraryLocal.first().get('title'), "Wombat's Fun Adventure", 'title changed, but not saved');
        libraryLocal.fetch();
        equals(libraryLocal.first().get('title'), 'The Tempest', 'title was read');
  });
  
  test("should persist changes", function(){
        libraryLocal.create(attrs);
        equals(libraryLocal.first().get('author'), 'Bill Shakespeare', 'author was read');
        libraryLocal.first().save({ author: 'William Shakespeare' });
        libraryLocal.fetch();
        equals(libraryLocal.first().get('author'), 'William Shakespeare', 'verify author update');
  });

  test("should pass attributes to parse after creating", function() {
    var book = new Backbone.Model(attrs);
    book.collection = libraryLocal;
    
    book.parse = function(savedAttrs) {
      equal(savedAttrs.title, attrs.title, 'attributes passed to parse')
      equal(savedAttrs.author, attrs.author, 'attributes passed to parse')
      equal(savedAttrs.length, attrs.length, 'attributes passed to parse')
    };
    
    book.save();
  });
  
  test("should pass attributes to parse after updating", function() {
    var book = libraryLocal.create(attrs);
    
    book.parse = function(savedAttrs) {
      equal(savedAttrs.title, attrs.title, 'attributes passed to parse')
      equal(savedAttrs.author, attrs.author, 'attributes passed to parse')
      equal(savedAttrs.length, attrs.length, 'attributes passed to parse')
    };
    
    book.save();
  });

  test("should store model id inside collection", function() {
    var book = libraryLocal.create(attrs);
    equals(libraryLocal.get(book.id), book, 'book has been read by id from collection');
  });

    test("should allow to change id", function() {
        libraryLocal.create(attrs);
        libraryLocal.first().save({id: '1-the-tempest', author: 'William Shakespeare'});
        equals(libraryLocal.first().get('id'), '1-the-tempest', 'verify ID update');
        equals(libraryLocal.first().get('title'), 'The Tempest', 'verify title is still there');
        equals(libraryLocal.first().get('author'), 'William Shakespeare', 'verify author update');
        equals(libraryLocal.first().get('length'), 123, 'verify length is still there');
    
    libraryLocal.fetch();
    equals(libraryLocal.length, 2, 'should not auto remove first object when changing ID');
    });
    
    test("should remove from collection", function() {
        _(23).times(function(index) {
            libraryLocal.create({id: index});
        });
        _(libraryLocal.toArray()).chain().clone().each(function(book) {
            book.destroy();
        });
        equals(libraryLocal.length, 0, 'item was destroyed and libraryLocal is empty');
        libraryLocal.fetch()
        equals(libraryLocal.length, 0, 'item was destroyed and libraryLocal is empty even after fetch');
    });
  
    test("should not try to load items from localstorage if they are not there anymore", function() {
        libraryLocal.create(attrs);
        localStorage.clear();
        libraryLocal.fetch();
        equals(0, libraryLocal.length);
    });
    
    test("should load from session store without server request", function() {
        var secondLibrary;
      
        libraryLocal.create(attrs);
        
        secondLibrary = new LibraryLocal();
        secondLibrary.fetch();
        equals(1, secondLibrary.length);
    });
    
    test("should cope with arbitrary idAttributes", function() {
        var Model = Backbone.Model.extend({
            idAttribute: '_id'
        });
        var Collection = Backbone.Collection.extend({
            model: Model,
            localStorage: new Store('strangeID')
        });
        
        var collection = new Collection();
        collection.create({});
        equals(collection.first().id, collection.first().get('_id'));
    });

    module("localStorage on models", {
    setup: function() {
            window.localStorage.clear();
      book = new Book();
    }
    });
  
    var Book = Backbone.Model.extend({
        defaults: {
            title  : 'The Tempest',
            author : 'Bill Shakespeare',
            length : 123
        },
    localStorage : new Backbone.LocalStorage('TheTempest')
    });
  
  var book = null;
    
  test("should overwrite unsaved changes when fetching", function() {
    book.save()
        book.set({ 'title': "Wombat's Fun Adventure" });
        book.fetch();
        equals(book.get('title'), 'The Tempest', 'model created');
  });
  
  test("should persist changes", function(){
        book.save({ author: 'William Shakespeare'});
        book.fetch();
        equals(book.get('author'), 'William Shakespeare', 'author successfully updated');
        equals(book.get('length'), 123, 'verify length is still there');
  });

  test("should remove book when destroying", function() {
    book.save({author: 'fnord'})
    equals(Book.prototype.localStorage.findAll().length, 1, 'book removed');
    book.destroy()
    equals(Book.prototype.localStorage.findAll().length, 0, 'book removed');
  });

  test("Book should use local sync", function()
  {
    var method = Backbone.getSyncMethod(book);
    equals(method, Backbone.LocalStorage.sync);
  });

  var MyRemoteModel = Backbone.Model.extend();

  var remoteModel = new MyRemoteModel();

  test("remoteModel should use ajax sync", function()
  {
    var method = Backbone.getSyncMethod(remoteModel);
    equals(method, Backbone.ajaxSync);
  });

  test("Backbone.sync should return a value when ajax is used.", function ()
  {
    var returnValue = remoteModel.fetch({url: '/'});
	notEqual(returnValue, undefined);
  });


//############

  module("sessionStorage on collections", {
      setup: function() {
          window.sessionStorage.clear();
          librarySession = new LibrarySession();
      }
  });
  
  test("should be empty initially", function() {
      equals(librarySession.length, 0, 'empty initially');
      librarySession.fetch();
      equals(librarySession.length, 0, 'empty read');
  });
  
  test("should create item", function() {
      librarySession.create(attrs);
      equals(librarySession.length, 1, 'one item added');
      equals(librarySession.first().get('title'), 'The Tempest', 'title was read');
      equals(librarySession.first().get('author'), 'Bill Shakespeare', 'author was read');
      equals(librarySession.first().get('length'), 123, 'length was read');
  });
  
  test("should discard unsaved changes on fetch", function() {
        librarySession.create(attrs);
        librarySession.first().set({ 'title': "Wombat's Fun Adventure" });
        equals(librarySession.first().get('title'), "Wombat's Fun Adventure", 'title changed, but not saved');
        librarySession.fetch();
        equals(librarySession.first().get('title'), 'The Tempest', 'title was read');
  });
  
  test("should persist changes", function(){
        librarySession.create(attrs);
        equals(librarySession.first().get('author'), 'Bill Shakespeare', 'author was read');
        librarySession.first().save({ author: 'William Shakespeare' });
        librarySession.fetch();
        equals(librarySession.first().get('author'), 'William Shakespeare', 'verify author update');
  });

  test("should pass attributes to parse after creating", function() {
    var book = new Backbone.Model(attrs);
    book.collection = librarySession;
    
    book.parse = function(savedAttrs) {
      equal(savedAttrs.title, attrs.title, 'attributes passed to parse')
      equal(savedAttrs.author, attrs.author, 'attributes passed to parse')
      equal(savedAttrs.length, attrs.length, 'attributes passed to parse')
    };
    
    book.save();
  });
  
  test("should pass attributes to parse after updating", function() {
    var book = librarySession.create(attrs);
    
    book.parse = function(savedAttrs) {
      equal(savedAttrs.title, attrs.title, 'attributes passed to parse')
      equal(savedAttrs.author, attrs.author, 'attributes passed to parse')
      equal(savedAttrs.length, attrs.length, 'attributes passed to parse')
    };
    
    book.save();
  });

  test("should store model id inside collection", function() {
    var book = librarySession.create(attrs);
    equals(librarySession.get(book.id), book, 'book has been read by id from collection');
  });

    test("should allow to change id", function() {
        librarySession.create(attrs);
        librarySession.first().save({id: '1-the-tempest', author: 'William Shakespeare'});
        equals(librarySession.first().get('id'), '1-the-tempest', 'verify ID update');
        equals(librarySession.first().get('title'), 'The Tempest', 'verify title is still there');
        equals(librarySession.first().get('author'), 'William Shakespeare', 'verify author update');
        equals(librarySession.first().get('length'), 123, 'verify length is still there');
    
    librarySession.fetch();
    equals(librarySession.length, 2, 'should not auto remove first object when changing ID');
    });
    
    test("should remove from collection", function() {
        _(23).times(function(index) {
            librarySession.create({id: index});
        });
        _(librarySession.toArray()).chain().clone().each(function(book) {
            book.destroy();
        });
        equals(librarySession.length, 0, 'item was destroyed and librarySession is empty');
        librarySession.fetch()
        equals(librarySession.length, 0, 'item was destroyed and librarySession is empty even after fetch');
    });
  
    test("should not try to load items from localstorage if they are not there anymore", function() {
        librarySession.create(attrs);
        sessionStorage.clear();
        librarySession.fetch();
        equals(0, librarySession.length);
    });
    
    test("should load from session store without server request", function() {
        var secondLibrary;

        librarySession.create(attrs);
        
        secondLibrary = new LibrarySession();
        secondLibrary.fetch();
        equals(1, secondLibrary.length);
    });
    
    test("should cope with arbitrary idAttributes", function() {
        var Model = Backbone.Model.extend({
            idAttribute: '_id'
        });
        var Collection = Backbone.Collection.extend({
            model: Model,
            sessionStorage: new Store('strangeID')
        });
        
        var collection = new Collection();
        collection.create({});
        equals(collection.first().id, collection.first().get('_id'));
    });

  
    module("sessionStorage on models", {
    setup: function() {
            window.sessionStorage.clear();
      bookSession = new BookSession();
    }
    });
  
    var BookSession = Backbone.Model.extend({
        defaults: {
            title  : 'The Tempest',
            author : 'Bill Shakespeare',
            length : 123
        },
    sessionStorage : new Backbone.SessionStorage('TheTempest')
    });
  
  var bookSession = null;
    
  test("should overwrite unsaved changes when fetching", function() {
    bookSession.save()
        bookSession.set({ 'title': "Wombat's Fun Adventure" });
        bookSession.fetch();
        equals(bookSession.get('title'), 'The Tempest', 'model created');
  });
  
  test("should persist changes", function(){
        bookSession.save({ author: 'William Shakespeare'});
        bookSession.fetch();
        equals(bookSession.get('author'), 'William Shakespeare', 'author successfully updated');
        equals(bookSession.get('length'), 123, 'verify length is still there');
  });

  test("should remove book when destroying", function() {
    bookSession.save({author: 'fnord'})
    equals(BookSession.prototype.sessionStorage.findAll().length, 1, 'book removed');
    bookSession.destroy()
    equals(BookSession.prototype.sessionStorage.findAll().length, 0, 'book removed');
  });

  test("Book should use session sync", function()
  {
    var method = Backbone.getSyncMethod(bookSession);
    equals(method, Backbone.SessionStorage.sync);
  });

  var MyRemoteModel = Backbone.Model.extend();

  var remoteModel = new MyRemoteModel();

  test("remoteModel should use ajax sync", function()
  {
    var method = Backbone.getSyncMethod(remoteModel);
    equals(method, Backbone.ajaxSync);
  });

  test("Backbone.sync should return a value when ajax is used.", function ()
  {
    var returnValue = remoteModel.fetch({url: '/'});
  notEqual(returnValue, undefined);
  });



});