var OrderDetails = function(){
  this.receiver = {
    firstName : element(by.binding('order.receiver.firstName')),
    lastName : element(by.binding('order.receiver.lastName')),
    address : element(by.binding('order.receiver.streetAddress')),
    postalCode : element(by.binding('order.receiver.postalCode')),
    city : element(by.binding('order.receiver.city'))
  };

  this.productNames = element.all(by.repeater('row in order.products').column('product'));

  this.total = element(by.binding('total'));

  this.btnSetAsSent = element(by.css('.container .btn'));
};

module.exports = OrderDetails;
