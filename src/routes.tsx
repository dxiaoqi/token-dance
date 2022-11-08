import React from 'react'
import { Route, Routes } from 'react-router-dom';

const App = React.lazy(() => import(/* webpackChunkName: "Home" */ "./pages/home/App"));
const Qr = React.lazy(() => import("./pages/qrCode/index"));
const Scancode = React.lazy(() => import("./pages/scancode"));
const ConnectWallet = React.lazy(() => import("./pages/connectWallet"));
const WaitingTicken = React.lazy(() => import("./pages/waitingTicken"));
const GetTicken = React.lazy(() => import("./pages/getTicken"));

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
    }, {
        path: 'scancode', title: "二维码扫描", component: Scancode,
    },{
        path: "/connect", title: "链接钱包", component: ConnectWallet,
        children: []
    },{
        path: "/waitingticken", title: "等待ticken", component: WaitingTicken,
        children: []
    },{
        path: "/getticken", title: "邀请函弹窗", component: GetTicken,
        children: []
    }
];

const renderRouter = (routerList: RouterConfig[]) => {
  return routerList.map((item) => {
      const { path, children } = item;
      // 补一个鉴权，未登录转到首页
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