// const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");

<<<<<<< HEAD
const userModel = require("../models/userModel");
const { uploadFile } = require("../util/aws");
=======
////////////                Validation              ////////////
const isValid = function (value) {
    if (typeof value == undefined || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === Number && value.trim().length === 0) return false
    return true
}
const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
  }
  


//////////                  CreateUser              ///////////
>>>>>>> e2760c1798b32bca92757feda7d3b37a192c9ef1

const {
  isValid,
  isValidRequestBody,
  isValidName,
  isValidPhone,
  isValidPassword,
  isValidPincode,
  isValidStreet,
  isValidCity,
} = require("../util/validator"); // isValidObjectId,

//-------------------------------------------------------------------------
//                1. API - POST /register
//-------------------------------------------------------------------------

const createUser = async function (req, res) {
  try {
    let data = req.body;
    let files = req.files;

    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Request Body Empty." });
    }

    if (!isValid(data.fname)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <fname>.",
      });
    }
    if (!isValidName(data.fname)) {
      return res.status(400).send({
        status: false,
        message: "<fname> should be Alphabets & Whitespace's Only.",
      });
    }

    if (!isValid(data.lname)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <lname>.",
      });
    }
    if (!isValidName(data.lname)) {
      return res.status(400).send({
        status: false,
        message: "<lname> should be Alphabets & Whitespace's Only.",
      });
    }

    if (!isValid(data.email)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <email>.",
      });
    }

    if (!isEmail(data.email)) {
      return res.status(400).send({
        status: false,
        message: "<email> Format Invalid.",
      });
    }

    const emailExist = await userModel.findOne({
      email: data.email,
    });
    if (emailExist) {
      return res.status(400).send({
        status: false,
        message: "<email> already registered.",
      });
    }

    if (!isValid(data.phone)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <phone>.",
      });
    }

    if (!isValidPhone(data.phone)) {
      return res.status(400).send({
        status: false,
        message:
          "<phone> should be an Indian Number ONLY (start with <6,7,8 or 9> and 10-Digits).",
      });
    }

    const phoneExist = await userModel.findOne({
      phone: data.phone,
    });
    if (phoneExist) {
      return res.status(400).send({
        status: false,
        message: "<phone> number already registered.",
      });
    }

    if (!isValid(data.password)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <password>.",
      });
    }
    if (!isValidPassword(data.password)) {
      return res.status(400).send({
        status: false,
        message: "<password> must be between 8 and 15 characters.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    // Address Validations. //!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (!data.address) {
      return res.status(400).send({
        status: false,
        message: "Please enter <address> in Object Format.",
      });
    }

    // console.log(data.address);
    // console.log(typeof data.address);

    const address = JSON.parse(data.address); //  For converting <address> in Form-data To JavaScript Object.

    // //ADDRESS Validation(Correct Format(OBJECT) - if Present ).
    // if (typeof address === "string" || address === null || address === false) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "ADDRESS Mandatory: As an <OBJECT> Format.",
    //   });
    // }

    // const address = JSON.parse(data.address); //  For converting <address> in Form-data To JavaScript Object.

    if (address) {
      if (Object.keys(address).length === 0) {
        return res.status(400).json({
          status: false,
          message:
            "<address> Empty. Please enter both <shipping> & <billing> address.",
        });
      }
    }

    if (!isValidRequestBody(address.shipping)) {
      return res.status(400).send({
        status: false,
        message: "<shipping> address required in Object Format.",
      });
    }

    if (!isValidRequestBody(address.billing)) {
      return res.status(400).send({
        status: false,
        message: "<billing> address required in Object Format.",
      });
    }

    if (!isValidStreet(address.shipping.street)) {
      return res.status(400).send({
        status: false,
        message:
          "Shipping <street> required (Alphabets, Hyphen(-), Forward-slash(/), Comma(,), Fullstop(.), Parenthesis(), Numbers & White-space(s) ONLY).",
      });
    }

    if (!isValidCity(address.shipping.city)) {
      return res.status(400).send({
        status: false,
        message:
          "Shipping <city> required (Alphabets, Hyphen(-) & White-space(s) ONLY)",
      });
    }

    if (!isValidPincode(address.shipping.pincode)) {
      return res.status(400).send({
        status: false,
        message:
          "Shipping <pincode> required (Indian Pincode - start with <1> and 6-Digits).",
      });
    }

    if (!isValidStreet(address.billing.street)) {
      return res.status(400).send({
        status: false,
        message:
          "Billing <street> required (Alphabets, Hyphen(-), Forward-slash(/), Comma(,), Fullstop(.), Parenthesis(), Numbers & White-space(s) ONLY).",
      });
    }

    if (!isValidCity(address.billing.city)) {
      return res.status(400).send({
        status: false,
        message:
          "Billing <city> required (Alphabets, Hyphen(-) & White-space(s) ONLY)",
      });
    }

    if (!isValidPincode(address.billing.pincode)) {
      return res.status(400).send({
        status: false,
        message:
          "Billing <pincode> required (Indian Pincode - start with <1> and 6-Digits).",
      });
    }

    data.address = address;

    // Upload Image.
    if (files && files.length > 0) {
      //upload to s3 and get the uploaded link
      let uploadedFileURL = await uploadFile(files[0]);
      data.profileImage = uploadedFileURL;
    } else {
      return res.status(400).send({
        message: "<Profile Image> is required.",
      });
    }

    let savedData = await userModel.create(data);
    return res.status(201).send({
      status: true,
      message: "User created successfully",
      data: savedData,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

//-------------------------------------------------------------------------
//                2. API - POST /login
//-------------------------------------------------------------------------

const login = async function (req, res) {
  try {
    if (!isValidRequestBody(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Request Body Empty." });
    }

    const { email, password } = req.body;

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide <email>." });
    }
    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide <password>." });
    }

    // Email Format.
    if (!isEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "<email> Format Invalid." });
    }
    if (!isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message: "<password> must be between 8 and 15 characters.",
      });
    }

    let findUser = await userModel.findOne({ email });
    if (!findUser) {
      return res.status(404).send({
        status: false,
        message: `User having email: <${email}> Not Found.`,
      });
    }

    let decryptedPassword = await bcrypt.compare(password, findUser.password); // await with <bcrypt>??
    if (!decryptedPassword)
      return res.status(401).send({
        status: false,
        message: "Invalid Credentials (Incorrect Password).",
      });

    // let token = jwt.sign(
    //   {
    //     userId: findUser._id,
    //     iat: Math.floor(Date.now() / 1000),
    //     exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
    //   },
    //   "Secret-Key"
    // );
    let token = jwt.sign(
      { userId: findUser._id },
      "This-is-a-Secret-Key-for-Login(!@#$%^&*(</>)))",
      {
        expiresIn: "24h", // 24 Hours.
      }
    );

    const userData = {
      userId: findUser._id,
      token: token,
    };
    return res.status(200).send({
      status: true,
      message: "User login successfull.",
      data: userData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//-------------------------------------------------------------------------
//                3. API - GET /user/:userId/profile
//-------------------------------------------------------------------------
const getUserById = async (req, res) => {
  try {
    const userIdParams = req.params.userId.trim();

    const findUser = await userModel.findById(userIdParams);

    if (!findUser) {
      return res
        .status(404)
        .send({ status: false, message: "User NOT Found." });
    }

    return res.status(200).send({
      status: true,
      message: "User profile details.",
      data: findUser,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//-------------------------------------------------------------------------
//                4. API - PUT /user/:userId/profile
//-------------------------------------------------------------------------
const updateUserById = async (req, res) => {
  try {
    const userIdParams = req.params.userId.trim();
    let body = req.body;

    if (!isValidRequestBody(body)) {
      return res
        .status(400)
        .send({ status: false, message: "Request Body Empty." });
    }

    const { fname, lname, email, phone, password, address } = body;

    // Validations.
    //fname.
    if (fname) {
      if (!isValid(fname)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide <fname>." });
      }

      if (!isValidName(fname)) {
        return res.status(400).send({
          status: false,
          message: "<fname> Invalid (Alphabets & Whitespace's Only).",
        });
      }
<<<<<<< HEAD
=======
  
      return res.status(200).send({
        status: true,
        message: "User profile details.",
        data: findUser,
      });
    } catch (error) {
      return res.status(500).send({ status: false, msg: error.message });
>>>>>>> e2760c1798b32bca92757feda7d3b37a192c9ef1
    }
    //  lname.
    if (lname) {
      if (!isValid(lname)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide <lname>." });
      }

<<<<<<< HEAD
      if (!isValidName(lname)) {
        return res.status(400).send({
          status: false,
          message: "<lname> Invalid (Alphabets & Whitespace's Only).",
        });
      }
    }
=======
//////////                  UpdateUser                   ///////////

const UpdateUser= async function(req,res){
    let data =req.body
    const userIdFromParams= req.params.userId
    const userIdFromToken = req.userId

    const {fname, lname, email, phone, password, address}=data
    const updatedData= {}
    if(!isValidObjectId(userIdFromParams)){
        return res.status(400).send({status: false, msg: "Valid UserId is required"})
      }
      const userByuserId= await userModel.findById(userIdFromParams);

      if(!userByuserId){
        return res.status(404).send({status: false, msg: "User not found."})
      }

      if(userIdFromToken != userIdFromParams){
        return res.status(403).send({status: false,message: "Unauthorized access."});
      }

      if (Object.keys(data) == 0) {
        return res.status(400).send({status: false,msg: "please provide data to update"})
    }

//=======================================fname validation=====================================


if (fname) {
    if (!isValid(fname)) {
        return res.status(400).send({ status: false, Message: "First name is required" })
    }
    updatedData.fname = fname
}


//===================================lname validation==========================================


if (lname) {
    if (!isValid(lname)) {
        return res.status(400).send({ status: false, Message: "Last name is required" })
    }
    updatedData.lname = lname
}

//================================email validation==============================================


if (email) {

    if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email.trim()))) return res.status(400).send({ status: false, msg: "Please provide a valid email" });

    const isEmailUsed = await userModel.findOne({ email: email })
    if (isEmailUsed) {
        return res.status(400).send({ status: false, msg: "email must be unique" })
    }
    updatedData.email = email
}


//=======================profile pic upload and validation==========================

let saltRounds = 10
const files = req.files

if (files && files.length > 0) {

    const profilePic = await aws.uploadFile(files[0])

    updatedData.profileImage = profilePic

}

//===============================phone validation-========================================

if (phone) {

    if (!(/^([+]\d{2})?\d{10}$/.test(phone))) return res.status(400).send({ status: false, msg: "please provide a valid phone number" })

    const isPhoneUsed = await userModel.findOne({ phone: phone })
    if (isPhoneUsed) {
        return res.status(400).send({ status: false, msg: "phone number must be unique" })
    }
    updatedData.phone = phone
}

//======================================password validation-====================================


if (password) {
    if (!isValid(password)) { return res.status(400).send({ status: false, message: "password is required" }) }
    //if (!(/^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&*-]).{8,15}$/.test(data.password.trim()))) { return res.status(400).send({ status: false, msg: "please provide a valid password with one uppercase letter ,one lowercase, one character and one number " }) }

    const encryptPassword = await bcrypt.hash(password, saltRounds)

    updatedData.password = encryptPassword
}


//========================================address validation=================================

if (address) {

    if (address.shipping) {

        if (!isValid(address.shipping.street)) {
            return res.status(400).send({ status: false, Message: "street name is required" })
        }
        updatedData["address.shipping.street"] = address.shipping.street


        if (!isValid(address.shipping.city)) {
            return res.status(400).send({ status: false, Message: "city name is required" })
        }

        updatedData["address.shipping.city"] = address.shipping.city

        if (!isValid(address.shipping.pincode)) {
            return res.status(400).send({ status: false, Message: "pincode is required" })
        }

        updatedData["address.shipping.pincode"] = address.shipping.pincode

    }

    if (address.billing) {
        if (!isValid(address.billing.street)) {
            return res.status(400).send({ status: false, Message: "Please provide street name in billing address" })
        }
        updatedData["address.billing.street"] = address.billing.street

        if (!isValid(address.billing.city)) {
            return res.status(400).send({ status: false, Message: "Please provide city name in billing address" })
        }
        updatedData["address.billing.city"] = address.billing.city

        if (!isValid(address.billing.pincode)) {
            return res.status(400).send({ status: false, Message: "Please provide pincode in billing address" })
        }
        updatedData["address.billing.pincode"] = address.billing.pincode
    }
}

//=========================================update data=============================

    const updatedUser = await userModel.findOneAndUpdate({ _id: userIdFromParams }, updatedData, { new: true })

  return res.status(200).send({ status: true, message: "User profile updated", data: updatedUser });

}
>>>>>>> e2760c1798b32bca92757feda7d3b37a192c9ef1

    // email.
    if (email) {
      if (!isValid(email)) {
        return res.status(400).send({
          status: false,
          message: "Please provide <email>.",
        });
      }
      // Email Format.
      if (!isEmail(email)) {
        return res
          .status(400)
          .send({ status: false, message: "<email> Format Invalid." });
      }
      // Unique - email Validations (DB-Call).
      const emailAlreadyExist = await userModel.findOne({ email });
      if (emailAlreadyExist) {
        return res
          .status(409)
          .send({ status: false, message: "<email> already registered." });
      }
    }

    // phone.
    if (phone) {
      if (!isValidPhone(phone)) {
        return res.status(400).send({
          status: false,
          message:
            "<phone> should be an Indian Number ONLY (start with <6,7,8 or 9> and 10-Digits).",
        });
      }
      // Unique - phone Validations (DB-Call).
      const phoneAlreadyExist = await userModel.findOne({ phone });
      if (phoneAlreadyExist) {
        return res
          .status(409)
          .send({ status: false, message: "<phone> already registered." });
      }
    }

    // Password.
    if (password) {
      if (!isValidPassword(password)) {
        return res.status(400).send({
          status: false,
          message: "<password> must be between 8 and 15 characters.",
        });
      }
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }

<<<<<<< HEAD
    // Address.
    if (address) {
      if (!isValidRequestBody(address)) {
        return res.status(400).send({
          status: false,
          message: "<address> Object can not be empty.",
        });
      }

      const { shipping, billing } = address;
      let userDocument = await userModel.findById(userIdParams);

      // Shipping Address.
      if (shipping) {
        if (!isValidRequestBody(shipping)) {
          return res.status(400).send({
            status: false,
            message: "<shipping> Object can not be empty.",
          });
        }

        const { street, city, pincode } = shipping;

        if (street) {
          if (!isValid(street)) {
            return res.status(400).send({
              status: false,
              message: "<street> can not be empty.",
            });
          }
          if (!isValidStreet(street)) {
            return res.status(400).send({
              status: false,
              message:
                "STREET can be Alphabets, Hyphen(-), Forward-slash(/), Comma(,), Fullstop(.), Parenthesis(), Numbers & White-space(s) ONLY.",
            });
          }
          userDocument.address.shipping.street = street;
        }
        if (city) {
          if (!isValid(city)) {
            return res.status(400).send({
              status: false,
              message: "<city> can not be empty.",
            });
          }
          if (!isValidCity(city)) {
            return res.status(400).send({
              status: false,
              message:
                "<city> can be Alphabets, Hyphen(-) & White-space(s) ONLY",
            });
          }
          userDocument.address.shipping.city = city;
        }
        if (pincode) {
          if (!isValidPincode(pincode)) {
            return res.status(400).send({
              status: false,
              message:
                "<pincode> must be an Indian Pincode (start with <1> and 6-Digits).",
            });
          }
          userDocument.address.shipping.pincode = pincode;
        }
      }

      // Billing Address.
      if (billing) {
        if (!isValidRequestBody(billing)) {
          return res.status(400).send({
            status: false,
            message: "<billing> Object can not be empty.",
          });
        }

        const { street, city, pincode } = billing;

        if (street) {
          if (!isValid(street)) {
            return res.status(400).send({
              status: false,
              message: "<street> can not be empty.",
            });
          }
          if (!isValidStreet(street)) {
            return res.status(400).send({
              status: false,
              message:
                "STREET can be Alphabets, Hyphen(-), Forward-slash(/), Comma(,), Fullstop(.), Parenthesis(), Numbers & White-space(s) ONLY.",
            });
          }
          userDocument.address.billing.street = street;
        }
        if (city) {
          if (!isValid(city)) {
            return res.status(400).send({
              status: false,
              message: "<city> can not be empty.",
            });
          }
          if (!isValidCity(city)) {
            return res.status(400).send({
              status: false,
              message:
                "<city> can be Alphabets, Hyphen(-) & White-space(s) ONLY",
            });
          }
          userDocument.address.billing.city = city;
        }
        if (pincode) {
          if (!isValidPincode(pincode)) {
            return res.status(400).send({
              status: false,
              message:
                "<pincode> must be an Indian Pincode (start with <1> and 6-Digits).",
            });
          }
          userDocument.address.billing.pincode = pincode;
        }
      }
      body.address = userDocument.address;
    }

    //// profileImage Validations.
    const file = req.files;
    if (file && file.length > 0) {
      const profilePicURL = await uploadFile(file[0]);
      body.profileImage = profilePicURL;
    }

    // Update User.
    const updateUser = await userModel.findByIdAndUpdate(userIdParams, body, {
      new: true,
    });
    // ERROR: If userId Not in Database.
    if (!updateUser) {
      return res.status(404).send({
        status: false,
        message: `User with ID <${userIdParams}> NOT Found.`,
      });
    }

    return res.status(200).send({
      status: true,
      message: "User profile updated.",
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  login,
  getUserById,
  updateUserById,
  createUser,
};
=======
module.exports = {createUser,login,getUserById,UpdateUser};
>>>>>>> e2760c1798b32bca92757feda7d3b37a192c9ef1
