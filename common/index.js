const Yup = require("yup");

const formSchema = Yup.object({
  username: Yup.string()
    .required('username required')
    .min(2, "username too short")
    .max(32, "username too long"),
  password: Yup.string()
    .required('password required')
    .min(6, "password too short")
    .max(128, "password too long"),
})

module.exports = { formSchema };