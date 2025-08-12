const validator = require('validator');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const nodemailer = require("nodemailer");
const doctorModel = require('../models/doctorModel');
const jwt=require('jsonwebtoken');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require("path");
const twilio = require("twilio");
const axios=require('axios')

// const addDoctor = async (req, res) => {
//   try {
//     console.log("Received request body:", req.body);
//     console.log("Received file:", req.file);

//     const { name, email, password, speciality, degree, experience,available, about, fees, address } = req.body;
//     const imageFile = req.file;

//     // Check for missing fields
//     if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
//       console.warn("Missing required fields");
//       return res.status(400).json({
//         success: false,
//         message: "Missing Details"
//       });
//     }

//     // Email validation
//     if (!validator.isEmail(email)) {
//       console.warn("Invalid email:", email);
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Email"
//       });
//     }

//     // Password validation
//     if (
//       password.length < 8 ||
//       !validator.matches(password, /[a-z]/) ||
//       !validator.matches(password, /[A-Z]/) ||
//       !validator.matches(password, /[0-9]/)
//     ) {
//       console.warn("Weak password");
//       return res.status(400).json({
//         success: false,
//         message:
//           "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
//       });
//     }

//     // Ensure image is provided
//     if (!imageFile) {
//       console.warn("Image file missing");
//       return res.status(400).json({
//         success: false,
//         message: "Image file is required"
//       });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     console.log("Password hashed");

//     // Upload image to Cloudinary
//     let imageUrl = '';
//     try {
//       const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
//         resource_type: "image"
//       });
//       imageUrl = imageUpload.secure_url;
//       console.log("Image uploaded to Cloudinary:", imageUrl);
//     } catch (cloudErr) {
//       console.error("Cloudinary upload error:", cloudErr);
//       return res.status(500).json({
//         success: false,
//         message: "Image upload failed",
//         error: cloudErr.message
//       });
//     }

//     // Parse address
//     let parsedAddress;
//     try {
//       parsedAddress = JSON.parse(address);
//     } catch (err) {
//       console.warn("Invalid address JSON:", address);
//       return res.status(400).json({
//         success: false,
//         message: "Invalid address format. Must be JSON."
//       });
//     }

//     const doctorData = {
//       name,
//       email,
//       available,
//       password: hashedPassword,
//       speciality,
//       degree,
//       experience,
//       about,
//       fees,
//       address: parsedAddress,
//       image: imageUrl,
//       date: Date.now()
//     };

//     const newDoctor = new doctorModel(doctorData);
//     const savedDoctor = await newDoctor.save();
//     console.log("Doctor saved to DB:", savedDoctor);

//     return res.status(200).json({
//       success: true,
//       message: "Doctor Added Successfully",
//       doctor: [savedDoctor]
//     });
//   } catch (err) {
//     console.error("Error in addDoctor:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//       error: err.message
//     });
//   }
// };

//API FOR THE ADMIN LOGIN

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        {
          email: process.env.ADMIN_EMAIL,
          role: 'admin'
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        success: true,
        message: "Admin Login Successful",
        token
      });
    } else {
      // 🔴 Invalid credentials — return 401 Unauthorized
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials"
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    // 🔴 Catch block also returns a consistent error structure
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server.",
      error: err.message
    });
  }
};



// const addDoctor = async (req, res) => {
//   try {
//     console.log("Received request body:", req.body);
//     console.log("Received file:", req.file);

//     const { name, email, phone, password, speciality, degree, experience, available, about, fees, address } = req.body;
//     const imageFile = req.file;

//     // validation
//     if (!name || !email || !phone || !password || !speciality || !degree || !experience || !about || !fees || !address) {
//       return res.status(400).json({ success: false, message: "Missing Details" });
//     }
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ success: false, message: "Invalid Email" });
//     }
//     if (
//       password.length < 8 ||
//       !validator.matches(password, /[a-z]/) ||
//       !validator.matches(password, /[A-Z]/) ||
//       !validator.matches(password, /[0-9]/)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 8 characters long and contain uppercase, lowercase, and a number"
//       });
//     }
//     if (!imageFile) {
//       return res.status(400).json({ success: false, message: "Image file is required" });
//     }

//     // hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // upload to cloudinary
//     let imageUrl = '';
//     try {
//       const upload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
//       imageUrl = upload.secure_url;
//     } catch (err) {
//       return res.status(500).json({ success: false, message: "Image upload failed", error: err.message });
//     }

