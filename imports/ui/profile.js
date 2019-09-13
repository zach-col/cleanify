import { Template } from 'meteor/templating';
import { Data } from '../api/data.js';
import './profile.html';

Template.profile.onCreated(function bodyOnCreated() {
    Meteor.subscribe('catalogs'),
    Meteor.subscribe('catalogitems')
})

Template.profile.helpers({
    catalogCount(){
        var catalogCount = Data.find({catalogname: {$exists: true}}).count()
        return catalogCount
    },
    catalogItemCount(){
        var catalogItemCount = Data.find({catalogid: {$exists: true}, userid: {$exists: true}}).count()
        return catalogItemCount
    },
    userEmail(){
        var userEmail = Meteor.user().emails[0].address
        return userEmail
    }
})