import Ember from 'ember';

export default Ember.Service.extend({
	searched: false,

	foodAdded: false,

	onAppRoute: true,

	calories: 0,

	results: [],

	todaysFood: []
});