//     // parse address
//     let parsedAddress;
//     try {
//       parsedAddress = JSON.parse(address);
//     } catch {
//       return res.status(400).json({ success: false, message: "Invalid address JSON" });
//     }

//     // save doctor
//     const newDoctor = new doctorModel({
//       name,
//       email,
//       phone,
//       available,
//       password: hashedPassword,
//       speciality,
//       degree,
//       experience,
//       about,
//       fees,
//       address: parsedAddress,
//       image: imageUrl,
//       date: Date.now()
//     });
//     const savedDoctor = await newDoctor.save();

//     // generate PDF
//     const pdfPath = path.join(__dirname, "../doctor_welcome.pdf");
//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream(pdfPath));

//     doc
//       .fillColor("#4F46E5")
//       .fontSize(24)
//       .text(`Welcome, Dr. ${name}!`, { align: "center" })
//       .moveDown()
//       .fillColor("#000000")
//       .fontSize(16)
//       .text(`Congratulations on joining our platform as a ${speciality} (${degree}).`, { align: "center" })
//       .moveDown()
//       .text("We are excited to have you on board. You can now offer your services to patients.", { align: "center" })
//       .moveDown(2)
//       .fillColor("#4F46E5")
//       .text("Profile Details", { underline: true })
//       .fillColor("#000000")
//       .text(`Name: Dr. ${name}`)
//       .text(`Email: ${email}`)
//       .text(`Speciality: ${speciality}`)
//       .text(`Degree: ${degree}`)
//       .text(`Experience: ${experience}`)
//       .text(`Fees: ₹${fees}`)
//       .text(`Address: ${parsedAddress.line1}, ${parsedAddress.line2}`)
//       .moveDown()
//       .fillColor("#4F46E5")
//       .text("Thank you for joining us!", { align: "center" });

//     doc.end();

//     // send email with PDF
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASSWORD
//       }
//     });

//     const htmlTemplate = `
//       <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #ccc;padding:20px">
//         <h2 style="color:#4F46E5">Welcome, Dr. ${name}!</h2>
//         <p>Your profile has been successfully created on our platform.</p>
//         <p><strong>Speciality:</strong> ${speciality}</p>
//         <p><strong>Degree:</strong> ${degree}</p>
//         <p>We are thrilled to have you join our mission to deliver quality healthcare.</p>
//         <p style="color:#4F46E5">Thank you for being a part of us!</p>
//       </div>
//     `;

//     await transporter.sendMail({
//       from: `"Sandy_Backend_Dev Admin" <${process.env.SMTP_EMAIL}>`,
//       to: email,
//       subject: "Welcome to Sandy_Backend_Dev  Platform",
//       html: htmlTemplate,
//       attachments: [
//         {
//           filename: "Welcome_Doctor.pdf",
//           path: pdfPath
//         }
//       ]
//     });

//     console.log(`Welcome email with PDF sent to ${email}`);

//     // 📲 Send WhatsApp message using Twilio
//     const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//     await twilioClient.messages.create({
//       from: 'whatsapp:+14155238886', // Twilio sandbox number or approved sender
//       to: `whatsapp:+91${phone}`,     // Doctor's number
//       body: `👨‍⚕️ Welcome Dr. ${name}!\n\nYour profile has been successfully created as a ${speciality} on Sandy_Backend_Dev.\nWe're excited to have you onboard!\n\n- Team Sandy_Backend_Dev`
//     });

//     console.log(`WhatsApp welcome message sent to ${phone}`);

//     return res.status(200).json({
//       success: true,
//       message: "Doctor added successfully. Welcome email and WhatsApp sent.",
//       doctor: savedDoctor
//     });

//   } catch (err) {
//     console.error("Error in addDoctor:", err);
//     return res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
//   }
// };



// const addDoctor = async (req, res) => {
//   try {
//     console.log("Received request body:", req.body);
//     console.log("Received file:", req.file);

//     const { name, email, phone, password, speciality, degree, experience, available, about, fees, address } = req.body;
//     const imageFile = req.file;

