import { z } from "zod";

export const loginSchema = z.object({

    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

});


export const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),

});

export const registerVerifySchema = z.object({

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    otp: z.preprocess(
        (val) => Number(val),
        z
            .number({ error: "OTP must be a number" })
            .int("OTP must be an integer")
            .min(100000, "OTP must be exactly 6 digits")
            .max(999999, "OTP must be exactly 6 digits")
    ),
});


export type loginSchemaType = z.infer<typeof loginSchema>;
export type registerSchemaType = z.infer<typeof registerSchema>;
export type registerVerifySchemaType = z.infer<typeof registerVerifySchema>;
