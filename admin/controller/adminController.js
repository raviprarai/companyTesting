const adminModel = require("../model/adminModel")
const userModel = require("../../user/model/userModel")
const authorModel = require("../model/author")
const bookModel = require("../model/bookModel")
const categoryModel = require("../model/bookCategory")
const transtionDb=require("../model/bookTransation")
const bookFinesDb = require("../model/bookFines")
const { admin, author, category,book } = require("../../validators/allValidators")
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

exports.addAuthor = async (req, res) => {
  try {
    const { error } = author.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    } else {
      const result = await authorModel.create({
        author_name: req.body.author_name,
        dob: req.body.dob,
        nationality: req.body.nationality,
        biography: req.body.biography
      });
      return res.status(200).json({
        status: 1,
        message: "Admin Add Author sucessfully",
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
exports.getAllAuthor = async (req, res) => {
  try {
    const result = await authorModel.find().populate("book").sort("-createdAt")
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
exports.updateAuthor = async (req, res) => {
  try {
    const data = await authorModel.findById(req.body.id);
    if (!data) {
      return res.status(404).json({
        status: 0,
        message: "Data Not Founded"
      })
    } else {
      const updatedData = await authorModel.findByIdAndUpdate(req.body.id, { $set: req.body }, { new: true })
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
exports.getOneAuthor = async (req, res) => {
  try {
    const result = await authorModel.findById(req.params.id);
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
exports.deletedAuthor = async (req, res) => {
  try {
    const data = await authorModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: 0,
        message: "Data Not Founded"
      })
    } else {
      const result = await authorModel.findByIdAndDelete(req.params.id);
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

exports.bookCategory = async (req, res) => {
  try {
    const { error } = category.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    } else {
      const exist = await categoryModel.exists({ category_Name: req.body.category_Name });
      if (exist) {
        return res
          .status(400)
          .json({ message: "This category_Name is already taken!" });
      }
      const result = await categoryModel.create({
        category_Name: req.body.category_Name
      })
      return res.status(200).json({
        status: 1,
        message: "Admin add category sucessfully",
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
exports.getAllbookCategory = async (req, res) => {
  try {
    const result = await categoryModel.find().populate("book").sort("-createdAt")
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
exports.deletedBookCategory = async (req, res) => {
  try {
    const data = await categoryModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: 0,
        message: "Data Not Founded"
      })
    } else {
      const result = await categoryModel.findByIdAndDelete(req.params.id);
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

exports.addBook = async (req, res) => {
  try {
    const { error } = book.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    } else {
      const result = await bookModel.create({
        bookName: req.body.bookName,
        alternateTitle:req.body.alternateTitle,
        author:req.body.author,
        publisher:req.body.publisher,
        description:req.body.description,
        category:req.body.category,
        publiction_year:req.body.publiction_year,
        language:req.body.language,
        pages:req.body.pages,
        edition:req.body.edition
      })
      await categoryModel.findByIdAndUpdate({_id:req.body.category},{$push:{book:result._id}},{new:true})
      await authorModel.findByIdAndUpdate({_id:req.body.author},{$push:{book:result._id}},{new:true})

      return res.status(200).json({
        status: 1,
        message: "Admin add book sucessfully",
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
exports.getAllbook = async (req, res) => {
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
exports.updateBook = async (req, res) => {
  try {
    const data = await bookModel.findById(req.body.id);
    if (!data) {
      return res.status(404).json({
        status: 0,
        message: "Data Not Founded"
      })
    } else {
      const updatedData = await bookModel.findByIdAndUpdate(req.body.id, { $set: req.body }, { new: true })
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
exports.deletedBook = async (req, res) => {
  try {
    const data = await bookModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: 0,
        message: "Data Not Founded"
      })
    } else {
      await authorModel.findByIdAndUpdate({_id:data.author},{$pull:{book:data._id}},{new:true})
      await categoryModel.findByIdAndUpdate({_id:data.category},{$pull:{book:data._id}},{new:true})

      const result = await bookModel.findByIdAndDelete(req.params.id);
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

exports.getAllBookTransation = async (req, res) => {
  try {
    const result = await transtionDb.find().populate("userId  bookId").sort("-createdAt")
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
exports.deletedBookTransation = async (req, res) => {
  try {
    const data = await transtionDb.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: 0,
        message: "Data Not Founded"
      })
    } else {
      const result = await transtionDb.findByIdAndDelete(req.params.id);
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
exports.addBookFines=async(req,res)=>{
  try {
    const result=await transtionDb.findById(req.body.id);
    if (!result) {
      return res.status(404).json({
        status: 0,
        message: "Data Not Founded"
    });
    } else {
      const userData=await userModel.findOne({_id:result.userId})
      const finesDb=await bookFinesDb.create({
        firstName:userData.firstName,
        lastName:userData.lastName,
        email:userData.email,
        bookId:result.bookId,
        userId:result.userId,
        booKTranstion:req.body.id,
        fines:req.body.fines
      })
      return res.status(200).json({
        status: 1,
        message: "Admin Add Fines For Issue Book",
        result:finesDb
    });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString()
  });
  }
}
exports.getAllBookTransationActive = async (req, res) => {
  try {
    const result = await transtionDb.find({transactionStatus:"Active"}).populate("userId  bookId").sort("-createdAt")
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
exports.getAllBookTransationInActive = async (req, res) => {
  try {
    const result = await transtionDb.find({transactionStatus:"Inactive"}).populate("userId  bookId").sort("-createdAt")
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
exports.getAllBookFines = async (req, res) => {
  try {
    const result = await bookFinesDb.find().populate("userId  booKTranstion bookId").sort("-createdAt")
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