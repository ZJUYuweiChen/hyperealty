import { HomeIcon, Building, Hammer, ShieldCheck } from "lucide-react";
import Index from "./pages/Index.jsx";
import Developer from "./pages/Developer.jsx";
import Contractor from "./pages/Contractor.jsx";
import Supervisor from "./pages/Supervisor.jsx";
import BlockList from "./pages/BlockList.jsx";
import ContractList from "./pages/ContractList.jsx";
import RealestateList from "./pages/RealestateList.jsx";

/**
* Central place for defining the navigation items. Used for navigation components and routing.
*/
export const navItems = [
{
    title: "可信建筑",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
},
{
    title: "开发商工作台",
    to: "/developer",
    icon: <Building className="h-4 w-4" />,
    page: <Developer />,
},
{
    title: "承包商工作台",
    to: "/contractor",
    icon: <Hammer className="h-4 w-4" />,
    page: <Contractor />,
},
{
    title: "监督者工作台",
    to: "/supervisor",
    icon: <ShieldCheck className="h-4 w-4" />,
    page: <Supervisor />,
},
{
    title: "开发商房产列表",
    to: "/developer/realestate/list",
    page: <RealestateList />,
},
{
    title: "开发商交易列表",
    to: "/developer/contract/list",
    page: <ContractList />,
},
{
    title: "开发商区块列表",
    to: "/developer/block/list",
    page: <BlockList />,
},
{
    title: "承包商房产列表",
    to: "/contractor/realestate/list",
    page: <RealestateList />,
},
{
    title: "承包商交易列表",
    to: "/contractor/contract/list",
    page: <ContractList />,
},
{
    title: "承包商区块列表",
    to: "/contractor/block/list",
    page: <BlockList />,
},
{
    title: "监督者房产列表",
    to: "/supervisor/realestate/list",
    page: <RealestateList />,
},
{
    title: "监督者交易列表",
    to: "/supervisor/contract/list",
    page: <ContractList />,
},
{
    title: "监督者区块列表",
    to: "/supervisor/block/list",
    page: <BlockList />,
},
];
