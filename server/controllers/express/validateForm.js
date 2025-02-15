const Yup = require("yup");

const formSchema = Yup.object({
  username: Yup.string()
    .required("username required")
    .min(2, "username too short")
    .max(32, "username too long"),
  password: Yup.string()
    .required("password required")
    .min(6, "password too short")
    .max(128, "password too long"),
});

const validateForm = (req, res, next) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .catch(() => {
      res.status(422).send();
    })
    .then((valid) => {
      if (valid) {
        // console.log("valid form");
        next();
      } else {
        res.status(422).send();
      }
    });
};

module.exports = validateForm;
