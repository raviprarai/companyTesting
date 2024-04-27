const router = require("express").Router();
const userRouter = require("../controller/userController");
const { verifyToken,verifyTokenAndUser } = require("../../middlewares/auth")
// const {uploadAddarForm,upload}=require("../../middlewares/fileUpload")
const multer = require('multer')
var storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
const upload = multer({storage:storage})
router.post("/userSignup", userRouter.userSignup);
router.post("/userLogin", userRouter.userLogin);
router.put("/editProfile", verifyTokenAndUser,userRouter.editProfile);
router.put("/editProfileImage", verifyTokenAndUser,upload.single('image'),userRouter.editProfileImage);
router.get("/showProfile", verifyTokenAndUser,userRouter.showProfile);
router.get("/userGetBookList",verifyTokenAndUser, userRouter.userGetBookList);
router.get("/getOneBook/:id",verifyTokenAndUser, userRouter.getOneBook);
router.post("/searchByBook",verifyTokenAndUser, userRouter.searchByBook);


module.exports = router;