//     // === Validations ===
//     if (!name || !email || !phone || !password || !speciality || !degree || !experience || !about || !fees || !address) {
//       return res.status(400).json({ success: false, message: "Missing Details" });
//     }
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ success: false, message: "Invalid Email" });
//     }
//     if (
//       password.length < 8 ||
//       !validator.matches(password, /[a-z]/) ||
//       !validator.matches(password, /[A-Z]/) ||
//       !validator.matches(password, /[0-9]/)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 8 characters long and contain uppercase, lowercase, and a number"
//       });
//     }
//     if (!imageFile) {
//       return res.status(400).json({ success: false, message: "Image file is required" });
//     }

//     // === Password Hash ===
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // === Upload Image to Cloudinary ===
//     let imageUrl = '';
//     try {
//       const upload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
//       imageUrl = upload.secure_url;
//     } catch (err) {
//       return res.status(500).json({ success: false, message: "Image upload failed", error: err.message });
//     }

//     // === Parse Address ===
//     let parsedAddress;
//     try {
//       parsedAddress = JSON.parse(address);
//     } catch {
//       return res.status(400).json({ success: false, message: "Invalid address JSON" });
//     }

//     // === Save Doctor ===
//     const newDoctor = new doctorModel({
//       name,
//       email,
//       phone,
//       available,
//       password: hashedPassword,
//       speciality,
//       degree,
//       experience,
//       about,
//       fees,
//       address: parsedAddress,
//       image: imageUrl,
//       date: Date.now()
//     });
//     const savedDoctor = await newDoctor.save();

//     // === Generate PDF ===
//     const pdfPath = path.join(__dirname, "../doctor_welcome.pdf");
//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream(pdfPath));

//     doc
//       .fillColor("#4F46E5")
//       .fontSize(24)
//       .text(`Welcome, Dr. ${name}!`, { align: "center" })
//       .moveDown()
//       .fillColor("#000000")
//       .fontSize(16)
//       .text(`Congratulations on joining our platform as a ${speciality} (${degree}).`, { align: "center" })
//       .moveDown()
//       .text("We are excited to have you on board. You can now offer your services to patients.", { align: "center" })
//       .moveDown(2)
//       .fillColor("#4F46E5")
//       .text("Profile Details", { underline: true })
//       .fillColor("#000000")
//       .text(`Name: Dr. ${name}`)
//       .text(`Email: ${email}`)
//       .text(`Speciality: ${speciality}`)
//       .text(`Degree: ${degree}`)
//       .text(`Experience: ${experience}`)
//       .text(`Fees: ₹${fees}`)
//       .text(`Address: ${parsedAddress.line1}, ${parsedAddress.line2}`)
//       .moveDown()
//       .fillColor("#4F46E5")
//       .text("Thank you for joining us!", { align: "center" });

//     doc.end();

//     // === Upload PDF to Cloudinary (for WhatsApp) ===
//     const uploadedPdf = await cloudinary.uploader.upload(pdfPath, {
//       resource_type: "raw",
//       public_id: `welcome_pdf_${Date.now()}`
//     });
//     const pdfUrl = uploadedPdf.secure_url;

//     // === Send Email with PDF ===
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASSWORD
//       }
//     });

//     const htmlTemplate = `
//       <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #ccc;padding:20px">
//         <h2 style="color:#4F46E5">Welcome, Dr. ${name}!</h2>
//         <p>Your profile has been successfully created on our platform.</p>
//         <p><strong>Speciality:</strong> ${speciality}</p>
//         <p><strong>Degree:</strong> ${degree}</p>
//         <p>We are thrilled to have you join our mission to deliver quality healthcare.</p>
//         <p style="color:#4F46E5">Thank you for being a part of us!</p>
//       </div>
//     `;

//     await transporter.sendMail({
//       from: `"Sandy_Backend_Dev Admin" <${process.env.SMTP_EMAIL}>`,
//       to: email,
//       subject: "Welcome to Sandy_Backend_Dev Platform",
//       html: htmlTemplate,
//       attachments: [
//         {
//           filename: "Welcome_Doctor.pdf",
//           path: pdfPath
//         }
//       ]
//     });

//     console.log(`📧 Welcome email with PDF sent to ${email}`);

//     // === Send WhatsApp Message with PDF ===
//     const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//     await twilioClient.messages.create({
//       from: 'whatsapp:+14155238886',
//       to: `whatsapp:+91${phone}`,
//       body: `👨‍⚕️ Hello Dr. ${name},\n\nWelcome to Sandy_Backend_Dev!\n\nYour welcome letter is attached as a PDF.\n\n- Team Sandy_Backend_Dev`,
//       mediaUrl: [pdfUrl] // PDF hosted on Cloudinary
//     });

