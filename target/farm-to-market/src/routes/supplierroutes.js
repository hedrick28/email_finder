import React from "react";
const Dashboard = React.lazy(() => import("../pages/supplier/Dashboard"));
const Profile = React.lazy(() => import("../pages/supplier/Profile"));
const Complaints = React.lazy(() => import("../pages/complaint/Complaints"));
const AddComplaint = React.lazy(() =>
  import("../pages/complaint/AddComplaint")
);
const ComplaintDetails = React.lazy(() =>
  import("../pages/complaint/ComplaintDetails")
);
const EditComplaint = React.lazy(() =>
  import("../pages/complaint/EditComplaint")
);
const Tutorials = React.lazy(() => import("../pages/tutorial/Tutorials"));
const AddTutorials = React.lazy(() => import("../pages/tutorial/AddTutorials"));
const TutorialDetail = React.lazy(() =>
  import("../pages/tutorial/TutorialDetail")
);
const Advertisements = React.lazy(() =>
  import("../pages/advertisement/Advertisements")
);
const AddAdvertisements = React.lazy(() =>
  import("../pages/advertisement/AddAdvertisement")
);
const EditAds = React.lazy(() => import("../pages/advertisement/EditAds"));
const AllVideos = React.lazy(() => import("../pages/tutorial/AllVideos"));
const AllImages = React.lazy(() => import("../pages/tutorial/AllImages"));
const AllArticles = React.lazy(() => import("../pages/tutorial/AllArticles"));
const EditTutorial = React.lazy(() => import("../pages/tutorial/EditTutorial"));
const Products = React.lazy(() => import("../pages/supplier/Products"));
const AddProducts = React.lazy(() => import("../pages/supplier/AddProduct"));
const MyPurchases = React.lazy(() => import("../pages/orders/MyPurchases"));
const Orders = React.lazy(() => import("../pages/orders/Orders"));
const AdDetails = React.lazy(() => import("../pages/advertisement/AdDetails"));

const routes = [
  { path: "/advertisement", element: Advertisements },
  { path: "/addadvertisement", element: AddAdvertisements },
  { path: "/advertisement/edit/:id", element: EditAds },
  { path: "/advertisement/details/:id", element: AdDetails },
  { path: "/dashboard", exact: true, element: Dashboard },
  { path: "/profile", exact: true, element: Profile },
  { path: "/complaint/mycomplaints", element: Complaints },
  { path: "/complaint/add", element: AddComplaint },
  { path: "/complaint/mycomplaints/detail/:id", element: ComplaintDetails },
  { path: "/complaint/mycomplaints/edit/:id", element: EditComplaint },
  { path: "/tutorials", element: Tutorials },
  { path: "/tutorials/add", element: AddTutorials },
  { path: "/tutorials/detail/:id", element: TutorialDetail },
  { path: "/tutorials/videos", element: AllVideos },
  { path: "/tutorials/images", element: AllImages },
  { path: "/tutorials/articles", element: AllArticles },
  { path: "/tutorials/edit/:id", element: EditTutorial },
  { path: "/products", element: Products },
  { path: "/product/add", element: AddProducts },
  { path: "/orders", element: Orders },
  { path: "/mypurchases", element: MyPurchases },
];

export default routes;
