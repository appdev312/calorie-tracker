"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('materialize-health/adapters/application', ['exports', 'emberfire/adapters/firebase'], function (exports, _emberfireAdaptersFirebase) {
  exports['default'] = _emberfireAdaptersFirebase['default'].extend({});
});
define('materialize-health/app', ['exports', 'ember', 'materialize-health/resolver', 'ember-load-initializers', 'materialize-health/config/environment'], function (exports, _ember, _materializeHealthResolver, _emberLoadInitializers, _materializeHealthConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _materializeHealthConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _materializeHealthConfigEnvironment['default'].podModulePrefix,
    Resolver: _materializeHealthResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _materializeHealthConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('materialize-health/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'materialize-health/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _materializeHealthConfigEnvironment) {

  var name = _materializeHealthConfigEnvironment['default'].APP.name;
  var version = _materializeHealthConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('materialize-health/components/calorie-count', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({
		// Inject the default data from my health-data service
		store: _ember['default'].inject.service(),

		// Hook the health-data service in as a model to use on my page
		model: function model() {
			return this.store.find('calories', 'userCals');
		}
	});
});
define('materialize-health/components/custom-item', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({
		healthData: _ember['default'].inject.service('health-data'),

		model: function model() {
			return this.get('healthData');
		},

		store: _ember['default'].inject.service(),

		actions: {
			openModal: function openModal() {
				$('#custom-item-modal').openModal();
			},

			addCalories: function addCalories(index) {
				// Store correct properties for easy access
				var caloriesPath = 'healthData.calories';
				var resultsPath = this.get('healthData').results;

				// Use the index of the item being clicked in the search
				// results to push that item into healthData.todaysFood
				this.get('healthData').todaysFood.pushObject(resultsPath[index]);

				// Set healthData.calories to itself plus the amount of calories
				// contained the food item selected by the user
				this.set(caloriesPath, this.get(caloriesPath) + Math.round(resultsPath[index].fields.nf_calories));

				this.set('healthData.foodAdded', true);
			},

			createItem: function createItem() {
				var _this = this;

				// let caloriesPath = 'healthData.calories';
				if (!$('#custom-item-name').val() || !$('#custom-item-calories').val()) {
					alert('Please enter an item name and calorie count.');
				} else {
					(function () {
						// Turn the input into a number
						var inputCalories = Math.round(Number($('#custom-item-calories').val()));

						console.log(inputCalories);

						var store = _this.get('store');

						store.findRecord('foodAdded', 'userFoodAddedStatus').then(function (userFoodAddedStatus) {
							// userFoodAddedStatus.set('status', true);
							// userFoodAddedStatus.save();
							console.log(userFoodAddedStatus);
						});

						var customItem = store.createRecord('item', {
							name: $('#custom-item-name').val(),
							calories: inputCalories
						});

						store.findRecord('calories', 'userCals').then(function (userCals) {
							userCals.set('total', userCals.get('total') + inputCalories);
							userCals.save();
						});

						customItem.save();
					})();
				}
			}
		}
	});
});
define('materialize-health/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('materialize-health/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('materialize-health/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'materialize-health/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _materializeHealthConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_materializeHealthConfigEnvironment['default'].APP.name, _materializeHealthConfigEnvironment['default'].APP.version)
  };
});
define('materialize-health/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('materialize-health/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('materialize-health/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.ArrayController.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('materialize-health/initializers/emberfire', ['exports', 'emberfire/initializers/emberfire'], function (exports, _emberfireInitializersEmberfire) {
  exports['default'] = _emberfireInitializersEmberfire['default'];
});
define('materialize-health/initializers/export-application-global', ['exports', 'ember', 'materialize-health/config/environment'], function (exports, _ember, _materializeHealthConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_materializeHealthConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _materializeHealthConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_materializeHealthConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('materialize-health/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('materialize-health/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('materialize-health/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("materialize-health/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('materialize-health/models/calories', ['exports', 'ember-data'], function (exports, _emberData) {
	exports['default'] = _emberData['default'].Model.extend({
		total: _emberData['default'].attr('number')
	});
});
define('materialize-health/models/food-added', ['exports', 'ember-data'], function (exports, _emberData) {
	exports['default'] = _emberData['default'].Model.extend({
		status: _emberData['default'].attr('boolean')
	});
});
define('materialize-health/models/item', ['exports', 'ember-data'], function (exports, _emberData) {
	exports['default'] = _emberData['default'].Model.extend({
		name: _emberData['default'].attr(),
		calories: _emberData['default'].attr()
	});
});
define('materialize-health/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('materialize-health/router', ['exports', 'ember', 'materialize-health/config/environment'], function (exports, _ember, _materializeHealthConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _materializeHealthConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('search-results');
    this.route('todays-food');
    this.route('add-custom-item');
  });

  exports['default'] = Router;
});
define('materialize-health/routes/add-custom-item', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('materialize-health/routes/application', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Route.extend({
		// Inject the default data from my health-data service
		healthData: _ember['default'].inject.service('health-data'),

		// Hook the health-data service in as a model to use on my page
		model: function model() {
			return this.store.findAll('calories');
		},

		healthData: _ember['default'].inject.service(),

		actions: {
			// Action when search button his pressed
			getResults: function getResults() {
				// Save this instance of this
				var self = this;
				// The URL to call the Nutritionix API
				var URL = "https://api.nutritionix.com/v1_1/search/" + $('#food-search').val() + "?results=0%3A20&cal_min=0&cal_max=50000&fields=item_name%2Cnf_calories&appId=f9261c61&appKey=fcf83f625641eb2e88ab325848e09e01";

				// Store healthData.results in variable for easy access
				var results = this.get('healthData').results;

				$.get(URL).then(function (data) {
					if (!data.total_hits || !$('#food-search').val()) {
						alert('Please enter a actual FOOD!!!');
					} else {

						// Move to the search-results route
						self.transitionTo('search-results');

						// Change searched and onAppRoute properties
						// so that correct button is displayed
						self.set('healthData.searched', true);
						self.set('healthData.onAppRoute', false);

						// Make sure the healthData.results is emptied so the user
						// only sees results from their most recent search
						results.length = 0;
						// Push each separate item into the healthData.results variable
						var itemID = -1;
						data.hits.forEach(function (item) {
							// itemID = itemID + 1;
							// item.itemID = itemID
							results.pushObject(item);
						});

						console.log(data);
					}
				}).fail(function () {
					alert('CRAP');
				});
			},

			viewResults: function viewResults() {
				this.set('healthData.onAppRoute', false);
				this.transitionTo('search-results');
			},

			viewTodaysFood: function viewTodaysFood() {
				this.set('healthData.onAppRoute', false);
				this.transitionTo('todays-food');
			}
		}
	});
});
define('materialize-health/routes/search-results', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Route.extend({
		// Inject the default data from my health-data service
		healthData: _ember['default'].inject.service('health-data'),

		// Hook the health-data service in as a model to use on my page
		model: function model() {
			return this.get('healthData');
		},

		actions: {
			addCalories: function addCalories(index) {
				var store = this.get('store');

				// Store correct properties for easy access
				// let caloriesPath = 'healthData.calories';
				var resultsPath = this.get('healthData').results;

				// Use the index of the item being clicked in the search
				// results to push that item into healthData.todaysFood
				// this.get('healthData').todaysFood.pushObject(resultsPath[index]);

				// Set healthData.calories to itself plus the amount of calories
				// contained the food item selected by the user
				// this.set(caloriesPath, this.get(caloriesPath) + Math.round(resultsPath[index].fields.nf_calories));

				// this.set('healthData.foodAdded', true);

				store.findRecord('foodAdded', 'userFoodAddedStatus').then(function (userFoodAddedStatus) {
					userFoodAddedStatus.set('status', true);
					userFoodAddedStatus.save();
				});

				var newItem = store.createRecord('item', {
					name: resultsPath[index].fields.item_name,
					calories: Math.round(resultsPath[index].fields.nf_calories)
				});

				store.findRecord('calories', 'userCals').then(function (userCals) {
					userCals.set('total', userCals.get('total') + Math.round(resultsPath[index].fields.nf_calories));
					userCals.save();
					console.log(userCals.get('total'));
				});

				newItem.save();
			},

			hideResults: function hideResults() {
				this.set('healthData.onAppRoute', true);
				this.transitionTo('application');
			}
		}
	});
});
define('materialize-health/routes/todays-food', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Route.extend({
		// Inject the default data from my health-data service
		healthData: _ember['default'].inject.service('health-data'),

		// Hook the health-data service in as a model to use on my page
		model: function model() {
			// return this.store.findAll('item');
			return _ember['default'].RSVP.hash({
				items: this.store.findAll('item'),
				healthData: this.get('healthData'),
				foodAdded: this.store.find('foodAdded', 'userFoodAddedStatus')
			});
		},

		actions: {
			removeItem: function removeItem(item) {
				// var self = this;

				// // Store property paths for easy access
				// let todaysPath = this.get('healthData').todaysFood;
				// let caloriesPath = 'healthData.calories';

				// 		this.set(caloriesPath, this.get(caloriesPath) - Math.round(todaysPath[index].fields.nf_calories));

				// 		todaysPath.removeAt(index);

				// Because Ember adds its own meta-object to the array,
				// check to see if its length is zero. The length property
				// still accurately reflects our data. If length is zero
				// set the foodAdded property to false in order to remove
				// the table from our display
				var store = this.get('store');

				store.findRecord('calories', 'userCals').then(function (userCals) {
					userCals.set('total', userCals.get('total') - item.get('calories'));
					userCals.save();
					console.log(userCals.get('total'));
				});

				item.destroyRecord();

				if ($('.item-row').length === 0) {
					// self.set('healthData.foodAdded', false);
					// store.find('foodAdded', 'userFoodAddedStatus')
					store.findRecord('foodAdded', 'userFoodAddedStatus').then(function (userFoodAddedStatus) {
						userFoodAddedStatus.set('status', false);
						userFoodAddedStatus.save();
					});
				}
			},

			hideResults: function hideResults() {
				this.transitionTo('application');
				this.set('healthData.onAppRoute', true);
			}
		}
	});
});
define('materialize-health/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('materialize-health/services/firebase-app', ['exports', 'emberfire/services/firebase-app'], function (exports, _emberfireServicesFirebaseApp) {
  exports['default'] = _emberfireServicesFirebaseApp['default'];
});
define('materialize-health/services/firebase', ['exports', 'emberfire/services/firebase'], function (exports, _emberfireServicesFirebase) {
  exports['default'] = _emberfireServicesFirebase['default'];
});
define('materialize-health/services/health-data', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Service.extend({
		searched: false,

		foodAdded: false,

		onAppRoute: true,

		calories: 0,

		results: [],

		todaysFood: []
	});
});
define("materialize-health/templates/add-custom-item", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 13,
            "column": 0
          }
        },
        "moduleName": "materialize-health/templates/add-custom-item.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment(" Modal Structure ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "id", "modal1");
        dom.setAttribute(el1, "class", "modal");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "modal-content");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h4");
        var el4 = dom.createTextNode("Modal Header");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("A bunch of text");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "modal-footer");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "href", "#!");
        dom.setAttribute(el3, "class", " modal-action modal-close waves-effect waves-green btn-flat");
        var el4 = dom.createTextNode("Agree");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [12, 0], [12, 10]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("materialize-health/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.6.2",
            "loc": {
              "source": null,
              "start": {
                "line": 29,
                "column": 3
              },
              "end": {
                "line": 35,
                "column": 3
              }
            },
            "moduleName": "materialize-health/templates/application.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("				");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "row");
            var el2 = dom.createTextNode("\n					");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2, "class", "col s8 offset-s2 col m4 offset-m4");
            var el3 = dom.createTextNode("\n						");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("button");
            dom.setAttribute(el3, "class", "btn btn-block blue darken-4");
            var el4 = dom.createTextNode("View Search Results");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n					");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n				");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1, 1, 1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element0);
            return morphs;
          },
          statements: [["element", "action", ["viewResults"], [], ["loc", [null, [32, 50], [32, 74]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.2",
          "loc": {
            "source": null,
            "start": {
              "line": 28,
              "column": 2
            },
            "end": {
              "line": 36,
              "column": 2
            }
          },
          "moduleName": "materialize-health/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "model.onAppRoute", ["loc", [null, [29, 9], [29, 25]]]]], [], 0, null, ["loc", [null, [29, 3], [35, 10]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 40,
            "column": 7
          }
        },
        "moduleName": "materialize-health/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("main");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "container");
        var el3 = dom.createTextNode("\n\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "row");
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "col s8 offset-s2 col m4 offset-m4");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5, "type", "button");
        dom.setAttribute(el5, "class", "btn btn-block btn-lg btn-info  blue darken-4");
        var el6 = dom.createTextNode("View Today's Food");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        dom.setAttribute(el3, "onsubmit", "return false");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "input-field col s12 col m8 offset-m2");
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("label");
        dom.setAttribute(el6, "for", "food-search");
        var el7 = dom.createTextNode("Search For Food");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n				");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "col s8 offset-s2 col m4 offset-m4");
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("button");
        dom.setAttribute(el6, "type", "submit");
        dom.setAttribute(el6, "class", "btn btn-block blue");
        var el7 = dom.createTextNode("Search");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n				");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0, 1]);
        var element2 = dom.childAt(element1, [3, 1, 1]);
        var element3 = dom.childAt(element1, [5]);
        var element4 = dom.childAt(element3, [3, 1, 1]);
        var morphs = new Array(7);
        morphs[0] = dom.createMorphAt(element1, 1, 1);
        morphs[1] = dom.createElementMorph(element2);
        morphs[2] = dom.createMorphAt(dom.childAt(element3, [1, 1]), 1, 1);
        morphs[3] = dom.createElementMorph(element4);
        morphs[4] = dom.createMorphAt(element3, 5, 5);
        morphs[5] = dom.createMorphAt(element1, 7, 7);
        morphs[6] = dom.createMorphAt(element1, 9, 9);
        return morphs;
      },
      statements: [["inline", "calorie-count", [], ["model", ["subexpr", "@mut", [["get", "model", ["loc", [null, [4, 24], [4, 29]]]]], [], []]], ["loc", [null, [4, 2], [4, 31]]]], ["element", "action", ["viewTodaysFood"], [], ["loc", [null, [8, 79], [8, 106]]]], ["inline", "input", [], ["id", "food-search", "type", "text", "class", "form-control", "enter", "getResults"], ["loc", [null, [14, 5], [14, 84]]]], ["element", "action", ["getResults"], [], ["loc", [null, [21, 13], [21, 36]]]], ["inline", "custom-item", [], ["model", ["subexpr", "@mut", [["get", "model", ["loc", [null, [25, 23], [25, 28]]]]], [], []]], ["loc", [null, [25, 3], [25, 30]]]], ["block", "if", [["get", "model.searched", ["loc", [null, [28, 8], [28, 22]]]]], [], 0, null, ["loc", [null, [28, 2], [36, 9]]]], ["content", "outlet", ["loc", [null, [38, 2], [38, 12]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("materialize-health/templates/components/calorie-count", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.2",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 2
            },
            "end": {
              "line": 5,
              "column": 2
            }
          },
          "moduleName": "materialize-health/templates/components/calorie-count.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("		");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h2");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
          return morphs;
        },
        statements: [["content", "calories.total", ["loc", [null, [4, 6], [4, 24]]]]],
        locals: ["calories"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 9
          }
        },
        "moduleName": "materialize-health/templates/components/calorie-count.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col s12 center-align");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("Calories");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1]), 1, 1);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [3, 10], [3, 15]]]]], [], 0, null, ["loc", [null, [3, 2], [5, 11]]]], ["content", "yield", ["loc", [null, [10, 0], [10, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("materialize-health/templates/components/custom-item", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 39,
            "column": 0
          }
        },
        "moduleName": "materialize-health/templates/components/custom-item.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col s8 offset-s2 col m4 offset-m4");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "type", "submit");
        dom.setAttribute(el3, "class", "btn btn-block blue darken-4");
        dom.setAttribute(el3, "href", "custom-item-modal");
        var el4 = dom.createTextNode("Add Custom Item");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment(" Modal Structure ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "id", "custom-item-modal");
        dom.setAttribute(el1, "class", "modal");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "modal-content");
        var el3 = dom.createTextNode("\n	  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h4");
        dom.setAttribute(el3, "class", "center-align");
        var el4 = dom.createTextNode("Add Custom Item");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        var el4 = dom.createTextNode("\n	  	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row");
        var el5 = dom.createTextNode("\n		  	");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "input-field col s8 col offset-s2");
        var el6 = dom.createTextNode("\n		  		");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n		  		");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("label");
        dom.setAttribute(el6, "for", "custom-item-name");
        var el7 = dom.createTextNode("Item Name");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n		  	");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n	  	");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n	  	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row");
        var el5 = dom.createTextNode("\n		  	");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "input-field col s4 col offset-s4");
        var el6 = dom.createTextNode("\n		  		");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n		  		");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("label");
        dom.setAttribute(el6, "for", "custom-item-calories");
        var el7 = dom.createTextNode("Calories:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n		  	");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n	  	");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n	  	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row");
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "col s8 offset-s2 col m4 offset-m4");
        var el6 = dom.createTextNode("\n				");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "type", "submit");
        dom.setAttribute(el6, "class", "btn btn-block blue");
        dom.setAttribute(el6, "href", "custom-item-modal");
        var el7 = dom.createTextNode("Add");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n			");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n		");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	  ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "modal-footer");
        var el3 = dom.createTextNode("\n	  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "class", "modal-action modal-close waves-effect waves-green btn-flat");
        var el4 = dom.createTextNode("Close");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1, 1]);
        var element1 = dom.childAt(fragment, [4, 1, 3]);
        var element2 = dom.childAt(element1, [5, 1, 1]);
        var morphs = new Array(5);
        morphs[0] = dom.createElementMorph(element0);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [1, 1]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [3, 1]), 1, 1);
        morphs[3] = dom.createElementMorph(element2);
        morphs[4] = dom.createMorphAt(fragment, 6, 6, contextualElement);
        return morphs;
      },
      statements: [["element", "action", ["openModal"], [], ["loc", [null, [3, 5], [3, 27]]]], ["inline", "input", [], ["id", "custom-item-name", "type", "text", "class", "form-control", "required", true, "enter", "getResults"], ["loc", [null, [14, 6], [14, 104]]]], ["inline", "input", [], ["id", "custom-item-calories", "type", "number", "class", "form-control", "required", true, "enter", "getResults"], ["loc", [null, [21, 6], [21, 110]]]], ["element", "action", ["createItem"], [], ["loc", [null, [28, 7], [28, 30]]]], ["content", "yield", ["loc", [null, [38, 0], [38, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("materialize-health/templates/search-results", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.2",
          "loc": {
            "source": null,
            "start": {
              "line": 18,
              "column": 3
            },
            "end": {
              "line": 27,
              "column": 3
            }
          },
          "moduleName": "materialize-health/templates/search-results.hbs"
        },
        isEmpty: false,
        arity: 2,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("				");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          dom.setAttribute(el1, "class", "item-row");
          var el2 = dom.createTextNode("\n					");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2, "class", "item-name");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n					");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2, "class", "calories");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n					");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2, "class", "add-button");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("						");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("button");
          dom.setAttribute(el3, "type", "button");
          dom.setAttribute(el3, "class", "btn btn-add blue");
          var el4 = dom.createTextNode("Add");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n					");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [5, 2]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          morphs[2] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [["content", "result.fields.item_name", ["loc", [null, [20, 27], [20, 54]]]], ["content", "result.fields.nf_calories", ["loc", [null, [21, 26], [21, 55]]]], ["element", "action", ["addCalories", ["get", "index", ["loc", [null, [24, 76], [24, 81]]]]], [], ["loc", [null, [24, 53], [24, 83]]]]],
        locals: ["result", "index"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 33,
            "column": 10
          }
        },
        "moduleName": "materialize-health/templates/search-results.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col s8 offset-s2 col m4 offset-m4");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3, "class", "btn btn-block red darken-4");
        var el4 = dom.createTextNode("Hide Results");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col s10 offset-s1");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("table");
        dom.setAttribute(el3, "class", "table");
        dom.setAttribute(el3, "id", "results-table");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("thead");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        var el6 = dom.createTextNode("Name");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        var el6 = dom.createTextNode("Calories (1 serving)");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        var el6 = dom.createTextNode("Add to Daily Total");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tbody");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [0, 1, 1]);
        var morphs = new Array(3);
        morphs[0] = dom.createElementMorph(element2);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2, 1, 1, 3]), 1, 1);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["element", "action", ["hideResults"], [], ["loc", [null, [3, 44], [3, 68]]]], ["block", "each", [["get", "model.results", ["loc", [null, [18, 11], [18, 24]]]]], [], 0, null, ["loc", [null, [18, 3], [27, 12]]]], ["content", "outlet", ["loc", [null, [33, 0], [33, 10]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("materialize-health/templates/todays-food", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.6.2",
            "loc": {
              "source": null,
              "start": {
                "line": 21,
                "column": 3
              },
              "end": {
                "line": 30,
                "column": 3
              }
            },
            "moduleName": "materialize-health/templates/todays-food.hbs"
          },
          isEmpty: false,
          arity: 2,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("				");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("tr");
            dom.setAttribute(el1, "class", "item-row");
            var el2 = dom.createTextNode("\n					");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("td");
            dom.setAttribute(el2, "class", "item-name");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n					");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("td");
            dom.setAttribute(el2, "class", "calories");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n					");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("td");
            dom.setAttribute(el2, "class", "add-button");
            var el3 = dom.createTextNode("\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("						");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("button");
            dom.setAttribute(el3, "type", "button");
            dom.setAttribute(el3, "class", "btn btn-add red darken-4");
            var el4 = dom.createTextNode("Remove");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n					");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n				");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var element1 = dom.childAt(element0, [5, 2]);
            var morphs = new Array(3);
            morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
            morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
            morphs[2] = dom.createElementMorph(element1);
            return morphs;
          },
          statements: [["content", "item.name", ["loc", [null, [23, 27], [23, 40]]]], ["content", "item.calories", ["loc", [null, [24, 26], [24, 43]]]], ["element", "action", ["removeItem", ["get", "item", ["loc", [null, [27, 83], [27, 87]]]], ["get", "index", ["loc", [null, [27, 88], [27, 93]]]]], [], ["loc", [null, [27, 61], [27, 95]]]]],
          locals: ["item", "index"],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.2",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 0
            },
            "end": {
              "line": 36,
              "column": 0
            }
          },
          "moduleName": "materialize-health/templates/todays-food.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "row");
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "col s10 offset-s1");
          var el3 = dom.createTextNode("\n		");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("table");
          dom.setAttribute(el3, "class", "table table-striped");
          dom.setAttribute(el3, "id", "todays-table");
          var el4 = dom.createTextNode("\n			");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("thead");
          var el5 = dom.createTextNode("\n				");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("th");
          var el6 = dom.createTextNode("Name");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n				");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("th");
          var el6 = dom.createTextNode("Calories (1 serving)");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n				");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("th");
          var el6 = dom.createTextNode("Remove from Today's Totals");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n			");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n\n			");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("tbody");
          var el5 = dom.createTextNode("\n");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("			");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n		");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n	");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1, 1, 3]), 1, 1);
          return morphs;
        },
        statements: [["block", "each", [["get", "model.items", ["loc", [null, [21, 11], [21, 22]]]]], [], 0, null, ["loc", [null, [21, 3], [30, 12]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.2",
          "loc": {
            "source": null,
            "start": {
              "line": 36,
              "column": 0
            },
            "end": {
              "line": 43,
              "column": 0
            }
          },
          "moduleName": "materialize-health/templates/todays-food.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "row");
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "col s12 center-align");
          var el3 = dom.createTextNode("\n		");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("p");
          dom.setAttribute(el3, "class", "lead");
          var el4 = dom.createTextNode("You haven't eaten anything today!");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n		");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("p");
          var el4 = dom.createTextNode("Search for a food and add it to today's totals to see it reflected here.");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n	");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 45,
            "column": 10
          }
        },
        "moduleName": "materialize-health/templates/todays-food.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col s8 offset-s2 col m4 offset-m4");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3, "class", "btn btn-block btn-lg btn-warning red darken-4");
        var el4 = dom.createTextNode("Hide");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [0, 1, 2]);
        var morphs = new Array(3);
        morphs[0] = dom.createElementMorph(element2);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["element", "action", ["hideResults"], [], ["loc", [null, [6, 64], [6, 88]]]], ["block", "if", [["get", "model.foodAdded.status", ["loc", [null, [9, 6], [9, 28]]]]], [], 0, 1, ["loc", [null, [9, 0], [43, 7]]]], ["content", "outlet", ["loc", [null, [45, 0], [45, 10]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define('materialize-health/torii-providers/firebase', ['exports', 'emberfire/torii-providers/firebase'], function (exports, _emberfireToriiProvidersFirebase) {
  exports['default'] = _emberfireToriiProvidersFirebase['default'];
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('materialize-health/config/environment', ['ember'], function(Ember) {
  var prefix = 'materialize-health';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("materialize-health/app")["default"].create({"name":"materialize-health","version":"0.0.0+60575a1b"});
}

/* jshint ignore:end */
//# sourceMappingURL=materialize-health.map