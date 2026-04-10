import { z, ZodSchema, ZodObject } from "zod";
import { useState, useCallback } from "react";


export const useFormValidation = <T extends Record<string, unknown>>(
    schema: ZodObject<{ [K in keyof T]: ZodSchema<T[K]> }>
) => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    /**
     * Validates a single field based on the schema
     */
    const validateField = useCallback(
        <K extends keyof T>(name: K, value: T[K]) => {
            try {
                const fieldSchema = (schema.shape as unknown as Record<keyof T, ZodSchema<T[K]>>)[name];
                if (!fieldSchema) return;

                const singleFieldSchema = z.object({ [name as string]: fieldSchema });

                singleFieldSchema.parse({ [name as string]: value });

                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name as string];
                    return newErrors;
                });

                return true;
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const fieldError = error.issues[0]?.message;
                    setErrors((prev) => ({
                        ...prev,
                        [name as string]: fieldError,
                    }));
                    return false;
                }
            }
        },
        [schema]
    );

    /**
     * Validates the entire form based on the schema
     */
    const validateForm = useCallback(
        (data: T) => {
            try {
                schema.parse(data);
                setErrors({});
                return { success: true, errors: null };
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const newErrors = Object.fromEntries(
                        error.issues.map(({ path, message }) => [path[0], message])
                    );
                    setErrors(newErrors);
                    return { success: false, errors: newErrors };
                }
                return { success: false, errors: { form: "Validation failed" } };
            }
        },
        [schema]
    );

    return {
        errors,
        validateField,
        validateForm,
    };
};

// Usage
// const schema = z.object({
//   name: z.string().min(3, "Name must be at least 3 characters"),
//   email: z.string().email("Invalid email address"),
//   age: z.preprocess(
//     (val) => Number(val),
//     z.number().min(18, "Must be at least 18")
//   ),
// });

// const { errors, validateField, validateForm } = useFormValidation(schema);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     age: 18,
//   });

// validateField(field, value);

// validateForm(formData)