import { toast } from 'bulma-toast';
import helper_functions from './lib/helper_functions';
import category from './product_category.js';
import { ReactiveVar } from 'meteor/reactive-var'

Template.AddProduct.onCreated(function(){
    Session.set('selectedFile', "");
    this.newProduct = new ReactiveVar('test');
});

Template.AddProduct.onRendered(function(){
});


Template.AddProduct.events({
    'click button#returnToProducts': function (event) {
        event.preventDefault();
        Router.go('/');
    },
    
    'submit form#addProductForm':function (event) {
        event.preventDefault();
        var template =  Template.instance();
        var product = {
            category: event.target.product_category.value,
            name: event.target.product_name.value,
            price: event.target.product_price.value,
            description: event.target.product_description.value
        }
        Meteor.call('createProduct', product, function (err, res) {
            if (!err) {
                const upload = ProductImages.insert({
                    file: event.target.product_image.files[0],
                    chunkSize: 'dynamic',
                    meta: {
                        product_id: res //hier benutze ich product id
                    }
                    }, false);
                    upload.on('end', function (error, fileObj) {
                    if (error) {
                        return error;
                    } else {
                        return true;
                    }
                    });
                    upload.start();
                    var prod = Products.findOne({_id: res});
                    template.newProduct.set(prod)
                    //
                toast({
                    message: TAPi18n.__('product_created'),
                    type: 'is-success',
                    duration: 3000,
                    position: "bottom-right",
                    closeOnClick: true
                });
                //Router.go('/');
            }else{
                toast({
                    message: TAPi18n.__('product_not_created'),
                    type: 'is-danger',
                    duration: 3000,
                    position: "bottom-right",
                    closeOnClick: true
                });
            }
        });
    },
    'change input.file-input':function (event) {
        event.preventDefault();
        Session.set('selectedFile', event.target.files[0].name);
    },
});


Template.AddProduct.helpers({
  'selectedFile':function () {
      if (Session.get('selectedFile')) {
          return Session.get('selectedFile');
      } else {
        return "choose_picture";
      }
  },

  'getNewProduct': function () {
      if (Template.instance().newProduct.get()) {
        var product = Template.instance().newProduct.get();
        var image = ProductImages.findOne({"meta.product_id": product._id});
        if (image) {
            product["image"] = image.link();
            return product;
        }
		
      } else {
          return {};
      }
  }
        
});


