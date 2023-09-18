import { useRoutes } from 'react-router-dom'

import Home from './Home'

function Routes() {
  const element = useRoutes([
    { path: "/", element: <Home/> }
  ]);
  return element;
}

export default Routes