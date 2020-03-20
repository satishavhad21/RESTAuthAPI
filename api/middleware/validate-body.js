const Joi = require('joi');

exports.validatePostUser = (req, res, next) => {

    const data = req.body;

    const userPostloginSchema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    Joi.validate(data, userPostloginSchema, (error, result) => {
        if (error) {
           
            return res.status(501).json({
                message: "Invalid Input",
                error: error
            })
        }
        else {
            console.log("Validated User "+JSON.stringify(result));
            next();
        }
    });

};
