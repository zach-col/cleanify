import { Template } from 'meteor/templating';
import { Data } from '../api/data.js';
import './viewcatalogitem.html';

Template.viewcatalogitem.onCreated(function bodyOnCreated() {
    Meteor.subscribe('catalogs'),
    Meteor.subscribe('catalogitems')
})
Template.viewcatalogitem.helpers({
	item(){
        var param = Router.current().params._id

        const item = Data.findOne({_id: param, itemname: {$exists: true}})
		return item
	},
    param(){
        var param = Router.current().params._id
        return param
    },
	catalogLink(){
        var param = Router.current().params._id

        const item = Data.find({_id: param, itemname: {$exists: true}})
		return item
	},
	catalog(){
		return Data.findOne({_id: this.catalogid, catalogname: {$exists: true}})
	}
})

Template.viewcatalogitem.events({
  'click #edit'(event) {
    event.preventDefault();

    var param = Router.current().params._id

    const item = Data.findOne({_id: param, itemname: {$exists: true}})

    // add values to popup modal
	document.getElementById("itemName").value = item.itemname;
	document.getElementById("itemDescription").value = item.itemdescription;

  },

  'submit .itemForm'(event) {
    event.preventDefault();

    var itemRequestingToEdit = Router.current().params._id

    const target = event.target
    // get item name
    const itemName = target.itemName.value

    // get item description
    const itemDescription = target.itemDescription.value

    if(isString(itemName) && isString(itemDescription)){

	    if(isNotEmpty(itemName) && isNotEmpty(itemDescription)){

			if(isNotGreaterThen(itemName, 25) && isNotEmpty(itemDescription, 200)){

			    Meteor.call('editItem', itemName, itemDescription, itemRequestingToEdit, function (error, result) {
			        if(!error) {
			            Bert.alert('Item updated', 'success', 'growl-top-right');

			        } else {
			            Bert.alert('Oops something went wrong', 'danger', 'growl-top-right');
			        }
			    })
			}

	    }

    }

  }
})


var isString = function(value){
	if (value.constructor === String){
		return true;
    } else {
        Bert.alert("Error please fill in all fields", "danger", "growl-top-right");
        return false;
    }
};

var isNotEmpty = function(value){
	if (value && value !== ''){
        return true;
	} else {
        Bert.alert("Error field is empty", "danger", "growl-top-right");
        return false;
    }
};

var isNotGreaterThen = function(value, length){
	if (value.length <= length){
		return true;
	} else {
        Bert.alert("Error length is to long", "danger", "growl-top-right");
        return false;
    }
};