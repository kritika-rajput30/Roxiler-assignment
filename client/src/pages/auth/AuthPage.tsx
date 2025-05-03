import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';  // import toast
import { post } from '../../utils/api';  // import the post method from the api helper
import { setCurrentUser } from '../../store/slices/userSlice';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    ...(isLogin
      ? {}
      : {
          name: Yup.string()
            .min(20, 'Minimum 20 characters')
            .max(60, 'Maximum 60 characters')
            .required('Name is required'),
          address: Yup.string()
            .max(400, 'Too long')
            .required('Address is required'),
        }),
    email: Yup.string().email('Invalid email').required('Required *'),
    password: Yup.string()
      .matches(/[A-Z]/, 'Must include an uppercase letter')
      .matches(/[!@#$%^&*]/, 'Must include a special character')
      .min(8, 'Too short')
      .max(16, 'Too long')
      .required('Required *'),
  });

  const handleSubmit = async (values: any) => {
    const payload = {
      email: values.email,
      password: values.password,
      ...(isLogin ? {} : { name: values.name, address: values.address }),
    };

    try {
      const endpoint = `/auth/${isLogin ? 'login' : 'register'}`;
      const data = await post(endpoint, payload);

      // Assuming the response includes token and role in case of success
      if (data.token && data.user.role) {
        dispatch(login({ token: data.token, role: data.user.role }));
        dispatch(setCurrentUser(data.user));
        toast.success('Successfully logged in!');  // Show success toast
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Something went wrong');  // Show error toast

      }
    } catch (err) {
      toast.error(err.message || 'Network error');  // Show error toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          {isLogin ? 'Login to RateHub' : 'Register on RateHub'}
        </h2>

        <Formik
          initialValues={{ name: '', address: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Field
                    name="name"
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <Field
                    name="address"
                    placeholder="Address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <ErrorMessage name="address" component="div" className="text-red-600 text-sm mt-1" />
                </div>
              </>
            )}

            <div>
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </Form>
        </Formik>

        <div className="text-center mt-6 text-sm text-gray-600">
          {isLogin ? (
            <>
              Don’t have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-primary font-medium underline hover:text-primary-dark"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-primary font-medium underline hover:text-primary-dark"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
