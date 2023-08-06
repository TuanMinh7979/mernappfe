import Input from '../../../components/input/Input';
import Button from '../../../components/button/Button';
import './Register.scss';


const Register = () => {
    return (
        <div className="auth-inner">
            <div className={`alerts`} role="alert">
            </div>

            <form className="auth-form" >
                <div className="form-input-container">
                    <Input
                        id="username"
                        name="username"
                        type="text"

                        labelText="Username"
                        placeholder="Enter Username"
                    />
                    <Input
                        id="email"
                        name="email"
                        type="text"
                        labelText="Email"
                        placeholder="Enter Email"
                    />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        labelText="Password"
                        placeholder="Enter Password"
                    />
                </div>
                <Button
                    label={`${true ? 'SIGNUP IN PROGRESS...' : 'SIGNUP'}`}
                    className="auth-button button"
                />
            </form>
        </div>
    );
};

export default Register;