import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';

function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: 'institute@gmail.com',
    password: 'client@123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let error = '';

    if (name === 'email') {
      if (!value) {
        error = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        error = 'Invalid email address';
      }
    }

    if (name === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 8) {
        error = 'Must be at least 8 characters';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (touched[name]) {
      setErrors({
        ...errors,
        [name]: validateField(name, value)
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    if (newErrors.email || newErrors.password) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white font-['Poppins',sans-serif]">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-[300px] mb-6 text-center">
          <h2 className="text-[1.8rem] text-[#2c3e50] mb-2 font-semibold">Welcome Back</h2>
          <p className="text-[#7f8c8d] text-[0.95rem]">Sign in to your institution account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[1.2rem] w-full max-w-[300px]">
          {/* Email Input */}
          <div>
            <div className={`flex items-center border rounded-lg px-2 bg-[#f8f9fa] h-12 ${
              touched.email && errors.email ? 'border-[#e74c3c]' : 'border-[#ddd]'
            }`}>
              <div className="pr-3 text-[#7f8c8d] text-base">
                <FaUser />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="flex-1 p-0 border-none outline-none bg-transparent text-[0.95rem] h-full text-[#737373] placeholder:text-[#95a5a6] placeholder:text-[0.9rem]"
              />
            </div>
            {touched.email && errors.email && (
              <div className="text-[#e74c3c] text-[0.8rem] mt-[-0.8rem] pl-2 h-[1.2rem] block">
                {errors.email}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className={`flex items-center border rounded-lg px-2 bg-[#f8f9fa] h-12 ${
              touched.password && errors.password ? 'border-[#e74c3c]' : 'border-[#ddd]'
            }`}>
              <div className="pr-3 text-[#7f8c8d] text-base">
                <FaLock />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="flex-1 p-0 border-none outline-none bg-transparent text-[0.95rem] h-full text-[#737373] placeholder:text-[#95a5a6] placeholder:text-[0.9rem]"
              />
              <div
                className="pl-3 cursor-pointer text-[#7f8c8d] text-base"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {touched.password && errors.password && (
              <div className="text-[#e74c3c] text-[0.8rem] mt-[-0.8rem] pl-2 h-[1.2rem] block">
                {errors.password}
              </div>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right mt-[-0.8rem] h-[1.2rem]">
            <a href="#" className="text-[#3498db] no-underline text-[0.85rem]">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#3498db] text-white border-none py-[0.9rem] rounded-lg text-base font-semibold cursor-pointer mt-2 hover:bg-[#2980b9] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {loading ? 'Please wait...' : 'Sign In'}
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center mt-[1.2rem] text-[#7f8c8d] text-[0.9rem] w-full max-w-[300px]">
          Don't have an account?{' '}
          <a href="#" className="text-[#3498db] no-underline font-semibold">
            Create account
          </a>
        </div>
      </div>

      {/* Right Side - Image Collage */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/suntraining.png" className="block w-[300px]" alt="Sun Training Logo" />
          </div>

          {/* Image Grid */}
          <div className="flex items-center justify-center p-4">
            <div className="grid grid-cols-2 grid-rows-2 gap-[15px] w-[90%] max-w-[400px] aspect-square">
              <div
                className="bg-white/10 border-2 border-white/20 rounded-lg bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80')"
                }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
              </div>

              <div
                className="bg-white/10 border-2 border-white/20 rounded-lg bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80')"
                }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
              </div>

              <div
                className="bg-white/10 border-2 border-white/20 rounded-lg bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80')"
                }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
              </div>

              <div
                className="bg-white/10 border-2 border-white/20 rounded-lg bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80')"
                }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