//     console.log(`📲 WhatsApp welcome PDF sent to ${phone}`);

//     return res.status(200).json({
//       success: true,
//       message: "Doctor added successfully. Welcome email and WhatsApp with PDF sent.",
//       doctor: savedDoctor
//     });

//   } catch (err) {
//     console.error("Error in addDoctor:", err);
//     return res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
//   }
// };





const AllDoctor=async(req,res)=>{
  try{

    const doctorList=await doctorModel.find({}).select('-password');
    console.log("Doctor",doctorList)


    return res.status(200).json({
      success: true,
      message: "Doctor Data Fetched Successfully",
      doctorList: doctorList,
    });
    



  }catch(err){
    return res.status(400).json({
      err:true,
      msg:"Something Went Wrong",
      data:[]
    })

  }
}


const addDoctor = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received file:", req.file);

    const { name, email, phone, password, speciality, degree, experience, available, about, fees, address } = req.body;
    const imageFile = req.file;

    if (!name || !email || !phone || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.status(400).json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }
    if (
      password.length < 8 ||
      !validator.matches(password, /[a-z]/) ||
      !validator.matches(password, /[A-Z]/) ||
      !validator.matches(password, /[0-9]/)
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long and contain uppercase, lowercase, and a number"
      });
    }
    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = '';
    try {
      const upload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      imageUrl = upload.secure_url;
    } catch (err) {
      return res.status(500).json({ success: false, message: "Image upload failed", error: err.message });
    }

    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid address JSON" });
    }

    const newDoctor = new doctorModel({
      name,
      email,
      phone,
      available,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      image: imageUrl,
      date: Date.now()
    });
    const savedDoctor = await newDoctor.save();

    // 👇 Add path to your logo image
    const logoPath = path.join(__dirname, '../public/images/dev.png');
    const pdfPath = path.join(__dirname, "../doctor_welcome.pdf");
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    // Add logo at top
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 220, 30, { width: 150 });
    }

    doc.moveDown(5);
    doc
      .fillColor("#4F46E5")
      .fontSize(24)
      .text(`Welcome, Dr. ${name}!`, { align: "center" })
      .moveDown()
      .fillColor("#000000")
      .fontSize(16)
      .text(`Congratulations on joining our platform as a ${speciality} (${degree}).`, { align: "center" })
      .moveDown()
      .text("We are excited to have you on board. You can now offer your services to patients.", { align: "center" })
      .moveDown(2)
      .fillColor("#4F46E5")
      .text("Profile Details", { underline: true })
      .fillColor("#000000")
      .text(`Name: Dr. ${name}`)
      .text(`Email: ${email}`)
      .text(`Speciality: ${speciality}`)
      .text(`Degree: ${degree}`)
      .text(`Experience: ${experience}`)
      .text(`Fees: ₹${fees}`)
      .text(`Address: ${parsedAddress.line1}, ${parsedAddress.line2}`)
      .moveDown()
      .fillColor("#4F46E5")
      .text("Thank you for joining us!", { align: "center" });

    doc.end();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const htmlTemplate = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #ccc;padding:20px">
        <h2 style="color:#4F46E5">Welcome, Dr. ${name}!</h2>
        <p>Your profile has been successfully created on our platform.</p>
        <p><strong>Speciality:</strong> ${speciality}</p>
        <p><strong>Degree:</strong> ${degree}</p>
        <p>We are thrilled to have you join our mission to deliver quality healthcare.</p>
        <p style="color:#4F46E5">Thank you for being a part of us!</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Sandy_Backend_Dev Admin" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Welcome to Sandy_Backend_Dev Platform",
      html: htmlTemplate,
      attachments: [
        {
          filename: "Welcome_Doctor.pdf",
          path: pdfPath
        }
      ]
    });

    console.log(`Welcome email with PDF sent to ${email}`);

    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await twilioClient.messages.create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+91${phone}`,
      body: `👨‍⚕️ Welcome Dr. ${name}!\n\nYour profile has been successfully created as a ${speciality} on Sandy_Backend_Dev.\nWe're excited to have you onboard!\n\n- Team Sandy_Backend_Dev`
    });

    return res.status(200).json({
      success: true,
      message: "Doctor added successfully. Welcome email and WhatsApp sent.",
      doctor: savedDoctor
    });

  } catch (err) {
    console.error("Error in addDoctor:", err);
    return res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
  }
};

