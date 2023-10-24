import NavWithAccess from "../components/NavWithAccess";

export default function Layout({children}){
    return(
        <>
        <NavWithAccess/>
        {children}
        </>
    );
}   