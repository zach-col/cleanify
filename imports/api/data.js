import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

export const Data = new Mongo.Collection('data');

// deny client side updates
Data.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Meteor.users.deny({
  update() { return true; }
});

if(Meteor.isServer){
    // get catalogs from collection
    Meteor.publish('catalogs', function catalogsPublication() {
        // make sure user is logged in
		if(!this.userId){
			return false;
			throw new Meteor.Error('not authorized');
		} else {
            return Data.find({

                                  catalogname: {$exists: true},
                                  catalogdescription: {$exists: true},
                              	  userid: this.userId},{
                                  limit: 60,
                                  fields: {
                                    catalogname: 1,
                                    catalogdescription: 1,
                                    userid: 1
                                  }

                                })

		}
    });
    // get data from collection
    Meteor.publish('catalogitems', function catalogsItemsPublication() {
        // make sure user is logged in
		if(!this.userId){
			return false;
			throw new Meteor.Error('not authorized');
		} else {
            return Data.find({

                                  itemname: {$exists: true},
                                  itemdescription: {$exists: true},
                                  catalogid: {$exists: true},
                              	  userid: this.userId},{
                                  limit: 60,
                                  fields: {
                                    itemname: 1,
                                    itemdescription: 1,
                                    catalogid: 1,
                                    userid: 1
                                  }

                                })

		}
    });



}

Meteor.methods({
	'createCatalog'(catalogName,catalogDescription){
		if(!Meteor.userId()){
			return "error"
		}
        if(isString(catalogName) && isNotEmpty(catalogName) && isNotGreaterThen(catalogName, 25) &
    	   isString(catalogDescription) && isNotEmpty(catalogDescription) && isNotGreaterThen(catalogDescription, 200)){
		    Data.insert({
		    	catalogname: catalogName,
		    	catalogdescription: catalogDescription,
		    	userid: Meteor.userId()
		    })

        } else {
        	return "error"
        }

	},
	'createCatalogItem'(itemName,itemDescription, param){
		if(!Meteor.userId()){
			throw "error"
		}
        if(isString(itemName) && isNotEmpty(itemName) && isNotGreaterThen(itemName, 25) &
    	   isString(itemDescription) && isNotEmpty(itemDescription) && isNotGreaterThen(itemDescription, 200) &&
			isString(param) && isNotEmpty(param) && isNotGreaterThen(param, 25)
    	   ){
		  Data.insert({
				itemname: itemName,
				itemdescription: itemDescription,
				userid: Meteor.userId(),
				catalogid: param
		   })
		}
		else {
			return "error"
		}
	},
	'editCatalog'(catalogName,catalogDescription, itemRequestingToEdit){
		if(!Meteor.userId()){
			throw "error"
		}

        if(isString(catalogName) && isNotEmpty(catalogName) && isNotGreaterThen(catalogName, 25) &
    	   isString(catalogDescription) && isNotEmpty(catalogDescription) && isNotGreaterThen(catalogDescription, 200) &&
			isString(itemRequestingToEdit) && isNotEmpty(itemRequestingToEdit) && isNotGreaterThen(itemRequestingToEdit, 25)
    	   ){


			// check if catalog exist
			var catalog = Data.findOne({_id: itemRequestingToEdit,
					catalogname: {$exists: true},
					catalogdescription: {$exists: true}})

			if(catalog){
				// check if user is owner
				if(catalog.userid == Meteor.userId()){
				    Data.update(itemRequestingToEdit, {
				      $set: { catalogname: catalogName, catalogdescription: catalogDescription }
				    });
				}
			}

        } else {
        	return "error"
        }

	},
	'deleteCatalog'(itemRequestingToDelete){
		if(!Meteor.userId()){
			throw "error"
		}

        if(isString(itemRequestingToDelete) && isNotEmpty(itemRequestingToDelete) && isNotGreaterThen(itemRequestingToDelete, 25)){
			var catalog = Data.findOne({_id: itemRequestingToDelete,
						catalogname: {$exists: true},
						catalogdescription: {$exists: true}})
			// check if catalog exist
			if(catalog){
				// check if user is owner
				if(catalog.userid == Meteor.userId()){
				    Data.remove({catalogid: itemRequestingToDelete})
				    Data.remove({_id: itemRequestingToDelete})
				}
			}
        } else {
        	return "error"
        }

	},
	'deleteItem'(itemRequestingToDelete){
		if(!Meteor.userId()){
			throw "error"
		}

        if(isString(itemRequestingToDelete) && isNotEmpty(itemRequestingToDelete) && isNotGreaterThen(itemRequestingToDelete, 25)){
			var item = Data.findOne({_id: itemRequestingToDelete,
						itemname: {$exists: true},
						itemdescription: {$exists: true}})
			// check if item exist
			if(item){
				// check if user is owner
				if(item.userid == Meteor.userId()){
		    		Data.remove({_id: itemRequestingToDelete})
				}
			}
        } else {
        	return "error"
        }
	},
	'editItem'(itemName,itemDescription, param){
		if(!Meteor.userId()){
			throw "error"
		}

        if(isString(itemName) && isNotEmpty(itemName) && isNotGreaterThen(itemName, 25) &
    	   isString(itemDescription) && isNotEmpty(itemDescription) && isNotGreaterThen(itemDescription, 200) &&
			isString(param) && isNotEmpty(param) && isNotGreaterThen(param, 25)
    	   ){
			var item = Data.findOne({_id: param,
						itemname: {$exists: true},
						itemdescription: {$exists: true}})
			// check if item exist
			if(item){
				// check if user is owner
				if(item.userid == Meteor.userId()){
				    Data.update(param, {
				      $set: { itemname: itemName, itemdescription: itemDescription }
				    });
				}
			}
        } else {
        	return "error"
        }
	}
})

if(Meteor.isServer){

    const createCatalog = {
        userId(userId) { return true; },
        type: 'method',
        name: 'createCatalog'
    };
    DDPRateLimiter.addRule(createCatalog, 1, 5000);
    DDPRateLimiter.setErrorMessage("error")

    const editCatalog = {
        userId(userId) { return true; },
        type: 'method',
        name: 'editCatalog'
    };
    DDPRateLimiter.addRule(editCatalog, 1, 5000);
    DDPRateLimiter.setErrorMessage("error")

    const deleteCatalog = {
        userId(userId) { return true; },
        type: 'method',
        name: 'deleteCatalog'
    };
    DDPRateLimiter.addRule(deleteCatalog, 1, 5000);
    DDPRateLimiter.setErrorMessage("error")


    const createCatalogItem = {
        userId(userId) { return true; },
        type: 'method',
        name: 'createCatalogItem'
    };
    DDPRateLimiter.addRule(createCatalogItem, 1, 5000);
    DDPRateLimiter.setErrorMessage("error")

    const editItem = {
        userId(userId) { return true; },
        type: 'method',
        name: 'editItem'
    };
    DDPRateLimiter.addRule(editItem, 1, 5000);
    DDPRateLimiter.setErrorMessage("error")

    const deleteItem = {
        userId(userId) { return true; },
        type: 'method',
        name: 'deleteItem'
    };
    DDPRateLimiter.addRule(deleteItem, 1, 5000);
    DDPRateLimiter.setErrorMessage("error")

}

// checkers
var isString = function(value){
	if (value.constructor === String){
		return true;
    } else {
        return false;
    }
};

var isNotEmpty = function(value){
	if (value && value !== ''){
        return true;
	} else {
        return false;
    }
};

var isNotGreaterThen = function(value, length){
	if (value.length <= length){
		return true;
	} else {
        return false;
    }
};