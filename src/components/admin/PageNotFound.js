import Everyones from "../campaign/Everyones";

const PageNotFound = () => {
    return <section className="container-fluid" id="page-not-found">
            <Everyones context="page-not-found"/>
            <span className="page-not-found">404 page not found</span>
            {/* <Join context="confirmation"/>
            <JoinQR context="confirmation"/> */}
    </section>
}

export default PageNotFound;