// const addDoctor = async (req, res) => {
//   try {
//     console.log("Received request body:", req.body);
//     console.log("Received file:", req.file);

//     const { name, email, phone, password, speciality, degree, experience, available, about, fees, address } = req.body;
//     const imageFile = req.file;

//     if (!name || !email || !phone || !password || !speciality || !degree || !experience || !about || !fees || !address) {
//       return res.status(400).json({ success: false, message: "Missing Details" });
//     }
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ success: false, message: "Invalid Email" });
//     }
//     if (
//       password.length < 8 ||
//       !validator.matches(password, /[a-z]/) ||
//       !validator.matches(password, /[A-Z]/) ||
//       !validator.matches(password, /[0-9]/)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 8 characters long and contain uppercase, lowercase, and a number"
//       });
//     }
//     if (!imageFile) {
//       return res.status(400).json({ success: false, message: "Image file is required" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     let imageUrl = '';
//     try {
//       const upload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
//       imageUrl = upload.secure_url;
//     } catch (err) {
//       return res.status(500).json({ success: false, message: "Image upload failed", error: err.message });
//     }

//     let parsedAddress;
//     try {
//       parsedAddress = JSON.parse(address);
//     } catch {
//       return res.status(400).json({ success: false, message: "Invalid address JSON" });
//     }

//     const newDoctor = new doctorModel({
//       name,
//       email,
//       phone,
//       available,
//       password: hashedPassword,
//       speciality,
//       degree,
//       experience,
//       about,
//       fees,
//       address: parsedAddress,
//       image: imageUrl,
//       date: Date.now()
//     });
//     const savedDoctor = await newDoctor.save();

//     // ✅ ADD WEBHOOK CALL AFTER SAVING THE DOCTOR
//     try {
//       await axios.post('https://hooks.zapier.com/hooks/catch/1234567/abcde'
// , {
//         name,
//         email,
//         phone,
//         speciality,
//         degree,
//         experience,
//         available,
//         about,
//         fees,
//         address: parsedAddress,
//         image: imageUrl,
//         date: new Date()
//       });
//     } catch (webhookError) {
//       console.error("Webhook failed:", webhookError.message);
//       // Do not block main flow if webhook fails
//     }

//     // (📎 Keep your PDF generation and email/WhatsApp sending code unchanged here...)

//     // All your email, WhatsApp, and PDF code comes here as you already have.

//     return res.status(200).json({
//       success: true,
//       message: "Doctor added successfully. Welcome email, WhatsApp, and webhook sent.",
//       doctor: savedDoctor
//     });

//   } catch (err) {
//     console.error("Error in addDoctor:", err);
//     return res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
//   }
// };



const updateDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const updateFields = { ...req.body };
    const imageFile = req.file;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    // Find the doctor
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Remove docId from updateFields to prevent overwriting _id
    delete updateFields.docId;

    // Validate email if present
    if (updateFields.email && !validator.isEmail(updateFields.email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Handle password update if present
    if (updateFields.password) {
      const password = updateFields.password;
      if (
        password.length < 8 ||
        !validator.matches(password, /[a-z]/) ||
        !validator.matches(password, /[A-Z]/) ||
        !validator.matches(password, /[0-9]/)
      ) {
        return res.status(400).json({
          success: false,
          message: "Password must contain uppercase, lowercase, number, and be at least 8 characters"
        });
      }

      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Parse address if provided as JSON string
    if (updateFields.address && typeof updateFields.address === 'string') {
      try {
        updateFields.address = JSON.parse(updateFields.address);
      } catch {
        return res.status(400).json({ success: false, message: "Invalid address JSON" });
      }
    }

    // If image file is uploaded, upload to Cloudinary
    if (imageFile) {
      try {
        const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image",
        });
        updateFields.image = uploadResult.secure_url;
      } catch (err) {
        return res.status(500).json({ success: false, message: "Image upload failed", error: err.message });
      }
    }

    // Update the doctor
    Object.assign(doctor, updateFields);
    const updatedDoctor = await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};



module.exports = { addDoctor,adminLogin,AllDoctor,updateDoctor };
