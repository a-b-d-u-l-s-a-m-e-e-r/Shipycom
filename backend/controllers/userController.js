const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail");
const crypto = require("crypto");

// register user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "sample id",
      url: "image url",
    },
  });
  const token = user.getJWTToken();
  sendToken(user, 201, res);
});

//login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user have given password or email both
  if (!email || !password) {
    return next(ErrorHander("Please enter email and password", 400));
  }

  const user = User.findOne({ email }).select("+password");
  if (!email) {
    return next(ErrorHander("Invalid email and password", 401));
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(ErrorHander("Invalid email and password", 401));
  }

  sendToken(user, 200, res);
});

//logout user
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

//forgot password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  //get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`;

  try{

    await sendEmail({
        email:user.email,
        subject:`Shipycom Password Recovery`,
        message,

    });
    res.status(200).json({
        success:true,
        message:`Email sent to ${user.email} successfully.`
    })

  }catch(error){
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHander(error.message,500));
  }
});


//reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  
  //creating token hash
   const resetPasswordToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");
  
  const user=await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now()},
  });

  if (!user) {
    return next(new ErrorHander("Rest password token is invalid or has been expired.", 400));
  }  

  if(req.body.password!=req.body.confirmPassword){
      return next(new ErrorHander("Password does not matched", 400));
  }
  user.password=req.body.password;
  user.resetPasswordToken=undefined;
  user.resetPasswordExpire=undefined;

  await user.save();

  sendToken(user,200,res);
})

//get user details
exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{
  const user=await User.findById(req.user.id);
  
  res.status(200).json({
    success:true,
    user,
  })
})

//update user password
exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{
  const user=await User.findById(req.user.id).select("+password");
  
  const isPasswordMatched = user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(ErrorHander("Old password is incorrect", 400));
  }

  if(req.body.newPassword!==req.body.confirmPassword){
    return next(ErrorHander("Password does not match", 400));
  }

  user.password=req.body.newPassword; 

  await user.save();

  sendToken(user,200,res);
})

//update user details
exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
  const newUserData={
    name:req.body.name,
    email:req.body.email,
  }

  //we will add cloudinary later

  const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  })

  res.status(200).json({
    success:true
  });
});


//get all users
exports.getAllUser=catchAsyncErrors(async(req,res,next)=>{
const users=await User.find();

  res.status(200).json({
    success:true,
    users,
  });
});
