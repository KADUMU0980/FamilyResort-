import Link from "next/link";

export default function LoginRequiredPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-3xl sm:px-10 border border-gray-100 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
                        <span className="text-4xl">🔒</span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                        Login Required
                    </h2>

                    <p className="text-gray-600 mb-8 text-lg">
                        You need to login to access this page.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-lg"
                        >
                            Login
                        </Link>

                        <Link
                            href="/registration"
                            className="w-full flex justify-center py-3 px-4 border border-blue-200 rounded-xl shadow-sm text-base font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            Sign Up
                        </Link>

                        <Link
                            href="/"
                            className="block mt-6 text-sm text-gray-500 hover:text-gray-900 underline"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
