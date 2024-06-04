import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthenticationPopUp from "../popUp/authentication/AuthenticationPopUp";
import MiniNavbar from "./DashboardMenu";
import { getUser, userLogOut } from "../../redux/actions/userActions";
import hamburgerMenu from "../../assets/basicIcon/hamburgerMenu.svg";
import motelLogo from "../../assets/LogoPink.png";
import userProfile from "../../assets/basicIcon/user-profile.png";
import searchIcon from "../../assets/basicIcon/search.svg";
import house from "../../assets/basicIcon/houseWhite.png";
import axios from 'axios'
import { API } from "../../backend";
import { RingLoader } from "react-spinners";

const Navbar = () => {
  const user = useSelector((state) => state.user.userDetails);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDisplay,setSearchDisplay] = useState('none');
  const [searchData,setSearchData] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const divRef = useRef(null);
  const btnRef = useRef(null);


  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const location = useLocation();
  const pathName = location.pathname;
  const inUserProfile = pathName?.includes("/users/show/");
  const inUserDashboard = pathName?.includes("/users/dashboard/");
  const inHostHomesLandingPage = pathName?.includes("/host/homes");
  const inListingDetailsPage = pathName?.includes("/listing");
  const inBookingPage = pathName?.includes("/book/stays");
  const isSmallDevice = window.innerWidth < 768;

  const [popup, setPopup] = useState(false);

  const dispatch = useDispatch();



  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target) && !btnRef.current.contains(event.target)) {
      setSearchDisplay('none');
    }
  };

  useEffect(()=>{
    console.log(searchDisplay);
  },[searchDisplay])

  useEffect(() => {
    if(searchDisplay==='block')
    document.addEventListener('click', handleClickOutside);
  // else 
  // document.removeEventListener('click', handleClickOutside);
    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [searchDisplay]);

  const handleLogout = () => {
    dispatch(userLogOut());
  };

  const searchHandler = async () => {
    setSearchDisplay('block');
    setIsLoading(true);
    
  try {
    const result = await axios.post(`${API}house/search/${searchQuery}`);
    console.log(result.data);
    if(result.data){
      setSearchData(result.data);
    }

  } catch (error) {
    
  }finally{
    setIsLoading(false);
  }
    
  }

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mouseup", handleOutsideClick);
    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
    };
  }, []);

  return (
    <nav
      className={`border-b-[1.4px] border-[#f1f1f1] sticky top-0 z-[99] bg-white ${inBookingPage && "hidden md:block"
        }`}
    >
      <div
        className={`xl:px-10 py-4 xl:mx-auto items-center px-5 relative ${inUserProfile ||
            inUserDashboard ||
            inHostHomesLandingPage ||
            inListingDetailsPage
            ? " max-w-screen-xl"
            : " max-w-screen-2xl"
          }
        ${inUserDashboard || inHostHomesLandingPage
            ? "flex flex-row justify-between"
            : "grid grid-cols-2 lg:grid-cols-3 gap-2"
          }
        ${inHostHomesLandingPage ? " xl:px-20" : ""}
        `}
      >
        {/* logo */}
        <div className=" md:w-[160px]">
          <span className="flex flex-row gap-2 items-center max-w-[120px]">
            <img
              src={motelLogo}
              alt="Logo"
              className=" w-10 cursor-pointer"
              onClick={() => {
                // setting cat to house for listing data fetching
                JSON.stringify(localStorage.setItem("category", "House"));
                // manually navigating bcz of avoiding asyncrounous nature and on click show default listing data
                navigate("/");
              }}
            />
            {/* if user is in hosting homes page we want only logo */}
            {inHostHomesLandingPage || isSmallDevice ? null : (
              <a href="/" className="text-xl text-[#ff385c] font-bold">PG LIFE</a>
            )}
          </span>
        </div>
        {/* if not in the booking page then show the options 👇 */}
        {inBookingPage ? (
          <div> </div>
        ) : (
          <>
            {/* searchbar */}
            {inUserProfile || inUserDashboard || inHostHomesLandingPage ? (
              // if user is in dahsboard
              <div>{inUserDashboard && <MiniNavbar />} </div>
            ) : (
              <div className="mx-auto lg:block hidden">
                <div className="border-[1px] border-[#dddddd] rounded-full px-3 py-2 flex items-center shadow hover:shadow-md transition-all cursor-pointer">
                  <input
                    type="search"
                    className=" focus:outline-none pl-2"
                    style={{
                      borderRadius: '20px',
                      height: '30px',
                      marginRight: '8px',
                    }}
                    placeholder="Search for places"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="bg-[#ff385c] rounded-full p-2" onClick={searchHandler} ref={btnRef}>
                    <img src={searchIcon} alt="Search hotel" className="w-4"/>
                  </div>
                </div>
                <div className="result" ref={divRef} style={{display:`${searchDisplay}`, overflowY:"scroll"}}>

                  {
                    loading && (
                      <div style={{display:"flex", height:"100%", width:"100%",alignItems:"center",justifyContent:'center'}}><RingLoader/></div>
                    )
                  }

                    {
                      searchData.length === 0 && (
                        <p style={{padding:'1rem'}}>no data found</p>
                      )
                    }

                 
                   {

                    

                     searchData.map((e)=>{
                      return(
                      <div className="search_result" id={e._id} onClick={()=>{
                        navigate(`/rooms/${e._id}`);
                        setSearchDisplay('none');
                      }}>
                        <div className="search_image">
                          <img src={e.photos[0]} className="search_image_img"/>
                        </div>
                        <div>
                        <h6> {e.title}</h6>
                        <p>{e.location.city.name}</p>
                        {/* <p>{e.description.substring(0,100)} . . . </p> */}
                        </div>
                      </div>
                      )
                     })
                   }
                </div>
              </div>

            )}
          </>
        )}
        {/* if in the booking page don't show any option 👇  */}
        {inBookingPage ? (
          <div> </div>
        ) : (
          <>
            {/* if user is in the hosting house landing page we want to show different button */}
            {inHostHomesLandingPage ? (
              <div className=" flex flex-row items-center justify-between gap-4">
                <p className=" text-[#222222] text-sm font-medium hidden sm:block">
                  Ready to Motel it?
                </p>
                <Link
                  to="/become-a-host"
                  className=" flex flex-row justify-between items-center gap-2 bg-[#ff385c] hover:bg-[#d90b63] transition-all duration-300 px-3 py-2 rounded-lg"
                >
                  <img src={house} alt="House setup" className=" w-4 md:w-5" />
                  <p className=" font-semibold text-sm md:text-base text-white">
                    Motel setup
                  </p>
                </Link>
              </div>
            ) : (
              <>
                {/* user bar */}
                <div className="flex justify-end items-center">
                  {!inUserDashboard && (
                    <Link
                      to="/host/homes"
                      className=" bg-[#ffffff] hover:bg-[#f0f0f0] transition-all rounded-full p-3 cursor-pointer mr-3 md:block hidden"
                    >
                      <p className="text-sm font-medium text-[#222222]">
                        Motel your home
                      </p>
                    </Link>
                  )}

                  <div
                    className="border-[1px] border-[#dddddd] rounded-full py-1 px-2 flex flex-row gap-3 hover:shadow-md transition-all cursor-pointer relative"
                    onClick={() => {
                      setShowUserMenu((prevValue) => !prevValue);
                    }}
                  >
                    <img
                      src={hamburgerMenu}
                      alt="Motel user menu"
                      className="w-4"
                    />
                    {user ? (
                      <p className=" bg-[#222222] text-[#efefef] px-3 py-2 rounded-full text-xs">
                        {user.name?.firstName?.slice(0, 1)}
                      </p>
                    ) : (
                      <img
                        src={userProfile}
                        alt="user profile icon"
                        className="w-8"
                      />
                    )}
                  </div>

                  {/* menu items code  */}

                  {showUserMenu ? (
                    <>
                      {!user ? (
                        <div
                          ref={userMenuRef}
                          className="shadow-md absolute right-9 top-[74px] bg-[#ffffff] border-[1px] border-[#dddddd] rounded-lg flex flex-col py-2 w-[230px] transition-all user__menu"
                        >
                          <Link
                            className="font-medium"
                            onClick={() => {
                              setShowUserMenu(false);
                              setPopup(true);
                            }}
                          >
                            Sign up
                          </Link>
                          <Link
                            onClick={() => {
                              setShowUserMenu(false);
                              setPopup(true);
                            }}
                          >
                            Login
                          </Link>
                          <hr className="h-[1.5px] bg-[#dddddd] my-1" />
                          <Link>Motel your home</Link>
                          <Link to="/">Help</Link>
                        </div>
                      ) : (
                        // logged in user menu
                        <div
                          ref={userMenuRef}
                          className="shadow-md absolute right-9 top-[70px] bg-[#ffffff] border-[1px] border-[#dddddd] rounded-lg flex flex-col py-2 w-[230px] transition-all user__menu"
                          onClick={() => {
                            setShowUserMenu((prev) => !prev);
                          }}
                        >
                          {user?.role === "host" || user?.role === "admin" ? (
                            <>
                              {!inUserDashboard ? (
                                <Link
                                  to={`/users/dashboard/${user._id}/overview=true`}
                                  onClick={() => {
                                    JSON.stringify(
                                      sessionStorage.setItem("activePage", 1)
                                    );
                                  }}
                                  className="font-medium"
                                >
                                  Dashboard
                                </Link>
                              ) : (
                                <Link className="font-medium" to={"/"}>
                                  Home
                                </Link>
                              )}
                            </>
                          ) : (
                            <Link className="font-medium">Notifications</Link>
                          )}
                          <Link className="font-medium">Trips</Link>
                          <Link className="font-medium">Wishlists</Link>
                          <hr className="h-[1.5px] bg-[#dddddd] my-1" />
                          <Link to={"/host/homes"}>Motel your home</Link>
                          <Link to={`/users/show/${user._id}`}>Account</Link>
                          <hr className="h-[1.5px] bg-[#dddddd] my-1" />
                          <Link>Help</Link>
                          <Link
                            onClick={() => {
                              handleLogout();
                            }}
                          >
                            Log out
                          </Link>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <AuthenticationPopUp popup={popup} setPopup={setPopup} />
    </nav>
  );
};

export default Navbar;
