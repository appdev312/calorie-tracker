import Ember from 'ember';

export default Ember.Component.extend({
	healthData: Ember.inject.service('health-data'),

	model() {
		return this.get('healthData');
	},

	store: Ember.inject.service(),

	actions: {
		openModal() {
			$('#custom-item-modal').openModal();
		},

		addCalories(index) {
			// Store correct properties for easy access
			let caloriesPath = 'healthData.calories';
			let resultsPath = this.get('healthData').results;

			// Use the index of the item being clicked in the search
			// results to push that item into healthData.todaysFood
			this.get('healthData').todaysFood.pushObject(resultsPath[index]);

			// Set healthData.calories to itself plus the amount of calories
			// contained the food item selected by the user
  			this.set(caloriesPath, this.get(caloriesPath) + Math.round(resultsPath[index].fields.nf_calories));

  			this.set('healthData.foodAdded', true);
		},

		createItem() {
			// let caloriesPath = 'healthData.calories';
			if (!$('#custom-item-name').val() || !$('#custom-item-calories').val()) {
				alert('Please enter an item name and calorie count.');
			}

			else {
				// Turn the input into a number
				let inputCalories = Math.round(Number($('#custom-item-calories').val()));

				console.log(inputCalories);

				let store = this.get('store');

	  			store.findRecord('foodAdded', 'userFoodAddedStatus')
				.then(function(userFoodAddedStatus) {
					// userFoodAddedStatus.set('status', true);
					// userFoodAddedStatus.save();
					console.log(userFoodAddedStatus);
				});

				let customItem = store.createRecord('item', {
					name: $('#custom-item-name').val(),
					calories: inputCalories
				});

				store.findRecord('calories', 'userCals')
				.then(function(userCals) {
					userCals.set('total', userCals.get('total') + inputCalories);
					userCals.save();
				});

				customItem.save();
			}
		}
	}
});
