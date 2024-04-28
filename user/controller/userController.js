const userDb = require("../model/userModel")
const bookModel = require("../../admin/model/bookModel")
const bookTransation = require("../../admin/model/bookTransation")

const { userSchema, userLogin, userEditSchema, image, bookTransations } = require("../../validators/allValidators")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const commonfunction = require("../../middlewares/fileUpload")
exports.userSignup = async (req, res) => {
    try {
        //   let { email, password } = req.body;
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            const exist = await userDb.exists({ email: req.body.email });
            if (exist) {
                return res
                    .status(400)
                    .json({ message: "This email is already taken!" });
            }
            const existData = await userDb.exists({ phone: req.body.phone });
            if (existData) {
                return res
                    .status(400)
                    .json({ message: "This Phone is already taken!" });
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const result = await userDb.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                dob: req.body.dob,
                email: req.body.email,
                phone: req.body.phone,
                joinDate: new Date(),
                gender: req.body.gender,
                address: req.body.address,
                password: hashedPassword,
            });

            return res.status(200).json({
                status: 1,
                message: "User Signup sucessfully",
                result
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
};
exports.userLogin = async (req, res) => {
    try {
        const { error } = userLogin.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            let userResult = await userDb.findOne({ email: req.body.email });
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
                        _id: userResult._id,
                        isUser: userResult.isUser,
                    };
                    let token = jwt.sign(dataToken, "test1234", {
                        expiresIn: "30d",
                    });
                    return res.status(200).json({
                        status: 1,
                        message: "User Login Successfully.....",
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
exports.editProfile = async (req, res) => {
    try {
        const { error } = userEditSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            const result = await userDb.findById(req.user._id);
            if (!result) {
                return res.status(404).json({
                    status: 0,
                    message: "User Not Founded"
                })
            } else {
                const upadatedata = await userDb.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
                return res.status(200).json({
                    status: 1,
                    message: "Update Successfully",
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString()
        })
    }
}
exports.editProfileImage = async (req, res) => {
    try {
        const { error } = image.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            const result = await userDb.findById(req.user._id);
            if (!result) {
                return res.status(404).json({
                    status: 0,
                    message: "User Not Founded"
                })
            } else {
                let profilePic = req.file.path
                req.body.profilePic = await commonfunction.uploadImage(profilePic);
                req.body.profilePic = req.body.profilePic
                const upadatedata = await userDb.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
                return res.status(200).json({
                    status: 1,
                    message: "Update Successfully",
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString()
        })
    }
}
exports.showProfile = async (req, res) => {
    try {
        const result = await userDb.findById(req.user._id)
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "User Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "User Data Founded",
                result
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
}


exports.userGetBookList = async (req, res) => {
    try {
        const result = await bookModel.find().populate("category author").sort("-createdAt")
        if (!result[0]) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded"
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
exports.getOneBook = async (req, res) => {
    try {
        const result = await bookModel.findById(req.params.id).populate("category author");
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Found"
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
exports.searchByBook = async (req, res) => {
    try {
        const key = req.body.key;
        const data = {
            $or: [
                { publisher: { $regex: new RegExp(key, "i") } },
                { publiction_year: { $regex: new RegExp(key, "i") } },
                { bookName: { $regex: new RegExp(key, "i") } },
                { alternateTitle: { $regex: new RegExp(key, "i") } }
            ],
        };
        const result = await bookModel.find(data).populate("category author");
        //   const totalCount = await userModel.countDocuments(data, dateCondition);
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "Book Founded Successfully",
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

exports.addBookTransation = async (req, res) => {
    try {
        const { error } = bookTransations.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        } else {
            const bookData = await bookModel.findById({ _id: req.body.bookId })
            if (!bookData) {
                return res.status(404).json({
                    status: 0,
                    message: "Book Not Founded",
                });
            }
            const fromDate = new Date(req.body.fromDate);
            const toDate = new Date(req.body.toDate);
            // console.log(fromDate,toDate);
            const result = await bookTransation.create({
                bookId:req.body.bookId,
                bookName: bookData?.bookName,
                userId: req.user._id,
                fromDate: fromDate,
                toDate: toDate,
            })
            await bookModel.findByIdAndUpdate({ _id: req.body.bookId }, { $push: { transactions: result._id } }, { new: true })

            return res.status(200).json({
                status: 1,
                message: "User Issue book sucessfully",
                result
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
};
exports.myIssueBook = async (req, res) => {
    try {
        const result = await bookTransation.find({userId:req.user._id}).populate("bookId");
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Found"
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
exports.returnBook=async(req,res)=>{
    try {
        const result=await bookTransation.findById(req.body.id)
        if (!result) {
            return res.status(404).json({
                status:0,
                message:"Data Not Founded"
            })
        } else {
            const returnDate = new Date(req.body.returndate);
           await bookTransation.findByIdAndUpdate(req.body.id,{
            transactionType:"Return",
            returnDate:returnDate,
            transactionStatus:"Inactive"
           },{new:true})
           return res.status(200).json({
            status: 1,
            message: "User Return book sucessfully"
        });
        }
    } catch (error) {
        return res.status(500).json({
            status:0,
            message:error.toString()
        })
    }
}