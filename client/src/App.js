import { useContext, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { UserContext } from "./context/userContext";

import Auth from "./pages/Auth";
import Product from "./pages/Product";
import DetailProduct from "./pages/DetailProduct";
import Complain from "./pages/Complain";
import Profile from "./pages/Profile";
import ComplainAdmin from "./pages/ComplainAdmin";
import CategoryAdmin from "./pages/CategoryAdmin";
import ProductAdmin from "./pages/ProductAdmin";
import UpdateCategoryAdmin from "./pages/UpdateCategoryAdmin";
import AddCategoryAdmin from "./pages/AddCategoryAdmin";
import AddProductAdmin from "./pages/AddProductAdmin";
import UpdateProductAdmin from "./pages/UpdateProductAdmin";
import Cart from "./pages/Cart";

import { API } from "./config/api";

function App() {
  let api = API();
  let history = useHistory();
  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    if (state.isLogin == false) {
      history.push("/auth");
    } else {
      if (state.user.status == "admin") {
        history.push("/complain-admin");
      } else if (state.user.status == "customer") {
        history.push("/");
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get("/check-auth", config);

      if (response.status === "failed") {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.user;

      payload.token = localStorage.token;

      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {}
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={Product} />
      <Route path="/auth" component={Auth} />
      <Route path="/product/:id" component={DetailProduct} />
      <Route path="/complain" component={Complain} />
      <Route path="/profile" component={Profile} />
      <Route path="/complain-admin" component={ComplainAdmin} />
      <Route path="/category-admin" component={CategoryAdmin} />
      <Route path="/edit-category/:id" component={UpdateCategoryAdmin} />
      <Route path="/add-category" component={AddCategoryAdmin} />
      <Route path="/product-admin" component={ProductAdmin} />
      <Route path="/add-product" component={AddProductAdmin} />
      <Route path="/edit-product/:id" component={UpdateProductAdmin} />
      <Route path="/cart" component={Cart} />
    </Switch>
  );
}

export default App;
