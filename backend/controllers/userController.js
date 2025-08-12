const Validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Import your User model
const userModel = require('../models/userModel');
const cloudinary = require('cloudinary').v2;
const Doctor = require('../models/doctorModel');
const appointmentModel=require('../models/appointmentModel');
// const doctorModel = require('../models/doctorModel');
// API to register new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 2. Validate email
        if (!Validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        // 3. Validate strong password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password should be at least 8 characters long"
            });
        }

        // 4. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Save user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        // 6. Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            err: false,
            data: token
        });

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            err: true,
            msg: "Something Went Wrong",
            data: []
        });
    }
};

//api for user login

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 2️⃣ Validate email format
        if (!Validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // 3️⃣ Find user in DB
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 4️⃣ Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // 5️⃣ Ensure secret key exists
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT secret key is missing in environment variables"
            });
        }

        // 6️⃣ Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
};


//Api to get user profile data


const getProfile = async (req, res) => {
    
    try {
      const userData = await User.findById(req.userId).select('-password');
  
      if (!userData) {
        return res.status(404).json({
          err: true,
          msg: "User not found",
          data: []
        });
      }
  
      return res.status(200).json({
        err: false,
        msg: "Data Fetched Successfully",
        data: [userData]
      });
  
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        err: true,
        msg: "Something Went Wrong",
        data: []
      });
    }
  };
  

//API to update 
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body;
        const userId = req.userId; // from auth middleware
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.status(400).json({ err: true, message: "Data Missing", data: [] });
        }

        let parsedAddress = null;
        try {
            parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
        } catch {
            parsedAddress = null;
        }

        const updateData = { name, phone, address: parsedAddress, dob, gender };

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            updateData.image = imageUpload.secure_url;
        }

        const updatedProfile = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedProfile) {
            return res.status(404).json({ err: true, message: "User not found", data: null });
        }

        return res.status(200).json({ err: false, message: "Profile Updated Successfully", data: updatedProfile });
    } catch (err) {
        return res.status(500).json({ err: true, message: err.message || "Something went wrong", data: [] });
    }
};

//Api to Book Appointmnet

// const bookAppointment=async(req,res)=>{
//     try{
//         const{userId,docId,slotDate,slotTime}=req.body

//         const docData=await Doctor.findById(docId).select('-password')

//         if(!docData.available){
//             return res.status(400).json({
//                 err:true,
//                 message:"Something Went Wrong",
//                 data:[]
//             })
            

//         }
//         let slots_booked=docData.slots_booked

//         if(slots_booked[slotDate])
//         {
//             if(slots_booked[slotDate].includes(slotTime)){
//                 return res.json({
//                     success:false,
//                     message:"Slot not Available",
//                     data:[]
//                 })

//             }else{
//                 slots_booked[slotDate].push(slotTime)
//             }

//         }else{
//             slots_booked[slotDate]=[]
//             slots_booked[slotDate].push(slotTime)
//         }

//         const userData=await userModel.findById(userId).select('-password')

//         delete docData.slots_booked
//         const appoimentData={
//             userId,
//             docId,
//             userData,
//             docData,
//             amount:docData.fees,
//             slotTime,
//             slotDate,
//             date:Date.now()


//         }
//         const newAppointment=new appointmentModel(appoimentData)
//          const db_Appointment=   await newAppointment.save();

//             //save new slots data in docData

//             await Doctor.findByIdAndUpdate(docId,{slots_booked})

//             return res.status(200).json({
//                 err:false,
//                 message:"Appointment Booked Successfully",
//                 data:db_Appointment
//             })



//     }catch(err){
//         return res.status(400).json({
//             err:true,
//             message:"Something Went Wrong",
//             data:[]
//         })

//     }
// }


// const bookAppointment = async (req, res) => {
//     try {
//         const { userId, docId, slotDate, slotTime } = req.body;

//         // 1. Doctor data fetch
//         const doctor = await Doctor.findById(docId).select('-password');
//         if (!doctor) {
//             return res.status(404).json({
//                 err: true,
//                 message: "Doctor not found",
//                 data: []
//             });
//         }

//         // 2. Check availability
//         if (!doctor.available) {
//             return res.status(400).json({
//                 err: true,
//                 message: "Doctor is not available",
//                 data: []
//             });
//         }

//         // 3. Check and update slots_booked
//         let slots_booked = { ...doctor.slots_booked }; // copy for safety
//         if (!slots_booked[slotDate]) {
//             slots_booked[slotDate] = [];
//         }

//         if (slots_booked[slotDate].includes(slotTime)) {
//             return res.status(400).json({
//                 err: true,
//                 message: "Slot not available",
//                 data: []
//             });
//         }

//         slots_booked[slotDate].push(slotTime);

//         // 4. User data fetch
//         const user = await userModel.findById(userId).select('-password');
//         if (!user) {
//             return res.status(404).json({
//                 err: true,
//                 message: "User not found",
//                 data: []
//             });
//         }

//         // 5. Appointment data prepare
//         const appointmentData = {
//             userId,
//             docId,
//             userData: user,
//             docData: {
//                 _id: doctor._id,
//                 name: doctor.name,
//                 email: doctor.email,
//                 speciality: doctor.speciality,
//                 degree: doctor.degree,
//                 experience: doctor.experience,
//                 about: doctor.about,
//                 fees: doctor.fees,
//                 available: doctor.available,
//                 address: doctor.address
//             },
//             amount: doctor.fees,
//             slotTime,
//             slotDate,
//             date: Date.now()
//         };

//         // 6. Save appointment
//         const newAppointment = new appointmentModel(appointmentData);
//         const savedAppointment = await newAppointment.save();

//         // 7. Update doctor's booked slots
//         await Doctor.findByIdAndUpdate(docId, { slots_booked });

//         // 8. Success response
//         return res.status(200).json({
//             err: false,
//             message: "Appointment booked successfully",
//             data: savedAppointment
//         });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             err: true,
//             message: "Internal Server Error",
//             data: []
//         });
//     }
// };



const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        const docData = await Doctor.findById(docId).select('-password');

        if (!docData.available) {
            return res.status(400).json({
                err: true,
                message: "Doctor not available",
                data: []
            });
        }

        let slots_booked = docData.slots_booked || {};

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({
                    success: false,
                    message: "Slot not Available",
                    data: []
                });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        const userData = await userModel.findById(userId).select('-password');

        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        const db_Appointment = await newAppointment.save();

        // ✅ FIX — Save only the updated slot date
        await Doctor.findByIdAndUpdate(
            docId,
            { $set: { [`slots_booked.${slotDate}`]: slots_booked[slotDate] } },
            { new: true }
        );

        return res.status(200).json({
            err: false,
            message: "Appointment Booked Successfully",
            data: db_Appointment
        });

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            err: true,
            message: "Something Went Wrong",
            data: []
        });
    }
};





module.exports = { registerUser,loginUser,getProfile,updateProfile,bookAppointment };
