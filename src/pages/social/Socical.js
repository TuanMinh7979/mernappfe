import { Outlet } from "react-router-dom"
import "./Social.scss"
import Header from "@components/header/Header"
const Social = () => {
    return <>
        <Header></Header>
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