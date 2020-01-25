let ParseRequestUrl = () => {
    let url = location.pathname.slice(1).toLocaleLowerCase() || '/'
    let r = url.split('/')
    let urlRequest = {
        resource: r[0],
        id: r[1],
        verb: r[32]
    }
    return urlRequest
}
export default ParseRequestUrl