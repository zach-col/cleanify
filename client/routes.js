Router.configure({
	layoutTemplate: 'main_layout'
})

Router.map(function(){

	this.route('home', {
		path: '/',
		template: 'home'
	})

    this.route('profile', {
        path: '/profile',
        template: 'profile',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (currentUser) {
                this.next();
            } else {
                Bert.alert('Please login to view your profile', 'danger', 'growl-top-right');
                Router.go("home");
            }
        }
    })

    this.route('signup', {
        path: '/signup',
        template: 'signup',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (currentUser) {
                Bert.alert('welcome', 'success', 'growl-top-right');
                Router.go("home");
            } else {
                this.next()
            }
        }
    })

    this.route('signin', {
        path: '/signin',
        template: 'signin',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (currentUser) {
                Bert.alert('Signed in', 'success', 'growl-top-right');
                Router.go("home");
            } else {
            	this.next()
            }
        }
    })

    this.route('createcatalog', {
        path: '/createcatalog',
        template: 'createcatalog',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (currentUser) {
            	this.next()
            } else {
                Bert.alert('Please sign in to create catalogs', 'danger', 'growl-top-right');
                Router.go("signin");
            }
        }
    })

    this.route('createcatalogitem', {
        path: '/createcatalogitem/:_id',
        template: 'createcatalogitem',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (currentUser) {
            	this.next()
            } else {
                Bert.alert('Please sign in to create items', 'danger', 'growl-top-right');
                Router.go("signin");
            }
        }
    })

    this.route('viewcatalogs', {
        path: '/viewcatalogs/',
        template: 'viewcatalogs',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (currentUser) {
            	this.next()
            } else {
                Bert.alert('Please sign in to view catalogs', 'danger', 'growl-top-right');
                Router.go("signin");
            }
        }
    })

    this.route('viewcatalogitems', {
        path: '/viewcatalogitems/:_id',
        template: 'viewcatalogitems',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (currentUser) {
            	this.next()
            } else {
                Bert.alert('Please sign in to view items', 'danger', 'growl-top-right');
                Router.go("signin");
            }
        }
    })

    this.route('viewcatalogitem', {
        path: '/viewcatalogitem/:_id',
        template: 'viewcatalogitem',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (currentUser) {
            	this.next()
            } else {
                Bert.alert('Please sign in to view items', 'danger', 'growl-top-right');
                Router.go("signin");
            }
        }
    })

})
