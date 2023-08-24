const Product=require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const ApiFeatures=require("../utils/apifeatures");
//create product-- admin
exports.createProduct=catchAsyncErrors(async (req,res,next)=>{
   
   req.body.user=req.user.id;
   
    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
         product
    })
});


//get all products
exports.getAllProducts=catchAsyncErrors(async(req,res)=>{

    const resultPerPage=5;
    const productCount=await Product.countDocuments();
    const apifeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

    const products=await apifeature.query;
    res.status(200).json({
        success:true,
        product,
        productCount
    });
});


// get product details
exports.getProductDetails=catchAsyncErrors(async (req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("Product not found",404));
    }
    res.status(200).json({
        success:true,
       product,
       productCount 
      })
});

// update product --admin

exports.updateProduct= catchAsyncErrors(async (req,res)=>{
    let product=Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("Product not found",404));
    }
    product=await Product.findOneAndUpdate(req.param.id,req.body,{new:true,
        runValidators:true,
        useFindAndModify:false
        });
        res.status(200).json({
            success:true,
            product
        })
});


// delete product --admin
exports.deleteProduct =catchAsyncErrors(async (req,res)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("Product not found",404));
    }
    await product.findOneAndRemove(req.params.id);
    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
});
