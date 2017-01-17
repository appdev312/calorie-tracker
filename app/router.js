import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('search-results');
  this.route('todays-food');
  this.route('add-custom-item');
});

export default Router;
