import { Template } from 'meteor/templating';
import { Data } from '../api/data.js';
import './createcatalogitem.html';

Template.createcatalogitem.helpers({
	catalog(){
        var param = Router.current().params._id

        const catalog = Data.findOne({_id: param,    catalogdescription: {$exists: true} })
		return catalog
	},
})

Template.createcatalogitem.events({
  'submit .catalogform'(event) {
    event.preventDefault();
    const target = event.target
    // get item name
    const itemName = target.itemname.value

    // get item description
    const itemDescription = target.itemdescription.value
    
    // current route
    var param = Router.current().params._id
    console.log(param)


    if(isString(itemName) && isString(itemDescription)){

	    if(isNotEmpty(itemName) && isNotEmpty(itemDescription)){

			if(isNotGreaterThen(itemName, 25) && isNotEmpty(itemDescription, 200)){

			    Meteor.call('createCatalogItem', itemName, itemDescription, param, function (error, result) {
			        if(!error) {
			            Router.go("viewcatalogitems", {_id:param});
			            Bert.alert('Item created', 'success', 'growl-top-right');

			        } else {
			            Bert.alert('Oops something went wrong', 'danger', 'growl-top-right');
			     	}
			    })

			}

	    }

    }

    target.itemname.value = "";
    target.itemdescription.value = "";
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
