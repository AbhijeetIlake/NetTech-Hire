import Joi from "joi";

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(", ");
            return res.status(400).json({
                success: false,
                message: errorMessage,
            });
        }

        next();
    };
};

// Auth Validation Schemas
export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name must not exceed 100 characters",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(128).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.max": "Password must not exceed 128 characters",
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
    role: Joi.string().valid("applicant", "company").required().messages({
        "any.only": "Role must be either 'applicant' or 'company'",
        "any.required": "Role is required",
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
});

// Job Validation Schemas
export const createJobSchema = Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
        "string.empty": "Job title is required",
        "string.min": "Job title must be at least 3 characters",
        "string.max": "Job title must not exceed 200 characters",
        "any.required": "Job title is required",
    }),
    description: Joi.string().min(10).max(5000).required().messages({
        "string.empty": "Job description is required",
        "string.min": "Job description must be at least 10 characters",
        "string.max": "Job description must not exceed 5000 characters",
        "any.required": "Job description is required",
    }),
    location: Joi.string().min(2).max(200).required().messages({
        "string.empty": "Location is required",
        "string.min": "Location must be at least 2 characters",
        "string.max": "Location must not exceed 200 characters",
        "any.required": "Location is required",
    }),
    salaryRange: Joi.string().max(100).allow("").optional().messages({
        "string.max": "Salary range must not exceed 100 characters",
    }),
    workMode: Joi.string()
        .valid("onsite", "remote", "hybrid")
        .required()
        .messages({
            "any.only": "Work mode must be 'onsite', 'remote', or 'hybrid'",
            "any.required": "Work mode is required",
        }),
    employmentType: Joi.string()
        .valid("full-time", "part-time", "contract", "internship")
        .required()
        .messages({
            "any.only":
                "Employment type must be 'full-time', 'part-time', 'contract', or 'internship'",
            "any.required": "Employment type is required",
        }),
});

// Application Status Validation Schema
export const updateApplicationStatusSchema = Joi.object({
    status: Joi.string()
        .valid("applied", "shortlisted", "interview", "selected", "rejected")
        .required()
        .messages({
            "any.only":
                "Status must be one of: applied, shortlisted, interview, selected, rejected",
            "any.required": "Status is required",
        }),
});

// Profile Update Validation Schema
export const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional().messages({
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name must not exceed 100 characters",
    }),
    email: Joi.string().email().optional().messages({
        "string.email": "Please provide a valid email address",
    }),
}).min(1).messages({
    "object.min": "At least one field is required for update",
});
