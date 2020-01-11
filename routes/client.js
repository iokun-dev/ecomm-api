let orderService = require('./../services/orderService');
let cartService = require('./../services/cartService');

module.exports = (apiRoutes) => {
    apiRoutes.post('/api/orders', orderService.saveOrder);
    apiRoutes.post('/api/guestorder', orderService.saveGuestOrder);
    apiRoutes.get('/api/orders', orderService.getOrders);
    apiRoutes.get('/api/orders-list', orderService.getOrdersList);
    apiRoutes.get('/api/orders-listbyorderno', orderService.getOrdersListByOrderNo);
    apiRoutes.put('/api/update-order-list', orderService.updateOrderStatus);
    apiRoutes.get('/api/orders-item-preview',orderService.ordersItemPreview);
    apiRoutes.get('/api/guestorders-item-preview',orderService.OrdersItemPreviewGuest);
    apiRoutes.get('/api/orders-item-details',orderService.ordersItemDetails);
    apiRoutes.get('/api/orders-details',orderService.ordersDetails);
    apiRoutes.post('/api/orders-dispatch', orderService.dispatchOrder);
    apiRoutes.put('/api/order-cancel',orderService.cancelOrder);
    apiRoutes.put('/api/order-cancel-item',orderService.cancelOrderItem);
    apiRoutes.put('/api/order-return',orderService.returnOrder);
    apiRoutes.put('/api/order-return-item',orderService.returnOrderItem);
    apiRoutes.post('/api/add-to-cart', cartService.saveCartProducts);
    apiRoutes.post('/api/add-to-cart-guest', cartService.saveCartProductsGuest);

    
    apiRoutes.post('/api/add-remove-to-cart', cartService.addCartProductsIncrement);
    apiRoutes.delete('/api/delete-cart',cartService.deleteCart);
    apiRoutes.get('/api/my-cart', cartService.getCartProducts);
    apiRoutes.get('/api/my-cart-guest', cartService.getCartProductsGuest);
    apiRoutes.post('/api/exist-address', orderService.getExistAddress);
    apiRoutes.post('/api/address', orderService.saveAddress);
    apiRoutes.post('/api/billaddress', orderService.getBillAddress);
    apiRoutes.post('/api/addbilladdress', orderService.saveBillAddress);
};