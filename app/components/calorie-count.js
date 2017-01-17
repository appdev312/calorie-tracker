import Ember from 'ember';

export default Ember.Component.extend({
	// Inject the default data from my health-data service
	store: Ember.inject.service(),

	// Hook the health-data service in as a model to use on my page
	model() {
		return this.store.find('calories', 'userCals');
	}
});