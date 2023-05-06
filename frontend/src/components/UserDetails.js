

const UserDetails = ({user})=>{
    return (
        <div className="user details " style={{
            display:"grid"

        }}>
            
            <h2>user details</h2>
            <h4>email : {user.email}</h4>
            <p>password : {user.password}</p>
        </div>
    )
}

export default UserDetails