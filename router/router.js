import  { uniq } from 'meteor/underscore'

Router.configure({
  layoutTemplate: "Layout",
  template: "Layout",
});

Router.onBeforeAction(function () {
  if (!Meteor.userId()) {
    this.render("Login");
  } else {
    this.next();
  }
},{
  except: ['register', 'verifyEmail', 'login', 'after_register', 'home', 'forgot_password',"reset_password_email","set_password_page"]
})


Router.route(
  "/",
  function () {
    this.subscribe("products");
    this.subscribe("productImages");
    Session.set("searchTerm","");
    if (this.ready()) {
      this.render("Home");
    } else {
      this.render("Loading");
    }
  },
  {
    name: "home",
    data: function () {
      var products = Products.find({ name: { $regex: Session.get('searchTerm'), $options: 'i'}}).fetch();
      products.forEach(product => {
        var image = ProductImages.findOne({ product_id: product._id });
        if (image) {
          product["image"] = image.image;
        }
      });
      return {
        products: products,
      };
    },
  }
);

Router.route(
  "/products/:_id",
  function () {
    this.subscribe("products", this.params._id);
    this.subscribe("productImageById", this.params._id);
    if (this.ready()) {
      this.render("ProductDetails");
    } else {
      this.render("Loading");
    }
  },
  {
    name: "productDetails"
  }
);

Router.route(
  "/products/search/:searchTerm",
  function () {
    this.subscribe("searchedProducts", this.params.searchTerm);
    if (this.ready()) {
      this.render("SearchProducts");
    } else {
      this.render("Loading");
    }
  },
  {
    name: "searchedProducts",
    data: function () {
      var products = Products.find({ name: { $regex: this.params.searchTerm, $options: 'i'}}).fetch();
      products.forEach(product => {
        var image = ProductImages.findOne({ product_id: product._id });
        if (image) {
          product["image"] = image.image;
        }
      });
      return {
        products: products,
        searchTerm: this.params.searchTerm
      };
    },
  }
);


Router.route(
  "/addproduct",
  function () {
    this.subscribe("product");
    this.subscribe("productImages");
    if (!Meteor.userId()) {
      Router.go("home");
      
    } else 
    if (this.ready()) {
      this.render("AddProduct");
    } else {
      this.render("Loading");
    }
  },
  {
    name: "addProduct",
  }
);

Router.route(
  "/register",
  function () {
    if (this.ready()) {
      if (Meteor.userId() ){
        Router.go('home');
      } else {
        this.render("Register");
      }
    } else {
      this.render("Loading");
    }
  },
  {
    name: "register",
  }
);


Router.route(
  "/login",
  function () {
    this.subscribe("users");
    if (this.ready()) {
      if (Meteor.userId() ){
        Router.go('home');
      } else {
        this.render("Login");
      }
    } else {
      this.render("Loading");
    }
  },
  {
    name: "login",
  }
);


Router.route(
  "/my_profile/:_id",
  function () {
    this.subscribe("users");
    if (!Meteor.userId()) {
      Router.go("home");
    } else 
    if (this.ready()) {
      this.render("MyProfile");
    } else {
      this.render("Loading");
    }
  },
  {
    name: "MyProfile",
    data: function () {
      var user = Meteor.users.findOne({_id: this.params._id})
      return {
        user: user
      }
    },
  }
);


Router.route(
  "/my_basket",
  function () {
    this.subscribe("users");
    if (!Meteor.userId()) {
      Router.go("home");
    } else 
    if (this.ready()) {
      this.render("UserBasket");
    } else {
      this.render("Loading");
    }
  },
  {
    name: "basket_page",
    data: function () {
      var basket_products = [];
      var user = Meteor.user();
      var sum = 0;
      if (user) {
        var wagen = user.profile.basket;
        wagen.forEach(element => {
          var product = Products.findOne({_id: element._id});
          product["count"] = element.count;
          product["sum"] = element.count*product.price;
          var image = ProductImages.findOne({ product_id: product._id });
          if (image) {
          product["image"] = image.image;
        }
        sum+=product.sum;
          basket_products.push(product);
        });
      }

      return{
        basket_products: basket_products,
        sum: sum
      }
    }, 
  }
);



Router.route(
  "/verifyEmail/:token",
  function () {
    var self = this;
    if (this.ready()) {
      Accounts.verifyEmail(this.params.token, function (err) {
        if(!err){
          self.render("VerifyEmail");
        }else{
          Router.go("login");
        }
      })
    } else {
      this.render("Loading");
    }
  },
  {
    name: "verifyEmail",
  }
);


Router.route(
  "/after_register",
  function () {
    if (this.ready()) {
      if (Meteor.userId() ){
        Router.go('home');
      } else {
        this.render("AfterRegister");
      }
    } else {
      this.render("Loading");
    }
  },
  {
    name: "after_register",
  }
);


Router.route(
  "/forgot_password",
  function () {
    if (this.ready()) {
      this.render("ForgotPassword");
    } else {
      this.render("Loading");
    }
  },
  {
    name: "forgot_password",
  }
);

Router.route(
  "/reset_password_email",
  function () {
    if (this.ready()) {
      if (Meteor.userId() ){
        Router.go('home');
      } else {
        this.render("AfterResetPassword");
      }
    } else {
      this.render("Loading");
    }
  },
  {
    name: "reset_password_email",
  }
);


Router.route(
  "/resetpassword/:token",
  function () {
    var self = this;
    if (this.ready()) {
      this.render("SetPassword");
    } else {
      this.render("Loading");
    }
  },
  {
    name: "set_password_page",
    data: function () {
      return {
        token: this.params.token
      }
    }
  }
);





Router.route(
  "/products/:_id/edit_product",
  function () {
    this.subscribe("publishProductId", this.params._id);
    this.subscribe("productImageById", this.params._id);
    if (this.ready()) {
      this.render("EditProductPage");
    } else {
      this.render("Loading");
    }
  },
  {
    name: "productEdit",
  }
);

