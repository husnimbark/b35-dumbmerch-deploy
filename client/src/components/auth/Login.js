import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useHistory } from "react-router-dom";
import { Alert } from "react-bootstrap";

import { useMutation } from "react-query";

import { API } from "../../config/api";

export default function Login() {
  const title = "Login";
  document.title = "DumbMerch | " + title;

  let history = useHistory();
  let api = API();

  const [state, dispatch] = useContext(UserContext);

  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const body = JSON.stringify(form);

      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      };

      const response = await api.post("/login", config);

      if (response.status == "success") {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data,
        });

        if (response.data.status == "admin") {
          history.push("/complain-admin");
        } else {
          history.push("/");
        }

        const alert = (
          <Alert variant="success" className="py-1">
            Login success
          </Alert>
        );
        setMessage(alert);
      } else {
        const alert = (
          <Alert variant="danger" className="py-1">
            Login failed
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Login failed
        </Alert>
      );
      setMessage(alert);
    }
  });

  return (
    <div className="d-flex justify-content-center">
      <div className="card-auth p-4">
        <div
          style={{ fontSize: "36px", lineHeight: "49px", fontWeight: "700" }}
          className="mb-3"
        >
          Login
        </div>
        {message && message}
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
          <div className="mt-3 form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={handleChange}
              className="px-3 py-2 mt-3"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              onChange={handleChange}
              className="px-3 py-2 mt-3"
            />
          </div>
          <div className="d-grid gap-2 mt-5">
            <button className="btn btn-login">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
