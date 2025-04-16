const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        console.log('Sending forgot password request to:', API_PATHS.AUTH.FORGOT_PASSWORD);
        console.log('With email:', email);
        
        const response = await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
        console.log('Response received:', response.data);
        
        setEmailSent(true);
        toast.success('Password reset link has been sent to your email');
    } catch (error) {
        console.error('Error details:', error.response || error);
        toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
        setIsLoading(false);
    }
}; 