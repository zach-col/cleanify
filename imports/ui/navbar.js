import { Template } from 'meteor/templating';
import { Data } from '../api/data.js';
import './navbar.html';

Template.navbar.events({

    'click #signOut'(event) {
	   // prevent default submit
       event.preventDefault();

       Meteor.logout();
       return false
    }


})