import { Outlet } from "react-router-dom"
import "./Social.scss"
const Social = () => {
    return <>
        <div >Header component</div>
        <div className="dashboard">
            <div className="dashboard-sidebar">
               <div className="">Sidebar</div>

            </div>
            <div className="dashboard-content">
                <Outlet></Outlet>
            </div>
        </div>
    </>
}
export default Social