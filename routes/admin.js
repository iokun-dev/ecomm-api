let attributeService = require('./../services/attributeService');
let categoryService = require('./../services/categoryService');
let productService = require('./../services/productService');
let userService = require('./../services/userService');
let cmsService = require('./../services/cmsService');
let orderService = require('./../services/orderService');
module.exports = (apiRoutes) => {
    apiRoutes.post('/api/sendmail', userService.sendmail);
    apiRoutes.get('/api/getFileRead', userService.getFileRead);
    apiRoutes.post('/api/user-login', userService.userLogin);
    apiRoutes.post('/api/change-password', userService.userChangePassword);    
    apiRoutes.post('/api/product-attribute', attributeService.saveProductAttribute);
    apiRoutes.get('/api/product-attribute', attributeService.getProductAttribute);
    apiRoutes.get('/api/get-attribute-infoById', attributeService.getAttributeInfoById);
    apiRoutes.put('/api/product-attribute', attributeService.updateProductAttribute);
    apiRoutes.delete('/api/product-attribute', attributeService.deleteProductAttribute);
    //apiRoutes.update('/api/product-attribute',attributeService.updateProductAttribute);
    apiRoutes.post('/api/product-category', categoryService.saveProductCategory);
    apiRoutes.post('/api/product-sub-sub-category', categoryService.saveProductSubSubCategory);
    apiRoutes.get('/api/product-sub-sub-category', categoryService.getProductSubSubCategory);
    apiRoutes.get('/api/product-category', categoryService.getProductCategory);
    apiRoutes.put('/api/product-category', categoryService.updateProductCategory);
    apiRoutes.delete('/api/product-category', categoryService.deleteProductCategory);
    apiRoutes.post('/api/product-subcategory', categoryService.saveProductSubCategory);
    apiRoutes.get('/api/product-subcategory', categoryService.getProductSubCategory);
    apiRoutes.put('/api/product-subcategory', categoryService.updateProductSubCategory);
    apiRoutes.delete('/api/product-subcategory', categoryService.deleteProductSubCategory);
    //apiRoutes.get('/api/product-subcategory-list',categoryService.getProductSubCategoryList);
    apiRoutes.post('/api/save-product', productService.saveProduct);
    apiRoutes.delete('/api/delete-product', productService.deleteProduct);
    apiRoutes.put('/api/update-product', productService.updateProduct);
    apiRoutes.get('/api/get-productdetails-byid',productService.getProductDetailsById);
    apiRoutes.post('/api/user-registration', userService.userRegistration);
    apiRoutes.put('/api/user-registration', userService.updateUserRegistration);
    apiRoutes.delete('/api/delete-user', userService.deleteUser);    
    apiRoutes.get('/api/user-role-list', userService.userRoleList);
    apiRoutes.get('/api/user-list', userService.getUserList);
    apiRoutes.get('/api/product-detail', productService.getProductsDetail);
    apiRoutes.get('/api/search-product', productService.getSearchProducts);
    apiRoutes.get('/api/search-product-sku', productService.getSearchProductsSkuNumber);
    apiRoutes.get('/api/filter-price-product', productService.getPriceFilterOnProducts);
    apiRoutes.post('/api/product-payment',productService.productPayment);
    apiRoutes.get('/api/execute',productService.execute);
    apiRoutes.get('/api/cancel',productService.cancel);
    apiRoutes.get('/api/delivery-action',productService.deliveryAction);
    apiRoutes.get('/api/lookup-details',productService.lookupDetails);
    apiRoutes.get('/api/lookup-filter-data',productService.lookupFilterData);
    apiRoutes.get('/api/lookup-filter-row-data',productService.lookupFilterRowData);
    apiRoutes.put('/api/update-lookup-filter-row-data',productService.UpdateLookupFilterRowData);
    apiRoutes.delete('/api/delete-lookup-filter-row-data',productService.DeleteLookupFilterRowData);
    apiRoutes.get('/api/lookup-details-filter',productService.lookupDetailsFilter);
    //apiRoutes.get('/api/user-list', userService.listUser);
    apiRoutes.get('/api/product-list-update', productService.productListUpdate);
    apiRoutes.post('/api/save-cms-content',cmsService.saveCmsContent); 
    apiRoutes.post('/api/saveCmsWithoutImage',cmsService.saveCmsWithoutImage);    
    apiRoutes.post('/api/saveContactUs',cmsService.saveContactUs);

    
    apiRoutes.get('/api/get-cms-content',cmsService.getCmsContent);
    apiRoutes.get('/api/getCmsContentNew',cmsService.getCmsContentNew);
    apiRoutes.put('/api/update-cms-content',cmsService.updateCmsContent);
    apiRoutes.post('/api/save-image-slider',cmsService.saveImageSlider);
    apiRoutes.get('/api/get-image-slider',cmsService.getImageSlider);
    apiRoutes.get('/api/get-image-slider-by-id',cmsService.getImageSliderById);
    
    apiRoutes.put('/api/show-slider-image',cmsService.showSliderImage);

    apiRoutes.put('/api/update-image-slider-by-id',cmsService.updateImageSliderById);

    apiRoutes.delete('/api/delete-image-slider-by-id',cmsService.deleteImageSliderById);
    apiRoutes.put('/api/update-order-status',orderService.updateOrderStatus);
    apiRoutes.post('/api/save-lookup-details',productService.saveLookupDetails);
    apiRoutes.get('/api/lookup-state-list',productService.lookupStateList);
    apiRoutes.post('/api/send-mail',orderService.sendMail);
    apiRoutes.post('/api/save-faq',cmsService.saveFaq);
    apiRoutes.get('/api/get-faq',cmsService.getFaq);
    apiRoutes.post('/api/save-about-us',cmsService.saveAboutUs);
    apiRoutes.post('/api/send-order-mail',orderService.sendOrderMail);
    
    
   


};