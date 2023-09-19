import { useRoutes } from 'react-router-dom'

import LoginPage from './views/Auth/Login/Login'

function Routes() {
  const element = useRoutes([
    {
      path: "/auth",
      children: [
        {
          path: "login", element: <LoginPage />
        }
      ]
    }
  ]);
  return element;
}

export default Routes