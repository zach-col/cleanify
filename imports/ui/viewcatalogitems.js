import { Template } from 'meteor/templating';
import { Data } from '../api/data.js';
import './viewcatalogitems.html';

Template.viewcatalogitems.onCreated(function bodyOnCreated() {
    Meteor.subscribe('catalogitems'),
    Meteor.subscribe('catalogs')
})
var itemRequestingToDelete = ""

Template.viewcatalogitems.helpers({
	catalogitems(){
        var param = Router.current().params._id

        const catalogitems = Data.find({catalogid: param})
		return catalogitems
	},
    param(){
        var param = Router.current().params._id
        return param
    },
    catalog(){
        var param = Router.current().params._id

        const catalog= Data.findOne({_id: param, catalogdescription: {$exists: true}})

        return catalog
    }
})


Template.viewcatalogitems.events({
  'click .delete'(event) {
    event.preventDefault();

    itemRequestingToDelete = this._id

    const item = Data.findOne({_id: itemRequestingToDelete})

    // set modal to show name
    document.getElementById("clickedItem").innerHTML = item.itemname;
  },
  'click .deleteItem'(event) {
    event.preventDefault();

    Meteor.call('deleteItem', itemRequestingToDelete, function (error, result) {
        if(!error) {
            Bert.alert('Item deleted', 'danger', 'growl-top-right');

        } else {
            Bert.alert('Oops something went wrong', 'danger', 'growl-top-right');
          }
    })

  }
})
