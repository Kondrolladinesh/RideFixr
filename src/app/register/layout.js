import NavWithOutAccess from "../components/NavWithOutAccess";


export default function Layout({children}){
    return(
        <>
        <NavWithOutAccess/>
        {children}
        </>
    );
}   