

Template.ProductEditPage.events({
});


Template.ProductEditPage.helpers({
    "isSelected": function (cat1, cat2) {
        console.log(cat1);
        console.log(cat2);

        if (cat1=cat2) {

            return "selected";
            
        } else {
            return "";
        }
    }
    
});

