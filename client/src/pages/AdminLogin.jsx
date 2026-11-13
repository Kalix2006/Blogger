import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {loginAdmin} from '../services/api.js';

export default function AdminLogin(){
    const[uemail,setUemail]=useState('');
    const[upass,setUpass]=useState('');
    const[isBusy,setIsBusy]=useState(false);
    const[errMsg,setErrMsg]=useState('');
    const navTo=useNavigate();

    const doLogin=async(e)=>{
        e.preventDefault();
        setErrMsg('');
        if(!uemail||!upass){
            setErrMsg('Please enter both email and password');
            return;
        }
        try{
            setIsBusy(true);
            const resp=await loginAdmin({email:uemail,password:upass});
            if(resp&&resp.token){
                sessionStorage.setItem('token',resp.token);
                if(resp.user){
                    sessionStorage.setItem('user',JSON.stringify(resp.user));
                }
                navTo('/admin/dashboard');
            }else{
                setErrMsg(resp.message||'Login failed');
            }
        }catch(err){
            setErrMsg(err?.response?.data?.message||'Invalid email or password');
        }finally{
            setIsBusy(false);
        }
    };

    return(
        <div className="container d-flex justify-content-center align-items-center" style={{minHeight:'75vh'}}>
            <div className="card shadow-sm border-0 p-4" style={{width:'100%',maxWidth:'400px'}}>
                <div className="text-center mb-3">
                    <img src="/logo.png" alt="Blogger" width="64" height="64" className="rounded-circle shadow-sm border p-1"/>
                </div>
                <h3 className="fw-bold text-center mb-3">Admin Login</h3>
                {errMsg && <div className="alert alert-danger py-2">{errMsg}</div>}
                <form onSubmit={doLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="admin@gmail.com"
                            value={uemail}
                            onChange={(e)=>setUemail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="******"
                            value={upass}
                            onChange={(e)=>setUpass(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-dark w-100 py-2 mt-2" disabled={isBusy}>
                        {isBusy ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Logging in...
                            </>
                        ):(
                            'Login'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
