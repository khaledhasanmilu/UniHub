import { useEffect } from 'react';
import SlidingLoginRegister from '../component/LoginS';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const WelcomePage = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const authToken = Cookies.get('authToken');
      console.log('authToken:', authToken);
      if (authToken) {
        navigate('/dashboard');
      }else{
          navigate('/login');
      }
    }, [navigate]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <Helmet>
        <title>UniHub-Login</title>
      </Helmet>      {/* Content Wrapper */}
      <div className='text-center px-4'>
        <h1 className="text-4xl font-bold mb-4">Welcome to UniHub</h1>
        <p className="text-lg mb-6">
          Connect with your university community, discover events, and much more.
        </p>
        <p className="text-xl mt-6 mb-6">Please log in or register to get started.</p>
      </div>

      {/* Include SlidingLoginRegister */}
      <SlidingLoginRegister />
    </div>
  );
};

export default WelcomePage;
