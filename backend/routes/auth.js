const router = require("express").Router();
const { authController } = require("../controller")
const {upload} = require("../src/uploader/uploader")
const {verifyToken} = require("../middleware/auth")
const {newver} = require("../middleware/update")


router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/forgotpassword", authController.forgotPassword)
router.put("/resetpassword/:token", authController.putpassword)
router.put("/verification",newver, authController.verification)

//
router.put("/profiledit", upload({
    acceptedFileTypes: ["png", "jpg", "jpeg"],
    filePrefix: "FILE",
    maxSize: 1 * 1024 * 1024,
}).single("picture"), verifyToken, authController.profiledit)


module.exports = router;