"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const UserLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerError("");

      try {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.ok) {
          setSuccess(true);
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 500);
        } else {
          const errorMessages = {
            CredentialsSignin: "Invalid email or password",
            CallbackError: "Authentication failed. Please try again.",
            Default: result?.error || "Login failed",
          };
          setServerError(
            errorMessages[result?.error] || errorMessages.Default
          );
          formik.setFieldValue("password", "");
        }
      } catch (err) {
        setServerError(err.message || "Login error");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const inputClass = (touched, err) =>
    `luxury-input ${touched && err ? "luxury-input-error" : ""}`;

  return (
    <div className="flex w-full justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-md">
        <div className="luxury-surface space-y-6 p-8">
          <div className="text-center">
            <h1 className="mb-2 font-display text-3xl font-semibold text-luxury-black">
              Welcome Back
            </h1>
            <p className="text-luxury-charcoal/70">Sign in to your account</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
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
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.password}
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
                <span>Login successful! Redirecting...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success || !formik.isValid}
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
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-luxury-stone" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/95 px-2 text-luxury-charcoal/60">OR</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-luxury-stone bg-white py-3 px-4 font-semibold text-luxury-black shadow-sm transition hover:border-luxury-gold/40 hover:bg-luxury-sand/50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="text-center">
            <Link
              href="/registration"
              className="font-medium text-luxury-gold-dark transition hover:text-luxury-black hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
