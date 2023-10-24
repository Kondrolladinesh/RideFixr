import MechNavBar from "../components/MechNavBar";

export default function Layout({children}){
    return(
        <>
        <MechNavBar/>
        {children}
        </>
    );
}   