import { Template } from 'meteor/templating';
import { Data } from '../api/data.js';
import './signin.html';

Template.signin.events({

    'submit .signIn'(event) {
        // prevent default submit
        event.preventDefault();
        // // get value from element
        const target = event.target;

        const email = target.email.value;

        const password = target.password.value;

        // this is done server side with a method
        Meteor.loginWithPassword(email, password);
        if(Meteor.user()){
          Bert.alert('Signed in', 'success', 'growl-top-right');
        } else {
            Bert.alert('Email or password is not correct', 'danger', 'growl-top-right');
        }
        return false
    }
})