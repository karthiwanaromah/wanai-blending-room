import Logo from "../assets/logo.png";

const HeaderComponent = () => {
  return (
    <header className="bg-gray-950 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="text-xl font-bold">
              <img className="h-16 w-auto" src={Logo} alt="Logo" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
