let ParseRequestUrl = () => {
    console.log('aaaaa')
    let url = location.pathname.slice(1).toLocaleLowerCase() || '/'
    let r = url.split('/')
    let urlRequest = {
        resource: r[0],
        id: r[1],
        verb: r[2]
    }
    console.log('aaaaa', r)
    return urlRequest
}
export default ParseRequestUrl