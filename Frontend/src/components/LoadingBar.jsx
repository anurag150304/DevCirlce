const LoadingBar = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="relative w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-blue-500 rounded-full animate-loading" />
            </div>
        </div>
    );
};

export default LoadingBar;