import { Navigate, useRoutes } from 'react-router-dom'

function Routes() {
  const element = useRoutes([
    { path: "/", element: <Navigate to="/auth/login" /> }
  ]);
  return element;
}

export default Routes