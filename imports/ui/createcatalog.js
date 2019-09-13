import { Template } from 'meteor/templating';
import { Data } from '../api/data.js';
import './createcatalog.html';
 
Template.createcatalog.events({
  'submit .catalogform'(event) {
    event.preventDefault();
    const target = event.target
    // get catalog name
    const catalogName = target.catalogname.value

    // get catalog description
    const catalogDescription = target.catalogdescription.value

    // check data client side and return specific error if it is not proper

    if(isString(catalogName) && isString(catalogDescription)){
	    if(isNotEmpty(catalogName) && isNotEmpty(catalogDescription)){

			if(isNotGreaterThen(catalogName, 25) && isNotEmpty(catalogDescription, 200)){

		   	    Meteor.call('createCatalog', catalogName, catalogDescription, function (error, result) {
			        if(!error) {
			            Router.go("viewcatalogs", {_id:result});
			            Bert.alert('Catalog created', 'success', 'growl-top-right');

			        } else {
			            Bert.alert('Oops something went wrong', 'danger', 'growl-top-right');
			        }
			    })

			}

	    }

    }

    target.catalogname.value = "";
    target.catalogdescription.value = "";
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