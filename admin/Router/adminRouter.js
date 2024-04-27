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
router.post("/addAuthor",verifyTokenAndAdmin, adminRouter.addAuthor);
router.get("/getAllAuthor",verifyTokenAndAdmin, adminRouter.getAllAuthor);
router.put("/updateAuthor",verifyTokenAndAdmin, adminRouter.updateAuthor);
router.get("/getOneAuthor/:id",verifyTokenAndAdmin, adminRouter.getOneAuthor);
router.delete("/deletedAuthor/:id",verifyTokenAndAdmin, adminRouter.deletedAuthor);

module.exports = router;