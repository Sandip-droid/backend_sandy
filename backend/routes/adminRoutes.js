const express = require('express');
const authUser=require('../middlewares/authUser.js')
const {addDoctor,adminLogin,AllDoctor,updateDoctor} = require('../controllers/adminController.js')
const {changeAvailability,doctorList} = require('../controllers/doctorController.js')
// const {}=require('../controllers/userController.js')
const upload=require('../middlewares/multer.js');
const authAdmin = require('../middlewares/authAdmin.js');
const { registerUser, loginUser, getProfile,updateProfile,bookAppointment } = require('../controllers/userController.js');
const router=express.Router();


router.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);

router.post('/update-doctor', upload.single('image'), updateDoctor);
router.get('/doctorList',authAdmin,AllDoctor)
router.get('/doctor-list',doctorList)
router.post('/login',adminLogin);
router.post('/register',registerUser)
router.post('/loginUser',loginUser)

router.post('/change-availability',authAdmin,changeAvailability);

router.get('/get-profile',authUser,getProfile)
router.post('/update-profile',upload.single('image'),authUser,updateProfile)
router.post('/booking',authUser,bookAppointment)

module.exports=router;