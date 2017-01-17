import Ember from 'ember';

export default Ember.Route.extend({
	// Inject the default data from my health-data service
	healthData: Ember.inject.service('health-data'),

	// Hook the health-data service in as a model to use on my page
	model() {
		// return this.store.findAll('item');
		return Ember.RSVP.hash({
			items: this.store.findAll('item'),
			healthData: this.get('healthData'),
			foodAdded: this.store.find('foodAdded', 'userFoodAddedStatus')
		});
	},

	actions: {
		removeItem(item) {
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
  			let store = this.get('store');

  			store.findRecord('calories', 'userCals')
			.then(function(userCals) {
				userCals.set('total', userCals.get('total') - item.get('calories'));
				userCals.save();
				console.log(userCals.get('total'));
			});

  			item.destroyRecord();

  			if ($('.item-row').length === 0) {
  				// self.set('healthData.foodAdded', false);
  				// store.find('foodAdded', 'userFoodAddedStatus')
  				store.findRecord('foodAdded', 'userFoodAddedStatus')
				.then(function(userFoodAddedStatus) {
					userFoodAddedStatus.set('status', false);
					userFoodAddedStatus.save();
				});
  			}
		},

		hideResults() {
			this.transitionTo('application');
			this.set('healthData.onAppRoute', true);
		}
	}
});