const adminModel = require("../model/adminModel")
const userModel = require("../../user/model/userModel")
const { admin } = require("../../validators/allValidators")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.adminSignup = async (req, res) => {
    try {
        let { email, password } = req.body;
        const { error } = admin.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        } else {
            const exist = await adminModel.exists({ email: req.body.email });
            if (exist) {
                return res
                    .status(400)
                    .json({ message: "This email is already taken!" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newuser = new adminModel({
                email,
                password: hashedPassword,
            });
            const saveduser = await newuser.save();
            return res.status(200).json({
                status: 1,
                message: "Admin is Signup sucessfully",
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
};
exports.adminlogin = async (req, res) => {
    try {
        const { error } = admin.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        } else {
            let userResult = await adminModel.findOne({ email: req.body.email });
            if (!userResult) {
                return res.status(404).json({
                    status: 0,
                    message: "Email Not found",
                });
            } else {
                let passCheck = bcrypt.compareSync(
                    req.body.password,
                    userResult.password
                );
                if (passCheck == false) {
                    return res.status(401).json({
                        status: 0,
                        message: "Incorrect password.",
                    });
                } else {
                    let dataToken = {
                        id: userResult._id,
                        isAdmin: userResult.isAdmin,
                    };
                    let token = jwt.sign(dataToken, "test1234", {
                        expiresIn: "30d",
                    });
                    return res.status(200).json({
                        status: 1,
                        message: "Admin Login Successfully.....",
                        result: userResult,
                        token,
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 0,
            message: error.toString(),
        });
    }
};
exports.userListAPI = async (req, res) => {
    try {
        const key = req.body.key;
        const page = parseInt(req.body.page);
        const perPage = parseInt(req.body.perPage);
        const startDate = req?.body?.startDate;
        const endDate = req?.body?.endDate;
        const dateCondition = {};
        if (startDate && endDate) {
            const currentDate = new Date();
            console.log(currentDate);
            if (new Date(endDate) <= currentDate) {
                dateCondition.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate + "T23:59:59.999Z"),
                };
            } else {
                return res.status(400).json({
                    status: 0,
                    message: "Please Enter Correct Date",
                });
            }
        }
        const data = {
            $or: [
                { firstName: { $regex: new RegExp(key, "i") } },
                { lastName: { $regex: new RegExp(key, "i") } },
                { email: { $regex: new RegExp(key, "i") } },
                { username: { $regex: new RegExp(key, "i") } },
                { phone: { $regex: new RegExp(key, "i") } },
                { address: { $regex: new RegExp(key, "i") } }
            ],
        };
        const skip = (page - 1) * perPage;
        const result = await userModel.find(data, dateCondition).sort("-createdAt")
            .skip(skip)
            .limit(perPage);
        const totalCount = await userModel.countDocuments(data, dateCondition);
        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 0,
                message: "User Not Founded"
            })
        } else {
            const totalPages = Math.ceil(totalCount / perPage);
            return res.status(200).json({
                status: 1,
                message: "User Founded Successfully",
                result,
                totalPages,
                currentPage: page,
                totalCount,
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString()
        })
    }
}
exports.updateUserData = async (req, res) => {
    try {
      const userData = await userModel.findById(req.body.id);
      if (!userData) {
        return res.status(404).json({
          status: 0,
          message: "User Not Founded"
        })
      } else {
        const updatedData = await userModel.findByIdAndUpdate(req.body.id, { $set: req.body }, { new: true })
        return res.status(200).json({
          status: 1,
          message: "Update Successfully"
        })
      }
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString()
      })
    }
  }
  exports.getOneUser = async (req, res) => {
    try {
      const result = await userModel.findById(req.params.id);
      if (!result) {
        return res.status(404).json({
          status: 0,
          message: "User Not Found"
        })
      } else {
        return res.status(200).json({
          status: 1,
          message: "Data Founded",
          result
        })
      }
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString()
      })
    }
  }
  exports.deletedProfile = async (req, res) => {
    try {
      const userdata = await userModel.findById(req.params.id);
      if (!userdata) {
        return res.status(404).json({
          status: 0,
          message: "User Not Founded"
        })
      } else {
        const result = await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
          status: 1,
          message: "Data Deleted Successfully",
        })
      }
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString()
      })
    }
  }