import React from "react";
//Admin pages
const Dashboard = React.lazy(() => import("../pages/admin/Dashboard"));
const Profile = React.lazy(() => import("../pages/admin/Profile"));
const Tips = React.lazy(() => import("../pages/admin/Tips"));
const AddTip = React.lazy(() => import("../pages/admin/AddTip"));
const TipDetails = React.lazy(() => import("../pages/admin/TipDetails"));
const UpdateTip = React.lazy(() => import("../pages/admin/UpdateTip"));
const AdminAdvertisement = React.lazy(() =>
  import("../pages/advertisement/AdminAdvertisement")
);
const FarmerAccounts = React.lazy(() =>
  import("../pages/admin/FarmerAccounts")
);
const SupplierAccounts = React.lazy(() =>
  import("../pages/admin/SupplierAccounts")
);
const AdminAccounts = React.lazy(() => import("../pages/admin/AdminAccounts"));
const AddAdmin = React.lazy(() => import("../pages/admin/AddAdmin"));
const AccountDetails = React.lazy(() =>
  import("../pages/admin/AccountDetails")
);
const Complaints = React.lazy(() => import("../pages/admin/Complaints"));
const ComplaintDetails = React.lazy(() =>
  import("../pages/admin/ComplaintDetails")
);
const Tutorials = React.lazy(() => import("../pages/tutorial/Tutorials"));
const AddTutorials = React.lazy(() => import("../pages/tutorial/AddTutorials"));
const TutorialDetail = React.lazy(() =>
  import("../pages/tutorial/TutorialDetail")
);
const AllVideos = React.lazy(() => import("../pages/tutorial/AllVideos"));
const AllImages = React.lazy(() => import("../pages/tutorial/AllImages"));
const AllArticles = React.lazy(() => import("../pages/tutorial/AllArticles"));
const Products = React.lazy(() => import("../pages/admin/Products"));
const EditTutorial = React.lazy(() => import("../pages/tutorial/EditTutorial"));

const routes = [
  { path: "/dashboard", element: Dashboard },
  {
    path: "/profile",
    element: Profile,
  },
  { path: "/tips", element: Tips },
  { path: "/all/advertisement", element: AdminAdvertisement },
  { path: "/create/tip", element: AddTip },
  { path: "/tip/details/:id", element: TipDetails },
  { path: "/tip/edit/:id", element: UpdateTip },
  { path: "/users/farmers", element: FarmerAccounts },
  { path: "/users/suppliers", element: SupplierAccounts },
  { path: "/users/admins", element: AdminAccounts },
  { path: "/users/admins/add", element: AddAdmin },
  { path: "/users/detail/:id", element: AccountDetails },
  { path: "/complaint/all", element: Complaints },
  { path: "/complaint/detail/:id", element: ComplaintDetails },
  { path: "/tutorials", element: Tutorials },
  { path: "/tutorials/add", element: AddTutorials },
  { path: "/tutorials/detail/:id", element: TutorialDetail },
  { path: "/tutorials/videos", element: AllVideos },
  { path: "/tutorials/images", element: AllImages },
  { path: "/tutorials/articles", element: AllArticles },
  { path: "/users/farmers/user/product/:id", element: Products },
  { path: "/tutorials/edit/:id", element: EditTutorial },
];

export default routes;
