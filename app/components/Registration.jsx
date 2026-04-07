"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { registerAction } from "@/app/serverActions/registerAction";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Phone number must be between 10 and 15 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerError("");

      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("password", values.password);

        const data = await registerAction(formData);

        if (data.success) {
          setSuccess(true);
          formik.resetForm();

          setTimeout(() => {
            router.push("/login");
          }, 1500);
        } else {
          setServerError(data.message || "Registration failed");
        }
      } catch (err) {
        setServerError(err.message || "An error occurred during registration");
      } finally {
        setLoading(false);
      }
    },
  });

  const inputClass = (touched, err) =>
    `luxury-input ${touched && err ? "luxury-input-error" : ""}`;

  return (
    <div className="flex w-full justify-center px-4 py-12 md:py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-luxury-charcoal/75 transition hover:text-luxury-black"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="luxury-surface space-y-6 p-8">
          <div className="text-center">
            <h1 className="mb-2 font-display text-3xl font-semibold text-luxury-black">
              Create Account
            </h1>
            <p className="text-luxury-charcoal/70">Join us and get started today</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="luxury-label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass(formik.touched.name, formik.errors.name)}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-xs text-red-600">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="luxury-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass(formik.touched.email, formik.errors.email)}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-red-600">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="luxury-label">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="9999999999"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass(
                  formik.touched.phoneNumber,
                  formik.errors.phoneNumber
                )}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="luxury-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder=""
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass(
                  formik.touched.password,
                  formik.errors.password
                )}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.password}
                </p>
              ) : (
                <p className="mt-1 text-xs text-luxury-charcoal/60">
                  Must contain 8+ characters, uppercase, lowercase, and number
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="luxury-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder=""
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass(
                  formik.touched.confirmPassword,
                  formik.errors.confirmPassword
                )}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {serverError && (
              <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-2xl border border-luxury-gold/40 bg-luxury-gold/10 px-4 py-3 text-sm text-luxury-black">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Registration successful! Redirecting to login...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success || !formik.isValid || !formik.dirty}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-luxury-gold py-3 px-4 font-semibold text-luxury-black shadow-luxury-gold transition hover:bg-luxury-gold-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin text-luxury-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-luxury-stone" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/95 px-2 text-luxury-charcoal/60">
                Already have an account?
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-luxury-gold-dark transition hover:text-luxury-black hover:underline"
            >
              Sign in instead
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-luxury-charcoal/65">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-luxury-gold-dark hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-luxury-gold-dark hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
