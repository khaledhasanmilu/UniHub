import { FaUserGraduate } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
const Login = () => {
    return (
        <div className="signin">
            <form className="flex flex-col gap-5 items-center border-2  shadow-sm shadow-blue-950 p-10 rounded-2xl" action="/" method="post">
            <h1 className=" text-lg font-bold">Login</h1>
                <div className="flex gap-1 items-center">
                    <FaUserGraduate/>
                    <input className="rounded-md px-3 py-1.5 -outline-offset-1 outline-gray-300 bg-white text-red-500 outline-none  focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 text-base " type="text" name="username" required placeholder="user name"/>
                </div>
                <div className="flex gap-1 items-center">
                <FaLock />
                    <input className="block rounded-md -outline-offset-1 placeholder:text-gray-400 outline-gray-300 bg-white text-red-500 outline-none px-3 py-1.5 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 text-base " type="password" name="password" required placeholder="password"/>
                    
                </div>
                <button className="rounded-md bg-lime-400 px-3 py-1.5 w-full" type="submit">Login</button>

                <div>
                Don't have an account ? <a href="">Signup</a>
                </div>
            </form>
           
        </div>
    );
};
export default Login;