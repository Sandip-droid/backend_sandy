const Doctor = require('../models/doctorModel');
// import { doctors } from '../../prescripto_admin/doctor_admin/src/assets/assets';

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    // Find current doctor
    const docData = await Doctor.findById(docId);
    if (!docData) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Toggle availability
    docData.available = !docData.available;
    await docData.save();

    return res.status(200).json({
      success: true,
      message: "Availability changed successfully",
      doctor: docData, // send updated doctor
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};



const doctorList=async(req,res)=>{
  try{
    const doctors=await Doctor.find({}).select('-password');
    console.log("object",doctors)


    return res.status(200).json({
      success: true,
      message: "Doctor List Fetched Successfully",
      doctors: doctors,
    });

  }catch(err)
  {
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
}

module.exports = { changeAvailability,doctorList };
