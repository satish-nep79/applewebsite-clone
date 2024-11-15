import { navLists } from "../constants";
import { appleImg, bagImg, searchImg } from "../utils";

const Navbar = () => {
  return (
    <header className="w-full py-5 sm:px-5 flex justify-between items-center">
      <nav className="flex 2-full screen-max-width">
        <img src={appleImg} alt="apple" className="h-7 w-7" />
      </nav>
      <div className="flex flex-1 justify-center max-sm:hidden">
        {navLists.map((item, index) => (
          <div
            key={index}
            className="px-5 text-sm cursor-pointer text-gray hover:text-white transition-all"
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1 ">
        <img src={searchImg} alt="search" className="h-7 w-7" />
        <img src={bagImg} alt="Bag" className="h-7 w-7" />
      </div>
    </header>
  );
};

export default Navbar;
