import { Template } from 'meteor/templating';
import { Data } from '../api/data.js';
import './signup.html';

Template.signup.events({
    'submit .signup'(event) {
        // prevent default submit
        event.preventDefault();
        // // get value from element
        const target = event.target;

        const email = target.email.value;

        const password = target.password.value;
        const password2 = target.passwordverification.value;

        if(password == password2){
            Accounts.createUser({
                email: email,
                password: password
            });
            if(Meteor.user()){
              Bert.alert('Signed in', 'success', 'growl-top-right');
            } else {
                Bert.alert('oops something went wrong', 'danger', 'growl-top-right');
            }
        } else if(password != password2){
                Bert.alert('Passwords must match', 'danger', 'growl-top-right');
        } else {
                Bert.alert('oops something went wrong', 'danger', 'growl-top-right');
        }
        return false
    }
})