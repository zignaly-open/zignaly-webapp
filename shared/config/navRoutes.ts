export type NavRoutesProps = {
  path: string;
  label: string;
}

const navRoutes = [
  {
    path: "/dashboard",
    label: "Profit Sharing",
  },
  {
    path: "/staking",
    label: "Staking"
  },
  {
    path: "/zigpad",
    label: "ZIGpad"
  }
];

export default navRoutes;
