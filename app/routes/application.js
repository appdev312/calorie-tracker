import Ember from 'ember';

export default Ember.Route.extend({
	// Inject the default data from my health-data service
	healthData: Ember.inject.service('health-data'),

	// Hook the health-data service in as a model to use on my page
	model() {
		return this.store.findAll('calories');
	},

	healthData: Ember.inject.service(),

	actions: {
		// Action when search button his pressed
		getResults() {
			// Save this instance of this
			var self = this;
			// The URL to call the Nutritionix API
			let URL = "https://api.nutritionix.com/v1_1/search/" + $('#food-search').val() + "?results=0%3A20&cal_min=0&cal_max=50000&fields=item_name%2Cnf_calories&appId=f9261c61&appKey=fcf83f625641eb2e88ab325848e09e01";

			// Store healthData.results in variable for easy access
			var results = this.get('healthData').results;

			$.get(URL)
			.then(function(data) {
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
					data.hits.forEach(function(item){
						// itemID = itemID + 1;
						// item.itemID = itemID
						results.pushObject(item);
					});

					console.log(data);
				}
			}).fail(function() {
				alert('CRAP');
			});
		},

		viewResults() {
			this.set('healthData.onAppRoute', false);
			this.transitionTo('search-results');
		},

		viewTodaysFood() {
			this.set('healthData.onAppRoute', false);
			this.transitionTo('todays-food');
		}
	}
});