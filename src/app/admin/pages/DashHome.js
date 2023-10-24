import "./DashBoard.css";
import PieChart from "./PieChart";
import PieChart2 from "./PieChart2";

const DashHome=({UserDetails, MechDetails})=>{
    return(
        <div className="DashHome">
            <div className="DashDetails">
                <div className="detailsBar">
                   <h5>Total Users:</h5>
                   <h3>{UserDetails.length}</h3>
                </div>
                <div className="detailsBar">
                    <h5>Total Mechanics:</h5>
                   <h3>{MechDetails.length}</h3>
                </div>
            </div>
            <div className="charts">
                <div>
                    <h3 style={{margin:"3", display:"flex", alignItems:"center", justifyContent:"center"}}>Pie Chart</h3>
                    <PieChart2 MechDetails={MechDetails}/>
                </div>
                <div>
                    <h3 style={{margin:"3", display:"flex", alignItems:"center", justifyContent:"center"}}>Pie Chart</h3>
                    <PieChart MechDetails={MechDetails}/>
                </div>
            </div>
        </div>
    )
}

export default DashHome;