import { useRoutes } from 'react-router-dom'

import Login from './pages/Login'

function Routes() {
  const element = useRoutes([
    {
      path: "/auth",
      children: [
        {
          path: "login", element: <Login />
        }
      ]
    }
  ]);
  return element;
}

export default Routes