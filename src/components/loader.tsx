const Loader: React.FC<{ loading: boolean }> = ({ loading }) => {
    if (!loading) return null;
    return <p className="text-gray-500 text-sm mt-2">⏳ Загрузка...</p>;
  };
  
  export default Loader;
  