import React from 'react'
import { auth } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import Signin from './Signin'
import LogOut from './LogOut'
import Home from './Home'
import Loading from "./Loading";


const style = {
    // nav: `bg-gray-800 h-20 flex justify-between items-center p-4`,
    // heading: `text-white text-3xl`
}

function Navbar(props) {
    const [user, loading] = useAuthState(auth);


    // console.log("from navbar this uid:");
    // console.log(user.uid)
    return ( 
        <>  
            
            {loading ? 
             <div>
                
                <Loading/>
            </div>
            :
            <div>
                {/* rmv */}
                        <div class="alert alert-info">
                            <div class="d-none d-xl-block font-weight-bold">size of screen: X-LARGE (XL)</div>
                            <div class="d-none d-lg-block d-xl-none font-weight-bold">size of screen: LARGE (LG)</div>
                            <div class="d-none d-md-block d-lg-none font-weight-bold">size of screen: MEDIUM (M)</div>
                            <div class="d-none d-sm-block d-md-none font-weight-bold">size of screen: SMALL (SM)</div>
                            <div class="d-block d-sm-none alert font-weight-bold">size of screen: X-SMALL (Defaut)</div>
                        </div>  
                {/* rmv */}
                {/* <div className={style.nav}> */}
                <div>
                    {(!user) && <Signin />}
                    {/* { user && <h1 className={style.heading}>Hello {user.displayName}</h1>} */}
                    { user && <h4>Hello {user.displayName}</h4>}

                    {user && <LogOut/>}
                </div>
                {/* <Routes> */}
                        {user && <Home uid={user.uid} isLoading={props.isLoading} setIsLoading={props.setIsLoading}/>}
                    <div>
                        
                    </div>
                {/* </Routes> */}
                { !user && <div>
                    <p><br></br>Please identify with your google account,<br></br> and reach your jam room soon</p>
                </div>}
            </div>
            }       
        </>
  )
}

export default Navbar
