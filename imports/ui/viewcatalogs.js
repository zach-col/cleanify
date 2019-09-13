import { Template } from 'meteor/templating';
import { Data } from '../api/data.js';
import './viewcatalogs.html';

Template.viewcatalogs.onCreated(function bodyOnCreated() {
    Meteor.subscribe('catalogs')
})

var itemRequestingToDelete = ""

var itemRequestingToEdit= ""

Template.viewcatalogs.helpers({
	catalogs(){
		return Data.find({catalogname: {$exists: true}})
	}
})

Template.viewcatalogs.events({
  'click .delete'(event) {
    event.preventDefault();

    const target = event.target
    // get catalog name
    const catalogname = this.catalogname

    // get catalogid
    const catalogid = this._id

    // set global variable of item requesting to delete to this id
    itemRequestingToDelete = this._id

    // set modal to show catalog name
	document.getElementById("clickedItem").innerHTML = catalogname;
  },

  'click .deleteItem'(event) {
    event.preventDefault();

    Meteor.call('deleteCatalog', itemRequestingToDelete, function (error, result) {
        if(!error) {
            Bert.alert('Catalog deleted', 'danger', 'growl-top-right');

        } else {
			Bert.alert('Oops something went wrong', 'danger', 'growl-top-right');
		}
    })

  },
  'click #edit'(event) {
    event.preventDefault();
    // set global var id to edit
    itemRequestingToEdit= this._id

    // add values to popup modal
    document.getElementById("catalogName").value = this.catalogname;
    document.getElementById("catalogDescription").value = this.catalogdescription;

  },

  'submit .catalogForm'(event) {
    event.preventDefault();

    const target = event.target
    // get catalog name
    const catalogName = target.catalogName.value

    // get catalog description
    const catalogDescription = target.catalogDescription.value

    if(isString(catalogName) && isString(catalogDescription)){

	    if(isNotEmpty(catalogName) && isNotEmpty(catalogDescription)){

			if(isNotGreaterThen(catalogName, 25) && isNotEmpty(catalogDescription, 200)){

			    Meteor.call('editCatalog', catalogName, catalogDescription, itemRequestingToEdit, function (error, result) {
			        if(!error) {
			            Bert.alert('Catalog updated', 'success', 'growl-top-right');

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