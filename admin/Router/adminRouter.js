const router = require("express").Router();
const adminRouter = require("../controller/adminController");
const { verifyToken,verifyTokenAndUser,verifyTokenAndAdmin } = require("../../middlewares/auth")
// const {uploadAddarForm,upload}=require("../../middlewares/fileUpload")
// const upload1=require("../../aws/s3")

router.post("/adminSignup", adminRouter.adminSignup);
router.post("/adminlogin", adminRouter.adminlogin);

router.post("/userListAPI",verifyTokenAndAdmin, adminRouter.userListAPI);
router.put("/updateUserData",verifyTokenAndAdmin, adminRouter.updateUserData);
router.get("/getOneUser/:id",verifyTokenAndAdmin, adminRouter.getOneUser);
router.delete("/deletedProfile/:id",verifyTokenAndAdmin, adminRouter.deletedProfile);






module.exports = router;