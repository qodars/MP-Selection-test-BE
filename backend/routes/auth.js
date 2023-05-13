const router = require("express").Router();
const { authController } = require("../controller")
const {upload} = require("../src/uploader/uploader")
const {verifyToken} = require("../middleware/auth")


router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/forgotpassword", authController.forgotPassword)
router.put("/resetpassword/:token", authController.putpassword)

//
router.put("/profiledit", upload({
    acceptedFileTypes: ["png", "jpg", "jpeg"],
    filePrefix: "FILE",
    maxSize: 1 * 1024 * 1024,
}).single("picture"), verifyToken, authController.profiledit)


module.exports = router;