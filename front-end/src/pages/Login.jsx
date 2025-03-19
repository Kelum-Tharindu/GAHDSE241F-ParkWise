import React from 'react';

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border-2 border-blue-500">
        <h1 className="text-2xl font-bold text-center text-blue-600">Login</h1>
        <form className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-blue-600">Username</label>
            <input type="text" id="username" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" placeholder="Enter your username" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-600">Password</label>
            <input type="password" id="password" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Login</button>
        </form>
        <p className="text-sm text-center text-blue-600">
          Don’t have an account? <a href="/signup" className="text-blue-600 hover:text-blue-500">Sign up</a>
        </p>
      </div>
    </div>
  );
}