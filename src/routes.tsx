import React from 'react'
import { Route, Routes } from 'react-router-dom';


const App = React.lazy(() => import(/* webpackChunkName: "Home" */ "./pages/home/App"));
const Qr = React.lazy(() => import("./pages/qrCode/index"));

interface RouterConfig {
    path: string;
    title: string;
    component: React.LazyExoticComponent<() => JSX.Element>;
    children?: RouterConfig[]
}
// 主路由
export const mainRouteConfig = [
    {
        path: "/", title: "首页", component: App,
        children: []
    },
    {
        path: "/qrcode", title: "二维码展示", component: Qr,
        children: []
    }
];

const renderRouter = (routerList: RouterConfig[]) => {
  return routerList.map((item) => {
      const { path, children } = item;
      return <Route
          key={path}
          path={path}
          element={<item.component />}
      >
          {!!children && children.map(i => {
              return <Route
                  key={i.path}
                  path={i.path}
                  element={<i.component />}
              />
          })}
      </Route >;
  });
};


const Routers = () => {
  return (
    <React.Suspense>
        <Routes>
            {renderRouter(mainRouteConfig)}
        </Routes>
    </React.Suspense>
  )
}

export default Routers