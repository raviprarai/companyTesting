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
router.post("/bookCategory",verifyTokenAndAdmin, adminRouter.bookCategory);
router.get("/getAllbookCategory",verifyTokenAndAdmin, adminRouter.getAllbookCategory);
router.delete("/deletedBookCategory/:id",verifyTokenAndAdmin, adminRouter.deletedBookCategory);
router.post("/addBook",verifyTokenAndAdmin, adminRouter.addBook);
router.get("/getAllbook",verifyTokenAndAdmin, adminRouter.getAllbook);
router.put("/updateBook",verifyTokenAndAdmin, adminRouter.updateBook);
router.get("/getOneBook/:id",verifyTokenAndAdmin, adminRouter.getOneBook);
router.delete("/deletedBook/:id",verifyTokenAndAdmin, adminRouter.deletedBook);
router.get("/getAllBookTransation",verifyTokenAndAdmin, adminRouter.getAllBookTransation);
router.delete("/deletedBookTransation/:id",verifyTokenAndAdmin, adminRouter.deletedBookTransation);
router.post("/addBookFines",verifyTokenAndAdmin, adminRouter.addBookFines);
router.get("/getAllBookTransationActive",verifyTokenAndAdmin, adminRouter.getAllBookTransationActive);
router.get("/getAllBookTransationInActive",verifyTokenAndAdmin, adminRouter.getAllBookTransationInActive);
router.get("/getAllBookFines",verifyTokenAndAdmin, adminRouter.getAllBookFines);

module.exports = router;